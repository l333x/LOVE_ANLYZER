import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export default function ProfileModal({ user, onClose, onLogout }) {
    const [stats, setStats] = useState({ total: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchStats = async () => {
            try {
                const res = await apiFetch('/api/history', {
                    headers: { Authorization: `Bearer ${user.access_token}` },
                });
                const data = await res.json();
                if (data.success) {
                    setStats({ total: data.analyses?.length || 0 });
                }
            } catch { /* silently fail */ }
            finally { setLoadingStats(false); }
        };
        fetchStats();
    }, [user]);

    if (!user) return null;

    const initial = user.email?.charAt(0)?.toUpperCase() || '?';
    const joinDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Miembro activo';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content !max-w-[420px] !p-0" onClick={(e) => e.stopPropagation()}>
                <div className="profile-card">
                    {/* Header band */}
                    <div className="px-7 pt-8 pb-6 text-center">
                        <div className="profile-avatar mx-auto mb-4">{initial}</div>
                        <h2 className="text-xl font-sans-heavy font-bold text-white tracking-tight">
                            {user.email}
                        </h2>
                        <p className="text-white/30 text-xs mt-1 font-sans-heavy uppercase tracking-widest">
                            {joinDate}
                        </p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 border-t border-white/[0.06]">
                        <div className="p-5 text-center border-r border-white/[0.06]">
                            <p className="text-2xl font-sans-heavy font-bold text-white">
                                {loadingStats ? '…' : stats.total}
                            </p>
                            <p className="text-[10px] text-white/30 font-sans-heavy uppercase tracking-wider mt-1">
                                Análisis
                            </p>
                        </div>
                        <div className="p-5 text-center">
                            <p className="text-2xl font-sans-heavy font-bold" style={{ color: 'var(--acid)' }}>∞</p>
                            <p className="text-[10px] text-white/30 font-sans-heavy uppercase tracking-wider mt-1">
                                Chat IA
                            </p>
                        </div>
                    </div>

                    {/* ID Footer */}
                    <div className="px-7 py-5 border-t border-white/[0.06]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] text-white/15 font-sans-heavy uppercase tracking-widest">
                                ID Digital ·  Love Analyzer
                            </span>
                            <span className="text-[10px] font-mono text-white/10">
                                {user.id?.slice(0, 8) || '—'}
                            </span>
                        </div>
                        <button
                            onClick={() => { onLogout(); onClose(); }}
                            className="w-full py-2.5 rounded-xl text-sm font-sans-heavy font-semibold transition-all text-white/40 hover:text-white border border-white/[0.06] hover:border-red-500/30 hover:bg-red-500/05"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
