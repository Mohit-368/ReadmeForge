import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition() {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation on route change
    setIsAnimating(true);
    
    // Smoke only for Home, fast fade for others
    const isHome = location.pathname === '/';
    const duration = isHome ? 1200 : 300;
    const delay = isHome ? 300 : 0;

    // Set CSS variables for sync
    document.documentElement.style.setProperty('--transition-duration', `${duration}ms`);
    document.documentElement.style.setProperty('--transition-delay', `${delay}ms`);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, duration + 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isAnimating) return null;

  const isHome = location.pathname === '/';

  return (
    <div className={`page-swipe-overlay${!isHome ? ' no-smoke' : ''}`}>
      {isHome && (
        <>
          <div className="smoke-cloud smoke-1" />
          <div className="smoke-cloud smoke-2" />
          <div className="smoke-cloud smoke-3" />
          <div className="smoke-cloud smoke-4" />
        </>
      )}
    </div>
  );
}
