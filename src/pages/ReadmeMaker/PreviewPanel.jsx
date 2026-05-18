import { useState, useEffect, useRef, useCallback } from 'react';
import { md2html, esc } from '../../utils/markdownUtils';
import { ZOOM_LEVELS, PREVIEW_ZOOM_KEY } from '../../utils/constants';
import { useToast } from '../../components/ui/Toast';

function getNearestZoom(level) {
  return ZOOM_LEVELS.reduce((c, v) => Math.abs(v - level) < Math.abs(c - level) ? v : c, ZOOM_LEVELS[0]);
}

function calculateQuality({ formData, sectionState, selectedTechs, screenshots }) {
  let score = 0;
  const suggestions = [];
  const { projName, tagline, ghUser, repoSlug, description, features, customTech,
    installCmds, usageCmd, authorName, authorGh, videoUrl, imageUrls, demoUrl, license } = formData;

  if (projName) score += 10; else suggestions.push({ icon: '📌', text: 'Add a project name.' });
  if (tagline) score += 5; else suggestions.push({ icon: '💬', text: 'Add a one-line tagline.' });
  if (ghUser && repoSlug) score += 5; else suggestions.push({ icon: '🔗', text: 'Fill in GitHub username and repo name.' });

  const descWords = description ? description.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
  if (descWords >= 30) score += 15;
  else if (descWords >= 15) { score += 8; suggestions.push({ icon: '📋', text: 'Expand description to 30+ words.' }); }
  else if (descWords > 0) { score += 3; suggestions.push({ icon: '📋', text: 'Description is very short.' }); }
  else suggestions.push({ icon: '📋', text: 'Add a project description.' });

  if (sectionState.features && features && features.trim().length > 20) score += 15;
  else if (sectionState.features && features) { score += 7; suggestions.push({ icon: '✨', text: 'Expand the features section.' }); }
  else suggestions.push({ icon: '✨', text: 'Enable and fill in the Features section.' });

  const totalTechs = selectedTechs.size + (customTech ? customTech.split(',').filter(t => t.trim()).length : 0);
  if (totalTechs >= 3) score += 10;
  else if (totalTechs >= 1) { score += 5; suggestions.push({ icon: '🛠️', text: 'Select at least 3 technologies.' }); }
  else suggestions.push({ icon: '🛠️', text: 'Select your tech stack.' });

  if (sectionState.installation && installCmds) score += 10;
  else if (sectionState.installation) { score += 4; suggestions.push({ icon: '🚀', text: 'Add installation commands.' }); }
  else suggestions.push({ icon: '🚀', text: 'Enable the Installation section.' });

  if (sectionState.installation && usageCmd) score += 5; else suggestions.push({ icon: '💻', text: 'Add usage instructions.' });
  if (sectionState.author && (authorName || authorGh)) score += 5; else suggestions.push({ icon: '👤', text: 'Fill in author details.' });

  if (sectionState.screenshots && (screenshots.length > 0 || videoUrl || imageUrls?.trim())) score += 5;
  else suggestions.push({ icon: '🖼️', text: 'Add screenshots or a demo video.' });

  if (demoUrl?.trim()) score += 5; else suggestions.push({ icon: '🔗', text: 'Add a live demo URL.' });
  if (sectionState.contributing) score += 5; else suggestions.push({ icon: '🤝', text: 'Enable the Contributing section.' });
  if (sectionState.author && license !== 'none') score += 5; else if (license === 'none') suggestions.push({ icon: '📄', text: 'Choose a license.' });

  return { score: Math.min(score, 100), suggestions };
}

export default function PreviewPanel({ currentMd, formData, sectionState, selectedTechs, screenshots }) {
  const toast = useToast();
  const [tab, setTabState] = useState('rendered');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [zoom, setZoom] = useState(() => {
    try {
      const raw = localStorage.getItem(PREVIEW_ZOOM_KEY);
      if (raw) return getNearestZoom(parseFloat(raw));
    } catch {}
    return 1;
  });
  const [qualityOpen, setQualityOpen] = useState(false);
  const previewBodyRef = useRef(null);
  const [showBackTop, setShowBackTop] = useState(false);

  const quality = calculateQuality({ formData, sectionState, selectedTechs, screenshots });

  useEffect(() => {
    try { localStorage.setItem(PREVIEW_ZOOM_KEY, String(zoom)); } catch {}
  }, [zoom]);

  useEffect(() => {
    const el = previewBodyRef.current;
    if (!el) return;
    const handler = () => setShowBackTop(el.scrollTop > 200);
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); }
      if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomOut(); }
      if (e.key === '0') { e.preventDefault(); setZoom(1); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [zoom]);

  useEffect(() => {
    if (isFocusMode) {
      document.body.classList.add('mobile-focus-active');
    } else {
      document.body.classList.remove('mobile-focus-active');
    }
    return () => document.body.classList.remove('mobile-focus-active');
  }, [isFocusMode]);

  function zoomIn() {
    const next = ZOOM_LEVELS.find(l => l > zoom);
    if (next !== undefined) setZoom(next);
  }
  function zoomOut() {
    const next = [...ZOOM_LEVELS].reverse().find(l => l < zoom);
    if (next !== undefined) setZoom(next);
  }

  const copyMarkdown = useCallback(async () => {
    if (!currentMd) { toast('Generate content first!'); return; }
    try {
      await navigator.clipboard.writeText(currentMd);
      toast('✓ Copied to clipboard!');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = currentMd;
      ta.style.cssText = 'position:absolute;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast('✓ Copied!'); } catch { toast('Copy failed'); }
      document.body.removeChild(ta);
    }
  }, [currentMd, toast]);

  const downloadMd = useCallback(() => {
    if (!currentMd) { toast('Nothing to download yet!'); return; }
    const blob = new Blob([currentMd], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast('✓ README.md downloaded!');
  }, [currentMd, toast]);

  const printPreview = useCallback(() => {
    if (!currentMd) { toast('Nothing to print yet!'); return; }
    toast('Opening print preview...');
    window.print();
  }, [currentMd, toast]);

  const hasContent = !!currentMd.trim();
  const zoomPct = Math.round(zoom * 100) + '%';

  return (
    <aside className={`preview${isFocusMode ? ' fullscreen-preview-overlay' : ''}`}>
      {!isFocusMode ? (
        <div className="preview-header">
          <div className="preview-tabs">
            <button
              className={`ptab${tab === 'rendered' ? ' active' : ''}`}
              onClick={() => setTabState('rendered')}
            >
              Preview
            </button>
            <button
              className={`ptab${tab === 'raw' ? ' active' : ''}`}
              onClick={() => setTabState('raw')}
            >
              Raw MD
            </button>
          </div>
          <div className="preview-actions">
            <button className="pbtn green" onClick={copyMarkdown}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy Markdown
            </button>
            <button className="pbtn" onClick={downloadMd}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download .md
            </button>
            <button className="pbtn print" onClick={printPreview}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
              </svg>
              Print Preview
            </button>
          </div>
        </div>
      ) : null}

      {hasContent && (
        <div className="quality-panel" id="qualityPanel">
          <div className="quality-panel-header" onClick={() => setQualityOpen(o => !o)}>
            <div className="quality-panel-left">
              <span className="quality-panel-icon">📊</span>
              <span className="quality-panel-title">README Quality Score</span>
              <span className="quality-score-badge" style={{
                background: getQualityColor(quality.score) + '33',
                borderColor: getQualityColor(quality.score) + '66',
                color: getQualityColor(quality.score),
              }}>{quality.score}</span>
            </div>
            <div className="quality-panel-right">
              <span className="quality-label" style={{ color: getQualityColor(quality.score) }}>
                {getQualityLabel(quality.score)}
              </span>
              <svg className="quality-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: qualityOpen ? '' : 'rotate(-90deg)' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          {qualityOpen && (
            <div className="quality-panel-body">
              <div className="quality-score-row">
                <div className="quality-ring-wrap">
                  <svg className="quality-ring" viewBox="0 0 36 36">
                    <circle className="quality-ring-bg" cx="18" cy="18" r="15.9" />
                    <circle className="quality-ring-fill" cx="18" cy="18" r="15.9"
                      strokeDasharray={`${quality.score} ${100 - quality.score}`}
                      style={{ stroke: getQualityColor(quality.score) }} />
                  </svg>
                  <span className="quality-ring-num" style={{ color: getQualityColor(quality.score) }}>{quality.score}</span>
                </div>
                <div className="quality-score-details">
                  <div className="quality-score-main" style={{ color: getQualityColor(quality.score) }}>{quality.score} / 100</div>
                  <div className="quality-score-sub">{getQualitySubtext(quality.score)}</div>
                  <div className="quality-bar-wrap">
                    <div className="quality-bar-track">
                      <div className="quality-bar-fill" style={{ width: quality.score + '%', background: getQualityColor(quality.score) }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="quality-suggestions">
                {quality.suggestions.length === 0 ? (
                  <div className="quality-suggestion quality-suggestion--good">
                    <span className="qs-icon">🎉</span>
                    <span className="qs-text">All key sections are complete — great job!</span>
                  </div>
                ) : (
                  <>
                    <div className="quality-suggestions-heading">Suggestions to improve</div>
                    {quality.suggestions.map((s, i) => (
                      <div key={i} className="quality-suggestion">
                        <span className="qs-icon">{s.icon}</span>
                        <span className="qs-text">{s.text}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="preview-body" ref={previewBodyRef} style={{ '--preview-zoom': zoom }}>
        <div className="preview-zoom-controls">
          <button className="pbtn" onClick={zoomOut} disabled={zoom <= ZOOM_LEVELS[0]} title="Zoom out (Ctrl -)">−</button>
          <span className="zoom-indicator">{zoomPct}</span>
          <button className="pbtn" onClick={zoomIn} disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]} title="Zoom in (Ctrl +)">+</button>
          <button className="pbtn" onClick={() => setZoom(1)} title="Reset zoom (Ctrl 0)">Reset</button>

          {!isFocusMode && (
            <button onClick={() => setIsFocusMode(true)} className="floating-focus-btn" aria-label="Focus View">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          )}
        </div>

        {!hasContent ? (
          <div className="preview-zoom-wrap">
            <div className="empty-preview">
              <div className="icon">📄</div>
              <h3>Live preview appears here</h3>
              <p>Start filling in the editor →</p>
            </div>
          </div>
        ) : tab === 'rendered' ? (
          <div className="preview-zoom-wrap">
            <div className="gh-preview" dangerouslySetInnerHTML={{ __html: md2html(currentMd) }} />
          </div>
        ) : (
          <div className="preview-zoom-wrap">
            <div className="raw-view">{currentMd}</div>
          </div>
        )}
      </div>

      {isFocusMode ? (
        <button onClick={() => setIsFocusMode(false)} className="exit-focus-btn" aria-label="Exit Focus Mode">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Exit Focus
        </button>
      ) : null}

      {showBackTop && (
        <button
          className="back-to-top-btn show"
          title="Back to Top"
          onClick={() => previewBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </aside>
  );
}

function getQualityColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 55) return '#f59e0b';
  if (score >= 30) return '#f97316';
  return '#f43f5e';
}
function getQualityLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 55) return 'Good';
  if (score >= 30) return 'Needs Work';
  return 'Incomplete';
}
function getQualitySubtext(score) {
  if (score >= 80) return 'Your README is comprehensive and well-structured!';
  if (score >= 55) return 'A few improvements will make your README stand out.';
  if (score >= 30) return 'Add more details to make your README more helpful.';
  return 'Fill in the key sections to get started.';
}
