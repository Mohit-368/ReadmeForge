import { isValidUrl } from '../../hooks/useUrlValidation';
import { useRef } from 'react';
import { TECHS, BADGES } from '../../utils/constants';
import { convertStructure } from '../../utils/structureUtils';
import { useTranslation } from '../../hooks/useTranslation';
import { getWordCount } from '../../utils/markdownUtils';

function WordCount({ text ,t}) {
  const count = getWordCount(text);
  return (
    <label>
      <span className="wordCount">{count}</span>{' '}
      <span className="wordCountText">
  {count === 1 ? t.word : t.words}
</span>
    </label>
  );
}

function EditorSection({ num, title, badge, hidden, children }) {
  if (hidden) return null;
  return (
    <div className="editor-section">
      <div className="es-header">
        <div className="es-num">{num}</div>
        <div className="es-title">{title}</div>
        {badge && <span className="es-badge">{badge}</span>}
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
}) {
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const t = useTranslation();

  const structPreview = formData.rawStructure
    ? convertStructure(formData.rawStructure, formData.projName || 'project')
    : t.structurePreview;

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

        <EditorSection
  num={1}
  title={t.projectTitle}
  hidden={!sectionState.title}
>
          <div className="two-col">
            <div>
              <label>{t.projectName}</label>
              <input type="text" id="projName" placeholder={t.awesomeProject}
                value={formData.projName} onChange={e => updateField('projName', e.target.value)} />
            </div>
            <div>
              <label>{t.tagline}</label>
              <input type="text" id="tagline" placeholder={t.blazingFast}
                value={formData.tagline} onChange={e => updateField('tagline', e.target.value)} />
            </div>
          </div>
          <div className="two-col">
            <div>
              <label>{t.githubUser}</label>
              <input type="text" id="ghUser" placeholder={t.octocat}
                value={formData.ghUser} onChange={e => updateField('ghUser', e.target.value)} />
            </div>
            <div>
              <label>{t.repoName}</label>
              <input type="text" id="repoSlug" placeholder={t.awesomeRepo}
                value={formData.repoSlug} onChange={e => updateField('repoSlug', e.target.value)} />
            </div>
          </div>
          <div>
            <label>{t.autoBadges}</label>
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

        <EditorSection
  num={2}
  title={t.description}
  hidden={!sectionState.description}
>
          <div>
            <label>{t.shortDescription}</label>
            <textarea className="textInput" id="description" style={{ minHeight: 90 }}
              placeholder={t.projectProblem}
              value={formData.description} onChange={e => updateField('description', e.target.value)} />
            <WordCount text={formData.description} t={t}/>
          </div>
          <div>
<label>{t.liveDemoUrl}</label>
<input
  type="url"
  id="demoUrl"
  placeholder="https://yourapp.com"
  value={formData.demoUrl}
  onChange={e => updateField('demoUrl', e.target.value)}
  className={!isValidUrl(formData.demoUrl) ? 'input-url-invalid' : ''}
/>

{!isValidUrl(formData.demoUrl) && (
  <span className="url-warning">
    ⚠️ Please enter a valid URL starting with https://
  </span>
)}
          </div>
        </EditorSection>

        <EditorSection num="3A" title={t.academicDetails} hidden={!sectionState.academic}>
          <div>
            <label>{t.abstract}</label>
            <textarea className="textInput" id="abstractText" style={{ minHeight: 100 }}
              placeholder={t.abstractPlaceholder}
              value={formData.abstractText} onChange={e => updateField('abstractText', e.target.value)} />
            <WordCount text={formData.abstractText} t={t}/>
          </div>
          <div className="two-col">
            <div>
              <label>{t.paperLink}</label>
              <input type="url" id="paperLink" placeholder="https://arxiv.org/abs/..."
                value={formData.paperLink} onChange={e => updateField('paperLink', e.target.value)} />
            </div>
            <div>
              <label>{t.datasetAccess}</label>
              <input type="url" id="datasetLink" placeholder="https://doi.org/... or https://huggingface.co/datasets/..."
                value={formData.datasetLink} onChange={e => updateField('datasetLink', e.target.value)} />
            </div>
          </div>
          <div>
            <label>{t.methodology}</label>
            <textarea className="textInput" id="methodology" style={{ minHeight: 100 }}
              placeholder={t.methodologyPlaceholder}
              value={formData.methodology} onChange={e => updateField('methodology', e.target.value)} />
            <WordCount text={formData.methodology} t={t}/>
          </div>
          <div>
            <label>{t.citations}</label>
            <textarea className="textInput" id="bibtexCitation" style={{ minHeight: 120 }}
              placeholder={t.citationPlaceholder}
              value={formData.bibtexCitation} onChange={e => updateField('bibtexCitation', e.target.value)} />
            <WordCount text={formData.bibtexCitation} t={t}/>
          </div>
        </EditorSection>

        <EditorSection
  num={3}
  title={t.features}
  hidden={!sectionState.features}
>
          <div>
            <label>{t.keyFeatures}</label>
            <textarea className="textInput" id="features" style={{ minHeight: 130 }}
              placeholder={t.featuresPlaceholder}
              value={formData.features} onChange={e => updateField('features', e.target.value)} />
            <WordCount text={formData.features} t={t}/>
          </div>
        </EditorSection>

        <EditorSection
  num={4}
  title={t.techStack}
  hidden={!sectionState.techstack}
          badge={techCount > 0 ? `${techCount} selected` : undefined}
        >
          <div>
            <label>{t.selectStack}</label>
            <div className="tech-picker">
              {TECHS.map(tech => (
                <button
                  key={tech.label}
                  className={`tech-chip${selectedTechs.has(tech.label) ? ' selected' : ''}`}
                  onClick={() => toggleTech(tech.label)}
                >
                  <span className="emoji">{tech.emoji}</span>{tech.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label>{t.customTech}</label>
            <input type="text" id="customTech" placeholder="Celery, Redis, Nginx..."
              value={formData.customTech} onChange={e => updateField('customTech', e.target.value)} />
          </div>
        </EditorSection>

        <EditorSection
  num={5}
  title={t.installation}
  hidden={!sectionState.installation}
>
          <div>
            <label>{t.prerequisites}</label>
            <input type="text" id="prereqs" placeholder={t.prerequisitesPlaceholder}
              value={formData.prereqs} onChange={e => updateField('prereqs', e.target.value)} />
          </div>
          <div>
            <label>{t.installCommands}</label>
            <textarea className="textInput" id="installCmds" style={{ minHeight: 100 }}
              placeholder={t.installPlaceholder}
              value={formData.installCmds} onChange={e => updateField('installCmds', e.target.value)} />
            <WordCount text={formData.installCmds} t={t}/>
          </div>
          <div>
            <label>{t.envVariables}</label>
            <textarea className="textInput" id="envVars" style={{ minHeight: 70 }}
              placeholder={t.envPlaceholder}
              value={formData.envVars} onChange={e => updateField('envVars', e.target.value)} />
            <WordCount text={formData.envVars} t={t}/>
          </div>
          <div>
            <label>{t.runCommand}</label>
            <textarea className="textInput" id="usageCmd" style={{ minHeight: 80 }}
              placeholder={t.runPlaceholder}
              value={formData.usageCmd} onChange={e => updateField('usageCmd', e.target.value)} />
            <WordCount text={formData.usageCmd} t={t}/>
          </div>
        </EditorSection>

        <EditorSection num={7} title={t.projectStructure} hidden={!sectionState.structure}>
          <div>
            <label>{t.folderStructure}</label>
            <textarea className="textInput" id="rawStructure" style={{ minHeight: 120 }}
              placeholder={t.structurePlaceholder}
              value={formData.rawStructure} onChange={e => updateField('rawStructure', e.target.value)} />
            <WordCount text={formData.rawStructure} t={t}/>
          </div>
          <div>
            <label>{t.visualPreview}</label>
            <div className="struct-preview">{structPreview}</div>
          </div>
        </EditorSection>

        <EditorSection num={8} title={t.screenshots} hidden={!sectionState.screenshots}>
          <div>
            <label>{t.videoLink}</label>
            <input type="url" id="videoUrl" placeholder="https://youtube.com/watch?v=..."
  value={formData.videoUrl} onChange={e => updateField('videoUrl', e.target.value)}
  className={!isValidUrl(formData.videoUrl) ? 'input-url-invalid' : ''} />
{!isValidUrl(formData.videoUrl) && (
  <span className="url-warning">⚠️ Please enter a valid URL starting with https://</span>
)}
          </div>
          <div>
            <label>{t.dragScreenshots}</label>
            <div
              ref={dropZoneRef}
              className="drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="drop-zone-icon">🖼️</div>
              <p>{t.dropImages}</p>
              <small>{t.imageFormats}</small>
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
            <label>{t.imageUrls}</label>
            <textarea className="textInput" id="imageUrls" style={{ minHeight: 60 }}
              placeholder={t.imageUrlPlaceholder}
              value={formData.imageUrls} onChange={e => updateField('imageUrls', e.target.value)} />
            <WordCount text={formData.imageUrls} t={t}/>
          </div>
        </EditorSection>

        <EditorSection num={9} title={t.apiDocs} hidden={!sectionState.api}>
          <div>
            <label>{t.apiEndpoints}</label>
            <textarea className="textInput" id="apiDocs" style={{ minHeight: 100 }}
              placeholder={t.apiPlaceholder}
              value={formData.apiDocs} onChange={e => updateField('apiDocs', e.target.value)} />
            <WordCount text={formData.apiDocs} t={t}/>
          </div>
          <div>
            <label>{t.apiBaseUrl}</label>
            <input type="text" id="apiBase" placeholder="https://api.yourapp.com/v1"
              value={formData.apiBase} onChange={e => updateField('apiBase', e.target.value)} />
          </div>
        </EditorSection>

        <EditorSection num={10} title={t.contributing} hidden={!sectionState.contributing}>
          <div>
            <label>{t.contributingNotes}</label>
            <textarea className="textInput" id="contribNotes" style={{ minHeight: 70 }}
              placeholder={t.contributingPlaceholder}
              value={formData.contribNotes} onChange={e => updateField('contribNotes', e.target.value)} />
            <WordCount text={formData.contribNotes} t={t}/>
          </div>
        </EditorSection>

        <EditorSection num={11} title={t.licenseAuthor} hidden={!sectionState.author}>
          <div className="two-col">
            <div>
              <label>{t.license}</label>
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
              <label>{t.fullName}</label>
              <input type="text" id="authorName" placeholder="Your Name"
                value={formData.authorName} onChange={e => updateField('authorName', e.target.value)} />
            </div>
          </div>
          <div className="two-col">
            <div>
              <label>{t.githubUsername}</label>
              <input type="text" id="authorGh" placeholder="username"
                value={formData.authorGh} onChange={e => updateField('authorGh', e.target.value)} />
            </div>
            <div>
              <label>{t.email}</label>
              <input type="email" id="authorEmail" placeholder="you@email.com"
                value={formData.authorEmail} onChange={e => updateField('authorEmail', e.target.value)} />
            </div>
          </div>
          <div className="two-col">
            <div>
              <label>{t.linkedin}</label>
              <input type="url" id="authorLinkedin" placeholder="https://linkedin.com/in/you"
  value={formData.authorLinkedin} onChange={e => updateField('authorLinkedin', e.target.value)}
  className={!isValidUrl(formData.authorLinkedin) ? 'input-url-invalid' : ''} />
{!isValidUrl(formData.authorLinkedin) && (
  <span className="url-warning">⚠️ Please enter a valid URL starting with https://</span>
)}
            </div>
            <div>
              <label>{t.portfolio}</label>
              <input type="url" id="authorWebsite" placeholder="https://yoursite.com"
  value={formData.authorWebsite} onChange={e => updateField('authorWebsite', e.target.value)}
  className={!isValidUrl(formData.authorWebsite) ? 'input-url-invalid' : ''} />
{!isValidUrl(formData.authorWebsite) && (
  <span className="url-warning">⚠️ Please enter a valid URL starting with https://</span>
)}
            </div>
          </div>
        </EditorSection>

        <EditorSection num={12} title={t.supportDonation} hidden={!sectionState.support}>
          <div>
            <label>{t.supportMessage}</label>
            <textarea className="textInput" id="supportMsg" style={{ minHeight: 60 }}
              placeholder={t.supportPlaceholder}
              value={formData.supportMsg} onChange={e => updateField('supportMsg', e.target.value)} />
            <WordCount text={formData.supportMsg} t={t}/>
          </div>
          <div className="two-col">
            <div>
              <label>{t.buyMeCoffee}</label>
              <input type="text" id="supportBmac" placeholder="username"
                value={formData.supportBmac} onChange={e => updateField('supportBmac', e.target.value)} />
            </div>
            <div>
              <label>{t.kofi}</label>
              <input type="text" id="supportKofi" placeholder="username"
                value={formData.supportKofi} onChange={e => updateField('supportKofi', e.target.value)} />
            </div>
          </div>
          <div className="two-col">
            <div>
              <label>{t.patreon}</label>
              <input type="text" id="supportPatreon" placeholder="username"
                value={formData.supportPatreon} onChange={e => updateField('supportPatreon', e.target.value)} />
            </div>
            <div>
              <label>{t.githubSponsors}</label>
              <input type="text" id="supportGhSponsors" placeholder="username"
                value={formData.supportGhSponsors} onChange={e => updateField('supportGhSponsors', e.target.value)} />
            </div>
          </div>
        </EditorSection>

      </div>
    </div>
  );
}
