import { useReadme } from '../../context/ReadmeContext'

const TEMPLATES = [
  { id: 'webapp', label: '🌐 Web App', data: { fields: { projName: 'My Web App', tagline: 'A modern, full-stack web application', description: 'A full-stack web application built with modern technologies. Features user authentication, real-time updates, and a responsive UI.', features: '### 🔐 Authentication\n- JWT-based login & registration\n- OAuth support\n\n### 📊 Dashboard\n- Real-time data visualization\n- Export to CSV\n\n### 🌐 API\n- RESTful API with full CRUD\n- Rate limiting & caching' }, techs: ['React', 'Node.js', 'PostgreSQL', 'Docker'] } },
  { id: 'ml', label: '🤖 ML / AI', data: { fields: { projName: 'ML Project', tagline: 'Machine learning model for image classification', description: 'A machine learning project that achieves state-of-the-art results on benchmark datasets. Includes training pipeline, model evaluation and a REST API for inference.', features: '### 🧠 Model\n- Custom CNN architecture\n- Transfer learning support\n\n### 📈 Training\n- Mixed precision training\n- Early stopping & checkpointing\n\n### ⚡ Inference API\n- FastAPI endpoint\n- Batch prediction support' }, techs: ['Python', 'TensorFlow', 'FastAPI', 'Docker'] } },
  { id: 'api', label: '⚡ Backend API', data: { fields: { projName: 'Backend API', tagline: 'Production-ready REST API with authentication', description: 'A scalable backend API built for production. Includes authentication, caching, rate limiting, and comprehensive API documentation.', features: '### 🔑 Auth\n- JWT + refresh tokens\n- Role-based access control\n\n### ⚡ Performance\n- Redis caching\n- Query optimization\n\n### 📚 Docs\n- Swagger / OpenAPI docs\n- Postman collection' }, techs: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'] } },
  { id: 'cli', label: '💻 CLI Tool', data: { fields: { projName: 'CLI Tool', tagline: 'A powerful command-line tool', description: 'A command-line tool that helps developers automate repetitive tasks. Supports plugins, configuration files, and shell completions.', features: '### ⚙️ Commands\n- Multiple sub-commands\n- Interactive prompts\n\n### 🔌 Plugins\n- Plugin system\n- Custom hooks\n\n### 🐚 Shell\n- Bash/Zsh/Fish completions\n- Cross-platform support' }, techs: ['Python', 'Go'] } },
  { id: 'mobile', label: '📱 Mobile App', data: { fields: { projName: 'Mobile App', tagline: 'Cross-platform mobile app', description: 'A cross-platform mobile application built with React Native. Features offline support, push notifications, and a native feel on both iOS and Android.', features: '### 📱 UI/UX\n- Native animations\n- Dark mode support\n\n### 🔔 Notifications\n- Push notifications\n- In-app messaging\n\n### 📡 Offline\n- Local data sync\n- Conflict resolution' }, techs: ['React', 'TypeScript', 'MongoDB'] } },
  { id: 'lib', label: '📦 Library', data: { fields: { projName: 'AwesomeLib', tagline: 'A lightweight, zero-dependency library', description: 'A lightweight, zero-dependency library that makes complex tasks simple. Tree-shakeable, fully typed, and battle-tested in production.', features: '### 🎯 Core\n- Zero dependencies\n- Tree-shakeable\n\n### 🔧 API\n- Fluent interface\n- Promise & callback support\n\n### 📦 Bundle\n- ESM + CJS + UMD\n- < 5kb gzipped' }, techs: ['TypeScript', 'JavaScript'] } },
  { id: 'hackathon', label: '🏆 Hackathon', data: { fields: { projName: 'HackProject', tagline: 'Built in 24 hours at HackathonX 2025', description: 'Award-winning hackathon project built in 24 hours. Solves [problem] using [approach]. Won [prize] at [hackathon name].', features: '### 🏆 What We Built\n- Core feature 1\n- Core feature 2\n\n### 🚀 Tech Choices\n- Why we chose each tech\n- Architecture decisions\n\n### 🔮 Future Plans\n- Post-hackathon roadmap' }, techs: ['React', 'Python', 'FastAPI', 'PostgreSQL'] } },
  { id: 'oss', label: '🔓 Open Source', data: { fields: { projName: 'OpenProject', tagline: 'An open-source tool loved by the community', description: 'An open-source project maintained by the community. We welcome contributions of all kinds — code, documentation, bug reports, and feature ideas.', features: '### ✨ Features\n- Feature 1\n- Feature 2\n\n### 🌍 Community\n- Active Discord\n- Weekly releases\n\n### 📖 Docs\n- Full documentation\n- Video tutorials' }, techs: ['Python', 'Docker'] } },
]

const SECTIONS = [
  { id: 'title', label: 'Project Title', icon: '📌', default: true },
  { id: 'description', label: 'Description', icon: '📋', default: true },
  { id: 'features', label: 'Features', icon: '✨', default: true },
  { id: 'techstack', label: 'Tech Stack', icon: '🛠️', default: true },
  { id: 'installation', label: 'Installation', icon: '🚀', default: true },
  { id: 'structure', label: 'Folder Structure', icon: '📁', default: true },
  { id: 'screenshots', label: 'Screenshots', icon: '🖼️', default: true },
  { id: 'api', label: 'API Docs', icon: '⚡', default: false },
  { id: 'contributing', label: 'Contributing', icon: '🤝', default: true },
  { id: 'author', label: 'License & Author', icon: '👤', default: true },
  { id: 'support', label: 'Support & Donation', icon: '❤️', default: false },
]

export default function Sidebar() {
  const { state, dispatch, showToast } = useReadme()
  const activeTemplate = state.activeTemplate

  const applyTemplate = (t) => {
    dispatch({ type: 'APPLY_TEMPLATE', fields: t.data.fields, techs: t.data.techs, templateId: t.id })
    showToast('✓ Template applied!')
  }

  return (
    <aside style={{
      width: '280px', flexShrink: 0,
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      overflowY: 'auto', display: 'flex', flexDirection: 'column',
    }}>
      {/* Templates */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <div style={sectionLabel()}>Templates</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => applyTemplate(t)} style={templateBtnStyle(activeTemplate === t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Toggles */}
      <div style={{ padding: '20px', flex: 1 }}>
        <div style={sectionLabel()}>Sections</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {SECTIONS.map(s => {
            const isActive = state.sections[s.id]
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                transition: 'all 0.2s',
                background: isActive ? 'rgba(56,189,248,0.08)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(56,189,248,0.2)' : 'transparent'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                  <span style={{ fontSize: '14px', width: '20px', textAlign: 'center' }}>{s.icon}</span>
                  {s.label}
                </div>
                <ToggleSwitch
                  checked={isActive}
                  onChange={v => dispatch({ type: 'TOGGLE_SECTION', id: s.id, value: v })}
                />
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <label style={{ position: 'relative', width: '36px', height: '20px', flexShrink: 0, cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '10px',
        background: checked ? 'rgba(56,189,248,0.3)' : 'var(--border2)',
        transition: 'background 0.3s',
      }}>
        <span style={{
          position: 'absolute', width: '14px', height: '14px', borderRadius: '50%', top: '3px',
          left: checked ? '19px' : '3px',
          background: checked ? 'var(--accent)' : 'var(--muted)',
          boxShadow: checked ? '0 0 10px var(--accent)' : 'none',
          transition: 'all 0.3s',
        }} />
      </span>
    </label>
  )
}

function sectionLabel() {
  return {
    fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase',
    marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
    paddingLeft: '4px',
    borderLeft: '2px solid var(--accent)',
  }
}

function templateBtnStyle(active) {
  return {
    padding: '8px', background: active ? 'rgba(56,189,248,0.15)' : 'var(--surface2)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border2)'}`,
    borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s', textAlign: 'center',
    fontFamily: "'Space Grotesk', sans-serif",
    color: active ? 'var(--accent)' : 'var(--muted2)',
    boxShadow: active ? '0 4px 12px rgba(56,189,248,0.15)' : 'none',
  }
}
