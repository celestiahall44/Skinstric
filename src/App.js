import { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage/LandingPage';
import Analysis from './pages/Analysis/Analysis';

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

  if (path === '/analysis') {
    return <Analysis />;
  }

  return <LandingPage onTakeTestClick={() => navigate('/analysis')} />;
}

export default App;
