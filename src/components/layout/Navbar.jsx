import { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../ui/Logo';
import LanguageSelector from '../LanguageSelector';
import { LanguageContext } from '../../context/LanguageContext';
import { translations } from '../../i18n';
import { useTranslation } from '../../hooks/useTranslation';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const { language } = useContext(LanguageContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const t = useTranslation();

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 0);

    updateScrollState();

    window.addEventListener('scroll', updateScrollState, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', updateScrollState);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActiveRoute = (path, exact = false) => {
    if (exact) return location.pathname === path;

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const linkClassName = (isActive, extraClass = '') =>
    `site-nav-link${isActive ? ' active' : ''}${
      extraClass ? ` ${extraClass}` : ''
    }`;

  return (
    <nav className={`site-nav${isScrolled ? ' is-scrolled' : ''}`}>
      <Link
        to="/"
        className="logo"
        onClick={() => setMenuOpen(false)}
      >
        <Logo size={36} />

        <span className="logo-name">
          README<span>Forge</span>
        </span>
      </Link>

      <div
        id="site-navigation"
        className={`site-nav-links${menuOpen ? ' open' : ''}`}
      >
        <Link
          to="/"
          className={linkClassName(isActiveRoute('/', true))}
          onClick={() => setMenuOpen(false)}
        >
          {t.home}
        </Link>

        <Link
          to="/readme-maker"
          className={linkClassName(
            isActiveRoute('/readme-maker')
          )}
          onClick={() => setMenuOpen(false)}
        >
          {t.readmeMaker}
        </Link>

        <Link
          to="/how-to-use"
          className={linkClassName(
            isActiveRoute('/how-to-use')
          )}
          onClick={() => setMenuOpen(false)}
        >
          {t.howToUse}
        </Link>

        <a
          href="https://github.com/Mohit-368/ReadmeForge"
          target="_blank"
          rel="noreferrer"
          className="site-nav-link site-nav-link--gh mobile-only"
          onClick={() => setMenuOpen(false)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>

          {t.source}
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

      <div
        className="site-nav-actions"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <a
          href="https://github.com/Mohit-368/ReadmeForge"
          target="_blank"
          rel="noreferrer"
          className="site-nav-link site-nav-link--gh desktop-only"
          title="View source on GitHub"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>

          {t.source}
        </a>

        <LanguageSelector />

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