export default function Navbar({ user, onLoginClick, onSignupClick, onLogout }) {
    return (
        <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-white/[0.02] sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <span className="text-2xl">💜</span>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Love Analyzer
                </span>
            </div>

            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        <span className="text-sm text-gray-400 hidden sm:inline">
                            {user.email}
                        </span>
                        <button onClick={onLogout} className="btn-secondary text-sm">
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={onLoginClick} className="btn-secondary text-sm">
                            Iniciar Sesión
                        </button>
                        <button onClick={onSignupClick} className="btn-glow text-sm !py-2 !px-5">
                            Crear Cuenta
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
