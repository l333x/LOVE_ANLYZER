import { useState } from 'react';
import { apiFetch } from '../lib/api';

export default function AuthModal({ mode: initialMode, onClose, onAuth }) {
    const [mode, setMode] = useState(initialMode || 'login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

        try {
            const res = await apiFetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const data = await res.json();

            if (data.success) {
                if (mode === 'register') {
                    setSuccess('¡Cuenta creada! Revisa tu email para confirmar, luego inicia sesión.');
                    setMode('login');
                } else {
                    onAuth({
                        ...data.user,
                        access_token: data.access_token,
                    });
                    onClose();
                }
            } else {
                setError(data.error || 'Ocurrió un error. Intenta de nuevo.');
            }
        } catch {
            setError('Error de conexión. Verifica que el servidor esté activo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <span className="text-4xl">{mode === 'login' ? '👋' : '🚀'}</span>
                    <h2 className="text-xl font-bold text-white mt-3">
                        {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {mode === 'login'
                            ? 'Inicia sesión para acceder a tu historial y chat'
                            : 'Regístrate gratis para guardar tus análisis'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex mb-5 bg-white/[0.04] rounded-xl p-1">
                    <button
                        onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login'
                            ? 'bg-purple-500/25 text-purple-300'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'register'
                            ? 'bg-purple-500/25 text-purple-300'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        Crear Cuenta
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                        ❌ {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 text-sm">
                        ✅ {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-glow w-full flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <div className="spinner !w-5 !h-5 !border-2"></div>
                                <span>Procesando...</span>
                            </>
                        ) : mode === 'login' ? (
                            '🔓 Iniciar Sesión'
                        ) : (
                            '✨ Crear Cuenta'
                        )}
                    </button>
                </form>

                <button onClick={onClose} className="w-full mt-4 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    Cancelar
                </button>
            </div>
        </div>
    );
}
