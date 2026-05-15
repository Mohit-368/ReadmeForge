import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition() {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation on route change
    setIsAnimating(true);
    
    // Duration matches CSS animation (1.4s total)
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isAnimating) return null;

  return (
    <div className="page-swipe-overlay">
      <div className="swipe-glow" />
    </div>
  );
}
