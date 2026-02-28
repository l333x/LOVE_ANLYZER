"""
Love Analyzer — Flask Backend
Analiza mensajes de texto con IA (Google Gemini) y gestiona
autenticación/historial con Supabase.
"""

import os
import json
import re
from functools import wraps

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
from google import genai

# ──────────────────────────────────────────────
# Configuración
# ──────────────────────────────────────────────
load_dotenv()

app = Flask(__name__)

# CORS: permite localhost en dev y la URL de producción (Vercel)
FRONTEND_URL = os.getenv("https://love-anlyzer.vercel.app", "http://localhost:5173")
allowed_origins = ["https://love-anlyzer.vercel.app", "http://localhost:5173"]
if FRONTEND_URL not in allowed_origins:
    allowed_origins.append(FRONTEND_URL)
CORS(app, origins=allowed_origins, supports_credentials=True)

# Supabase
SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Google Gemini
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
gemini_client = genai.Client(api_key=GEMINI_API_KEY)
GEMINI_MODEL = "gemini-2.5-flash"

# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

ROLE_LABELS = {
    "pareja": "Pareja actual",
    "esposo": "Esposo/a",
    "amigo": "Amigo/a",
    "familiar": "Familiar",
    "crush": "Crush / Casi algo",
    "ex": "Ex-pareja",
}


def get_system_prompt(role: str) -> str:
    """Genera el system prompt adaptado al rol seleccionado."""
    role_label = ROLE_LABELS.get(role, role)
    return f"""Eres un experto en psicología relacional, comunicación asertiva y coaching emocional.
Tu especialidad es analizar mensajes de texto que una persona recibe de su **{role_label}**.

REGLAS:
1. Ajusta el tono y la profundidad del análisis según el tipo de relación ({role_label}).
2. Sé empático, claro y directo. No uses jerga técnica innecesaria.
3. Identifica patrones de comunicación: manipulación, sinceridad, evasión, doble sentido, cariño genuino, etc.
4. Si detectas señales de abuso emocional, psicológico o cualquier tipo de violencia, activa la alerta de abuso.
5. Tu respuesta DEBE ser EXCLUSIVAMENTE un JSON válido (sin texto adicional, sin markdown) con esta estructura exacta:

{{
  "contexto": "Explicación clara de qué significa realmente este mensaje en el contexto de la relación.",
  "flags": ["🟩 Green flag: descripción", "🚩 Red flag: descripción", "🟨 Yellow flag: descripción"],
  "abuso_detectado": false,
  "recomendacion_final": "Un consejo práctico, empático y accionable.",
  "sugerencias_respuesta": ["Opción 1 de respuesta", "Opción 2 de respuesta", "Opción 3 de respuesta"]
}}

NOTAS SOBRE FLAGS:
- 🟩 Green flag = señales positivas y saludables.
- 🚩 Red flag = señales de alerta o comportamiento tóxico/dañino.
- 🟨 Yellow flag = señales ambiguas que requieren atención o seguimiento.
- Incluye solo las flags relevantes. Puede haber varias del mismo tipo.

Responde ÚNICAMENTE con el JSON, sin bloques de código, sin explicaciones fuera del JSON."""


def get_chat_system_prompt(role: str) -> str:
    """System prompt para el chat de seguimiento."""
    role_label = ROLE_LABELS.get(role, role)
    return f"""Eres un coach relacional empático y experto en comunicación asertiva.
Estás ayudando a una persona a entender y manejar la comunicación con su **{role_label}**.
Ya realizaste un análisis previo de un mensaje. Ahora la persona quiere profundizar o hacer preguntas de seguimiento.

REGLAS:
1. Mantén el contexto de la conversación anterior.
2. Responde de forma cálida, clara y práctica.
3. Si detectas señales de peligro, no dudes en mencionarlas con sensibilidad.
4. Responde en texto plano (no JSON). Usa un tono conversacional pero profesional."""


def extract_user_from_token(req) -> dict | None:
    """Extrae el usuario de Supabase a partir del token Bearer."""
    auth_header = req.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ", 1)[1]
    try:
        user_response = supabase.auth.get_user(token)
        return {"id": user_response.user.id, "email": user_response.user.email, "token": token}
    except Exception:
        return None


def require_auth(f):
    """Decorador que exige autenticación."""
    @wraps(f)
    def decorated(*args, **kwargs):
        user = extract_user_from_token(request)
        if not user:
            return jsonify({"error": "Autenticación requerida. Inicia sesión para continuar."}), 401
        request.user = user
        return f(*args, **kwargs)
    return decorated


def parse_gemini_json(text: str) -> dict:
    """Intenta parsear la respuesta de Gemini como JSON."""
    # Eliminar posibles bloques de código markdown
    cleaned = re.sub(r"```json\s*", "", text)
    cleaned = re.sub(r"```\s*", "", cleaned)
    cleaned = cleaned.strip()
    return json.loads(cleaned)


# ──────────────────────────────────────────────
# Endpoints — Análisis
# ──────────────────────────────────────────────

@app.route("/api/analyze", methods=["POST"])
def analyze_message():
    """Analiza un mensaje con Gemini y devuelve el resultado en JSON."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "El cuerpo de la petición es requerido."}), 400

    role = data.get("role", "").strip()
    message = data.get("message", "").strip()

    if not role or not message:
        return jsonify({"error": "Los campos 'role' y 'message' son obligatorios."}), 400

    system_prompt = get_system_prompt(role)

    try:
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[
                {"role": "user", "parts": [{"text": f"Analiza este mensaje que recibí de mi {ROLE_LABELS.get(role, role)}:\n\n\"{message}\""}]}
            ],
            config={
                "system_instruction": system_prompt,
                "temperature": 0.7,
            },
        )

        analysis = parse_gemini_json(response.text)

        # Validar estructura mínima
        required_keys = ["contexto", "flags", "abuso_detectado", "recomendacion_final", "sugerencias_respuesta"]
        for key in required_keys:
            if key not in analysis:
                analysis[key] = "" if key != "flags" and key != "sugerencias_respuesta" else []
                if key == "abuso_detectado":
                    analysis[key] = False

    except json.JSONDecodeError:
        return jsonify({"error": "La IA generó una respuesta inválida. Intenta de nuevo."}), 500
    except Exception as e:
        return jsonify({"error": f"Error al conectar con la IA: {str(e)}"}), 500

    # Si el usuario está autenticado, guardar en BD
    user = extract_user_from_token(request)
    if user:
        try:
            supabase.table("analyses").insert({
                "user_id": user["id"],
                "role": role,
                "original_message": message,
                "ai_analysis": analysis,
            }).execute()
        except Exception:
            pass  # No bloquear la respuesta si falla el guardado

    return jsonify({"success": True, "analysis": analysis})


# ──────────────────────────────────────────────
# Endpoints — Chat de seguimiento
# ──────────────────────────────────────────────

@app.route("/api/chat", methods=["POST"])
@require_auth
def chat_followup():
    """Chat de seguimiento con contexto (requiere autenticación)."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "El cuerpo de la petición es requerido."}), 400

    role = data.get("role", "").strip()
    user_message = data.get("message", "").strip()
    history = data.get("history", [])

    if not user_message:
        return jsonify({"error": "El campo 'message' es obligatorio."}), 400

    system_prompt = get_chat_system_prompt(role)

    # Construir historial de conversación para Gemini
    contents = []
    for msg in history:
        contents.append({
            "role": msg.get("role", "user"),
            "parts": [{"text": msg.get("text", "")}],
        })
    # Agregar el mensaje actual
    contents.append({
        "role": "user",
        "parts": [{"text": user_message}],
    })

    try:
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=contents,
            config={
                "system_instruction": system_prompt,
                "temperature": 0.7,
            },
        )
        reply = response.text
    except Exception as e:
        return jsonify({"error": f"Error en el chat: {str(e)}"}), 500

    return jsonify({"success": True, "reply": reply})


# ──────────────────────────────────────────────
# Endpoints — Chat History Persistence
# ──────────────────────────────────────────────

@app.route("/api/chat/save", methods=["POST"])
@require_auth
def save_chat_history():
    """Saves cloud chat history for a specific analysis."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "El cuerpo de la petición es requerido."}), 400

    analysis_id = data.get("analysis_id")
    chat_history = data.get("chat_history", [])

    if not analysis_id:
        return jsonify({"error": "El campo 'analysis_id' es obligatorio."}), 400

    user = request.user
    try:
        supabase.table("analyses").update({
            "chat_history": chat_history,
        }).eq("id", analysis_id).eq("user_id", user["id"]).execute()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ──────────────────────────────────────────────
# Endpoints — Autenticación (proxy a Supabase)
# ──────────────────────────────────────────────

@app.route("/api/auth/register", methods=["POST"])
def register():
    """Registra un nuevo usuario vía Supabase Auth."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "El cuerpo de la petición es requerido."}), 400

    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios."}), 400

    try:
        res = supabase.auth.sign_up({"email": email, "password": password})
        if res.user:
            return jsonify({
                "success": True,
                "message": "Cuenta creada exitosamente. Revisa tu email para confirmar.",
                "user": {"id": res.user.id, "email": res.user.email},
            })
        return jsonify({"error": "No se pudo crear la cuenta."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/auth/login", methods=["POST"])
def login():
    """Inicia sesión vía Supabase Auth."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "El cuerpo de la petición es requerido."}), 400

    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios."}), 400

    try:
        res = supabase.auth.sign_in_with_password({"email": email, "password": password})
        if res.session:
            return jsonify({
                "success": True,
                "access_token": res.session.access_token,
                "user": {"id": res.user.id, "email": res.user.email},
            })
        return jsonify({"error": "Credenciales incorrectas."}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 401


# ──────────────────────────────────────────────
# Endpoints — Historial
# ──────────────────────────────────────────────

@app.route("/api/history", methods=["GET"])
@require_auth
def get_history():
    """Devuelve el historial de análisis del usuario autenticado."""
    user = request.user
    try:
        result = (
            supabase.table("analyses")
            .select("*")
            .eq("user_id", user["id"])
            .order("created_at", desc=True)
            .limit(50)
            .execute()
        )
        return jsonify({"success": True, "analyses": result.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ──────────────────────────────────────────────
# Health check
# ──────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "Love Analyzer API"})


# ──────────────────────────────────────────────
# Run
# ──────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000)
