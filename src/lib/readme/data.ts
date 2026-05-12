export interface SectionDef {
  id: string;
  label: string;
  icon: string;
  default: boolean;
}

export const SECTIONS: SectionDef[] = [
  { id: "title", label: "Project Title", icon: "📌", default: true },
  { id: "description", label: "Description", icon: "📋", default: true },
  { id: "features", label: "Features", icon: "✨", default: true },
  { id: "techstack", label: "Tech Stack", icon: "🛠️", default: true },
  { id: "installation", label: "Installation", icon: "🚀", default: true },
  { id: "usage", label: "Usage", icon: "💻", default: true },
  { id: "structure", label: "Folder Structure", icon: "📁", default: true },
  { id: "screenshots", label: "Screenshots", icon: "🖼️", default: true },
  { id: "api", label: "API Docs", icon: "⚡", default: false },
  { id: "contributing", label: "Contributing", icon: "🤝", default: true },
  { id: "author", label: "License & Author", icon: "👤", default: true },
  { id: "support", label: "Support & Donation", icon: "❤️", default: false },
];

export const TECHS = [
  { label: "Python", emoji: "🐍" },
  { label: "JavaScript", emoji: "🟨" },
  { label: "TypeScript", emoji: "💙" },
  { label: "React", emoji: "⚛️" },
  { label: "Next.js", emoji: "▲" },
  { label: "Vue", emoji: "💚" },
  { label: "Node.js", emoji: "🟢" },
  { label: "Express", emoji: "🚂" },
  { label: "Django", emoji: "🎸" },
  { label: "FastAPI", emoji: "⚡" },
  { label: "Flask", emoji: "🌶️" },
  { label: "Spring", emoji: "🍃" },
  { label: "Java", emoji: "☕" },
  { label: "Go", emoji: "🐹" },
  { label: "Rust", emoji: "🦀" },
  { label: "C++", emoji: "⚙️" },
  { label: "PostgreSQL", emoji: "🐘" },
  { label: "MySQL", emoji: "🐬" },
  { label: "MongoDB", emoji: "🍃" },
  { label: "Redis", emoji: "🔴" },
  { label: "SQLite", emoji: "🗃️" },
  { label: "Docker", emoji: "🐳" },
  { label: "Kubernetes", emoji: "☸️" },
  { label: "AWS", emoji: "☁️" },
  { label: "GCP", emoji: "🌥️" },
  { label: "Azure", emoji: "💠" },
  { label: "TensorFlow", emoji: "🧠" },
  { label: "PyTorch", emoji: "🔥" },
  { label: "Tailwind", emoji: "💨" },
  { label: "GraphQL", emoji: "◈" },
  { label: "Nginx", emoji: "🌐" },
  { label: "Linux", emoji: "🐧" },
];

export const BADGES = [
  { id: "license", label: "License" },
  { id: "stars", label: "⭐ Stars" },
  { id: "forks", label: "🍴 Forks" },
  { id: "issues", label: "Issues" },
  { id: "prs", label: "PRs Welcome" },
  { id: "build", label: "Build Passing" },
  { id: "coverage", label: "Coverage" },
  { id: "version", label: "Version" },
];

export interface Template {
  name: string;
  tag: string;
  techs: string[];
  desc: string;
  features: string;
}

export const TEMPLATES: Record<string, Template> = {
  webapp: {
    name: "My Web App",
    tag: "A modern, full-stack web application",
    techs: ["React", "Node.js", "PostgreSQL", "Docker"],
    desc: "A full-stack web application built with modern technologies. Features user authentication, real-time updates, and a responsive UI.",
    features: "### 🔐 Authentication\n- JWT-based login & registration\n- OAuth support\n\n### 📊 Dashboard\n- Real-time data visualization\n- Export to CSV\n\n### 🌐 API\n- RESTful API with full CRUD\n- Rate limiting & caching",
  },
  ml: {
    name: "ML Project",
    tag: "Machine learning model for image classification",
    techs: ["Python", "TensorFlow", "FastAPI", "Docker"],
    desc: "A machine learning project that achieves state-of-the-art results on benchmark datasets. Includes training pipeline, model evaluation, and a REST API for inference.",
    features: "### 🧠 Model\n- Custom CNN architecture\n- Transfer learning support\n\n### 📈 Training\n- Mixed precision training\n- Early stopping & checkpointing\n\n### ⚡ Inference API\n- FastAPI endpoint\n- Batch prediction support",
  },
  api: {
    name: "Backend API",
    tag: "Production-ready REST API with authentication",
    techs: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker"],
    desc: "A scalable backend API built for production. Includes authentication, caching, rate limiting, and comprehensive API documentation.",
    features: "### 🔑 Auth\n- JWT + refresh tokens\n- Role-based access control\n\n### ⚡ Performance\n- Redis caching\n- Query optimization\n\n### 📚 Docs\n- Swagger / OpenAPI docs\n- Postman collection",
  },
  cli: {
    name: "CLI Tool",
    tag: "A powerful command-line tool",
    techs: ["Python", "Go"],
    desc: "A command-line tool that helps developers automate repetitive tasks. Supports plugins, configuration files, and shell completions.",
    features: "### ⚙️ Commands\n- Multiple sub-commands\n- Interactive prompts\n\n### 🔌 Plugins\n- Plugin system\n- Custom hooks\n\n### 🐚 Shell\n- Bash/Zsh/Fish completions\n- Cross-platform support",
  },
  mobile: {
    name: "Mobile App",
    tag: "Cross-platform mobile app",
    techs: ["React", "TypeScript", "MongoDB"],
    desc: "A cross-platform mobile application built with React Native. Features offline support, push notifications, and a native feel on both iOS and Android.",
    features: "### 📱 UI/UX\n- Native animations\n- Dark mode support\n\n### 🔔 Notifications\n- Push notifications\n- In-app messaging\n\n### 📡 Offline\n- Local data sync\n- Conflict resolution",
  },
  lib: {
    name: "AwesomeLib",
    tag: "A lightweight, zero-dependency library",
    techs: ["TypeScript", "JavaScript"],
    desc: "A lightweight, zero-dependency library that makes complex tasks simple. Tree-shakeable, fully typed, and battle-tested in production.",
    features: "### 🎯 Core\n- Zero dependencies\n- Tree-shakeable\n\n### 🔧 API\n- Fluent interface\n- Promise & callback support\n\n### 📦 Bundle\n- ESM + CJS + UMD\n- < 5kb gzipped",
  },
  hackathon: {
    name: "HackProject",
    tag: "Built in 24 hours at HackathonX 2025",
    techs: ["React", "Python", "FastAPI", "PostgreSQL"],
    desc: "Award-winning hackathon project built in 24 hours.",
    features: "### 🏆 What We Built\n- Core feature 1\n- Core feature 2",
  },
  oss: {
    name: "OpenProject",
    tag: "An open-source tool loved by the community",
    techs: ["Python", "Docker"],
    desc: "An open-source project maintained by the community.",
    features: "### ✨ Features\n- Feature 1\n- Feature 2",
  },
};

export const TEMPLATE_BUTTONS: { id: keyof typeof TEMPLATES; label: string }[] = [
  { id: "webapp", label: "🌐 Web App" },
  { id: "ml", label: "🤖 ML / AI" },
  { id: "api", label: "⚡ Backend API" },
  { id: "cli", label: "💻 CLI Tool" },
  { id: "mobile", label: "📱 Mobile App" },
  { id: "lib", label: "📦 Library" },
  { id: "hackathon", label: "🏆 Hackathon" },
  { id: "oss", label: "🔓 Open Source" },
];

export const LICENSES = ["MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "ISC", "Unlicense", "AGPL-3.0", "none"];
