import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition() {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation on route change
    setIsAnimating(true);
    
    // Duration matches CSS animation (1.2s total)
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isAnimating) return null;

  return (
    <div className="page-swipe-overlay">
      <div className="smoke-cloud smoke-1" />
      <div className="smoke-cloud smoke-2" />
      <div className="smoke-cloud smoke-3" />
      <div className="smoke-cloud smoke-4" />
    </div>
  );
}
