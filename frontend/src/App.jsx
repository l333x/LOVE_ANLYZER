import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { apiFetch } from './lib/api';
import NoiseTexture from './components/NoiseTexture';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import PrivacyModal from './components/PrivacyModal';
import AnalyzeModal from './components/AnalyzeModal';
import AnalysisResults from './components/AnalysisResults';
import ChatFollowUp from './components/ChatFollowUp';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import MethodologyPage from './pages/MethodologyPage';
import GlossaryPage from './pages/GlossaryPage';
import DashboardPage from './pages/DashboardPage';

/* Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* Floating geometric shapes background */
function FloatingGeometry() {
  return (
    <>
      <div className="geo-shape geo-circle" style={{ width: 120, height: 120, top: '15%', left: '5%', animationDelay: '0s' }} />
      <div className="geo-shape geo-diamond" style={{ width: 80, height: 80, top: '60%', right: '8%', animationDelay: '5s' }} />
      <div className="geo-shape geo-circle" style={{ width: 50, height: 50, bottom: '20%', left: '45%', animationDelay: '10s' }} />
      <div className="geo-shape" style={{ width: 100, height: 100, top: '80%', left: '15%', animationDelay: '15s', borderRadius: '0.5rem' }} />
    </>
  );
}

export default function App() {
  // ─── Auth state (PRESERVED) ───
  const [user, setUser] = useState(null);

  // ─── Modal state (PRESERVED + EXPANDED) ───
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // ─── Analysis state (PRESERVED) ───
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisRole, setAnalysisRole] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  // ─── Persist user session from localStorage (PRESERVED) ───
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

  // ═══ Handlers (ALL PRESERVED) ═══

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
    setShowProfileModal(false);
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

  // ─── NEW: Resume analysis from dashboard history ───
  const handleResumeAnalysis = ({ role, result, chatHistory }) => {
    setAnalysisResult(result);
    setAnalysisRole(role);
    // chatHistory is loaded into ChatFollowUp via the analysis context
  };

  // ─── Home: Landing or Results (PRESERVED LOGIC) ───
  const HomePage = () => (
    <>
      {!analysisResult ? (
        <LandingPage onAnalyzeClick={handleCTAClick} />
      ) : (
        <div className="page-enter">
          {/* Back button */}
          <div className="flex justify-center pt-8 relative z-10">
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
        </div>
      )}
    </>
  );

  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* ── Dynamic Background Layer ── */}
      <div className="mesh-bg" />
      <NoiseTexture />
      <FloatingGeometry />

      <div className="min-h-screen flex flex-col relative">
        <Navbar
          user={user}
          onLoginClick={openLogin}
          onSignupClick={openSignup}
          onLogout={handleLogout}
          onProfileClick={() => setShowProfileModal(true)}
        />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/metodologia" element={<MethodologyPage />} />
            <Route path="/glosario" element={<GlossaryPage />} />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  user={user}
                  onLoginClick={openLogin}
                  onResumeAnalysis={handleResumeAnalysis}
                />
              }
            />
          </Routes>
        </main>
      </div>

      {/* ─── Modals (PRESERVED + EXPANDED) ─── */}
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

      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onLogout={handleLogout}
        />
      )}
    </BrowserRouter>
  );
}
