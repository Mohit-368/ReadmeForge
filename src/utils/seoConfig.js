export const SITE_URL = 'https://makeareadme.netlify.app';
export const SITE_NAME = 'READMEForge';
export const DEFAULT_TITLE = 'READMEForge - Generate Professional GitHub READMEs in 30 Seconds';
export const DEFAULT_DESCRIPTION =
  'READMEForge is a free, open-source README generator with live preview, templates, quality scoring, and one-click export.';
export const DEFAULT_KEYWORDS = [
  'README generator',
  'GitHub README maker',
  'open source README tool',
  'markdown editor',
  'developer documentation',
  'project README template',
];

export const seoPages = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
  },
  '/readme-maker': {
    title: 'README Maker - Build a Professional README with READMEForge',
    description:
      'Create a polished GitHub README with live preview, smart templates, badges, screenshots, and one-click Markdown export.',
    keywords: [
      'README maker',
      'GitHub profile README',
      'README template generator',
      'Markdown README editor',
      'developer portfolio README',
    ],
  },
  '/how-to-use': {
    title: 'How To Use READMEForge - README Generator Guide',
    description:
      'Learn how to use READMEForge templates, sections, quality scoring, live preview, and export tools to create a better project README.',
    keywords: [
      'READMEForge guide',
      'how to write README',
      'README best practices',
      'GitHub documentation guide',
      'Markdown guide',
    ],
  },
};

export function absoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`;
}

export function createWebAppSchema(path = '/') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: absoluteUrl(path),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description: DEFAULT_DESCRIPTION,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Person',
      name: 'Mohit Kumar',
      url: 'https://github.com/Mohit-368',
    },
  };
}
