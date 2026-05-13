import { useReadme } from '../../context/ReadmeContext'
import { copyMarkdown, downloadPDF } from '../../utils/exportUtils'
import { generateMarkdown } from '../../utils/markdownGenerator'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { state, dispatch, showToast, clearSavedData } = useReadme()
  const { sections, autoSaved, theme } = state
  const navigate = useNavigate()

  const activeSections = Object.values(sections).filter(Boolean).length

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', theme: theme === 'dark' ? 'light' : 'dark' })
  }

  const handleCopy = () => {
    const md = generateMarkdown(state)
    copyMarkdown(md, showToast)
  }

  const handleDownloadPDF = () => {
    const md = generateMarkdown(state)
    downloadPDF(md, showToast)
  }

  const handleReset = () => {
    dispatch({ type: 'RESET_ALL' })
    showToast('↺ All fields reset!')
  }

  const handleClearSaved = () => {
    localStorage.removeItem('readmeforge-data')
    showToast('🗑 Saved data cleared!')
  }

  return (
    <header style={{
      position: 'relative', zIndex: 200,
      background: 'var(--header-bg)', backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
      height: '64px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px',
      boxShadow: '0 4px 30px rgba(0,0,0,0.4)', flexShrink: 0,
    }}>

      {/* ── Logo ── */}
      <button
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '14px', color: '#fff',
          boxShadow: '0 4px 20px rgba(56,189,248,0.3)', textShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}>RF</div>
        <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px', color: 'var(--text)' }}>
          README<span style={{ color: 'var(--accent)' }}>Forge</span>
        </span>
      </button>

      {/* ── Center — sections counter + autosave ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: 'var(--surface2)', padding: '6px 16px',
        borderRadius: '30px', border: '1px solid var(--border2)',
      }}>
        <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--muted)' }}>sections:</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>{activeSections}</span>
        <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--muted)' }}>active</span>
        {autoSaved && (
          <span style={{
            fontSize: '10px', background: 'rgba(16,185,129,0.15)', color: 'var(--green)',
            padding: '2px 8px', borderRadius: '8px', marginLeft: '8px', fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
          }}>✓ Auto-saved</span>
        )}
      </div>

      {/* ── Right actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Source — */}
        <a
          href="https://github.com/Mohit-368/ReadmeForge"
          target="_blank"
          rel="noreferrer"
          className="hbtn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          Source
        </a>

        <button className="hbtn" onClick={handleClearSaved}>🗑 Clear Saved</button>
        <button className="hbtn" onClick={handleReset}>↺ Reset All Fields</button>
        <button className="hbtn" onClick={handleCopy}>Copy Markdown</button>

        {/* Theme toggle — .theme-toggle CSS class handles hover + rotate */}
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark/light mode">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>

        {/* Download PDF — .hbtn.primary for gradient + glow hover */}
        <button className="hbtn primary" onClick={handleDownloadPDF}>
          ⬇ Download PDF
        </button>
      </div>

    </header>
  )
}
