export default function PrivacyModal({ onAccept, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-5">
                    <span className="text-4xl">🔒</span>
                    <h2 className="text-xl font-bold text-white mt-3">Tu privacidad es nuestra prioridad</h2>
                </div>

                <div className="text-sm text-gray-300 space-y-3 mb-6 leading-relaxed">
                    <p>
                        En cumplimiento con la <strong className="text-purple-300">Ley Orgánica de Protección de Datos Personales
                            del Ecuador (LOPDP)</strong>, te informamos:
                    </p>
                    <ul className="space-y-2 list-none">
                        <li className="flex gap-2">
                            <span>🛡️</span>
                            <span>Tus mensajes se procesan de forma <strong className="text-white">confidencial</strong> y no se almacenan a menos que crees una cuenta.</span>
                        </li>
                        <li className="flex gap-2">
                            <span>🤖</span>
                            <span>El análisis es generado por inteligencia artificial con fines <strong className="text-white">orientativos</strong>, no reemplaza consejo profesional.</span>
                        </li>
                        <li className="flex gap-2">
                            <span>🚫</span>
                            <span>No compartimos tu información con terceros.</span>
                        </li>
                        <li className="flex gap-2">
                            <span>🗑️</span>
                            <span>Puedes solicitar la eliminación de tus datos en cualquier momento.</span>
                        </li>
                    </ul>
                </div>

                <button onClick={onAccept} className="btn-glow w-full">
                    ✅ Acepto y quiero continuar
                </button>

                <button onClick={onClose} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    Cancelar
                </button>
            </div>
        </div>
    );
}
