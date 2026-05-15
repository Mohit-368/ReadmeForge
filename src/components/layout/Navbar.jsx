import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../ui/Logo';
import { useNavbarExtra } from '../../context/NavbarContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const { extraContent } = useNavbarExtra();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    rafId = requestAnimationFrame(() => {
      updateIndicator();
      // Second check for reliability
      rafId = requestAnimationFrame(updateIndicator);
    });

    window.addEventListener('resize', updateIndicator);
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [location.pathname]);

  return (
    <nav className={`site-nav${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
        <Logo size={scrolled ? 32 : 38} />
        <span className="logo-name">README<span>Forge</span></span>
      </Link>

      {/* Editor-specific extra content injected here */}
      {extraContent && <div className="nav-extra-content">{extraContent}</div>}

      <div className={`site-nav-links${menuOpen ? ' open' : ''}`} ref={navRef}>
        {/* Sliding Indicator */}
        <div 
          className="nav-active-indicator" 
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity
          }}
        />

        <NavLink
          to="/"
          end
          className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/readme-maker"
          className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          README Maker
        </NavLink>
        <NavLink
          to="/how-to-use"
          className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          How To Use
        </NavLink>
        <a
          href="https://github.com/Mohit-368/ReadmeForge"
          target="_blank"
          rel="noreferrer"
          className="site-nav-link site-nav-link--gh"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          Source
        </a>
        <button
          className="theme-toggle"
          id="themeToggle"
          title="Toggle dark/light mode"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>

      <button
        className="nav-hamburger"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(o => !o)}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
