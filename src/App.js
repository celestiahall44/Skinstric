import { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage/LandingPage';
import Introduction from './pages/Introduction/Introduction';
import Options from './pages/Options/Options';
import AIAnalysis from './pages/AIAnalysis/AIAnalysis';
import Demographics from './pages/Demographics/Demographics';
import CameraSetUp from './pages/CameraSetUp/CameraSetUp';
import TakePhoto from './pages/TakePhoto/TakePhoto';

const PHASE_TWO_RESULT_STORAGE_KEY = 'skinstricPhaseTwoResult';
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 960;

function readStoredPhaseTwoResult() {
  try {
    const storedValue = window.localStorage.getItem(PHASE_TWO_RESULT_STORAGE_KEY);
    if (!storedValue) {
      return null;
    }

    return JSON.parse(storedValue);
  } catch {
    return null;
  }
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [phaseTwoResult, setPhaseTwoResult] = useState(() => readStoredPhaseTwoResult());
  const [viewportScale, setViewportScale] = useState(1);
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  const handlePhaseTwoAnalysisComplete = (result) => {
    const nextResult = result || null;
    setPhaseTwoResult(nextResult);

    if (nextResult) {
      window.localStorage.setItem(PHASE_TWO_RESULT_STORAGE_KEY, JSON.stringify(nextResult));
    } else {
      window.localStorage.removeItem(PHASE_TWO_RESULT_STORAGE_KEY);
    }

    navigate('/ai-analysis');
  };

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const recalculateScale = () => {
      const widthScale = window.innerWidth / DESIGN_WIDTH;
      const heightScale = window.innerHeight / DESIGN_HEIGHT;
      const compact = window.innerWidth < 1025;
      setIsCompactViewport(compact);
      setViewportScale(compact ? Math.max(widthScale, heightScale) : Math.min(widthScale, heightScale, 1));
    };

    recalculateScale();
    window.addEventListener('resize', recalculateScale);
    return () => window.removeEventListener('resize', recalculateScale);
  }, []);

  const navigate = (to) => {
    if (window.location.pathname === to) {
      return;
    }

    window.history.pushState({}, '', to);
    setPath(to);
  };

  let pageContent = <LandingPage onTakeTestClick={() => navigate('/introduction')} />;

  if (path === '/introduction') {
    pageContent = <Introduction onProceedClick={() => navigate('/options')} />;
  } else if (path === '/options') {
    pageContent = (
      <Options
        onAnalysisComplete={handlePhaseTwoAnalysisComplete}
        onCameraPermissionAllow={() => navigate('/camera-setup')}
      />
    );
  } else if (path === '/camera-setup') {
    pageContent = <CameraSetUp onSetupComplete={() => navigate('/take-photo')} />;
  } else if (path === '/take-photo') {
    pageContent = (
      <TakePhoto
        onLogoClick={() => navigate('/')}
        onBack={() => navigate('/options')}
        onAnalysisComplete={handlePhaseTwoAnalysisComplete}
      />
    );
  } else if (path === '/ai-analysis') {
    pageContent = <AIAnalysis />;
  } else if (path === '/demographics') {
    pageContent = <Demographics phaseTwoResult={phaseTwoResult} />;
  }

  return (
    <div className={`app-responsive-viewport${isCompactViewport ? ' app-responsive-viewport--compact' : ''}`}>
      <div
        className="app-responsive-shell"
        style={{ transform: `scale(${viewportScale})`, width: `${DESIGN_WIDTH}px`, height: `${DESIGN_HEIGHT}px` }}
      >
        {pageContent}
      </div>
    </div>
  );
}

export default App;
