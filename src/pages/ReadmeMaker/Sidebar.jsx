import { SECTIONS, TECHS, TEMPLATES } from '../../utils/constants';

export default function Sidebar({
  sectionState, toggleSection,
  selectedTechs, toggleTech,
  applyTemplate, activeTemplate,
}) {
  const activeSectionCount = Object.values(sectionState).filter(Boolean).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Templates</div>
        <div className="templates-grid">
          {Object.entries(TEMPLATES).map(([key, t]) => (
            <button
              key={key}
              className={`template-btn${activeTemplate === key ? ' selected' : ''}`}
              onClick={() => applyTemplate(t, key)}
            >
              {key === 'webapp' && '🌐 Web App'}
              {key === 'ml' && '🤖 ML / AI'}
              {key === 'api' && '⚡ Backend API'}
              {key === 'cli' && '💻 CLI Tool'}
              {key === 'mobile' && '📱 Mobile App'}
              {key === 'lib' && '📦 Library'}
              {key === 'hackathon' && '🏆 Hackathon'}
              {key === 'oss' && '🔓 Open Source'}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section" style={{ flex: 1 }}>
        <div className="sidebar-label">Sections</div>
        <div className="section-toggles">
          {SECTIONS.map(sec => (
            <div
              key={sec.id}
              className={`sec-toggle${sectionState[sec.id] ? ' active' : ''}`}
            >
              <div className="sec-toggle-left">
                <span className="sec-toggle-icon">{sec.icon}</span>
                {sec.label}
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={sectionState[sec.id]}
                  onChange={e => toggleSection(sec.id, e.target.checked)}
                />
                <span className="tslider" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
