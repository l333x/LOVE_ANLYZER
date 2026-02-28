import { useState } from 'react';

function getFlagClass(flag) {
    if (flag.includes('🚩')) return 'flag-red';
    if (flag.includes('🟩')) return 'flag-green';
    if (flag.includes('🟨')) return 'flag-yellow';
    return 'flag-yellow';
}

export default function AnalysisResults({ analysis, role }) {
    const [copiedIdx, setCopiedIdx] = useState(null);

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 2000);
        });
    };

    if (!analysis) return null;

    return (
        <section className="page-enter w-full max-w-3xl mx-auto px-5 sm:px-8 py-10 space-y-6 relative">
            {/* Orb */}
            <div className="orb w-[300px] h-[300px] bg-pink-500 top-0 right-0" style={{ position: 'absolute' }} />

            <h2 className="text-huge font-sans-heavy font-black text-white text-center relative z-10">
                Resultado<span className="font-serif-it normal-case" style={{ color: 'var(--pink)' }}> del análisis</span>
            </h2>
            <p className="text-center text-white/30 text-sm mb-8 relative z-10">Aquí está lo que la IA descubrió en ese mensaje.</p>

            {/* Contexto */}
            <div className="glass-card p-6 sm:p-8 animate-card stagger-1 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🧠</span>
                    <h3 className="font-sans-heavy font-bold text-lg text-white tracking-tight">Análisis de Contexto</h3>
                </div>
                <p className="text-white/60 leading-relaxed">{analysis.contexto}</p>
            </div>

            {/* Flags */}
            {analysis.flags && analysis.flags.length > 0 && (
                <div className="glass-card p-6 sm:p-8 animate-card stagger-2 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">🏁</span>
                        <h3 className="font-sans-heavy font-bold text-lg text-white tracking-tight">Banderas Detectadas</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {analysis.flags.map((flag, i) => (
                            <span key={i} className={`flag-badge ${getFlagClass(flag)}`}>
                                {flag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Alerta de abuso */}
            {analysis.abuso_detectado && (
                <div
                    className="animate-card stagger-3 relative z-10 p-6 sm:p-8 rounded-2xl"
                    style={{
                        background: 'rgba(255,45,123,0.06)',
                        border: '2px solid rgba(255,45,123,0.2)',
                        boxShadow: '0 0 40px rgba(255,45,123,0.08)',
                    }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">⚠️</span>
                        <h3 className="font-sans-heavy font-bold text-lg tracking-tight" style={{ color: 'var(--pink)' }}>
                            Alerta: Posible Abuso Detectado
                        </h3>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">
                        Nuestro análisis ha detectado posibles señales de abuso emocional o psicológico.
                        Te recomendamos buscar apoyo profesional. En Ecuador puedes
                        contactar la <strong className="text-white">Línea de atención 171</strong> (ECU 911).
                    </p>
                </div>
            )}

            {/* Recomendación */}
            <div className="glass-card p-6 sm:p-8 animate-card stagger-3 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">💡</span>
                    <h3 className="font-sans-heavy font-bold text-lg text-white tracking-tight">Recomendación del Coach</h3>
                </div>
                <p className="text-white/60 leading-relaxed">{analysis.recomendacion_final}</p>
            </div>

            {/* Sugerencias */}
            {analysis.sugerencias_respuesta && analysis.sugerencias_respuesta.length > 0 && (
                <div className="glass-card p-6 sm:p-8 animate-card stagger-4 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">💬</span>
                        <h3 className="font-sans-heavy font-bold text-lg text-white tracking-tight">Sugerencias de Respuesta</h3>
                    </div>
                    <div className="space-y-3">
                        {analysis.sugerencias_respuesta.map((sug, i) => (
                            <div
                                key={i}
                                className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all"
                            >
                                <p className="text-white/60 text-sm flex-1 leading-relaxed">"{sug}"</p>
                                <button
                                    onClick={() => copyToClipboard(sug, i)}
                                    className="shrink-0 text-xs px-4 py-2 rounded-lg font-sans-heavy font-semibold transition-all"
                                    style={{
                                        background: copiedIdx === i ? 'rgba(34,255,136,0.1)' : 'rgba(255,45,123,0.1)',
                                        color: copiedIdx === i ? 'var(--acid)' : 'var(--pink)',
                                        border: `1px solid ${copiedIdx === i ? 'rgba(34,255,136,0.2)' : 'rgba(255,45,123,0.2)'}`,
                                    }}
                                >
                                    {copiedIdx === i ? '✓ Copiado' : 'Copiar'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
