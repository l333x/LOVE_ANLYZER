import { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export default function ChatFollowUp({ user, role, analysis, onAuthPrompt }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Gate: anonymous users can't chat
        if (!user) {
            onAuthPrompt();
            return;
        }

        const userMsg = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            // Build history for context
            const history = [
                // Include the original analysis context
                {
                    role: 'user',
                    text: `[Análisis previo] Mensaje original analizado (rol: ${role}). Resultado del análisis: ${JSON.stringify(analysis)}`,
                },
                ...messages,
            ];

            const res = await apiFetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.access_token}`,
                },
                body: JSON.stringify({ role, message: userMsg, history }),
            });

            const data = await res.json();

            if (data.success) {
                setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: 'model', text: `⚠️ Error: ${data.error || 'No se pudo procesar tu mensaje.'}` },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: 'model', text: '⚠️ Error de conexión. Intenta de nuevo.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <section className="w-full max-w-2xl mx-auto px-4 pb-8">
            <div className="glass-card p-5">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-4">
                    <span>🗣️</span> Chat de Seguimiento
                </h3>

                {/* Messages */}
                <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1">
                    {messages.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                            Haz preguntas sobre el análisis para profundizar...
                        </p>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="chat-bubble-ai flex items-center gap-2">
                                <div className="spinner !w-4 !h-4 !border-2"></div>
                                <span className="text-sm text-gray-400">Pensando...</span>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="input-field flex-1"
                        placeholder={
                            user
                                ? 'Escribe tu pregunta de seguimiento...'
                                : 'Inicia sesión para usar el chat...'
                        }
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className={`btn-glow !px-5 !py-3 ${(!input.trim() || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        ➤
                    </button>
                </div>

                {!user && (
                    <p className="text-xs text-amber-400/80 mt-2 text-center">
                        🔐 Inicia sesión o Crea tu cuenta para continuar esta conversación y guardar tu historial.
                    </p>
                )}
            </div>
        </section>
    );
}
