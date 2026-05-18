import { useEffect, useRef, useMemo } from 'react';
import { useReadmeState } from '../../hooks/useReadmeState';
import { useToast } from '../../components/ui/Toast';
import { generateMarkdown } from '../../utils/markdownUtils';
import { SECTIONS } from '../../utils/constants';
import Sidebar from './Sidebar';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import Navbar from '../../components/layout/Navbar';
import SEOHead from '../../components/shared/SEOHead';
import { useState } from 'react';

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
  function handleShortcut(event) {
    const isMac = navigator.platform.toUpperCase().includes("MAC");

    const ctrlOrCmd = isMac
      ? event.metaKey
      : event.ctrlKey;

    // Shortcut: Ctrl/Cmd + Alt + C
    if (
      ctrlOrCmd &&
      event.altKey &&
      event.key.toLowerCase() === "c"
    ) {
      event.preventDefault();

      handleCopyMarkdown();
    }
  }

  document.addEventListener("keydown", handleShortcut);

  return () => {
    document.removeEventListener("keydown", handleShortcut);
  };
}, [currentMd]);
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
            <button
  className="hbtn"
  onClick={handleCopyMarkdown}
  title={
    navigator.platform.toUpperCase().includes("MAC")
      ? "Shortcut: Cmd + Alt + C"
      : "Shortcut: Ctrl + Alt + C"
  }
>
  Copy Markdown
</button>
          </div>
        </header>

        <div className="main" style={{ height: 'calc(100vh - 128px)' }}>
          <Sidebar
            sectionState={sectionState}
            toggleSection={toggleSection}
            selectedTechs={selectedTechs}
            toggleTech={toggleTech}
            applyTemplate={handleApplyTemplate}
            activeTemplate={activeTemplate}
          />
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
          <PreviewPanel
            currentMd={currentMd}
            formData={formData}
            sectionState={sectionState}
            selectedTechs={selectedTechs}
            screenshots={screenshots}
          />
        </div>
      </div>
    </>
  );
}
