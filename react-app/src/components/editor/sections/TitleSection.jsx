import SectionCard from '../SectionCard'
import { Input, Textarea, TwoCol } from '../FormFields'
import { useReadme } from '../../../context/ReadmeContext'

const BADGE_OPTIONS = [
  { id: 'license', label: '📄 License' },
  { id: 'stars', label: '⭐ Stars' },
  { id: 'forks', label: '🍴 Forks' },
  { id: 'issues', label: '🐛 Issues' },
  { id: 'prs', label: '🔀 PRs Welcome' },
  { id: 'build', label: '🔨 Build' },
  { id: 'coverage', label: '📊 Coverage' },
  { id: 'version', label: '🏷 Version' },
]

export default function TitleSection({ num }) {
  const { state, dispatch } = useReadme()
  const { fields, selectedBadges } = state
  const f = (id) => fields[id] || ''
  const set = (id) => (e) => dispatch({ type: 'SET_FIELD', id, value: e.target.value })

  return (
    <SectionCard num={num} title="Project Title & Badges" badge="Required">
      <TwoCol>
        <Input label="PROJECT NAME *" id="projName" placeholder="AwesomeProject" value={f('projName')} onChange={set('projName')} />
        <Input label="TAGLINE" id="tagline" placeholder="A blazing-fast tool for..." value={f('tagline')} onChange={set('tagline')} />
      </TwoCol>
      <TwoCol>
        <Input label="GITHUB USERNAME" id="ghUser" placeholder="your-username" value={f('ghUser')} onChange={set('ghUser')} />
        <Input label="REPOSITORY SLUG" id="repoSlug" placeholder="your-repo-name" value={f('repoSlug')} onChange={set('repoSlug')} />
      </TwoCol>

      {/* Badge Picker */}
      <div>
        <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--muted)', marginBottom: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>BADGES</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {BADGE_OPTIONS.map(b => {
            const active = selectedBadges.has(b.id)
            return (
              <button key={b.id} onClick={() => dispatch({ type: 'TOGGLE_BADGE', badge: b.id })} style={{
                padding: '6px 12px', borderRadius: '8px', border: `1px solid ${active ? 'var(--yellow)' : 'var(--border2)'}`,
                background: active ? 'rgba(245,158,11,0.15)' : 'var(--surface2)',
                color: active ? 'var(--yellow)' : 'var(--muted2)',
                fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: "'JetBrains Mono', monospace",
                boxShadow: active ? '0 4px 12px rgba(245,158,11,0.15)' : 'none',
              }}>{b.label}</button>
            )
          })}
        </div>
      </div>
    </SectionCard>
  )
}
