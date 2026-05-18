import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEOHead from '../../components/shared/SEOHead';
import { SHOWCASE_ITEMS, SHOWCASE_CATEGORIES } from '../../data/showcaseItems';

function ShowcaseCard({ item }) {
  const gradient = `linear-gradient(135deg, ${item.accent}22 0%, ${item.accent2}18 50%, transparent 100%)`;
  const categoryLabel = SHOWCASE_CATEGORIES.find(c => c.id === item.category)?.label || item.category;

  return (
    <article className={`showcase-card${item.featured ? ' showcase-card--featured' : ''}`}>
      {item.featured && <span className="showcase-featured-badge">Featured</span>}

      <div className="showcase-card-preview" style={{ background: gradient }}>
        <div className="showcase-preview-chrome">
          <span /><span /><span />
          <small>README.md</small>
        </div>
        <PreviewMd item={item} />
      </div>

      <div className="showcase-card-body">
        <div className="showcase-card-top">
          <h3 className="showcase-card-title">{item.title}</h3>
          <span className="showcase-category-pill">{categoryLabel}</span>
        </div>
        <p className="showcase-card-tagline">{item.tagline}</p>
        <div className="showcase-card-meta" aria-label="README stats">
          <span>{item.metrics.sections} sections</span>
          <span>{item.metrics.badges} badges</span>
          <span>{item.metrics.score}% score</span>
        </div>
        <ul className="showcase-highlights">
          {item.highlights.map(h => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div className="showcase-card-footer">
          <a
            href={`https://github.com/${item.creator.github}`}
            target="_blank"
            rel="noreferrer"
            className="showcase-creator"
          >
            <img src={item.creator.avatar} alt="" className="showcase-creator-avatar" />
            <span>{item.creator.name}</span>
          </a>
          <a href={item.repoUrl} target="_blank" rel="noreferrer" className="showcase-repo-link">
            View README
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

function PreviewMd({ item }) {
  return (
    <div className="showcase-preview-md">
      {item.previewLines.map((line, i) => {
        let lineClass = 'showcase-md-line';
        if (line.startsWith('#')) lineClass += ' showcase-md-line--h';
        else if (line.startsWith('-')) lineClass += ' showcase-md-line--bullet';
        else if (line.startsWith('`')) lineClass += ' showcase-md-line--code';
      return (
          <div key={i} className={lineClass}>{line}</div>
        );
      })}
    </div>
  );
}

function HeroPreview() {
  const featured = SHOWCASE_ITEMS.filter(item => item.featured).slice(0, 3);

  return (
    <div className="showcase-hero-preview" aria-hidden="true">
      <div className="showcase-hero-window">
        <div className="showcase-preview-chrome">
          <span /><span /><span />
          <small>Community picks</small>
        </div>
        <div className="showcase-hero-stack">
          {featured.map((item, index) => (
            <div
              key={item.id}
              className={`showcase-hero-mini showcase-hero-mini--${index + 1}`}
              style={{ '--mini-accent': item.accent, '--mini-accent-2': item.accent2 }}
            >
              <div>
                <strong>{item.title}</strong>
                <p>{item.tagline}</p>
              </div>
              <span>{item.metrics.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getCategoryCount(categoryId) {
  if (categoryId === 'all') return SHOWCASE_ITEMS.length;
  return SHOWCASE_ITEMS.filter(item => item.category === categoryId).length;
}

export default function CommunityShowcasePage() {
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    if (category === 'all') return SHOWCASE_ITEMS;
    return SHOWCASE_ITEMS.filter(item => item.category === category);
  }, [category]);

  const featuredCount = SHOWCASE_ITEMS.filter(i => i.featured).length;

  return (
    <>
      <SEOHead
        title="Community Showcase — READMEForge"
        description="Discover READMEs built with ReadmeForge. Featured examples, creator profiles, and creative designs from the community."
      />
      <Navbar />

      <div className="showcase-page" style={{ paddingTop: 64 }}>
        <header className="showcase-hero">
          <div className="landing-container showcase-hero-inner">
            <div className="showcase-hero-copy">
              <div className="section-label-tag">Made with ReadmeForge</div>
              <h1 className="showcase-hero-title">
                Community <span className="accent-text">Showcase</span>
              </h1>
              <p className="showcase-hero-sub">
                Explore selected READMEs built with the platform, discover creative layouts, and visit the GitHub creators behind each project.
              </p>
              <div className="showcase-hero-actions">
                <Link to="/readme-maker" className="cta-btn cta-btn--primary">
                  Build a README
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <a
                  href="https://github.com/Mohit-368/ReadmeForge/issues/new"
                  target="_blank"
                  rel="noreferrer"
                  className="cta-btn cta-btn--secondary"
                >
                  Submit README
                </a>
              </div>
              <div className="showcase-hero-stats">
                <div className="showcase-hero-stat">
                  <strong>{SHOWCASE_ITEMS.length}</strong>
                  <span>Examples</span>
                </div>
                <div className="showcase-hero-stat-divider" />
                <div className="showcase-hero-stat">
                  <strong>{featuredCount}</strong>
                  <span>Featured</span>
                </div>
                <div className="showcase-hero-stat-divider" />
                <div className="showcase-hero-stat">
                  <strong>{SHOWCASE_CATEGORIES.length - 1}</strong>
                  <span>Categories</span>
                </div>
              </div>
            </div>
            <HeroPreview />
          </div>
        </header>

        <section className="showcase-filters-section">
          <div className="landing-container">
            <div className="showcase-section-heading">
              <div>
                <div className="section-label-tag">Featured submissions</div>
                <h2>Browse README examples</h2>
              </div>
              <p>Filter by project type and open any README or creator profile directly on GitHub.</p>
            </div>
            <div className="showcase-filters" role="tablist" aria-label="Filter showcase">
              {SHOWCASE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={category === cat.id}
                  className={`showcase-filter-btn${category === cat.id ? ' active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <span>{cat.label}</span>
                  <small>{getCategoryCount(cat.id)}</small>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="showcase-grid-section">
          <GridContainer filtered={filtered} />
        </section>

        <section className="showcase-cta-strip">
          <div className="landing-container">
            <div className="showcase-cta-box">
              <div className="showcase-submit-steps" aria-label="How to submit">
                <span>1. Build</span>
                <span>2. Export</span>
                <span>3. Share</span>
              </div>
              <h2>Built something great?</h2>
              <p>Share your README with the community and help new users discover real-world ReadmeForge examples.</p>
              <div className="showcase-cta-actions">
                <Link to="/readme-maker" className="cta-btn cta-btn--primary">
                  Start Building
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <a
                  href="https://github.com/Mohit-368/ReadmeForge/issues/new"
                  target="_blank"
                  rel="noreferrer"
                  className="cta-btn cta-btn--secondary"
                >
                  Submit yours
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

function GridContainer({ filtered }) {
  return (
    <div className="landing-container">
      {filtered.length === 0 ? (
        <p className="showcase-empty">No examples in this category yet.</p>
      ) : (
        <div className="showcase-grid">
          {filtered.map(item => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
