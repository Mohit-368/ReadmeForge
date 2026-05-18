import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEOHead from '../../components/shared/SEOHead';

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
  { q: 'What file format can I export to?', a: 'You can copy the raw Markdown to clipboard, download it as a README.md file, or print it to PDF using your browser\'s built-in print dialog.' },
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

  return (
    <>
      <SEOHead
        title="How To Use — READMEForge"
        description="Step-by-step guide to creating a professional GitHub README with READMEForge. Learn templates, sections, export, and tips."
      />
      <Navbar />

      <div className="htu-page">
        <div className="htu-hero">
          <div className="landing-container">
            <div className="section-label-tag">Documentation</div>
            <h1 className="htu-title">How to use <span className="accent-text">READMEForge</span></h1>
            <p className="htu-subtitle">From zero to a professional README in under 60 seconds. Here's everything you need to know.</p>
            <Link to="/readme-maker" className="cta-btn cta-btn--primary" style={{ display: 'inline-flex', marginTop: 8 }}>
              Open README Maker →
            </Link>
          </div>
        </div>

        <section className="htu-steps-section">
          <div className="landing-container">
            <h2 className="landing-section-title">Step-by-step guide</h2>
            <div className="htu-steps">
              {steps.map(s => (
                <div key={s.num} className="htu-step">
                  <div className="htu-step-num">{s.num}</div>
                  <div className="htu-step-content">
                    <div className="htu-step-icon">{s.icon}</div>
                    <h3 className="htu-step-title">{s.title}</h3>
                    <p className="htu-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="htu-tips-section">
  <div className="landing-container">
    <h2 className="landing-section-title">Tips &amp; best practices</h2>
    <div className="terminal-box">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot terminal-dot--red"></span>
          <span className="terminal-dot terminal-dot--yellow"></span>
          <span className="terminal-dot terminal-dot--green"></span>
        </div>
        <span className="terminal-title">
          <span className="terminal-prompt">$</span>
        <span className="terminal-command">readme-tips.sh</span>
        </span>
      </div>
      <div className="terminal-body">
        {tips.map((t, i) => (
          <div key={i} className="terminal-line">
            <span className="terminal-num">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="terminal-icon">{t.icon}</span>
            <span className="terminal-text">{t.tip}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

        <section className="htu-faq-section">
          <div className="landing-container">
            <h2 className="landing-section-title">Frequently asked questions</h2>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {f.q}
                    <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openFaq === i && <div className="faq-answer">{f.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-cta" style={{ paddingTop: 0 }}>
          <div className="landing-container">
            <div className="cta-box">
              <h2 className="cta-title">Ready to start?</h2>
              <p className="cta-sub">Open the README Maker and build your first professional README now.</p>
              <div className="cta-buttons">
                <Link to="/readme-maker" className="cta-btn cta-btn--primary">
                  Open README Maker
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
