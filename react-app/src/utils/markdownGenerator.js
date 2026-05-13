// Markdown generator — 
// Receives the full state object instead of reading from DOM

import { convertStructure } from './structureConverter';

export function generateMarkdown(state) {
  const { fields, sections, selectedTechs, selectedBadges, screenshots, license } = state;

  const f = (id) => (fields[id] || '').trim();

  var name = f('projName') || 'My Project';
  var tagline = f('tagline');
  var ghUser = f('ghUser') || f('authorGh') || 'username';
  var repoSlug = f('repoSlug') || name.toLowerCase().replace(/\s+/g, '-');
  var desc = f('description');
  var demoUrl = f('demoUrl');
  var features = f('features');
  var prereqs = f('prereqs');
  var installCmds = f('installCmds');
  var envVars = f('envVars');
  var usageCmd = f('usageCmd');
  var rawStruct = f('rawStructure');
  var videoUrl = f('videoUrl');
  var imageUrls = f('imageUrls');
  var apiDocs = f('apiDocs');
  var apiBase = f('apiBase');
  var contribNotes = f('contribNotes');
  var authorName = f('authorName');
  var authorGh = f('authorGh');
  var authorEmail = f('authorEmail');
  var authorLi = f('authorLinkedin');
  var authorWeb = f('authorWebsite');
  var customTech = f('customTech');
  var supportMsg = f('supportMsg');
  var supportBmac = f('supportBmac');
  var supportKofi = f('supportKofi');
  var supportPatreon = f('supportPatreon');
  var supportGhSponsors = f('supportGhSponsors');

  var md = '';
  var on = (id) => sections[id];

  // ─ SECTION 1: Title, Badges & Table of Contents ─
  if (on('title')) {
    md += '# ' + name + '\n\n';
    if (tagline) md += '> **' + tagline + '**\n\n';
    var badges = [];
    if (selectedBadges.has('license') && license !== 'none')
      badges.push('[![License](https://img.shields.io/badge/license-' + encodeURIComponent(license) + '-green.svg)](LICENSE)');
    if (selectedBadges.has('stars'))
      badges.push('[![Stars](https://img.shields.io/github/stars/' + ghUser + '/' + repoSlug + '?style=social)](https://github.com/' + ghUser + '/' + repoSlug + ')');
    if (selectedBadges.has('forks'))
      badges.push('[![Forks](https://img.shields.io/github/forks/' + ghUser + '/' + repoSlug + '?style=social)](https://github.com/' + ghUser + '/' + repoSlug + '/fork)');
    if (selectedBadges.has('issues'))
      badges.push('[![Issues](https://img.shields.io/github/issues/' + ghUser + '/' + repoSlug + ')](https://github.com/' + ghUser + '/' + repoSlug + '/issues)');
    if (selectedBadges.has('prs'))
      badges.push('[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/' + ghUser + '/' + repoSlug + '/pulls)');
    if (selectedBadges.has('build'))
      badges.push('![Build](https://img.shields.io/badge/build-passing-brightgreen)');
    if (selectedBadges.has('coverage'))
      badges.push('![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)');
    if (selectedBadges.has('version'))
      badges.push('![Version](https://img.shields.io/badge/version-1.0.0-blue)');
    if (badges.length) md += badges.join(' ') + '\n\n';
    md += '---\n\n';
    md += '## 📋 Table of Contents\n\n';
    if (on('description')) md += '- [Description](#-description)\n';
    if (on('features')) md += '- [Features](#-features)\n';
    if (on('techstack')) md += '- [Tech Stack](#️-tech-stack)\n';
    if (on('installation')) md += '- [Installation](#-installation)\n';
    if (on('structure')) md += '- [Project Structure](#-project-structure)\n';
    if (on('screenshots')) md += '- [Screenshots](#️-screenshots)\n';
    if (on('api')) md += '- [API Reference](#-api-reference)\n';
    if (on('contributing')) md += '- [Contributing](#-contributing)\n';
    if (on('author')) md += '- [License](#-license)\n- [Author](#-author)\n';
    if (on('support')) md += '- [Support & Donation](#️-support--donation)\n';
    md += '\n---\n\n';
  }

  // ─ SECTION 2: Description ─
  if (on('description')) {
    md += '## 📌 Description\n\n';
    md += (desc || '_Add a description of your project here._') + '\n\n';
    if (demoUrl) md += '🔗 **Live Demo:** [' + demoUrl + '](' + demoUrl + ')\n\n';
    md += '---\n\n';
  }

  // ─ SECTION 3: Features ─
  if (on('features') && features) {
    md += '## ✨ Features\n\n';
    features.split('\n').forEach(function (line) {
      var l = line.trimEnd();
      if (l.trim().startsWith('###')) md += '\n' + l.trim() + '\n';
      else if (l.trim()) md += (l.trim().startsWith('-') ? l : '- ' + l.trim()) + '\n';
    });
    md += '\n---\n\n';
  }

  // ─ SECTION 4: Tech Stack ─
  if (on('techstack')) {
    var allTech = Array.from(selectedTechs);
    if (customTech) customTech.split(',').forEach(function (t) { var tr = t.trim(); if (tr) allTech.push(tr); });
    if (allTech.length) {
      md += '## 🛠️ Tech Stack\n\n| Layer | Technology |\n|---|---|\n';
      var front = allTech.filter(t => ['React','Vue','Next.js','TypeScript','JavaScript','Tailwind','HTML','CSS'].includes(t));
      var back = allTech.filter(t => ['Node.js','Express','Django','FastAPI','Flask','Spring','Go','Python','Rust','Java','C++'].includes(t));
      var db = allTech.filter(t => ['PostgreSQL','MySQL','MongoDB','SQLite','Redis'].includes(t));
      var infra = allTech.filter(t => ['Docker','Kubernetes','AWS','GCP','Azure','Nginx','Linux'].includes(t));
      var ml = allTech.filter(t => ['TensorFlow','PyTorch','GraphQL'].includes(t));
      var rest = allTech.filter(t => ![].concat(front,back,db,infra,ml).includes(t));
      if (front.length) md += '| Frontend | ' + front.join(', ') + ' |\n';
      if (back.length) md += '| Backend  | ' + back.join(', ') + ' |\n';
      if (db.length) md += '| Database | ' + db.join(', ') + ' |\n';
      if (ml.length) md += '| AI / ML  | ' + ml.join(', ') + ' |\n';
      if (infra.length) md += '| DevOps   | ' + infra.join(', ') + ' |\n';
      if (rest.length) md += '| Other    | ' + rest.join(', ') + ' |\n';
      md += '\n---\n\n';
    }
  }

  // ─ SECTION 5: Installation ─
  if (on('installation')) {
    md += '## 🚀 Installation\n\n';
    if (prereqs) md += '**Prerequisites:** ' + prereqs + '\n\n';
    if (installCmds) {
      md += '```bash\n' + installCmds + '\n```\n\n';
    } else {
      md += '```bash\ngit clone https://github.com/' + ghUser + '/' + repoSlug + '.git\ncd ' + repoSlug + '\n```\n\n';
    }
    if (envVars) md += '**Environment Variables** — create a `.env` file:\n\n```env\n' + envVars + '\n```\n\n';
    md += '---\n\n';
  }

  // ─ SECTION 6: Usage (inside Installation) ─
  if (on('installation') && usageCmd) {
    md += '## 💻 Usage\n\n```bash\n' + usageCmd + '\n```\n\n---\n\n';
  }

  // ─ SECTION 7: Project Structure ─
  if (on('structure') && rawStruct.trim()) {
    md += '## 📁 Project Structure\n\n```\n' + convertStructure(rawStruct, name) + '\n```\n\n---\n\n';
  }

  // ─ SECTION 8: Screenshots ─
  if (on('screenshots')) {
    var hasContent = videoUrl || screenshots.length || imageUrls.trim();
    if (hasContent) {
      md += '## 🖼️ Screenshots\n\n';
      if (videoUrl) md += '▶️ **Demo Video:** [Watch Here](' + videoUrl + ')\n\n';
      screenshots.forEach(function (ss) {
        var label = ss.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        md += '### ' + label + '\n\n![' + label + '](' + ss.dataUrl + ')\n\n';
      });
      if (imageUrls.trim()) {
        imageUrls.split('\n').filter(l => l.trim()).forEach(function (line) {
          var parts = line.split('|').map(p => p.trim());
          if (parts.length >= 2) md += '### ' + parts[0] + '\n\n![' + parts[0] + '](' + parts[1] + ')\n\n';
          else if (parts[0]) md += '![Screenshot](' + parts[0] + ')\n\n';
        });
      }
      md += '---\n\n';
    }
  }

  // ─ SECTION 9: API Reference ─
  if (on('api') && apiDocs.trim()) {
    md += '## ⚡ API Reference\n\n';
    if (apiBase) md += '**Base URL:** `' + apiBase + '`\n\n';
    md += '| Method | Endpoint | Description |\n|--------|----------|-------------|\n';
    apiDocs.split('\n').filter(l => l.trim()).forEach(function (line) {
      var parts = line.split('|').map(p => p.trim());
      if (parts.length >= 2) {
        var ep = parts[0].split(' ');
        md += '| `' + ep[0] + '` | `' + ep.slice(1).join(' ') + '` | ' + parts[1] + ' |\n';
      }
    });
    md += '\n---\n\n';
  }

  // ─ SECTION 10: Contributing ─
  if (on('contributing')) {
    md += '## 🤝 Contributing\n\nContributions are always welcome!\n\n';
    md += '1. Fork the repository\n';
    md += '2. Create your branch: `git checkout -b feature/amazing-feature`\n';
    md += '3. Commit your changes: `git commit -m "Add amazing feature"`\n';
    md += '4. Push to the branch: `git push origin feature/amazing-feature`\n';
    md += '5. Open a Pull Request\n\n';
    if (contribNotes) md += contribNotes + '\n\n';
    md += '---\n\n';
  }

  // ─ SECTION 11: License & Author ─
  if (on('author')) {
    if (license !== 'none')
      md += '## 📄 License\n\nThis project is licensed under the **[' + license + ' License](LICENSE)**.\n\n---\n\n';
    md += '## 👤 Author\n\n';
    var displayName = authorName || authorGh || ghUser;
    md += '**' + displayName + '**\n\n';
    if (authorGh) md += '- 🐙 GitHub: [@' + authorGh + '](https://github.com/' + authorGh + ')\n';
    if (authorEmail) md += '- 📧 Email: [' + authorEmail + '](mailto:' + authorEmail + ')\n';
    if (authorLi) md += '- 💼 LinkedIn: [' + displayName + '](' + authorLi + ')\n';
    if (authorWeb) md += '- 🌐 Website: [' + authorWeb + '](' + authorWeb + ')\n';
    md += '\n---\n\n';
    md += '> Made with ❤️ by [' + displayName + '](https://github.com/' + (authorGh || ghUser) + ')\n';
  }

  // ─ SECTION 12: Support ─
  if (on('support')) {
    var hasSupportUrls = supportBmac || supportKofi || supportPatreon || supportGhSponsors;
    if (supportMsg || hasSupportUrls) {
      md += '## ❤️ Support & Donation\n\n';
      if (supportMsg) { md += supportMsg + '\n\n'; }
      else if (hasSupportUrls) { md += 'If you find this project helpful, please consider supporting its development:\n\n'; }
      var supportLinks = [];
      if (supportBmac) supportLinks.push('[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/' + supportBmac + ')');
      if (supportKofi) supportLinks.push('[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/' + supportKofi + ')');
      if (supportPatreon) supportLinks.push('[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/' + supportPatreon + ')');
      if (supportGhSponsors) supportLinks.push('[![GitHub Sponsors](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#EA4AAA)](https://github.com/sponsors/' + supportGhSponsors + ')');
      if (supportLinks.length > 0) md += supportLinks.join(' ') + '\n\n';
      md += '---\n\n';
    }
  }

  return md;
}
