import { useRef } from 'react';
import { TECHS, BADGES } from '../../utils/constants';
import { convertStructure } from '../../utils/structureUtils';
import { getWordCount } from '../../utils/markdownUtils';

function WordCount({ text }) {
  const count = getWordCount(text);
  return (
    <label>
      <span className="wordCount">{count}</span>{' '}
      <span className="wordCountText">{count === 1 ? 'Word' : 'Words'}</span>
    </label>
  );
}

function EditorSection({ num, title, badge, hidden, children, onAIClick }) {
  if (hidden) return null;
  return (
    <div className="editor-section">
      <div className="es-header">
        <div className="es-num">{num}</div>
        <div className="es-title">{title}</div>
        {badge && <span className="es-badge">{badge}</span>}
        {onAIClick && (
          <button
            className="ai-section-btn"
            onClick={onAIClick}
            title={`AI suggestions for ${title}`}
            style={{ marginLeft: 'auto' }}
          >
            ✨ AI
          </button>
        )}
      </div>
      <div className="es-body">{children}</div>
    </div>
  );
}

export default function EditorPanel({
  formData, updateField,
  sectionState,
  selectedTechs, toggleTech,
  selectedBadges, toggleBadge,
  screenshots, addScreenshots, removeScreenshot,
  openAIModal
}) {
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const structPreview = formData.rawStructure
    ? convertStructure(formData.rawStructure, formData.projName || 'project')
    : 'Paste structure above to preview...';

  const techCount = selectedTechs.size;

  function handleDragOver(e) {
    e.preventDefault();
    dropZoneRef.current?.classList.add('dragover');
  }
  function handleDragLeave() {
    dropZoneRef.current?.classList.remove('dragover');
  }
  function handleDrop(e) {
    e.preventDefault();
    dropZoneRef.current?.classList.remove('dragover');
    addScreenshots(e.dataTransfer.files);
  }

  return (
    <div className="editor">
      <div className="editor-inner" id="editorInner">

        <EditorSection num={1} title="Project Title & Badges" hidden={!sectionState.title} onAIClick={() => openAIModal('title')}>
          <div className="two-col">
            <div>
              <label>PROJECT NAME *</label>
              <input type="text" id="projName" placeholder="AwesomeProject"
                value={formData.projName} onChange={e => updateField('projName', e.target.value)} />
            </div>
            <div>
              <label>TAGLINE</label>
              <input type="text" id="tagline" placeholder="A blazing-fast tool for..."
                value={formData.tagline} onChange={e => updateField('tagline', e.target.value)} />
            </div>
          </div>
          <div className="two-col">
            <div>
              <label>GITHUB USER</label>
              <input type="text" id="ghUser" placeholder="octocat"
                value={formData.ghUser} onChange={e => updateField('ghUser', e.target.value)} />
            </div>
            <div>
              <label>REPO NAME</label>
              <input type="text" id="repoSlug" placeholder="awesome-project"
                value={formData.repoSlug} onChange={e => updateField('repoSlug', e.target.value)} />
            </div>
          </div>
          <div>
            <label>AUTO BADGES — click to toggle</label>
            <div className="badge-picker">
              {BADGES.map(b => (
                <button
                  key={b.id}
                  className={`badge-chip${selectedBadges.has(b.id) ? ' selected' : ''}`}
                  onClick={() => toggleBadge(b.id)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </EditorSection>

        <EditorSection num={2} title="Description" hidden={!sectionState.description} onAIClick={() => openAIModal('description')}>
          <div>
            <label>SHORT DESCRIPTION</label>
            <textarea className="textInput" id="description" style={{ minHeight: 90 }}
              placeholder="What does your project do? What problem does it solve?"
              value={formData.description} onChange={e => updateField('description', e.target.value)} />
            <WordCount text={formData.description} />
          </div>
          <div>
            <label>LIVE DEMO URL (optional)</label>
            <input type="url" id="demoUrl" placeholder="https://yourapp.com"
              value={formData.demoUrl} onChange={e => updateField('demoUrl', e.target.value)} />
          </div>
        </EditorSection>

        <EditorSection num={3} title="Features" hidden={!sectionState.features} onAIClick={() => openAIModal('features')}>
          <div>
            <label>KEY FEATURES — use "### Category" for groups, "- item" for bullets</label>
            <textarea className="textInput" id="features" style={{ minHeight: 130 }}
              placeholder={'### 🔐 Authentication\n- Email OTP verification\n- Secure login / logout\n\n### 📝 Posts\n- Create, Read, Update, Delete'}
              value={formData.features} onChange={e => updateField('features', e.target.value)} />
            <WordCount text={formData.features} />
          </div>
        </EditorSection>

        <EditorSection
          num={4} title="Tech Stack" hidden={!sectionState.techstack}
          badge={techCount > 0 ? `${techCount} selected` : undefined}
        >
          <div>
            <label>CLICK TO SELECT YOUR STACK</label>
            <div className="tech-picker">
              {TECHS.map(t => (
                <button
                  key={t.label}
                  className={`tech-chip${selectedTechs.has(t.label) ? ' selected' : ''}`}
                  onClick={() => toggleTech(t.label)}
                >
                  <span className="emoji">{t.emoji}</span>{t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label>OR ADD CUSTOM (comma separated)</label>
            <input type="text" id="customTech" placeholder="Celery, Redis, Nginx..."
              value={formData.customTech} onChange={e => updateField('customTech', e.target.value)} />
          </div>
        </EditorSection>

        <EditorSection num={5} title="Installation" hidden={!sectionState.installation} onAIClick={() => openAIModal('installation')}>
          <div>
            <label>PREREQUISITES</label>
            <input type="text" id="prereqs" placeholder="Python 3.10+, Node.js 18+"
              value={formData.prereqs} onChange={e => updateField('prereqs', e.target.value)} />
          </div>
          <div>
            <label>INSTALL COMMANDS (one per line)</label>
            <textarea className="textInput" id="installCmds" style={{ minHeight: 100 }}
              placeholder={'git clone https://github.com/user/repo.git\ncd repo\npip install -r requirements.txt'}
              value={formData.installCmds} onChange={e => updateField('installCmds', e.target.value)} />
            <WordCount text={formData.installCmds} />
          </div>
          <div>
            <label>ENV VARIABLES (optional)</label>
            <textarea className="textInput" id="envVars" style={{ minHeight: 70 }}
              placeholder={'SECRET_KEY=your_secret\nDATABASE_URL=sqlite:///db.sqlite3'}
              value={formData.envVars} onChange={e => updateField('envVars', e.target.value)} />
            <WordCount text={formData.envVars} />
          </div>
          <div>
            <label>RUN COMMAND / USAGE INSTRUCTIONS</label>
            <textarea className="textInput" id="usageCmd" style={{ minHeight: 80 }}
              placeholder={'python manage.py runserver\n\n# Then open http://127.0.0.1:8000/'}
              value={formData.usageCmd} onChange={e => updateField('usageCmd', e.target.value)} />
            <WordCount text={formData.usageCmd} />
          </div>
        </EditorSection>

        <EditorSection num={7} title="Project Structure Visualizer" hidden={!sectionState.structure}>
          <div>
            <label>PASTE YOUR FOLDER STRUCTURE (indented with spaces)</label>
            <textarea className="textInput" id="rawStructure" style={{ minHeight: 120 }}
              placeholder={'src/\n  api/\n  models/\n  utils/\ntemplates/\nmain.py\nrequirements.txt'}
              value={formData.rawStructure} onChange={e => updateField('rawStructure', e.target.value)} />
            <WordCount text={formData.rawStructure} />
          </div>
          <div>
            <label>VISUAL PREVIEW</label>
            <div className="struct-preview">{structPreview}</div>
          </div>
        </EditorSection>

        <EditorSection num={8} title="Screenshots" hidden={!sectionState.screenshots}>
          <div>
            <label>LIVE DEMO / VIDEO LINK (optional)</label>
            <input type="url" id="videoUrl" placeholder="https://youtube.com/watch?v=..."
              value={formData.videoUrl} onChange={e => updateField('videoUrl', e.target.value)} />
          </div>
          <div>
            <label>DRAG &amp; DROP SCREENSHOTS</label>
            <div
              ref={dropZoneRef}
              className="drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="drop-zone-icon">🖼️</div>
              <p>Drop images here or click to browse</p>
              <small>PNG, JPG, GIF — they'll be linked as Markdown</small>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => addScreenshots(e.target.files)}
              />
            </div>
            <div className="screenshot-list">
              {screenshots.map((ss, idx) => (
                <div key={idx} className="screenshot-item">
                  <img src={ss.dataUrl} alt="" />
                  <span className="screenshot-item-name">{ss.name}</span>
                  <button className="screenshot-item-remove" onClick={() => removeScreenshot(idx)}>✕</button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label>OR ADD IMAGE URLS (format: Label | URL, one per line)</label>
            <textarea className="textInput" id="imageUrls" style={{ minHeight: 60 }}
              placeholder={'Landing Page | https://i.imgur.com/abc.png\nDashboard | https://i.imgur.com/xyz.png'}
              value={formData.imageUrls} onChange={e => updateField('imageUrls', e.target.value)} />
            <WordCount text={formData.imageUrls} />
          </div>
        </EditorSection>

        <EditorSection num={9} title="API Documentation" hidden={!sectionState.api}>
          <div>
            <label>API ENDPOINTS — format: METHOD /path | Description (one per line)</label>
            <textarea className="textInput" id="apiDocs" style={{ minHeight: 100 }}
              placeholder={'GET /api/users | Get all users\nPOST /api/users | Create a new user'}
              value={formData.apiDocs} onChange={e => updateField('apiDocs', e.target.value)} />
            <WordCount text={formData.apiDocs} />
          </div>
          <div>
            <label>API BASE URL (optional)</label>
            <input type="text" id="apiBase" placeholder="https://api.yourapp.com/v1"
              value={formData.apiBase} onChange={e => updateField('apiBase', e.target.value)} />
          </div>
        </EditorSection>

        <EditorSection num={10} title="Contributing" hidden={!sectionState.contributing}>
          <div>
            <label>CUSTOM CONTRIBUTING NOTES (optional — default guide auto-generated)</label>
            <textarea className="textInput" id="contribNotes" style={{ minHeight: 70 }}
              placeholder="Any specific guidelines, code style rules, branch naming conventions..."
              value={formData.contribNotes} onChange={e => updateField('contribNotes', e.target.value)} />
            <WordCount text={formData.contribNotes} />
          </div>
        </EditorSection>

        <EditorSection num={11} title="License & Author" hidden={!sectionState.author}>
          <div className="two-col">
            <div>
              <label>LICENSE</label>
              <select id="license" value={formData.license} onChange={e => updateField('license', e.target.value)}>
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="GPL-3.0">GPL 3.0</option>
                <option value="BSD-3-Clause">BSD 3-Clause</option>
                <option value="ISC">ISC</option>
                <option value="Unlicense">Unlicense</option>
                <option value="AGPL-3.0">AGPL 3.0</option>
                <option value="none">No License</option>
              </select>
            </div>
            <div>
              <label>FULL NAME</label>
              <input type="text" id="authorName" placeholder="Your Name"
                value={formData.authorName} onChange={e => updateField('authorName', e.target.value)} />
            </div>
          </div>
          <div className="two-col">
            <div>
              <label>GITHUB USERNAME</label>
              <input type="text" id="authorGh" placeholder="username"
                value={formData.authorGh} onChange={e => updateField('authorGh', e.target.value)} />
            </div>
            <div>
              <label>EMAIL (optional)</label>
              <input type="email" id="authorEmail" placeholder="you@email.com"
                value={formData.authorEmail} onChange={e => updateField('authorEmail', e.target.value)} />
            </div>
          </div>
          <div className="two-col">
            <div>
              <label>LINKEDIN (optional)</label>
              <input type="url" id="authorLinkedin" placeholder="https://linkedin.com/in/you"
                value={formData.authorLinkedin} onChange={e => updateField('authorLinkedin', e.target.value)} />
            </div>
            <div>
              <label>PORTFOLIO (optional)</label>
              <input type="url" id="authorWebsite" placeholder="https://yoursite.com"
                value={formData.authorWebsite} onChange={e => updateField('authorWebsite', e.target.value)} />
            </div>
          </div>
        </EditorSection>

        <EditorSection num={12} title="Support & Donation" hidden={!sectionState.support}>
          <div>
            <label>SUPPORT MESSAGE (optional)</label>
            <textarea className="textInput" id="supportMsg" style={{ minHeight: 60 }}
              placeholder="If you find this project helpful, please consider supporting its development:"
              value={formData.supportMsg} onChange={e => updateField('supportMsg', e.target.value)} />
            <WordCount text={formData.supportMsg} />
          </div>
          <div className="two-col">
            <div>
              <label>BUY ME A COFFEE (username)</label>
              <input type="text" id="supportBmac" placeholder="username"
                value={formData.supportBmac} onChange={e => updateField('supportBmac', e.target.value)} />
            </div>
            <div>
              <label>KO-FI (username)</label>
              <input type="text" id="supportKofi" placeholder="username"
                value={formData.supportKofi} onChange={e => updateField('supportKofi', e.target.value)} />
            </div>
          </div>
          <div className="two-col">
            <div>
              <label>PATREON (username)</label>
              <input type="text" id="supportPatreon" placeholder="username"
                value={formData.supportPatreon} onChange={e => updateField('supportPatreon', e.target.value)} />
            </div>
            <div>
              <label>GITHUB SPONSORS (username)</label>
              <input type="text" id="supportGhSponsors" placeholder="username"
                value={formData.supportGhSponsors} onChange={e => updateField('supportGhSponsors', e.target.value)} />
            </div>
          </div>
        </EditorSection>

      </div>
    </div>
  );
}
