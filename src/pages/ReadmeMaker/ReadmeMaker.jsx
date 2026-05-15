import { useEffect, useRef, useMemo } from 'react';
import { useReadmeState } from '../../hooks/useReadmeState';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../components/ui/Toast';
import { generateMarkdown } from '../../utils/markdownUtils';
import { SECTIONS } from '../../utils/constants';
import Sidebar from './Sidebar';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import Logo from '../../components/ui/Logo';
import SEOHead from '../../components/shared/SEOHead';
import { useState } from 'react';

import { useNavbarExtra } from '../../context/NavbarContext';

export default function ReadmeMaker() {
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();
  const { setExtraContent } = useNavbarExtra();

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

  // Inject Editor actions into Navbar
  useEffect(() => {
    setExtraContent(
      <div className="editor-nav-actions">
        <div className="header-center">
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace', marginRight: 4 }}>sections:</span>
          <span id="sectionCount" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{activeSectionCount}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace' }}> active</span>
          <span className={`autosave-status${autoSaved ? ' visible' : ''}`}>✓ Auto-saved</span>
        </div>
        <div className="header-right">
          <button className="hbtn" onClick={handleClearSaved}>🗑 Clear</button>
          <button className="hbtn" onClick={handleResetAll}>↺ Reset</button>
          <button className="hbtn primary" onClick={handleCopyMarkdown}>Copy Markdown</button>
        </div>
      </div>
    );

    return () => setExtraContent(null);
  }, [activeSectionCount, autoSaved, setExtraContent]);

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

  return (
    <>
      <SEOHead
        title="README Maker — READMEForge"
        description="Generate a professional GitHub README in seconds with live preview, templates, and one-click export."
      />
      <div className="page-transition">
        <div id="app-builder" style={{ paddingTop: 64 }}>
          <div className="main">
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
      </div>
    </>
  );
}
