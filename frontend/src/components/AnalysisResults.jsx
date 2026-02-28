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
        <section className="w-full max-w-2xl mx-auto px-4 py-8 space-y-5">
            <h2 className="text-2xl font-bold text-center text-white mb-6">
                📊 Resultados del Análisis
            </h2>

            {/* Contexto */}
            <div className="glass-card p-5 animate-card" style={{ animationDelay: '0.05s' }}>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-3">
                    <span>🧠</span> Análisis de Contexto
                </h3>
                <p className="text-gray-300 leading-relaxed">{analysis.contexto}</p>
            </div>

            {/* Flags */}
            {analysis.flags && analysis.flags.length > 0 && (
                <div className="glass-card p-5 animate-card" style={{ animationDelay: '0.1s' }}>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-3">
                        <span>🏁</span> Banderas Detectadas
                    </h3>
                    <div className="flex flex-wrap gap-2">
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
                    className="glass-card p-5 animate-card border-red-500/40"
                    style={{ animationDelay: '0.15s', background: 'rgba(239, 68, 68, 0.08)' }}
                >
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-red-400 mb-3">
                        <span>⚠️</span> Alerta: Posible Abuso Detectado
                    </h3>
                    <p className="text-red-300 text-sm leading-relaxed">
                        Nuestro análisis ha detectado posibles señales de abuso emocional o psicológico
                        en este mensaje. Te recomendamos buscar apoyo profesional. En Ecuador puedes
                        contactar la <strong>Línea de atención 171</strong> (ECU 911).
                    </p>
                </div>
            )}

            {/* Recomendación final */}
            <div className="glass-card p-5 animate-card" style={{ animationDelay: '0.2s' }}>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-3">
                    <span>💡</span> Recomendación del Coach
                </h3>
                <p className="text-gray-300 leading-relaxed">{analysis.recomendacion_final}</p>
            </div>

            {/* Sugerencias de respuesta */}
            {analysis.sugerencias_respuesta && analysis.sugerencias_respuesta.length > 0 && (
                <div className="glass-card p-5 animate-card" style={{ animationDelay: '0.25s' }}>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-3">
                        <span>💬</span> Sugerencias de Respuesta
                    </h3>
                    <div className="space-y-2">
                        {analysis.sugerencias_respuesta.map((sug, i) => (
                            <div
                                key={i}
                                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-purple-500/20 transition-colors"
                            >
                                <p className="text-gray-300 text-sm flex-1">"{sug}"</p>
                                <button
                                    onClick={() => copyToClipboard(sug, i)}
                                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors font-medium"
                                >
                                    {copiedIdx === i ? '✅ Copiado' : '📋 Copiar'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
