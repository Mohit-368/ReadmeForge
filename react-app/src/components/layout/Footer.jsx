export default function Footer() {
  return (
    <footer style={{
      background: 'transparent', padding: '40px 32px',
      position: 'relative', zIndex: 20, marginTop: '20px',
    }}>
      {/* Top rule */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      }} />

      <div style={{
        maxWidth: '1200px', margin: '0 auto', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '24px',
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--muted2)', fontSize: '13px', fontFamily: "'Space Grotesk', sans-serif" }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '11px', color: '#fff',
            boxShadow: '0 0 15px rgba(56,189,248,0.2)',
          }}>RF</div>
          <span>
            <strong style={{ color: 'var(--text)' }}>ReadmeForge</strong> — open-source GitHub README generator
          </span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="https://github.com/Mohit-368/ReadmeForge" target="_blank" rel="noreferrer" style={footerLinkStyle()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          <div style={{ width: '1px', height: '24px', background: 'var(--border2)' }} />
          <a href="https://twitter.com" target="_blank" rel="noreferrer" style={footerLinkStyle()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </a>
        </div>
      </div>
    </footer>
  )
}

function footerLinkStyle() {
  return {
    color: 'var(--muted)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
    fontSize: '13px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
  }
}
