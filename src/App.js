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

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to) => {
    if (window.location.pathname === to) {
      return;
    }

    window.history.pushState({}, '', to);
    setPath(to);
  };

  if (path === '/introduction') {
    return <Introduction onProceedClick={() => navigate('/options')} />;
  }

  if (path === '/options') {
    return (
      <Options
        onAnalysisComplete={(result) => {
          const nextResult = result || null;
          setPhaseTwoResult(nextResult);

          if (nextResult) {
            window.localStorage.setItem(PHASE_TWO_RESULT_STORAGE_KEY, JSON.stringify(nextResult));
          } else {
            window.localStorage.removeItem(PHASE_TWO_RESULT_STORAGE_KEY);
          }

          navigate('/demographics');
        }}
        onCameraPermissionAllow={() => navigate('/camera-setup')}
      />
    );
  }

  if (path === '/camera-setup') {
    return <CameraSetUp onSetupComplete={() => navigate('/take-photo')} />;
  }

  if (path === '/take-photo') {
    return <TakePhoto onLogoClick={() => navigate('/')} onBack={() => navigate('/camera-setup')} />;
  }

  if (path === '/ai-analysis') {
    return <AIAnalysis />;
  }

  if (path === '/demographics') {
    return <Demographics phaseTwoResult={phaseTwoResult} />;
  }

  return <LandingPage onTakeTestClick={() => navigate('/introduction')} />;
}

export default App;
