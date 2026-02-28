import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
    { to: '/', label: 'Inicio' },
    { to: '/metodologia', label: 'Metodología' },
    { to: '/glosario', label: 'Glosario Tóxico' },
];

export default function Navbar({ user, onLoginClick, onSignupClick, onLogout, onProfileClick }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const initial = user?.email?.charAt(0)?.toUpperCase() || '?';

    return (
        <>
            {/* ── Desktop + Mobile Bar ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 py-4 flex items-center justify-between backdrop-blur-xl bg-black/40 border-b border-white/[0.05]">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 no-underline">
                    <span className="text-2xl">💔</span>
                    <span className="font-sans-heavy text-lg font-bold tracking-tight text-white">
                        Love<span style={{ color: 'var(--pink)' }}>Analyzer</span>
                    </span>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`text-sm font-medium tracking-tight no-underline transition-colors ${location.pathname === link.to
                                    ? 'text-white'
                                    : 'text-white/50 hover:text-white'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {user && (
                        <Link
                            to="/dashboard"
                            className={`text-sm font-medium tracking-tight no-underline transition-colors ${location.pathname === '/dashboard'
                                    ? 'text-white'
                                    : 'text-white/50 hover:text-white'
                                }`}
                        >
                            Mi Historial
                        </Link>
                    )}
                </div>

                {/* Desktop auth */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <>
                            {/* Profile avatar button */}
                            <button
                                onClick={onProfileClick}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans-heavy font-bold text-white transition-all hover:scale-110 hover:shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, var(--pink), var(--electric))',
                                    boxShadow: '0 0 15px rgba(255,45,123,0.2)',
                                }}
                                title={user.email}
                            >
                                {initial}
                            </button>
                            <button onClick={onLogout} className="btn-secondary text-xs">Salir</button>
                        </>
                    ) : (
                        <>
                            <button onClick={onLoginClick} className="btn-secondary text-xs">Iniciar Sesión</button>
                            <button onClick={onSignupClick} className="btn-glow !py-2 !px-5 !text-xs">Crear Cuenta</button>
                        </>
                    )}
                </div>

                {/* Hamburger (mobile) */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-[5px] p-2 relative z-[60]"
                    aria-label="Menu"
                >
                    <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                    <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </button>
            </nav>

            {/* ── Mobile Fullscreen Menu ── */}
            <div
                className={`fixed inset-0 z-[55] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMenuOpen(false)}
                        className="text-3xl font-sans-heavy font-bold tracking-tighter text-white no-underline hover:opacity-70 transition-opacity"
                    >
                        {link.label}
                    </Link>
                ))}

                {user && (
                    <>
                        <Link
                            to="/dashboard"
                            onClick={() => setMenuOpen(false)}
                            className="text-3xl font-sans-heavy font-bold tracking-tighter text-white no-underline hover:opacity-70 transition-opacity"
                        >
                            Mi Historial
                        </Link>
                        <button
                            onClick={() => { onProfileClick(); setMenuOpen(false); }}
                            className="text-xl font-sans-heavy font-bold tracking-tighter text-white/60 no-underline hover:opacity-70 transition-opacity"
                        >
                            👤 Mi Perfil
                        </button>
                    </>
                )}

                <div className="flex flex-col items-center gap-3 mt-6">
                    {user ? (
                        <button onClick={() => { onLogout(); setMenuOpen(false); }} className="btn-secondary">
                            Cerrar Sesión
                        </button>
                    ) : (
                        <>
                            <button onClick={() => { onLoginClick(); setMenuOpen(false); }} className="btn-secondary">
                                Iniciar Sesión
                            </button>
                            <button onClick={() => { onSignupClick(); setMenuOpen(false); }} className="btn-glow">
                                Crear Cuenta
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Spacer for fixed navbar */}
            <div className="h-[72px]" />
        </>
    );
}
