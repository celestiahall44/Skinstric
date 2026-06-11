import { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage/LandingPage';
import Introduction from './pages/Introduction/Introduction';
import Options from './pages/Options/Options';

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
    return <Options />;
  }

  return <LandingPage onTakeTestClick={() => navigate('/introduction')} />;
}

export default App;
