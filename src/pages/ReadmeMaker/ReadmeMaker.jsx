import { useEffect, useRef, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReadmeState } from '../../hooks/useReadmeState';
import { useToast } from '../../components/ui/Toast';
import { generateMarkdown } from '../../utils/markdownUtils';
import Sidebar from './Sidebar';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import SEOHead from '../../components/shared/SEOHead';
import '../Landing/Landing.css';

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

  // Custom Cursor Refs
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

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

  // Custom Cursor Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let rAF;
    const updateRing = () => {
      const easeFactor = 0.12;
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      ringPos.current.x += dx * easeFactor;
      ringPos.current.y += dy * easeFactor;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }

      rAF = requestAnimationFrame(updateRing);
    };

    rAF = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rAF);
    };
  }, []);

  return (
    <div className="landing-page" style={{ cursor: 'none' }}>
      <SEOHead
        title="README Maker — READMEForge"
        description="Generate a professional GitHub README in seconds with live preview, templates, and one-click export."
      />

      {/* Custom Cursor elements */}
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />

      {/* Custom Isolated Premium Navbar (Always scrolled/solid-translucent on editor page) */}
      <nav className="lp-site-nav scrolled" style={{ position: 'absolute' }}>
        <Link to="/" className="lp-logo">
          <div className="lp-logo-icon">RF</div>
          <span>READMEForge</span>
        </Link>
        <div className="lp-site-nav-links">
          <Link to="/" className="lp-site-nav-link">Home</Link>
          <Link to="/readme-maker" className="lp-site-nav-link">README Maker</Link>
          <Link to="/how-to-use" className="lp-site-nav-link">How To Use</Link>
          <Link to="/readme-maker" className="lp-nav-cta">Start Building</Link>
        </div>
      </nav>

      <div id="app-builder" style={{ paddingTop: 72, cursor: 'none' }}>
        <header className="header" style={{ cursor: 'none' }}>
          <div className="header-center">
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace', marginRight: 4 }}>sections:</span>
            <span id="sectionCount" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{activeSectionCount}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace' }}> active</span>
            <span className={`autosave-status${autoSaved ? ' visible' : ''}`}>✓ Auto-saved</span>
          </div>
          <div className="header-right">
            <a href="https://github.com/Mohit-368/ReadmeForge" target="_blank" rel="noreferrer"
              className="hbtn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
              </svg>
              Source
            </a>
            <button className="hbtn" style={{ cursor: 'none' }} onClick={handleClearSaved}>🗑 Clear Saved</button>
            <button className="hbtn" style={{ cursor: 'none' }} onClick={handleResetAll}>↺ Reset All Fields</button>
            <button className="hbtn" style={{ cursor: 'none' }} onClick={handleCopyMarkdown}>Copy Markdown</button>
          </div>
        </header>

        <div className="main" style={{ height: 'calc(100vh - 136px)', cursor: 'none' }}>
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
  );
}
