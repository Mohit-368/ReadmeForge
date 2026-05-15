import Logo from '../ui/Logo';

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <Logo size={28} />
          <p>Designed &amp; Built by <strong>Mohit Kumar</strong></p>
        </div>
        <div className="footer-right">
          <a href="https://github.com/Mohit-368/ReadmeForge" target="_blank" rel="noreferrer" className="footer-link">
            <CodeIcon />
            Source Code
          </a>
          <div className="footer-divider" />
          <a href="https://github.com/Mohit-368" target="_blank" rel="noreferrer" className="footer-icon" title="GitHub">
            <GitHubIcon />
          </a>
          <a href="https://www.linkedin.com/in/mohitkumar368/" target="_blank" rel="noreferrer" className="footer-icon" title="LinkedIn">
            <LinkedInIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
