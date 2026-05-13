import { useState, useMemo, useRef, useEffect } from 'react'
import { useReadme } from '../../context/ReadmeContext'
import { generateMarkdown } from '../../utils/markdownGenerator'
import { md2html } from '../../utils/markdownToHtml'
import { calculateQuality } from '../../utils/qualityScore'
import { copyMarkdown, downloadMd, printPreview } from '../../utils/exportUtils'
import QualityScorePanel from './QualityScorePanel'

export default function Preview() {
  const { state, showToast } = useReadme()
  const [currentTab, setCurrentTab] = useState('rendered')
  const previewBodyRef = useRef(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const markdown = useMemo(() => generateMarkdown(state), [state])
  const quality = useMemo(() => calculateQuality(state), [state])

  useEffect(() => {
    const el = previewBodyRef.current
    if (!el) return
    const handler = () => setShowBackToTop(el.scrollTop > 200)
    el.addEventListener('scroll', handler)
    return () => el.removeEventListener('scroll', handler)
  }, [])

  const copySvg = (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
  const downloadSvg = (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
  const printSvg = (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
    </svg>
  )

  return (
    <aside style={{
      width: '460px', flexShrink: 0,
      background: 'var(--surface)', borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
    }}>

      {/* ── Preview Header ── */}
      <div style={{
        padding: '12px 16px 14px', borderBottom: '1px solid var(--border)',
        background: 'var(--surface2)', flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>

        {/* Row 1: Tabs */}
        <div className="preview-tabs">
          <button
            className={`ptab${currentTab === 'rendered' ? ' active' : ''}`}
            onClick={() => setCurrentTab('rendered')}
          >
            Preview (Better at full dimensions)
          </button>
          <button
            className={`ptab${currentTab === 'raw' ? ' active' : ''}`}
            onClick={() => setCurrentTab('raw')}
          >
            Raw MD
          </button>
        </div>

        {/* Row 2: Copy + Download */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button className="pbtn green" onClick={() => copyMarkdown(markdown, showToast)}>
            {copySvg} Copy Markdown
          </button>
          <button className="pbtn" onClick={() => downloadMd(markdown, showToast)}>
            {downloadSvg} Download Markdown file
          </button>
        </div>

        {/* Row 3: Print Preview — full width */}
        <button className="pbtn print" style={{ width: '100%' }} onClick={() => printPreview(markdown, showToast)}>
          {printSvg} Print Preview
        </button>
      </div>

      {/* ── Quality Score Panel ── */}
      <QualityScorePanel quality={quality} />

      {/* ── Preview Body ── */}
      <div
        ref={previewBodyRef}
        style={{ flex: 1, overflow: 'auto', padding: '24px', minHeight: 0 }}
      >
        {!markdown.trim() ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '48px', opacity: 0.3, marginBottom: '16px' }}>📄</div>
            <h3 style={{ fontSize: '16px', color: 'var(--muted2)', marginBottom: '8px' }}>Live preview appears here</h3>
            <p style={{ fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", opacity: 0.5 }}>Start filling in the editor →</p>
          </div>
        ) : (
          currentTab === 'rendered'
            ? <div className="gh-preview" dangerouslySetInnerHTML={{ __html: md2html(markdown) }} />
            : <div className="raw-view">{markdown}</div>
        )}
      </div>

      {/* ── Back to Top ── */}
      {showBackToTop && (
        <button
          onClick={() => previewBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'absolute', bottom: '24px', right: '24px',
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'var(--surface2)', border: '1px solid var(--border2)',
            color: 'var(--muted2)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            animation: 'backToTopShow 0.3s ease',
          }}
          title="Back to top"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </aside>
  )
}
