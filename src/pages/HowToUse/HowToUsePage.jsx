import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/layout/Footer';
import SEOHead from '../../components/shared/SEOHead';
import '../Landing/Landing.css';

const steps = [
  { num: '01', icon: '📋', title: 'Choose a Template', desc: 'Pick from 8 project templates — Web App, ML/AI, API, CLI, Mobile, Library, Hackathon, or Open Source. Each pre-fills the most relevant sections for your project type.' },
  { num: '02', icon: '✏️', title: 'Fill in Your Details', desc: 'Work through the editor sections at your own pace. Add your project name, description, features, tech stack, installation commands, and author info.' },
  { num: '03', icon: '🛠️', title: 'Select Your Tech Stack', desc: 'Click on any of the 32 pre-built technology chips to add them. Your stack is automatically organized into Frontend, Backend, Database, and DevOps layers.' },
  { num: '04', icon: '📊', title: 'Check Your Quality Score', desc: 'Watch your README quality score update in real time as you fill sections. Follow the suggestions to reach a perfect 100.' },
  { num: '05', icon: '👁️', title: 'Preview in Real Time', desc: 'Toggle between the rendered GitHub-style preview and raw Markdown. Use zoom controls for a closer look. The preview updates instantly as you type.' },
  { num: '06', icon: '📥', title: 'Export Your README', desc: 'When you\'re happy, copy to clipboard, download as README.md, or print to PDF. Your work auto-saves so you can come back any time.' },
];

const faqs = [
  { q: 'Is READMEForge free to use?', a: 'Yes, completely free. No sign-up, no limits, no hidden costs. It\'s also fully open-source.' },
  { q: 'Will my data be saved?', a: 'Your form data is saved automatically to your browser\'s localStorage. It persists between sessions but is stored only on your device — nothing is sent to any server.' },
  { q: 'Can I use it for private projects?', a: 'Absolutely. The tool runs entirely in your browser. Your project details never leave your machine.' },
  { q: 'What file format can I export to?', a: 'You can copy the raw Markdown to clipboard, download it as a README.md file, or print to PDF using your browser\'s built-in print dialog.' },
  { q: 'Can I add screenshots to my README?', a: 'Yes! Drag and drop image files into the Screenshots section, or paste image URLs in the "Label | URL" format, one per line.' },
  { q: 'How do section toggles work?', a: 'In the sidebar, each section has an on/off toggle. Disabled sections are hidden from the editor and excluded from the generated Markdown.' },
];

const tips = [
  { icon: '💡', tip: 'Write a description of at least 30 words to score full marks on the quality check.' },
  { icon: '🏷️', tip: 'Use "### Category" headers in the Features field to group features — they render as subheadings.' },
  { icon: '📦', tip: 'Use 2-space indentation in the Structure field. Folders should end with a slash (e.g. src/).' },
  { icon: '🔗', tip: 'Enter your GitHub username and repo name early — they power the badge links and auto-fill the clone URL.' },
  { icon: '🎨', tip: 'The template buttons are the fastest way to start — pick the closest match and customize from there.' },
  { icon: '💾', tip: 'Use "Clear Saved" only if you want to fully wipe your session. Your data auto-saves every 600ms.' },
];

export default function HowToUsePage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Custom Cursor Refs
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  // Floating Radial Orbs
  const [orbOffsets, setOrbOffsets] = useState({
    blue: { x: 0, y: 0 },
    purple: { x: 0, y: 0 },
    cyan: { x: 0, y: 0 }
  });

  // Intersection Observer for Scroll Reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Navbar Scroll Tracker
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Cursor & Orb Parallax Loop
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }

      // Parallax effect on radial orbs
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const xPercent = (e.clientX - winW / 2) / (winW / 2);
      const yPercent = (e.clientY - winH / 2) / (winH / 2);

      setOrbOffsets({
        blue: { x: xPercent * -25, y: yPercent * -25 },
        purple: { x: xPercent * 30, y: yPercent * 30 },
        cyan: { x: xPercent * -18, y: yPercent * -18 }
      });
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

  // Spotlight mousemove handler for tip cards
  const handleTipMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  };

  return (
    <div className="landing-page">
      <SEOHead
        title="How To Use — READMEForge"
        description="Step-by-step guide to creating a professional GitHub README with READMEForge. Learn templates, sections, export, and tips."
      />

      {/* Custom Cursor elements */}
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />

      {/* Custom Isolated Premium Navbar */}
      <nav className={`lp-site-nav ${scrolled ? 'scrolled' : ''}`}>
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

      {/* How To Use Hero */}
      <div className="lp-hero" style={{ minHeight: '85vh', paddingBottom: '40px' }}>
        <div className="lp-hero-grid" />
        
        {/* Floating Radial Gradient Orbs */}
        <div className="lp-orb-container">
          <div 
            className="lp-orb lp-orb-blue" 
            style={{ transform: `translate(${orbOffsets.blue.x}px, ${orbOffsets.blue.y}px)` }}
          />
          <div 
            className="lp-orb lp-orb-purple" 
            style={{ transform: `translate(${orbOffsets.purple.x}px, ${orbOffsets.purple.y}px)` }}
          />
          <div 
            className="lp-orb lp-orb-cyan" 
            style={{ transform: `translate(${orbOffsets.cyan.x}px, ${orbOffsets.cyan.y}px)` }}
          />
        </div>

        <div className="lp-badge-wrapper">
          <div className="lp-badge-dot" />
          <span className="lp-badge-text">Documentation</span>
        </div>

        <h1 className="lp-hero-headline" style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5rem)' }}>
          <span className="lp-word-wrapper"><span className="lp-word" style={{ animationDelay: '0.35s' }}>How</span></span>
          <span className="lp-word-wrapper"><span className="lp-word" style={{ animationDelay: '0.48s' }}>to</span></span>
          <span className="lp-word-wrapper"><span className="lp-word" style={{ animationDelay: '0.61s' }}>use</span></span>
          <span className="lp-word-wrapper"><span className="lp-word lp-gradient-word" style={{ animationDelay: '0.74s' }}>READMEForge</span></span>
        </h1>

        <p className="lp-hero-subheading" style={{ marginBottom: '24px' }}>
          From zero to a professional README in under 60 seconds. Here's everything you need to know.
        </p>

        <div className="lp-hero-ctas">
          <Link to="/readme-maker" className="lp-btn lp-btn-primary">
            Open README Maker
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Step-by-Step Guide Section */}
      <section className="lp-section">
        <div className="lp-section-header reveal">
          <div className="lp-section-tag">Walkthrough</div>
          <h2 className="lp-section-title">Step-by-step guide</h2>
        </div>
        <div className="htu-steps-wrapper" style={{ marginTop: '40px' }}>
          <div className="htu-steps">
            {steps.map((s, i) => (
              <div key={s.num} className={`htu-step reveal reveal-delay-${(i % 4) + 1}`} style={{ display: 'flex', gap: '32px', marginBottom: '40px' }}>
                <div className="htu-step-num" style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: '800',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(56,189,248,0.3)',
                  flexShrink: 0
                }}>{s.num}</div>
                <div className="htu-step-content" style={{ flex: 1 }}>
                  <div className="htu-step-icon" style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
                  <h3 className="htu-step-title" style={{ fontFamily: 'var(--font-head)', fontSize: '20px', fontWeight: '700', color: 'var(--white)', marginBottom: '8px' }}>{s.title}</h3>
                  <p className="htu-step-desc" style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--muted)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips & Best Practices Section */}
      <section className="lp-section" style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="lp-section-header reveal">
          <div className="lp-section-tag">Tips</div>
          <h2 className="lp-section-title">Tips &amp; best practices</h2>
        </div>
        
        {/* Spotlight segments layout for Tips */}
        <div className="lp-features-grid-wrapper" style={{ marginTop: '40px' }}>
          <div className="lp-features-grid">
            {tips.map((t, i) => (
              <div 
                key={i} 
                className={`lp-feature-card reveal reveal-delay-${(i % 3) + 1}`}
                onMouseMove={handleTipMouseMove}
              >
                <div className="lp-feature-spotlight" />
                <div className="lp-feature-card-content">
                  <div className="lp-feature-icon-wrapper">{t.icon}</div>
                  <p className="lp-feature-card-desc" style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--muted)', marginTop: '8px' }}>
                    {t.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="lp-section">
        <div className="lp-section-header reveal">
          <div className="lp-section-tag">FAQs</div>
          <h2 className="lp-section-title">Frequently asked questions</h2>
        </div>
        <div className="faq-list reveal reveal-delay-2" style={{ marginTop: '40px' }}>
          {faqs.map((f, i) => (
            <div 
              key={i} 
              className={`faq-item ${openFaq === i ? 'open' : ''}`}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                marginBottom: '12px',
                overflow: 'hidden',
                transition: 'border-color 0.3s'
              }}
            >
              <button 
                className="faq-question" 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%',
                  padding: '24px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-head)',
                  fontSize: '16px',
                  fontWeight: '700',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'none'
                }}
              >
                {f.q}
                <svg 
                  className="faq-chevron" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  style={{
                    width: '18px',
                    height: '18px',
                    transition: 'transform 0.3s',
                    transform: openFaq === i ? 'rotate(180deg)' : 'none',
                    color: openFaq === i ? 'var(--accent)' : 'var(--muted)'
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openFaq === i && (
                <div 
                  className="faq-answer" 
                  style={{
                    padding: '0 24px 24px',
                    fontSize: '14px',
                    color: 'var(--muted)',
                    lineHeight: '1.7',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '16px'
                  }}
                >
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Landing CTA */}
      <div className="lp-cta-banner-wrapper">
        <div className="lp-cta-banner reveal">
          <div className="lp-cta-glow" />
          <div className="lp-cta-content">
            <h2 className="lp-cta-title">Ready to start?</h2>
            <p className="lp-cta-sub">Open the README Maker and build your first professional README now.</p>
            <div className="lp-cta-buttons">
              <Link to="/readme-maker" className="lp-btn lp-btn-primary">
                Open README Maker
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
