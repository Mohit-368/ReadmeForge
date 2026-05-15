import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../ui/Logo';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`site-nav${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
        <Logo size={scrolled ? 32 : 38} />
        <span className="logo-name">README<span>Forge</span></span>
      </Link>

      <div className={`site-nav-links${menuOpen ? ' open' : ''}`}>
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
