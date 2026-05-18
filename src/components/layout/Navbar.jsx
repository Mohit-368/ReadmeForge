import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../ui/Logo';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

  const isActiveRoute = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const linkClassName = (isActive, extraClass = '') => `site-nav-link${isActive ? ' active' : ''}${extraClass ? ` ${extraClass}` : ''}`;

  return (
    <nav className={`site-nav${isScrolled ? ' is-scrolled' : ''}`} aria-label="Primary navigation">
      <Link to="/" className="logo" aria-label="READMEForge home" onClick={() => setMenuOpen(false)}>
        <Logo size={36} />
        <span className="logo-name">README<span>Forge</span></span>
      </Link>

      <div id="site-navigation" className={`site-nav-links${menuOpen ? ' open' : ''}`}>
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
          aria-label="Toggle dark/light mode"
          title="Toggle dark/light mode"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        {/* Source link moved to actions area so it stays beside theme toggle */}
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
          aria-label="Toggle dark/light mode"
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
