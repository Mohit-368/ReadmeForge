import { useState } from 'react'

export default function QualityScorePanel({ quality }) {
  const [open, setOpen] = useState(false)
  const { score, suggestions } = quality

  const getColor = (s) => {
    if (s >= 80) return '#10b981'
    if (s >= 55) return '#f59e0b'
    if (s >= 30) return '#f97316'
    return '#f43f5e'
  }

  const getLabel = (s) => {
    if (s >= 80) return 'Excellent'
    if (s >= 55) return 'Good'
    if (s >= 30) return 'Needs Work'
    return 'Incomplete'
  }

  const color = getColor(score)

  return (
    <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface2)', flexShrink: 0 }}>
      {/* Collapsed Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', cursor: 'pointer', userSelect: 'none', transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface3)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px' }}>📊</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted2)', fontFamily: "'Space Grotesk', sans-serif" }}>README Quality Score</span>
          <span style={{
            fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            padding: '2px 8px', borderRadius: '20px',
            background: color + '33', border: `1px solid ${color}66`, color,
            transition: 'all 0.3s',
          }}>{score}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', color, transition: 'color 0.3s' }}>{getLabel(score)}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" style={{ width: '14px', height: '14px', transition: 'transform 0.25s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Expanded Body */}
      {open && (
        <div style={{ padding: '16px 20px 20px', borderTop: '1px solid var(--border)', maxHeight: '220px', overflowY: 'auto' }}>
          {/* Score Ring + Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            {/* SVG Ring */}
            <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
              <svg className="quality-ring" viewBox="0 0 36 36">
                <circle className="quality-ring-bg" cx="18" cy="18" r="15.9155" />
                <circle className="quality-ring-fill" cx="18" cy="18" r="15.9155"
                  strokeDasharray={`${score} ${100 - score}`}
                  style={{ stroke: color }} />
              </svg>
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '15px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color, lineHeight: 1 }}>
                {score}
              </span>
            </div>

            {/* Score text + bar */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color, marginBottom: '3px' }}>{score} / 100</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '10px', lineHeight: 1.4 }}>
                {score >= 80 ? "Your README is comprehensive and well-structured!" : score >= 55 ? "A few improvements will make your README stand out." : score >= 30 ? "Add more details to make your README more helpful." : "Fill in the key sections to get started."}
              </div>
              <div style={{ width: '100%', height: '5px', background: 'var(--surface3)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '8px 12px' }}>
              <span style={{ fontSize: '13px', flexShrink: 0 }}>🎉</span>
              <span style={{ fontSize: '12px', color: 'var(--muted2)', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.5 }}>All key sections are complete — great job!</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Suggestions to improve</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {suggestions.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: '8px', padding: '8px 12px' }}>
                    <span style={{ fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
                    <span style={{ fontSize: '12px', color: 'var(--muted2)', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.5 }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
