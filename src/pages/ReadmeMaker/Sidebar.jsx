import { SECTIONS, TECHS, TEMPLATES } from '../../utils/constants';
import { useTranslation } from '../../hooks/useTranslation';

export default function Sidebar({
  sectionState, toggleSection,
  selectedTechs, toggleTech,
  applyTemplate, activeTemplate,
}) {
  const t = useTranslation();
  const activeSectionCount = Object.values(sectionState).filter(Boolean).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">{t.templates}</div>
        <div className="templates-grid">
          {Object.entries(TEMPLATES).map(([key, template]) => (
            <button
              key={key}
              className={`template-btn${activeTemplate === key ? ' selected' : ''}`}
              onClick={() => applyTemplate(template, key)}
            >
              {key === 'webapp' && `🌐 ${t.webApp}`}
              {key === 'ml' && `🤖 ${t.mlAi}`}
              {key === 'api' && `⚡ ${t.backendApi}`}
              {key === 'cli' && `💻 ${t.cliTool}`}
              {key === 'academic' && `🎓 ${t.academicResearch}`}
              {key === 'mobile' && `📱 ${t.mobileApp}`}
              {key === 'lib' && `📦 ${t.library}`}
              {key === 'hackathon' && `🏆 ${t.hackathon}`}
              {key === 'oss' && `🔓 ${t.openSource}`}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section" style={{ flex: 1 }}>
        <div className="sidebar-label">{t.sections}</div>
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
