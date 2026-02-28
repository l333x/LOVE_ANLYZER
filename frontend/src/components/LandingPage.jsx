export default function LandingPage({ onAnalyzeClick }) {
    return (
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-3xl mx-auto">
            {/* Hero */}
            <div className="animate-card">
                <span className="text-6xl mb-6 block">💌</span>
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
                    <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Descifra lo que realmente
                    </span>
                    <br />
                    <span className="text-white">dicen sus mensajes</span>
                </h1>
                <p className="text-lg text-gray-400 mb-3 max-w-xl mx-auto leading-relaxed">
                    Nuestra IA analiza el tono, las intenciones y las banderas ocultas en los mensajes
                    que recibes de tu pareja, crush, ex o cualquier relación.
                </p>
                <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                    ✨ Analiza un mensaje rápido sin registro.
                    Crea una cuenta gratis para guardar tu historial y tener un chat de seguimiento con la IA.
                </p>
            </div>

            {/* CTA */}
            <button
                onClick={onAnalyzeClick}
                className="btn-glow text-lg px-10 py-4 animate-card"
                style={{ animationDelay: '0.15s', animation: 'pulse-glow 3s ease-in-out infinite, slideUp 0.4s ease backwards' }}
            >
                🔍 Analizar un Mensaje
            </button>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full">
                {[
                    { icon: '🧠', title: 'Análisis Profundo', desc: 'Contexto real detrás de cada palabra' },
                    { icon: '🚩', title: 'Sistema de Banderas', desc: 'Red, green y yellow flags detectadas' },
                    { icon: '💬', title: 'Chat con la IA', desc: 'Haz preguntas de seguimiento' },
                ].map((f, i) => (
                    <div
                        key={i}
                        className="glass-card p-5 text-center animate-card hover:border-purple-500/30 transition-colors"
                        style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                    >
                        <span className="text-3xl mb-2 block">{f.icon}</span>
                        <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                        <p className="text-sm text-gray-400">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
