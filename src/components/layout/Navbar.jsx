import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../ui/Logo';
import { useNavbarExtra } from '../../context/NavbarContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const { extraContent } = useNavbarExtra();

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 0);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScrollState);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Update indicator position when route changes or window resizes
  useEffect(() => {
    let rafId;
    const updateIndicator = () => {
      if (!navRef.current) return;
      const activeLink = navRef.current.querySelector('.site-nav-link.active');
      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink;
        setIndicatorStyle({
          left: offsetLeft,
          width: offsetWidth,
          opacity: 1
        });
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    // Use rAF to wait for the DOM to be ready and class to be applied
    rafId = requestAnimationFrame(updateIndicator);

    // If scrolled state changed, run a loop for the duration of the CSS transition (500ms)
    // to keep the indicator "locked" while elements are moving
    let startTime = Date.now();
    const transitionLoop = () => {
      updateIndicator();
      if (Date.now() - startTime < 600) {
        rafId = requestAnimationFrame(transitionLoop);
      }
    };
    
    if (isScrolled !== undefined) {
      transitionLoop();
    }

    window.addEventListener('resize', updateIndicator);
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [location.pathname, isScrolled]);

  const isActiveRoute = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const linkClassName = (isActive, extraClass = '') => `site-nav-link${isActive ? ' active' : ''}${extraClass ? ` ${extraClass}` : ''}`;

  return (
    <nav className={`site-nav${isScrolled ? ' is-scrolled scrolled' : ''}`}>
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
        <Logo size={isScrolled ? 32 : 38} />
        <span className="logo-name">README<span>Forge</span></span>
      </Link>

      {/* Editor-specific extra content injected here */}
      {extraContent && <div className="nav-extra-content">{extraContent}</div>}

      <div id="site-navigation" className={`site-nav-links${menuOpen ? ' open' : ''}`} ref={navRef}>
        {/* Sliding Indicator */}
        <div 
          className="nav-active-indicator" 
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity
          }}
        />

        <Link
          to="/"
          className={linkClassName(isActiveRoute('/', true))}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/readme-maker"
          className={linkClassName(isActiveRoute('/readme-maker'))}
          onClick={() => setMenuOpen(false)}
        >
          README Maker
        </Link>
        <Link
          to="/how-to-use"
          className={linkClassName(isActiveRoute('/how-to-use'))}
          onClick={() => setMenuOpen(false)}
        >
          How To Use
        </Link>
        <a
          href="https://github.com/Mohit-368/ReadmeForge"
          target="_blank"
          rel="noreferrer"
          className="site-nav-link site-nav-link--gh mobile-only"
          onClick={() => setMenuOpen(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          Source
        </a>
        <button
          type="button"
          className="theme-toggle mobile-only"
          title="Toggle dark/light mode"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="site-nav-actions">
        <a
          href="https://github.com/Mohit-368/ReadmeForge"
          target="_blank"
          rel="noreferrer"
          className="site-nav-link site-nav-link--gh desktop-only"
          title="View source on GitHub"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          Source
        </a>

        <button
          type="button"
          className="theme-toggle desktop-only"
          id="themeToggle"
          title="Toggle dark/light mode"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>

        <button
          className="nav-hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
