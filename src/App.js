import { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage/LandingPage';
import Introduction from './pages/Introduction/Introduction';
import Options from './pages/Options/Options';
import AIAnalysis from './pages/AIAnalysis/AIAnalysis';
import Demographics from './pages/Demographics/Demographics';

function App() {
  const [path, setPath] = useState(window.location.pathname);

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
    return <Options onAnalysisComplete={() => navigate('/ai-analysis')} />;
  }

  if (path === '/ai-analysis') {
    return <AIAnalysis />;
  }

  if (path === '/demographics') {
    return <Demographics />;
  }

  return <LandingPage onTakeTestClick={() => navigate('/introduction')} />;
}

export default App;
