import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

const ROLE_LABELS = {
    pareja: '❤️ Pareja',
    esposo: '💍 Esposo/a',
    amigo: '🤝 Amigo/a',
    familiar: '👨‍👩‍👧 Familiar',
    crush: '🦋 Crush',
    ex: '💔 Ex-pareja',
};

export default function DashboardPage({ user, onLoginClick }) {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (!user) return;
        const fetchHistory = async () => {
            try {
                const res = await apiFetch('/api/history', {
                    headers: { Authorization: `Bearer ${user.access_token}` },
                });
                const data = await res.json();
                if (data.success) setAnalyses(data.analyses || []);
            } catch {
                /* silently fail */
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    // ── Not logged in ──
    if (!user) {
        return (
            <div className="page-enter flex-1 flex flex-col items-center justify-center text-center px-5 py-20">
                <span className="text-6xl mb-6 animate-float">🔐</span>
                <h1 className="text-huge font-sans-heavy font-black text-white mb-4">
                    Acceso <span className="font-serif-it normal-case" style={{ color: 'var(--pink)' }}>restringido</span>
                </h1>
                <p className="text-white/40 max-w-md mb-8">
                    Inicia sesión o crea una cuenta para acceder a tu historial de análisis.
                </p>
                <button onClick={onLoginClick} className="btn-glow text-lg px-10 py-4">
                    Iniciar Sesión →
                </button>
            </div>
        );
    }

    // ── Detail view ──
    if (selected) {
        const a = selected;
        const ai = a.ai_analysis || {};
        return (
            <div className="page-enter px-5 sm:px-8 py-10 max-w-3xl mx-auto relative z-10">
                <button
                    onClick={() => setSelected(null)}
                    className="btn-secondary text-xs mb-8"
                >
                    ← Volver al historial
                </button>

                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{ROLE_LABELS[a.role]?.split(' ')[0]}</span>
                    <span className="text-white/30 text-xs">{new Date(a.created_at).toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                <div className="glass-card p-5 mb-5">
                    <p className="text-white/30 text-xs font-sans-heavy uppercase tracking-wider mb-2">Mensaje original</p>
                    <p className="text-white/60 text-sm leading-relaxed">"{a.original_message}"</p>
                </div>

                <div className="glass-card p-5 mb-5">
                    <p className="text-white/30 text-xs font-sans-heavy uppercase tracking-wider mb-2">Contexto</p>
                    <p className="text-white/60 text-sm leading-relaxed">{ai.contexto}</p>
                </div>

                {ai.flags && ai.flags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                        {ai.flags.map((f, i) => (
                            <span key={i} className={`flag-badge ${f.includes('🚩') ? 'flag-red' : f.includes('🟩') ? 'flag-green' : 'flag-yellow'}`}>
                                {f}
                            </span>
                        ))}
                    </div>
                )}

                <div className="glass-card p-5">
                    <p className="text-white/30 text-xs font-sans-heavy uppercase tracking-wider mb-2">Recomendación</p>
                    <p className="text-white/60 text-sm leading-relaxed">{ai.recomendacion_final}</p>
                </div>
            </div>
        );
    }

    // ── History grid ──
    return (
        <div className="page-enter relative">
            <div className="orb w-[350px] h-[350px] bg-purple-500 top-[5%] right-[-5%]" style={{ position: 'absolute' }} />

            <section className="px-5 sm:px-8 pt-16 pb-8 text-center max-w-4xl mx-auto relative z-10">
                <h1 className="text-huge font-sans-heavy font-black text-white animate-card">
                    Mi <span className="font-serif-it normal-case" style={{ color: 'var(--neon-purple)' }}>Historial</span>
                </h1>
                <p className="text-white/40 mt-3 animate-card stagger-1">
                    Todos tus análisis guardados. Haz clic para ver el detalle.
                </p>
            </section>

            <section className="px-5 sm:px-8 pb-20 max-w-5xl mx-auto relative z-10">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="spinner" />
                    </div>
                ) : analyses.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4">📭</span>
                        <p className="text-white/30">Aún no tienes análisis guardados.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analyses.map((a, i) => {
                            const ai = a.ai_analysis || {};
                            const hasRed = ai.flags?.some(f => f.includes('🚩'));
                            const hasGreen = ai.flags?.some(f => f.includes('🟩'));
                            return (
                                <div
                                    key={a.id || i}
                                    onClick={() => setSelected(a)}
                                    className="glass-card p-5 cursor-pointer animate-card group"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg">{ROLE_LABELS[a.role]?.split(' ')[0] || '📩'}</span>
                                        <span className="text-[10px] text-white/20 font-sans-heavy">
                                            {new Date(a.created_at).toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                    <p className="text-white/50 text-sm line-clamp-2 mb-3 leading-relaxed">
                                        "{a.original_message}"
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {hasRed && <span className="text-xs px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">🚩 Red</span>}
                                        {hasGreen && <span className="text-xs px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">🟩 Green</span>}
                                        {ai.abuso_detectado && <span className="text-xs px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20">⚠️ Abuso</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
