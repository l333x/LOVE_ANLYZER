import { useState } from 'react';

const ROLES = [
    { key: 'pareja', label: 'Pareja actual', icon: '❤️' },
    { key: 'esposo', label: 'Esposo/a', icon: '💍' },
    { key: 'amigo', label: 'Amigo/a', icon: '🤝' },
    { key: 'familiar', label: 'Familiar', icon: '👨‍👩‍👧' },
    { key: 'crush', label: 'Crush / Casi algo', icon: '🦋' },
    { key: 'ex', label: 'Ex-pareja', icon: '💔' },
];

export default function AnalyzeModal({ onSubmit, onClose, loading }) {
    const [selectedRole, setSelectedRole] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!selectedRole || !message.trim()) return;
        onSubmit({ role: selectedRole, message: message.trim() });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-5">
                    <span className="text-4xl">💬</span>
                    <h2 className="text-xl font-bold text-white mt-3">¿Quién te envió este mensaje?</h2>
                    <p className="text-sm text-gray-400 mt-1">Selecciona el tipo de relación para un análisis más preciso</p>
                </div>

                {/* Role selector */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                    {ROLES.map((r) => (
                        <button
                            key={r.key}
                            onClick={() => setSelectedRole(r.key)}
                            className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all border
                ${selectedRole === r.key
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                    : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06] hover:border-white/20'
                                }`}
                        >
                            <span>{r.icon}</span>
                            <span>{r.label}</span>
                        </button>
                    ))}
                </div>

                {/* Message input */}
                {selectedRole && (
                    <div className="animate-card">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Pega o escribe el mensaje que recibiste:
                        </label>
                        <textarea
                            className="input-field"
                            placeholder="Escribe el mensaje aquí..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={!message.trim() || loading}
                            className={`btn-glow w-full mt-4 flex items-center justify-center gap-2
                ${(!message.trim() || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner !w-5 !h-5 !border-2"></div>
                                    <span>Analizando...</span>
                                </>
                            ) : (
                                <>🔍 Analizar Mensaje</>
                            )}
                        </button>
                    </div>
                )}

                <button onClick={onClose} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    Cancelar
                </button>
            </div>
        </div>
    );
}
