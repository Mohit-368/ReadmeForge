import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition() {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation on route change
    setIsAnimating(true);
    
    // Fast transition for Editor/HTU, regular for Home
    const isFast = location.pathname !== '/';
    const duration = isFast ? 800 : 1200;
    const delay = isFast ? 150 : 300;

    // Set CSS variables for sync
    document.documentElement.style.setProperty('--transition-duration', `${duration}ms`);
    document.documentElement.style.setProperty('--transition-delay', `${delay}ms`);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, duration + 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isAnimating) return null;

  const isFast = location.pathname !== '/';

  return (
    <div className={`page-swipe-overlay${isFast ? ' is-fast' : ''}`}>
      <div className="smoke-cloud smoke-1" />
      <div className="smoke-cloud smoke-2" />
      <div className="smoke-cloud smoke-3" />
      <div className="smoke-cloud smoke-4" />
    </div>
  );
}
