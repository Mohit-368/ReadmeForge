import SectionCard from '../SectionCard'
import { labelStyle, inputStyle } from '../FormFields'
import { useReadme } from '../../../context/ReadmeContext'

const LICENSES = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'MPL-2.0', 'AGPL-3.0', 'LGPL-2.1', 'Unlicense', 'none']

export default function AuthorSection({ num }) {
  const { state, dispatch } = useReadme()
  const f = (id) => state.fields[id] || ''
  const set = (id) => (e) => dispatch({ type: 'SET_FIELD', id, value: e.target.value })

  return (
    <SectionCard num={num} title="License & Author">
      {/* Row 1: License + Full Name */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ ...labelStyle, marginBottom: '8px' }}>LICENSE</label>
          <select
            id="license"
            value={state.license}
            onChange={e => dispatch({ type: 'SET_LICENSE', value: e.target.value })}
            style={{ ...inputStyle }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border2)' }}
          >
            {LICENSES.map(l => (
              <option key={l} value={l}>{l === 'none' ? 'No License' : l}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ ...labelStyle, marginBottom: '8px' }}>FULL NAME</label>
          <input
            id="authorName"
            type="text"
            placeholder="Your Name"
            value={f('authorName')}
            onChange={set('authorName')}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.1)'; e.target.style.background = 'var(--surface)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface2)' }}
          />
        </div>
      </div>

      {/* Row 2: GitHub Username + Email */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ ...labelStyle, marginBottom: '8px' }}>GITHUB USERNAME</label>
          <input
            id="authorGh"
            type="text"
            placeholder="username"
            value={f('authorGh')}
            onChange={set('authorGh')}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.1)'; e.target.style.background = 'var(--surface)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface2)' }}
          />
        </div>
        <div>
          <label style={{ ...labelStyle, marginBottom: '8px' }}>EMAIL (OPTIONAL)</label>
          <input
            id="authorEmail"
            type="email"
            placeholder="you@email.com"
            value={f('authorEmail')}
            onChange={set('authorEmail')}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.1)'; e.target.style.background = 'var(--surface)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface2)' }}
          />
        </div>
      </div>

      {/* Row 3: LinkedIn + Portfolio */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ ...labelStyle, marginBottom: '8px' }}>LINKEDIN (OPTIONAL)</label>
          <input
            id="authorLinkedin"
            type="url"
            placeholder="https://linkedin.com/in/your-profile"
            value={f('authorLinkedin')}
            onChange={set('authorLinkedin')}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.1)'; e.target.style.background = 'var(--surface)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface2)' }}
          />
        </div>
        <div>
          <label style={{ ...labelStyle, marginBottom: '8px' }}>PORTFOLIO (OPTIONAL)</label>
          <input
            id="authorWebsite"
            type="url"
            placeholder="https://yoursite.com"
            value={f('authorWebsite')}
            onChange={set('authorWebsite')}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.1)'; e.target.style.background = 'var(--surface)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface2)' }}
          />
        </div>
      </div>
    </SectionCard>
  )
}
