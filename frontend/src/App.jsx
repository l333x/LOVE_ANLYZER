import { useState, useEffect } from 'react';
import { apiFetch } from './lib/api';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import PrivacyModal from './components/PrivacyModal';
import AnalyzeModal from './components/AnalyzeModal';
import AnalysisResults from './components/AnalysisResults';
import ChatFollowUp from './components/ChatFollowUp';
import AuthModal from './components/AuthModal';

export default function App() {
  // Auth state
  const [user, setUser] = useState(null);

  // Modal state
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Analysis state
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisRole, setAnalysisRole] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  // Persist user session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('la_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('la_user');
      }
    }
  }, []);

  // ─── Handlers ───

  const handleCTAClick = () => {
    setShowPrivacyModal(true);
  };

  const handlePrivacyAccept = () => {
    setShowPrivacyModal(false);
    setShowAnalyzeModal(true);
  };

  const handleAnalyze = async ({ role, message }) => {
    setAnalyzing(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user?.access_token) {
        headers['Authorization'] = `Bearer ${user.access_token}`;
      }

      const res = await apiFetch('/api/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify({ role, message }),
      });

      const data = await res.json();

      if (data.success) {
        setAnalysisResult(data.analysis);
        setAnalysisRole(role);
        setShowAnalyzeModal(false);
      } else {
        alert(data.error || 'Error al analizar el mensaje.');
      }
    } catch {
      alert('Error de conexión. Verifica que el backend esté activo.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem('la_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('la_user');
  };

  const openLogin = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const openSignup = () => {
    setAuthModalMode('register');
    setShowAuthModal(true);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setAnalysisRole('');
    setShowPrivacyModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={user}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        onLogout={handleLogout}
      />

      {/* Main content */}
      {!analysisResult ? (
        <LandingPage onAnalyzeClick={handleCTAClick} />
      ) : (
        <>
          {/* Back / new analysis button */}
          <div className="flex justify-center pt-6">
            <button onClick={handleNewAnalysis} className="btn-secondary text-sm">
              ← Nuevo Análisis
            </button>
          </div>

          <AnalysisResults analysis={analysisResult} role={analysisRole} />
          <ChatFollowUp
            user={user}
            role={analysisRole}
            analysis={analysisResult}
            onAuthPrompt={openLogin}
          />
        </>
      )}

      {/* Modals */}
      {showPrivacyModal && (
        <PrivacyModal
          onAccept={handlePrivacyAccept}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}

      {showAnalyzeModal && (
        <AnalyzeModal
          onSubmit={handleAnalyze}
          onClose={() => setShowAnalyzeModal(false)}
          loading={analyzing}
        />
      )}

      {showAuthModal && (
        <AuthModal
          mode={authModalMode}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
        />
      )}
    </div>
  );
}
