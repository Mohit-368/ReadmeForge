import { useEffect, useRef, useMemo, useState } from 'react';
import { useReadmeState } from '../../hooks/useReadmeState';
import { useToast } from '../../components/ui/Toast';
import { generateMarkdown } from '../../utils/markdownUtils';
import { SECTIONS } from '../../utils/constants';
import Sidebar from './Sidebar';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import Navbar from '../../components/layout/Navbar';
import SEOHead from '../../components/shared/SEOHead';

export default function ReadmeMaker() {
  const toast = useToast();

  const {
    formData, updateField,
    sectionState, toggleSection,
    selectedTechs, toggleTech,
    selectedBadges, toggleBadge,
    screenshots, addScreenshots, removeScreenshot,
    applyTemplate, resetAll, clearSaved,
    autoSaved,
  } = useReadmeState();

  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeMobileTab, setActiveMobileTab] = useState('editor');

  const currentMd = useMemo(() =>
    generateMarkdown({ formData, sectionState, selectedTechs, selectedBadges, screenshots }),
    [formData, sectionState, selectedTechs, selectedBadges, screenshots]
  );

  const activeSectionCount = Object.values(sectionState).filter(Boolean).length;

  function handleApplyTemplate(template, key) {
    applyTemplate(template);
    setActiveTemplate(key);
    toast('✓ Template applied!');
  }

  function handleCopyMarkdown() {
    if (!currentMd) { toast('Generate content first!'); return; }
    navigator.clipboard.writeText(currentMd)
      .then(() => toast('✓ Copied to clipboard!'))
      .catch(() => toast('Copy failed'));
  }

  function handleResetAll() {
    resetAll();
    setActiveTemplate(null);
    toast('✓ Reset complete!');
  }

  function handleClearSaved() {
    clearSaved();
    toast('✓ Saved data cleared!');
  }

  useEffect(() => {
    // Industry-standard fix for iOS Safari keyboard void glitch
    const handleKeyboardDismiss = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        // Wait a tiny fraction of a second for the keyboard to fully retract, then snap the viewport back
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 50);
      }
    };
    
    document.addEventListener('focusout', handleKeyboardDismiss);
    return () => document.removeEventListener('focusout', handleKeyboardDismiss);
  }, []);

  return (
    <>
      <SEOHead
        title="README Maker — READMEForge"
        description="Generate a professional GitHub README in seconds with live preview, templates, and one-click export."
      />
      <Navbar />
      <div id="app-builder" style={{ paddingTop: 64 }}>
        <header className="header">
          <div className="header-center">
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace', marginRight: 4 }}>sections:</span>
            <span id="sectionCount" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{activeSectionCount}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace' }}> active</span>
            <span className={`autosave-status${autoSaved ? ' visible' : ''}`}>✓ Auto-saved</span>
          </div>
          <div className="header-right">
            <a href="https://github.com/Mohit-368/ReadmeForge" target="_blank" rel="noreferrer"
              className="hbtn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
              </svg>
              Source
            </a>
            <button className="hbtn" onClick={handleClearSaved}>🗑 Clear Saved</button>
            <button className="hbtn" onClick={handleResetAll}>↺ Reset All Fields</button>
            <button className="hbtn" onClick={handleCopyMarkdown}>Copy Markdown</button>
          </div>
        </header>

        <div className="mobile-tab-switcher">
          <button
            type="button"
            className={`mobile-tab-switcher-btn${activeMobileTab === 'setup' ? ' active' : ''}`}
            onClick={() => setActiveMobileTab('setup')}
          >
            Setup
          </button>
          <button
            type="button"
            className={`mobile-tab-switcher-btn${activeMobileTab === 'editor' ? ' active' : ''}`}
            onClick={() => setActiveMobileTab('editor')}
          >
            Editor
          </button>
          <button
            type="button"
            className={`mobile-tab-switcher-btn${activeMobileTab === 'preview' ? ' active' : ''}`}
            onClick={() => setActiveMobileTab('preview')}
          >
            Preview
          </button>
        </div>

        <div className="main" style={{ height: 'calc(100vh - 128px)' }}>
          <div className={`mobile-panel-wrapper${activeMobileTab === 'setup' ? ' active' : ''}`}>
            <Sidebar
              sectionState={sectionState}
              toggleSection={toggleSection}
              selectedTechs={selectedTechs}
              toggleTech={toggleTech}
              applyTemplate={handleApplyTemplate}
              activeTemplate={activeTemplate}
            />
          </div>
          <div className={`mobile-panel-wrapper${activeMobileTab === 'editor' ? ' active' : ''}`}>
            <EditorPanel
              formData={formData}
              updateField={updateField}
              sectionState={sectionState}
              selectedTechs={selectedTechs}
              toggleTech={toggleTech}
              selectedBadges={selectedBadges}
              toggleBadge={toggleBadge}
              screenshots={screenshots}
              addScreenshots={addScreenshots}
              removeScreenshot={removeScreenshot}
            />
          </div>
          <div className={`mobile-panel-wrapper${activeMobileTab === 'preview' ? ' active' : ''}`}>
            <PreviewPanel
              currentMd={currentMd}
              formData={formData}
              sectionState={sectionState}
              selectedTechs={selectedTechs}
              screenshots={screenshots}
            />
          </div>
        </div>

        {/* Mobile Global Scroll-to-Top */}
        <button
          className="mobile-global-top-btn"
          onClick={() => {
            const activeWrapper = document.querySelector('.mobile-panel-wrapper.active');
            if (activeWrapper) activeWrapper.scrollTo({ top: 0, behavior: 'smooth' });
            const innerTarget = activeWrapper?.firstElementChild;
            if (innerTarget) innerTarget.scrollTo({ top: 0, behavior: 'smooth' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Scroll to top"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>
    </>
  );
}
