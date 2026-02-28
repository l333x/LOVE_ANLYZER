import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const ROLE_LABELS = {
    pareja: '❤️ Pareja',
    esposo: '💍 Esposo/a',
    amigo: '🤝 Amigo/a',
    familiar: '👨‍👩‍👧 Familiar',
    crush: '🦋 Crush',
    ex: '💔 Ex-pareja',
};

export default function DashboardPage({ user, onLoginClick, onResumeAnalysis }) {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

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

    const handleResume = (analysis) => {
        if (onResumeAnalysis) {
            onResumeAnalysis({
                role: analysis.role,
                result: analysis.ai_analysis,
                chatHistory: analysis.chat_history || [],
            });
            navigate('/');
        }
    };

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
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => setSelected(null)}
                        className="btn-secondary text-xs"
                    >
                        ← Volver
                    </button>
                    <button
                        onClick={() => handleResume(a)}
                        className="btn-glow !text-xs !py-2 !px-5"
                    >
                        💬 Continuar Chat
                    </button>
                </div>

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

                <div className="glass-card p-5 mb-5">
                    <p className="text-white/30 text-xs font-sans-heavy uppercase tracking-wider mb-2">Recomendación</p>
                    <p className="text-white/60 text-sm leading-relaxed">{ai.recomendacion_final}</p>
                </div>

                {/* Saved chat history */}
                {a.chat_history && a.chat_history.length > 0 && (
                    <div className="glass-card p-5">
                        <p className="text-white/30 text-xs font-sans-heavy uppercase tracking-wider mb-3">
                            💬 Chat Previo ({a.chat_history.length} mensajes)
                        </p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {a.chat_history.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} !text-xs !py-2 !px-3`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Bento grid ──
    const totalAnalyses = analyses.length;
    const redCount = analyses.filter(a => a.ai_analysis?.flags?.some(f => f.includes('🚩'))).length;
    const greenCount = analyses.filter(a => a.ai_analysis?.flags?.some(f => f.includes('🟩'))).length;

    return (
        <div className="page-enter relative">
            <div className="orb w-[350px] h-[350px] bg-purple-500 top-[5%] right-[-5%]" style={{ position: 'absolute' }} />
            <div className="orb w-[300px] h-[300px] bg-pink-500 bottom-[10%] left-[-5%]" style={{ position: 'absolute' }} />

            <section className="px-5 sm:px-8 pt-16 pb-8 text-center max-w-5xl mx-auto relative z-10">
                <h1 className="text-huge font-sans-heavy font-black text-white animate-card">
                    Mi <span className="font-serif-it normal-case" style={{ color: 'var(--neon-purple)' }}>Historial</span>
                </h1>
                <p className="text-white/40 mt-3 animate-card stagger-1">
                    Tus análisis guardados. Visualiza, profundiza y retoma donde lo dejaste.
                </p>
            </section>

            {/* ── Stats strip ── */}
            <section className="px-5 sm:px-8 pb-10 max-w-5xl mx-auto relative z-10">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bento-card p-5 text-center animate-card stagger-1">
                        <p className="text-3xl font-sans-heavy font-black text-white">{totalAnalyses}</p>
                        <p className="text-[10px] text-white/25 font-sans-heavy uppercase tracking-widest mt-1">Total</p>
                    </div>
                    <div className="bento-card p-5 text-center animate-card stagger-2">
                        <p className="text-3xl font-sans-heavy font-black" style={{ color: 'var(--pink)' }}>{redCount}</p>
                        <p className="text-[10px] text-white/25 font-sans-heavy uppercase tracking-widest mt-1">🚩 Red Flags</p>
                    </div>
                    <div className="bento-card p-5 text-center animate-card stagger-3">
                        <p className="text-3xl font-sans-heavy font-black" style={{ color: 'var(--acid)' }}>{greenCount}</p>
                        <p className="text-[10px] text-white/25 font-sans-heavy uppercase tracking-widest mt-1">🟩 Green Flags</p>
                    </div>
                </div>
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
                            const hasChat = a.chat_history && a.chat_history.length > 0;
                            return (
                                <div
                                    key={a.id || i}
                                    className="bento-card p-5 cursor-pointer animate-card group relative z-10"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                    {/* Card body - click to view detail */}
                                    <div onClick={() => setSelected(a)}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-lg">{ROLE_LABELS[a.role]?.split(' ')[0] || '📩'}</span>
                                            <span className="text-[10px] text-white/20 font-sans-heavy">
                                                {new Date(a.created_at).toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                        <p className="text-white/50 text-sm line-clamp-2 mb-3 leading-relaxed">
                                            "{a.original_message}"
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap mb-3">
                                            {hasRed && <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">🚩 Red</span>}
                                            {hasGreen && <span className="text-[10px] px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">🟩 Green</span>}
                                            {ai.abuso_detectado && <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20">⚠️ Abuso</span>}
                                            {hasChat && <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">💬 Chat</span>}
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-2 pt-2 border-t border-white/[0.04]">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelected(a); }}
                                            className="flex-1 text-[11px] py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/15 transition-all font-sans-heavy font-medium"
                                        >
                                            Ver Detalle
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleResume(a); }}
                                            className="flex-1 text-[11px] py-1.5 rounded-lg border transition-all font-sans-heavy font-semibold"
                                            style={{
                                                background: 'rgba(255,45,123,0.06)',
                                                borderColor: 'rgba(255,45,123,0.15)',
                                                color: 'var(--pink)',
                                            }}
                                        >
                                            💬 Retomar
                                        </button>
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
