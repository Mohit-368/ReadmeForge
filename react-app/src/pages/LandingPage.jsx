import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div
      className="relative flex flex-col items-center overflow-hidden z-10 min-h-screen"
      style={{ background: 'var(--hero-bg)', color: 'var(--hero-text)', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 60%)' }} />

      {/* ── Top Nav ── */}
      <header className="absolute top-10 w-full flex justify-between items-center z-50" style={{ padding: '0 5%' }}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'var(--hero-text)', filter: 'drop-shadow(0 0 20px var(--hero-logo-shadow))'
        }}>
          README
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 8px var(--hero-logo-glow))' }}>
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" />
          </svg>
          FORGE
        </div>

        {/* Source Code Link */}
        <a
          href="https://github.com/Mohit-368/ReadmeForge"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            color: 'var(--muted2)', textDecoration: 'none',
            fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 600,
            background: 'var(--hero-chip-bg)', padding: '8px 16px', borderRadius: '9999px',
            border: '1px solid var(--hero-chip-border)', backdropFilter: 'blur(12px)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--hero-chip-bg-hover)';
            e.currentTarget.style.borderColor = 'var(--hero-chip-border-hover)';
            e.currentTarget.style.color = 'var(--hero-text)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--hero-chip-bg)';
            e.currentTarget.style.borderColor = 'var(--hero-chip-border)';
            e.currentTarget.style.color = 'var(--muted2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          Source Code
        </a>
      </header>

      {/* ── Giant Title ── */}
      <main className="flex-1 flex items-center justify-center w-full relative z-10" style={{ padding: '0 5%' }}>
        <h1 className="hero-title">GitHub<br />Readme.Md<br />maker</h1>
      </main>

      {/* ── 3D CSS Art — Star Shape (top right) ── */}
      <div style={{
        position: 'absolute', right: '12%', top: '15%',
        width: '180px', height: '180px',
        animation: 'floatFast 6s ease-in-out infinite',
        filter: 'drop-shadow(0 20px 40px rgba(99,102,241,0.2))',
        opacity: 0.9,
        zIndex: 10,
      }}>
        {[0, 60, 120].map((rot) => (
          <div key={rot} style={{
            position: 'absolute', width: '50px', height: '180px', borderRadius: '50px',
            left: '65px', top: 0,
            background: `linear-gradient(to bottom, var(--grad-cyan), var(--grad-blue), var(--grad-purple))`,
            boxShadow: 'inset 6px 6px 15px rgba(255,255,255,0.9), inset -6px -6px 20px rgba(99,102,241,0.6), 10px 15px 30px rgba(0,0,0,0.6)',
            transform: `rotate(${rot}deg)`,
          }} />
        ))}
      </div>

      {/* ── 3D CSS Art — Stacked Pills (bottom right) ── */}
      <div style={{
        position: 'absolute', right: '25%', bottom: '20%',
        width: '160px', height: '250px',
        animation: 'floatSlow 8s ease-in-out infinite',
        filter: 'drop-shadow(0 20px 40px rgba(34,211,238,0.15))',
        opacity: 0.9,
        zIndex: 0,
      }}>
        {[
          { color: 'var(--grad-cyan)', top: 0, left: 0, zIndex: 10 },
          { color: 'var(--grad-blue)', top: '60px', left: '30px', zIndex: 20 },
          { color: 'var(--grad-purple)', top: '120px', left: '60px', zIndex: 30 },
        ].map((pill, i) => (
          <div key={i} style={{
            position: 'absolute', width: '130px', height: '90px', borderRadius: '60px',
            top: pill.top, left: pill.left, background: pill.color, zIndex: pill.zIndex,
            boxShadow: 'inset 8px 8px 15px rgba(255,255,255,0.9), inset -8px -8px 25px rgba(14,165,233,0.4), 15px 20px 30px rgba(0,0,0,0.5)',
          }} />
        ))}
      </div>

      {/* ── CTA Button ── */}
      <div className="absolute bottom-9 z-50 flex justify-center w-full">
        <button
          onClick={() => navigate('/builder')}
          style={{
            background: 'linear-gradient(90deg, rgba(10,15,26,0.8) 0%, rgba(99,102,241,0.3) 100%)',
            border: '1px solid var(--hero-cta-border)',
            color: 'var(--hero-cta-text)',
            padding: '16px 36px', borderRadius: '9999px',
            fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(99,102,241,0.2)',
            backdropFilter: 'blur(12px)', cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(129,140,248,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(99,102,241,0.2)'; }}
        >
          Click to Create
        </button>
      </div>
    </div>
  )
}
