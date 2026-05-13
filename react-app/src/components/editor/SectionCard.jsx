// Reusable card shell for each editor section
export default function SectionCard({ num, title, badge, children }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '16px', marginBottom: '24px', overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)', transition: 'all 0.3s',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', background: 'var(--surface2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: '#fff',
          boxShadow: '0 2px 10px rgba(56,189,248,0.3)',
        }}>{num}</div>
        <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.3px', flex: 1, color: 'var(--text)' }}>{title}</div>
        {badge && (
          <span style={{
            fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
            padding: '4px 10px', borderRadius: '6px',
            background: 'rgba(16,185,129,0.15)', color: 'var(--green)',
            border: '1px solid rgba(16,185,129,0.3)',
          }}>{badge}</span>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {children}
      </div>
    </div>
  )
}
