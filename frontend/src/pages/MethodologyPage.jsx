import { Link } from 'react-router-dom';

const STEPS = [
    {
        num: '01',
        emoji: '📩',
        title: 'Pega el mensaje',
        desc: 'Copia el mensaje de WhatsApp, Instagram DM, Telegram o cualquier plataforma y pégalo en Love Analyzer.',
        detail: 'No importa la longitud. Puede ser un texto, un párrafo o toda una conversación.',
    },
    {
        num: '02',
        emoji: '🤖',
        title: 'La IA lo analiza',
        desc: 'Nuestro motor de IA (Gemini) actúa como un experto en psicología relacional y comunicación asertiva.',
        detail: 'Analiza el tono, detecta patrones de manipulación, evasión, doble sentido, love bombing, gaslighting y más.',
    },
    {
        num: '03',
        emoji: '🚩',
        title: 'Detecta banderas',
        desc: 'Clasifica los hallazgos en Red Flags (peligro), Yellow Flags (precaución) y Green Flags (señales positivas).',
        detail: 'Si detecta posibles señales de abuso emocional o psicológico, activa una alerta especial.',
    },
    {
        num: '04',
        emoji: '💡',
        title: 'Te da un plan',
        desc: 'Recibes una recomendación empática del coach IA y sugerencias de respuesta que puedes copiar y enviar.',
        detail: 'Las respuestas son asertivas, contextuales y adaptadas al tipo de relación que seleccionaste.',
    },
    {
        num: '05',
        emoji: '💬',
        title: 'Profundiza en chat',
        desc: 'Si necesitas más claridad, abre el chat de seguimiento. La IA mantiene todo el contexto de tu análisis.',
        detail: 'Requiere cuenta gratuita. Tu historial queda guardado para futuras consultas.',
    },
];

const PATTERNS = [
    { name: 'Gaslighting', icon: '🌪️', color: 'var(--pink)', desc: 'Hacer que dudes de tu propia realidad o percepción.' },
    { name: 'Love Bombing', icon: '💣', color: 'var(--electric)', desc: 'Exceso de atención y afecto para generar dependencia.' },
    { name: 'Breadcrumbing', icon: '🍞', color: '#ffd000', desc: 'Dar migajas de atención para mantener el interés sin compromiso.' },
    { name: 'Stonewalling', icon: '🧱', color: 'var(--muted)', desc: 'Bloquear toda comunicación como forma de castigo.' },
    { name: 'Comunicación asertiva', icon: '💚', color: 'var(--acid)', desc: 'Expresión clara, respetuosa y directa de necesidades y límites.' },
    { name: 'Triangulación', icon: '🔺', color: 'var(--pink)', desc: 'Involucrar a una tercera persona para generar celos o inseguridad.' },
];

export default function MethodologyPage() {
    return (
        <div className="page-enter relative">
            {/* Orbs */}
            <div className="orb w-[400px] h-[400px] bg-blue-500 top-[5%] right-[-5%]" style={{ position: 'absolute' }} />
            <div className="orb w-[350px] h-[350px] bg-pink-500 bottom-[15%] left-[-5%]" style={{ position: 'absolute' }} />

            {/* ── Hero ── */}
            <section className="px-5 sm:px-8 pt-16 pb-10 text-center max-w-4xl mx-auto relative z-10">
                <span className="text-6xl block mb-6 animate-float">🔬</span>
                <h1 className="text-huge font-sans-heavy font-black text-white animate-card">
                    Cómo <span className="font-serif-it normal-case" style={{ color: 'var(--electric)' }}>funciona</span> la magia
                </h1>
                <p className="text-white/40 mt-4 max-w-lg mx-auto animate-card stagger-1">
                    No es magia: es psicología, lingüística computacional e inteligencia artificial trabajando juntas.
                </p>
            </section>

            {/* ── Steps ── */}
            <section className="px-5 sm:px-8 py-16 max-w-4xl mx-auto relative z-10">
                <div className="space-y-0">
                    {STEPS.map((step, i) => (
                        <div
                            key={step.num}
                            className="animate-card flex gap-6 sm:gap-10 group"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {/* Timeline */}
                            <div className="flex flex-col items-center shrink-0">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-sans-heavy font-bold"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '2px solid rgba(255,255,255,0.08)',
                                        color: 'var(--pink)',
                                    }}
                                >
                                    {step.num}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className="w-[2px] flex-1 min-h-[40px]" style={{ background: 'rgba(255,255,255,0.05)' }} />
                                )}
                            </div>

                            {/* Content */}
                            <div className="pb-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{step.emoji}</span>
                                    <h3 className="font-sans-heavy font-bold text-xl text-white tracking-tight">{step.title}</h3>
                                </div>
                                <p className="text-white/50 leading-relaxed mb-1">{step.desc}</p>
                                <p className="text-white/25 text-sm leading-relaxed">{step.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Patterns we detect ── */}
            <section className="px-5 sm:px-8 py-20 border-t border-white/[0.05] relative z-10">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-huge font-sans-heavy font-black text-white text-center mb-4">
                        Patrones que <span className="font-serif-it normal-case" style={{ color: 'var(--pink)' }}>detectamos</span>
                    </h2>
                    <p className="text-center text-white/30 max-w-lg mx-auto mb-14">
                        La IA está entrenada para reconocer estos patrones en el texto.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PATTERNS.map((p, i) => (
                            <div
                                key={p.name}
                                className="glass-card p-6 animate-card"
                                style={{ animationDelay: `${i * 0.08}s` }}
                            >
                                <span className="text-3xl block mb-3">{p.icon}</span>
                                <h3 className="font-sans-heavy font-bold text-white tracking-tight mb-1" style={{ color: p.color }}>{p.name}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="px-5 sm:px-8 py-16 text-center relative z-10">
                <Link to="/" className="btn-glow text-lg px-10 py-4 no-underline inline-block">
                    ← Volver al inicio
                </Link>
            </section>
        </div>
    );
}
