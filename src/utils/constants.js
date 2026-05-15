export const SECTIONS = [
  { id: 'title', label: 'Project Title', icon: '📌', el: 'sec-title', default: true },
  { id: 'description', label: 'Description', icon: '📋', el: 'sec-description', default: true },
  { id: 'features', label: 'Features', icon: '✨', el: 'sec-features', default: true },
  { id: 'academic', label: 'Academic Details', icon: '📚', el: 'sec-academic', default: false },
  { id: 'techstack', label: 'Tech Stack', icon: '🛠️', el: 'sec-techstack', default: true },
  { id: 'installation', label: 'Installation', icon: '🚀', el: 'sec-installation', default: true },
  { id: 'structure', label: 'Folder Structure', icon: '📁', el: 'sec-structure', default: true },
  { id: 'screenshots', label: 'Screenshots', icon: '🖼️', el: 'sec-screenshots', default: true },
  { id: 'api', label: 'API Docs', icon: '⚡', el: 'sec-api', default: false },
  { id: 'contributing', label: 'Contributing', icon: '🤝', el: 'sec-contributing', default: true },
  { id: 'author', label: 'License & Author', icon: '👤', el: 'sec-author', default: true },
  { id: 'support', label: 'Support & Donation', icon: '❤️', el: 'sec-support', default: false },
];

export const TECHS = [
  { label: 'Python', emoji: '🐍' },
  { label: 'JavaScript', emoji: '🟨' },
  { label: 'TypeScript', emoji: '💙' },
  { label: 'React', emoji: '⚛️' },
  { label: 'Next.js', emoji: '▲' },
  { label: 'Vue', emoji: '💚' },
  { label: 'Node.js', emoji: '🟢' },
  { label: 'Express', emoji: '🚂' },
  { label: 'Django', emoji: '🎸' },
  { label: 'FastAPI', emoji: '⚡' },
  { label: 'Flask', emoji: '🌶️' },
  { label: 'Spring', emoji: '🍃' },
  { label: 'Java', emoji: '☕' },
  { label: 'Go', emoji: '🐹' },
  { label: 'Rust', emoji: '🦀' },
  { label: 'C++', emoji: '⚙️' },
  { label: 'PostgreSQL', emoji: '🐘' },
  { label: 'MySQL', emoji: '🐬' },
  { label: 'MongoDB', emoji: '🍃' },
  { label: 'Redis', emoji: '🔴' },
  { label: 'SQLite', emoji: '🗃️' },
  { label: 'Docker', emoji: '🐳' },
  { label: 'Kubernetes', emoji: '☸️' },
  { label: 'AWS', emoji: '☁️' },
  { label: 'GCP', emoji: '🌥️' },
  { label: 'Azure', emoji: '💠' },
  { label: 'TensorFlow', emoji: '🧠' },
  { label: 'PyTorch', emoji: '🔥' },
  { label: 'Tailwind', emoji: '💨' },
  { label: 'GraphQL', emoji: '◈' },
  { label: 'Nginx', emoji: '🌐' },
  { label: 'Linux', emoji: '🐧' },
];

export const BADGES = [
  { id: 'license', label: 'License' },
  { id: 'stars', label: '⭐ Stars' },
  { id: 'forks', label: '🍴 Forks' },
  { id: 'issues', label: 'Issues' },
  { id: 'prs', label: 'PRs Welcome' },
  { id: 'build', label: 'Build Passing' },
  { id: 'coverage', label: 'Coverage' },
  { id: 'version', label: 'Version' },
];

export const DEFAULT_BADGES = new Set(['license', 'stars', 'prs']);

export const TEMPLATES = {
  webapp: {
    name: 'My Web App',
    tag: 'A modern, full-stack web application',
    techs: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    desc: 'A full-stack web application built with modern technologies. Features user authentication, real-time updates, and a responsive UI.',
    features: '### 🔐 Authentication\n- JWT-based login & registration\n- OAuth support\n\n### 📊 Dashboard\n- Real-time data visualization\n- Export to CSV\n\n### 🌐 API\n- RESTful API with full CRUD\n- Rate limiting & caching',
  },
  ml: {
    name: 'ML Project',
    tag: 'Machine learning model for image classification',
    techs: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
    desc: 'A machine learning project that achieves state-of-the-art results on benchmark datasets. Includes training pipeline, model evaluation, and a REST API for inference.',
    features: '### 🧠 Model\n- Custom CNN architecture\n- Transfer learning support\n\n### 📈 Training\n- Mixed precision training\n- Early stopping & checkpointing\n\n### ⚡ Inference API\n- FastAPI endpoint\n- Batch prediction support',
  },
  api: {
    name: 'Backend API',
    tag: 'Production-ready REST API with authentication',
    techs: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
    desc: 'A scalable backend API built for production. Includes authentication, caching, rate limiting, and comprehensive API documentation.',
    features: '### 🔑 Auth\n- JWT + refresh tokens\n- Role-based access control\n\n### ⚡ Performance\n- Redis caching\n- Query optimization\n\n### 📚 Docs\n- Swagger / OpenAPI docs\n- Postman collection',
  },
  cli: {
    name: 'CLI Tool',
    tag: 'A powerful command-line tool',
    techs: ['Python', 'Go'],
    desc: 'A command-line tool that helps developers automate repetitive tasks. Supports plugins, configuration files, and shell completions.',
    features: '### ⚙️ Commands\n- Multiple sub-commands\n- Interactive prompts\n\n### 🔌 Plugins\n- Plugin system\n- Custom hooks\n\n### 🐚 Shell\n- Bash/Zsh/Fish completions\n- Cross-platform support',
  },
  academic: {
    name: 'Research Project',
    tag: 'Reproducible research, paper artifacts, and dataset access',
    techs: ['Python', 'PyTorch'],
    desc: 'A research repository for sharing paper artifacts, reproducible experiments, dataset access details, and citation information.',
    features: '### Research Artifacts\n- Reproducible experiment scripts\n- Evaluation notebooks and figures\n\n### Results\n- Baseline comparisons\n- Ablation studies\n\n### Reuse\n- Dataset access instructions\n- BibTeX citation block',
    abstractText: 'This project investigates [research problem] using [method or model]. It provides reproducible code, dataset access instructions, and evaluation artifacts so students and researchers can inspect, cite, and extend the work.',
    methodology: '### Data Collection\n- Describe the dataset source, inclusion criteria, and preprocessing steps.\n\n### Experimental Setup\n- Document baselines, model configuration, hardware, and hyperparameters.\n\n### Evaluation\n- List the metrics, validation protocol, and statistical tests used.',
    paperLink: 'https://arxiv.org/abs/0000.00000',
    datasetLink: 'https://doi.org/10.0000/example-dataset',
    bibtexCitation: '@article{researchproject2026,\n  title={Research Project Title},\n  author={First Author and Second Author},\n  journal={Conference or Journal Name},\n  year={2026}\n}',
  },
  mobile: {
    name: 'Mobile App',
    tag: 'Cross-platform mobile app',
    techs: ['React', 'TypeScript', 'MongoDB'],
    desc: 'A cross-platform mobile application built with React Native. Features offline support, push notifications, and a native feel on both iOS and Android.',
    features: '### 📱 UI/UX\n- Native animations\n- Dark mode support\n\n### 🔔 Notifications\n- Push notifications\n- In-app messaging\n\n### 📡 Offline\n- Local data sync\n- Conflict resolution',
  },
  lib: {
    name: 'AwesomeLib',
    tag: 'A lightweight, zero-dependency library',
    techs: ['TypeScript', 'JavaScript'],
    desc: 'A lightweight, zero-dependency library that makes complex tasks simple. Tree-shakeable, fully typed, and battle-tested in production.',
    features: '### 🎯 Core\n- Zero dependencies\n- Tree-shakeable\n\n### 🔧 API\n- Fluent interface\n- Promise & callback support\n\n### 📦 Bundle\n- ESM + CJS + UMD\n- < 5kb gzipped',
  },
  hackathon: {
    name: 'HackProject',
    tag: 'Built in 24 hours at HackathonX 2025',
    techs: ['React', 'Python', 'FastAPI', 'PostgreSQL'],
    desc: 'Award-winning hackathon project built in 24 hours. Solves [problem] using [approach]. Won [prize] at [hackathon name].',
    features: '### 🏆 What We Built\n- Core feature 1\n- Core feature 2\n\n### 🚀 Tech Choices\n- Why we chose each tech\n- Architecture decisions\n\n### 🔮 Future Plans\n- Post-hackathon roadmap',
  },
  oss: {
    name: 'OpenProject',
    tag: 'An open-source tool loved by the community',
    techs: ['Python', 'Docker'],
    desc: 'An open-source project maintained by the community. We welcome contributions of all kinds — code, documentation, bug reports, and feature ideas.',
    features: '### ✨ Features\n- Feature 1\n- Feature 2\n\n### 🌍 Community\n- Active Discord\n- Weekly releases\n\n### 📖 Docs\n- Full documentation\n- Video tutorials',
  },
};

export const STORAGE_KEY = 'readmeforge-data';
export const PREVIEW_ZOOM_KEY = 'readmeforge-preview-zoom';
export const THEME_KEY = 'readmeforge-theme';
export const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export const FIELD_IDS = [
  'projName', 'tagline', 'ghUser', 'repoSlug', 'description', 'demoUrl',
  'features', 'prereqs', 'installCmds', 'envVars', 'usageCmd', 'rawStructure',
  'videoUrl', 'imageUrls', 'apiDocs', 'apiBase', 'contribNotes', 'authorName',
  'authorGh', 'authorEmail', 'authorLinkedin', 'authorWebsite', 'customTech',
  'supportMsg', 'supportBmac', 'supportKofi', 'supportPatreon', 'supportGhSponsors',
  'abstractText', 'paperLink', 'datasetLink', 'methodology', 'bibtexCitation',
];
