import { useEffect } from 'react';

const DEFAULT_SITE_URL = 'https://readmeforge.netlify.app';
const DEFAULT_IMAGE = '/og-image.png';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertCanonical(href) {
  let canonical = document.head.querySelector('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', href);
}

function upsertJsonLd(data) {
  const id = 'readmeforge-jsonld';
  let script = document.getElementById(id);

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

export default function SEOHead({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  structuredData,
}) {
  useEffect(() => {
    const siteUrl = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
    const pathname = path || window.location.pathname || '/';
    const canonicalUrl = `${siteUrl}${pathname === '/' ? '/' : pathname}`;
    const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
    const pageTitle = title || 'READMEForge — Professional README Generator';
    const pageDescription = description || 'Create professional GitHub README files with templates, live preview, quality scoring, and one-click Markdown export.';

    document.title = pageTitle;

    upsertMeta('meta[name="description"]', { name: 'description', content: pageDescription });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow' });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'READMEForge' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: pageDescription });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: pageDescription });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });
    upsertCanonical(canonicalUrl);
    upsertJsonLd(
      structuredData || {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'READMEForge',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: canonicalUrl,
        description: pageDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    );
  }, [title, description, path, image, type, structuredData]);

  return null;
}
