import { Link } from 'react-router-dom';

export default function LandingPage({ onAnalyzeClick }) {
    return (
        <div className="page-enter relative">
            {/* ── Orbs ── */}
            <div className="orb w-[500px] h-[500px] bg-pink-500 top-[-10%] left-[-10%]" style={{ position: 'absolute' }} />
            <div className="orb w-[400px] h-[400px] bg-blue-500 top-[20%] right-[-5%]" style={{ position: 'absolute' }} />
            <div className="orb w-[350px] h-[350px] bg-green-400 bottom-[10%] left-[30%]" style={{ position: 'absolute' }} />

            {/* ═══ HERO ═══ */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-5 sm:px-8 text-center overflow-hidden">
                {/* Floating emojis */}
                <span className="absolute text-[6rem] sm:text-[8rem] top-[10%] left-[5%] animate-float opacity-60 select-none pointer-events-none" style={{ animationDelay: '0s' }}>💔</span>
                <span className="absolute text-[5rem] sm:text-[7rem] top-[15%] right-[8%] animate-float opacity-50 select-none pointer-events-none" style={{ animationDelay: '2s' }}>🚩</span>
                <span className="absolute text-[4rem] sm:text-[6rem] bottom-[20%] left-[10%] animate-float opacity-40 select-none pointer-events-none" style={{ animationDelay: '4s' }}>🦋</span>
                <span className="absolute text-[5rem] sm:text-[7rem] bottom-[15%] right-[5%] animate-float opacity-50 select-none pointer-events-none" style={{ animationDelay: '1s' }}>💚</span>

                {/* Title */}
                <div className="relative z-10 animate-card max-w-5xl">
                    <h1 className="text-massive font-sans-heavy font-black uppercase text-white">
                        Descifra{' '}
                        <span className="font-serif-it normal-case" style={{ color: 'var(--pink)' }}>lo que</span>
                        <br />
                        <span className="text-outline">realmente</span>{' '}
                        <span className="font-serif-it normal-case" style={{ color: 'var(--acid)' }}>dicen</span>
                    </h1>
                </div>

                {/* Subtitle */}
                <p className="relative z-10 mt-8 max-w-lg text-white/50 text-base sm:text-lg leading-relaxed animate-card stagger-2">
                    Nuestra IA analiza el tono, las intenciones y las{' '}
                    <span className="text-white font-medium">banderas ocultas</span> en los mensajes
                    de tu pareja, crush, ex o cualquier relación.
                </p>

                <p className="relative z-10 mt-3 text-sm text-white/30 max-w-md animate-card stagger-3">
                    ✨ Analiza un mensaje rápido sin registro. Crea una cuenta gratis para guardar tu historial y chatear con la IA.
                </p>

                {/* CTA */}
                <button
                    onClick={onAnalyzeClick}
                    className="relative z-10 btn-glow text-lg sm:text-xl px-10 sm:px-14 py-4 sm:py-5 mt-10 animate-card stagger-4"
                    style={{ animation: 'pulse-glow 3s ease-in-out infinite, slideUp 0.5s cubic-bezier(0.4,0,0.2,1) backwards' }}
                >
                    Analizar un Mensaje →
                </button>
            </section>

            {/* ═══ MARQUEE ═══ */}
            <div className="overflow-hidden border-y border-white/[0.05] py-5 relative">
                <div className="marquee-track">
                    {[...Array(2)].map((_, i) => (
                        <span key={i} className="flex items-center gap-8 text-2xl sm:text-3xl font-sans-heavy font-bold tracking-tight text-white/10 whitespace-nowrap px-8 uppercase">
                            <span>Green Flags</span> <span className="text-green-400/30">✦</span>
                            <span>Toxicidad</span> <span style={{ color: 'rgba(255,45,123,0.3)' }}>✦</span>
                            <span>Manipulación</span> <span className="text-blue-400/30">✦</span>
                            <span>Love Bombing</span> <span className="text-yellow-400/30">✦</span>
                            <span>Gaslighting</span> <span style={{ color: 'rgba(255,45,123,0.3)' }}>✦</span>
                            <span>Red Flags</span> <span className="text-green-400/30">✦</span>
                            <span>Ghosting</span> <span className="text-blue-400/30">✦</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* ═══ BENTO GRID ═══ */}
            <section className="px-5 sm:px-8 py-20 sm:py-28 max-w-6xl mx-auto">
                <h2 className="text-huge font-sans-heavy font-black text-white text-center mb-4 animate-fade">
                    ¿Por qué <span className="font-serif-it normal-case" style={{ color: 'var(--pink)' }}>Love Analyzer</span>?
                </h2>
                <p className="text-center text-white/40 max-w-xl mx-auto mb-16 text-base">
                    Más que un analizador de mensajes. Es tu coach emocional de bolsillo.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {/* Card 1 — Tall */}
                    <div className="glass-card p-7 sm:row-span-2 flex flex-col justify-between animate-card stagger-1">
                        <div>
                            <span className="text-5xl block mb-4">🧠</span>
                            <h3 className="font-sans-heavy font-bold text-xl text-white mb-2 tracking-tight">
                                Análisis Psicológico Profundo
                            </h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Detectamos manipulación, evasión, doble sentido, cariño genuino y patrones de comunicación que revelan la verdadera intención.
                            </p>
                        </div>
                        <div className="mt-6 flex gap-2 flex-wrap">
                            <span className="flag-badge flag-red text-xs">🚩 Manipulación</span>
                            <span className="flag-badge flag-green text-xs">🟩 Cariño</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="glass-card p-7 animate-card stagger-2">
                        <span className="text-4xl block mb-3">🚩</span>
                        <h3 className="font-sans-heavy font-bold text-lg text-white mb-1 tracking-tight">Sistema de Banderas</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Red flags, green flags y yellow flags. Visualiza todo de un vistazo.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="glass-card p-7 animate-card stagger-3">
                        <span className="text-4xl block mb-3">💬</span>
                        <h3 className="font-sans-heavy font-bold text-lg text-white mb-1 tracking-tight">Chat con la IA</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Haz preguntas de seguimiento. La IA mantiene el contexto completo de tu análisis.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="glass-card p-7 animate-card stagger-4">
                        <span className="text-4xl block mb-3">🔒</span>
                        <h3 className="font-sans-heavy font-bold text-lg text-white mb-1 tracking-tight">100% Confidencial</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Cumplimiento con LOPDP Ecuador. Tus mensajes no se almacenan sin tu consentimiento.
                        </p>
                    </div>

                    {/* Card 5 — Wide */}
                    <div className="glass-card p-7 sm:col-span-2 animate-card stagger-5">
                        <div className="flex items-start gap-5">
                            <span className="text-5xl shrink-0">⚡</span>
                            <div>
                                <h3 className="font-sans-heavy font-bold text-lg text-white mb-1 tracking-tight">Sugerencias de Respuesta</h3>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    No te quedes en visto. Recibe opciones de respuesta con tono asertivo, empático o directo.
                                    Copia y envía con un solo clic.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ BOTTOM CTA ═══ */}
            <section className="px-5 sm:px-8 py-20 text-center relative overflow-hidden">
                <div className="orb w-[300px] h-[300px] bg-pink-500 top-0 left-[50%] -translate-x-1/2" style={{ position: 'absolute' }} />
                <h2 className="text-huge font-sans-heavy font-black text-white relative z-10">
                    ¿<span className="font-serif-it normal-case" style={{ color: 'var(--acid)' }}>Listo</span> para la verdad?
                </h2>
                <p className="text-white/40 mt-4 mb-8 relative z-10">No cuesta nada. No toma más de 30 segundos.</p>
                <button onClick={onAnalyzeClick} className="btn-glow text-lg px-12 py-4 relative z-10">
                    Analizar Ahora →
                </button>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-white/[0.05] px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/20 text-xs">
                <span>© 2026 Love Analyzer. Todos los derechos reservados.</span>
                <div className="flex gap-6">
                    <Link to="/metodologia" className="hover:text-white/50 transition-colors no-underline text-white/20">Metodología</Link>
                    <Link to="/glosario" className="hover:text-white/50 transition-colors no-underline text-white/20">Glosario</Link>
                </div>
            </footer>
        </div>
    );
}
