import SectionCard from '../SectionCard'
import { Input, labelStyle, inputStyle } from '../FormFields'
import { useReadme } from '../../../context/ReadmeContext'

// Emojis
const TECH_OPTIONS = [
  { label: 'Python',       emoji: '🐍' },
  { label: 'JavaScript',   emoji: '🟨' },
  { label: 'TypeScript',   emoji: '💙' },
  { label: 'React',        emoji: '⚛️' },
  { label: 'Next.js',      emoji: '▲' },
  { label: 'Vue',          emoji: '💚' },
  { label: 'Node.js',      emoji: '🟢' },
  { label: 'Express',      emoji: '🚂' },
  { label: 'Django',       emoji: '🎸' },
  { label: 'FastAPI',      emoji: '⚡' },
  { label: 'Flask',        emoji: '🌶️' },
  { label: 'Spring',       emoji: '🍃' },
  { label: 'Java',         emoji: '☕' },
  { label: 'Go',           emoji: '🐹' },
  { label: 'Rust',         emoji: '🦀' },
  { label: 'C++',          emoji: '⚙️' },
  { label: 'PostgreSQL',   emoji: '🐘' },
  { label: 'MySQL',        emoji: '🐬' },
  { label: 'MongoDB',      emoji: '🍃' },
  { label: 'Redis',        emoji: '🔴' },
  { label: 'SQLite',       emoji: '🗃️' },
  { label: 'Docker',       emoji: '🐳' },
  { label: 'Kubernetes',   emoji: '☸️' },
  { label: 'AWS',          emoji: '☁️' },
  { label: 'GCP',          emoji: '🌥️' },
  { label: 'Azure',        emoji: '💠' },
  { label: 'TensorFlow',   emoji: '🧠' },
  { label: 'PyTorch',      emoji: '🔥' },
  { label: 'Tailwind',     emoji: '💨' },
  { label: 'GraphQL',      emoji: '◈' },
  { label: 'Nginx',        emoji: '🌐' },
  { label: 'Linux',        emoji: '🐧' },
]

export default function TechStackSection({ num }) {
  const { state, dispatch } = useReadme()
  const { selectedTechs, fields } = state

  const count = selectedTechs.size
  const badge = count > 0 ? `${count} selected` : null

  return (
    <SectionCard num={num} title="Tech Stack" badge={badge}>
      {/* Label */}
      <div>
        <label style={{ ...labelStyle, marginBottom: '12px' }}>CLICK TO SELECT YOUR STACK</label>
        {/* Tech chips — */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {TECH_OPTIONS.map(t => {
            const active = selectedTechs.has(t.label)
            return (
              <button
                key={t.label}
                className="tech-chip"
                onClick={() => dispatch({ type: 'TOGGLE_TECH', tech: t.label })}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border2)'}`,
                  background: active ? 'rgba(56,189,248,0.12)' : 'var(--surface2)',
                  color: active ? 'var(--accent)' : 'var(--muted2)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: active ? '0 4px 12px rgba(56,189,248,0.2)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '15px', lineHeight: 1 }}>{t.emoji}</span>
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom tech input */}
      <div>
        <label style={{ ...labelStyle, marginBottom: '8px' }}>OR ADD CUSTOM (COMMA SEPARATED)</label>
        <input
          id="customTech"
          type="text"
          placeholder="Celery, Redis, Nginx..."
          value={fields['customTech'] || ''}
          onChange={e => dispatch({ type: 'SET_FIELD', id: 'customTech', value: e.target.value })}
          style={inputStyle}
          onFocus={e => {
            e.target.style.borderColor = 'var(--accent)'
            e.target.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.1)'
            e.target.style.background = 'var(--surface)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--border2)'
            e.target.style.boxShadow = 'none'
            e.target.style.background = 'var(--surface2)'
          }}
        />
      </div>
    </SectionCard>
  )
}
