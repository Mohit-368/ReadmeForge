import Logo from "../ui/Logo";

const CodeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const DiscordIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M8.5 9.5C9.3 9.5 10 10.2 10 11s-.7 1.5-1.5 1.5S7 11.8 7 11s.7-1.5 1.5-1.5zm7 0c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5S14 11.8 14 11s.7-1.5 1.5-1.5z" />
    <path d="M18 4a16 16 0 0 0-4-1l-.2.4c1.5.4 2.2 1 2.2 1a13 13 0 0 0-4-.6 13 13 0 0 0-4 .6s.7-.6 2.2-1L10 3a16 16 0 0 0-4 1C3.5 7.5 3 10.9 3 10.9A16 16 0 0 0 8 13l1-1.3c-1.9-.5-2.6-1.6-2.6-1.6.6.4 1.2.7 1.8.9a10 10 0 0 0 7.6 0c.6-.2 1.2-.5 1.8-.9 0 0-.7 1.1-2.6 1.6l1 1.3a16 16 0 0 0 5-2.1S20.5 7.5 18 4z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="rf-footer">
      <div className="rf-footer-top">
        <div className="rf-footer-brand">
          <Logo size={42} />

          <div>
            <h2>ReadmeForge</h2>

            <p>
              Build stunning GitHub READMEs with a modern futuristic workflow.
            </p>
          </div>
        </div>

        <div className="rf-footer-links">
          <h4>Quick Links</h4>

          <a href="/">Home</a>
          <a href="#" onClick={(e) => {  e.preventDefault();   alert("Coming soon!"); }}>About</a>
          <a href="#" onClick={(e) => {  e.preventDefault();   alert("Coming soon!"); }}>Privacy Policy</a>
          <a href="#" onClick={(e) => {  e.preventDefault();   alert("Coming soon!"); }}>Terms & Conditions</a>
        </div>

        <div className="rf-footer-socials">
          <h4>Connect</h4>

          <a
            href="https://github.com/Mohit-368/ReadmeForge"
            target="_blank"
            rel="noreferrer"
            className="rf-source-btn"
          >
            <CodeIcon />
            Source Code
          </a>

          <div className="rf-social-icons">
            <a
              href="https://github.com/Mohit-368"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>

            <a
              href="https://www.linkedin.com/in/mohitkumar368/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
            <a
               href="https://discord.com"
               target="_blank"
               rel="noreferrer"
               aria-label="Discord"
            >
  <DiscordIcon />
</a>
          </div>
        </div>
      </div>

      <div className="rf-footer-bottom">
        <div className="rf-footer-signature">
          <Logo size={30} />

          <p className="rf-credit">
            Designed & Built by <strong>Mohit Kumar</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}