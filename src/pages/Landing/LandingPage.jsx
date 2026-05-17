import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/shared/SEOHead';
import Footer from '../../components/layout/Footer';
import './Landing.css';

const features = [
  { icon: '⚡', title: 'Live Preview', desc: 'See your README rendered in real-time as you type. GitHub-accurate preview with badge rendering.' },
  { icon: '🎨', title: '8 Smart Templates', desc: 'Start fast with templates for Web Apps, ML projects, APIs, CLIs, Mobile Apps, and more.' },
  { icon: '🛠️', title: '32 Tech Chips', desc: 'One-click technology selection. Auto-organizes your stack into Frontend, Backend, Database, and DevOps layers.' },
  { icon: '📊', title: 'Quality Score', desc: 'Built-in README quality analyzer gives you a score out of 100 with actionable improvement tips.' },
  { icon: '📁', title: 'Structure Visualizer', desc: 'Paste your folder structure and get a beautiful tree diagram with emoji icons automatically.' },
  { icon: '📥', title: 'Export Options', desc: 'Copy to clipboard, download as README.md, or print to PDF — all in one click.' },
  { icon: '💾', title: 'Auto-Save', desc: 'Your work is automatically saved to localStorage. Pick up exactly where you left off.' },
  { icon: '🌙', title: 'Dark & Light Mode', desc: 'Full dark and light theme support with smooth transitions and system preference detection.' },
];

const steps = [
  { num: '1', title: 'Select Template', desc: 'Choose from 8 starter layouts tailored for different project needs.' },
  { num: '2', title: 'Pick Tech Stack', desc: 'Add badges for your programming languages, frameworks, and databases in one click.' },
  { num: '3', title: 'Customize Sections', desc: 'Edit project details, add license info, installation guides, and visual directory structures.' },
  { num: '4', title: 'Export instantly', desc: 'Copy markdown directly to clipboard or download files instantly.' }
];

const marqueeItems = [
  'Web App', 'ML/AI', 'CLI Tool', 'Library', 'Mobile App', 'Open Source', 'Game Projects', 'APIs', 'NPM Package',
  'Web App', 'ML/AI', 'CLI Tool', 'Library', 'Mobile App', 'Open Source', 'Game Projects', 'APIs', 'NPM Package'
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  
  // Custom Cursor state
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  // Parallax Orbs state
  const [orbOffsets, setOrbOffsets] = useState({
    blue: { x: 0, y: 0 },
    purple: { x: 0, y: 0 },
    cyan: { x: 0, y: 0 }
  });

  // Animated Stats State
  const [statCounts, setStatCounts] = useState([0, 0, 0, 0]);
  const statsRef = useRef(null);
  const statsHasAnimated = useRef(false);

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

  // Custom Cursor Animation Loop (Lerp)
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Update instant dot position
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }

      // Parallax effect on Hero radial orbs
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

    // Lerp logic for outer ring
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

  // Spotlight Mouse Move handler for Feature Cards
  const handleFeatureMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  };

  // Stats Count Up Animation using IntersectionObserver
  useEffect(() => {
    const statsTargets = [8, 32, 12, 100];
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsHasAnimated.current) {
        statsHasAnimated.current = true;
        const duration = 1800; // 1800ms
        const startTime = performance.now();

        const animateStats = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const timeFraction = Math.min(elapsedTime / duration, 1);
          
          // ease-out-quart formula
          const progress = 1 - Math.pow(1 - timeFraction, 4);

          const currentStats = statsTargets.map(target => Math.floor(progress * target));
          setStatCounts(currentStats);

          if (timeFraction < 1) {
            requestAnimationFrame(animateStats);
          } else {
            setStatCounts(statsTargets);
          }
        };

        requestAnimationFrame(animateStats);
      }
    }, { threshold: 0.15 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Split word helper for Headline animation
  const renderSplitHeadline = () => {
    const line = "GitHub Readme.Md maker";
    const words = line.split(" ");
    return words.map((word, wIdx) => {
      const isGradient = word.toLowerCase().includes("readme.md") || word.toLowerCase().includes("maker");
      const delay = 0.35 + wIdx * 0.13;
      return (
        <span key={wIdx} className="lp-word-wrapper">
          <span 
            className={`lp-word ${isGradient ? 'lp-gradient-word' : ''}`}
            style={{ animationDelay: `${delay}s` }}
          >
            {word}
          </span>
        </span>
      );
    });
  };

  return (
    <div className="landing-page">
      <SEOHead
        title="READMEForge — Generate Professional GitHub READMEs in 30 Seconds"
        description="Free, open-source README generator. Live preview, 8 templates, quality scoring, and one-click export. No sign-up required."
      />

      {/* Custom Cursor elements (hidden on mobile via CSS) */}
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

      {/* Hero Section */}
      <div className="lp-hero">
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

        {/* Pulsing Dot Badge */}
        <div className="lp-badge-wrapper">
          <div className="lp-badge-dot" />
          <span className="lp-badge-text">GSoC Open Source Project</span>
        </div>

        {/* Headline */}
        <h1 className="lp-hero-headline">
          {renderSplitHeadline()}
        </h1>

        {/* Subheading */}
        <p className="lp-hero-subheading">
          The ultimate developer tool to craft perfect repository and profile READMEs in under 30 seconds. Free, open-source, and fully interactive.
        </p>

        {/* CTA Buttons */}
        <div className="lp-hero-ctas">
          <Link to="/readme-maker" className="lp-btn lp-btn-primary">
            Start Building
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/how-to-use" className="lp-btn lp-btn-secondary">
            How It Works
          </Link>
        </div>

        {/* Stats Row */}
        <div ref={statsRef} className="lp-stats-row reveal reveal-delay-2">
          <div className="lp-stat-item">
            <div className="lp-stat-val">{statCounts[0]}+</div>
            <div className="lp-stat-lbl">Templates</div>
          </div>
          <div className="lp-stat-item">
            <div className="lp-stat-val">{statCounts[1]}</div>
            <div className="lp-stat-lbl">Tech Chips</div>
          </div>
          <div className="lp-stat-item">
            <div className="lp-stat-val">{statCounts[2]}</div>
            <div className="lp-stat-lbl">Sections</div>
          </div>
          <div className="lp-stat-item">
            <div className="lp-stat-val">{statCounts[3]}%</div>
            <div className="lp-stat-lbl">Quality Score</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="lp-scroll-indicator reveal reveal-delay-4">
          <span>Explore</span>
          <div className="lp-scroll-line-container">
            <div className="lp-scroll-line" />
          </div>
        </div>
      </div>

      {/* Marquee Strip */}
      <div className="lp-marquee-section">
        <div className="lp-marquee-container">
          {marqueeItems.concat(marqueeItems).map((item, index) => (
            <span key={index} className="lp-marquee-chip">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section className="lp-section">
        <div className="lp-section-header reveal">
          <div className="lp-section-tag">What's inside</div>
          <h2 className="lp-section-title">Everything you need to write<br />a perfect README</h2>
        </div>
        <div className="lp-features-grid-wrapper">
          <div className="lp-features-grid">
            {features.map((f, i) => (
              <div 
                key={f.title} 
                className={`lp-feature-card reveal reveal-delay-${(i % 4) + 1}`}
                onMouseMove={handleFeatureMouseMove}
              >
                <div className="lp-feature-spotlight" />
                <div className="lp-feature-card-content">
                  <div className="lp-feature-icon-wrapper">{f.icon}</div>
                  <h3 className="lp-feature-card-title">{f.title}</h3>
                  <p className="lp-feature-card-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Step Cards */}
      <section className="lp-section">
        <div className="lp-section-header reveal">
          <div className="lp-section-tag">Workflow</div>
          <h2 className="lp-section-title">How It Works in 4 Steps</h2>
        </div>
        <div className="lp-steps-wrapper">
          <div className="lp-steps-connector" />
          <div className="lp-steps-grid">
            {steps.map((s, i) => (
              <div key={s.num} className={`lp-step-card reveal reveal-delay-${i + 1}`}>
                <div className="lp-step-circle">{s.num}</div>
                <h3 className="lp-step-card-title">{s.title}</h3>
                <p className="lp-step-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="lp-cta-banner-wrapper">
        <div className="lp-cta-banner reveal">
          <div className="lp-cta-glow" />
          <div className="lp-cta-content">
            <h2 className="lp-cta-title">Ready to craft your README?</h2>
            <p className="lp-cta-sub">No sign-up. No limits. Just a great README in under 60 seconds.</p>
            <div className="lp-cta-buttons">
              <Link to="/readme-maker" className="lp-btn lp-btn-primary">
                Start Building
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/how-to-use" className="lp-btn lp-btn-secondary">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
