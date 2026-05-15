import { convertStructure } from './structureUtils.js';

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const BADGE_COLORS = {
  brightgreen: '#22c55e', green: '#22c55e', yellowgreen: '#84cc16',
  yellow: '#eab308', orange: '#f97316', red: '#ef4444',
  blue: '#3b82f6', lightgrey: '#94a3b8', grey: '#64748b',
  gray: '#64748b', blueviolet: '#8b5cf6', ff69b4: '#ec4899',
};

export function shieldToBadge(label, url) {
  const isShield = url.indexOf('shields.io') !== -1;
  if (!isShield)
    return `<span class="gh-badge" style="background:#555;color:#fff">${label}</span>`;

  let color = '#555', left = label || '', right = '', m;
  m = url.match(/\/badge\/([^?]+)/);
  if (m) {
    const parts = m[1].split('-');
    if (parts.length >= 3) {
      right = parts[parts.length - 2];
      const col = parts[parts.length - 1].split('?')[0];
      color = BADGE_COLORS[col] || '#' + col;
      left = parts.slice(0, parts.length - 2).join(' ').replace(/_/g, ' ');
    } else if (parts.length === 2) {
      right = parts[1].split('?')[0];
      color = '#22c55e';
      left = parts[0].replace(/_/g, ' ');
    } else {
      left = parts[0].replace(/_/g, ' ');
      color = '#3b82f6';
    }
  }
  if (!m) {
    if (url.indexOf('/github/stars') !== -1) { left = 'Stars'; right = '★'; color = '#f59e0b'; }
    else if (url.indexOf('/github/forks') !== -1) { left = 'Forks'; right = '⑂'; color = '#8b5cf6'; }
    else if (url.indexOf('/github/issues') !== -1) { left = 'Issues'; right = '●'; color = '#ef4444'; }
    else { left = label; color = '#3b82f6'; }
  }
  left = decodeURIComponent(left).replace(/\+/g, ' ');
  right = decodeURIComponent(right).replace(/\+/g, ' ');
  return `<span class="gh-badge"><span class="gh-badge-left">${left}</span>${right ? `<span class="gh-badge-right" style="background:${color}">${right}</span>` : ''}</span>`;
}

export function md2html(md) {
  let h = md;
  h = h.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => `<pre><code>${esc(code)}</code></pre>`);
  h = h.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  h = h.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  h = h.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/__(.+?)__/g, '<strong>$1</strong>');
  h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
  h = h.replace(/^---$/gm, '<hr>');
  h = h.replace(/\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g, (_, alt, imgUrl, linkUrl) =>
    `<a href="${linkUrl}" target="_blank" style="text-decoration:none">${shieldToBadge(alt, imgUrl)}</a>`
  );
  h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, imgUrl) => {
    if (imgUrl.indexOf('shields.io') !== -1) return shieldToBadge(alt, imgUrl);
    return `<img src="${imgUrl}" alt="${alt}" style="max-width:100%;border-radius:4px;margin:4px 0">`;
  });
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  h = h.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  h = h.replace(/((\|.+\|\n)+)/g, (table) => {
    const rows = table.trim().split('\n');
    let out = '<table>';
    rows.forEach((row, i) => {
      if (row.match(/^\|[-| :]+\|$/)) return;
      const cells = row.split('|').filter((c, idx, a) => idx > 0 && idx < a.length - 1);
      const tag = i === 0 ? 'th' : 'td';
      out += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
    });
    return out + '</table>';
  });
  h = h.replace(/^- (.+)$/gm, '<li>$1</li>');
  h = h.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  h = h.replace(/(<li>[\s\S]*?<\/li>)/g, m => `<ul>${m}</ul>`);
  h = h.split('\n\n').map(block => {
    if (/^<(h[1-6]|ul|ol|li|pre|blockquote|hr|table)/.test(block.trim())) return block;
    return `<p>${block.replace(/\n/g, ' ')}</p>`;
  }).join('\n');
  return h;
}

export function generateMarkdown({ formData, sectionState, selectedTechs, selectedBadges, screenshots }) {
  const {
    projName, tagline, ghUser: ghUserRaw, repoSlug: repoSlugRaw,
    description, demoUrl, features, prereqs, installCmds, envVars,
    usageCmd, rawStructure, videoUrl, imageUrls, apiDocs, apiBase,
    contribNotes, license, authorName, authorGh, authorEmail,
    authorLinkedin, authorWebsite, customTech, supportMsg,
    supportBmac, supportKofi, supportPatreon, supportGhSponsors,
    abstractText, paperLink, datasetLink, methodology, bibtexCitation,
  } = formData;

  const name = projName || 'My Project';
  const ghUser = ghUserRaw || authorGh || 'username';
  const repoSlug = repoSlugRaw || name.toLowerCase().replace(/\s+/g, '-');
  const on = (id) => sectionState[id];
  let md = '';

  if (on('title')) {
    md += `# ${name}\n\n`;
    if (tagline) md += `> **${tagline}**\n\n`;
    const badges = [];
    if (selectedBadges.has('license') && license !== 'none')
      badges.push(`[![License](https://img.shields.io/badge/license-${encodeURIComponent(license)}-green.svg)](LICENSE)`);
    if (selectedBadges.has('stars'))
      badges.push(`[![Stars](https://img.shields.io/github/stars/${ghUser}/${repoSlug}?style=social)](https://github.com/${ghUser}/${repoSlug})`);
    if (selectedBadges.has('forks'))
      badges.push(`[![Forks](https://img.shields.io/github/forks/${ghUser}/${repoSlug}?style=social)](https://github.com/${ghUser}/${repoSlug}/fork)`);
    if (selectedBadges.has('issues'))
      badges.push(`[![Issues](https://img.shields.io/github/issues/${ghUser}/${repoSlug})](https://github.com/${ghUser}/${repoSlug}/issues)`);
    if (selectedBadges.has('prs'))
      badges.push(`[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/${ghUser}/${repoSlug}/pulls)`);
    if (selectedBadges.has('build'))
      badges.push(`![Build](https://img.shields.io/badge/build-passing-brightgreen)`);
    if (selectedBadges.has('coverage'))
      badges.push(`![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)`);
    if (selectedBadges.has('version'))
      badges.push(`![Version](https://img.shields.io/badge/version-1.0.0-blue)`);
    if (badges.length) md += badges.join(' ') + '\n\n';
    md += '---\n\n';
    md += '## 📋 Table of Contents\n\n';
    if (on('description')) md += '- [Description](#-description)\n';
    if (on('academic')) md += '- [Academic / Research Details](#academic--research-details)\n';
    if (on('features')) md += '- [Features](#-features)\n';
    if (on('techstack')) md += '- [Tech Stack](#-tech-stack)\n';
    if (on('installation')) md += '- [Installation](#-installation)\n';
    if (on('structure')) md += '- [Project Structure](#-project-structure)\n';
    if (on('screenshots')) md += '- [Screenshots](#-screenshots)\n';
    if (on('api')) md += '- [API Reference](#-api-reference)\n';
    if (on('contributing')) md += '- [Contributing](#-contributing)\n';
    if (on('author')) md += '- [License](#-license)\n- [Author](#-author)\n';
    if (on('support')) md += '- [Support & Donation](#️-support--donation)\n';
    md += '\n---\n\n';
  }

  if (on('description')) {
    md += '## 📌 Description\n\n';
    md += (description || '_Add a description of your project here._') + '\n\n';
    if (demoUrl) md += `🔗 **Live Demo:** [${demoUrl}](${demoUrl})\n\n`;
    md += '---\n\n';
  }

  if (on('academic')) {
    const hasAcademicContent = abstractText || paperLink || datasetLink || methodology || bibtexCitation;
    if (hasAcademicContent) {
      md += '## Academic / Research Details\n\n';
      const academicBadges = [];
      if (paperLink) academicBadges.push(`[![Paper](https://img.shields.io/badge/Paper-Read%20Now-blue)](${paperLink})`);
      if (datasetLink) academicBadges.push(`[![Dataset](https://img.shields.io/badge/Dataset-Access-green)](${datasetLink})`);
      if (academicBadges.length) md += academicBadges.join(' ') + '\n\n';
      if (abstractText) md += `### Abstract\n\n${abstractText}\n\n`;
      if (paperLink) md += `### Paper Link\n\n[${paperLink}](${paperLink})\n\n`;
      if (datasetLink) md += `### Dataset Access\n\n[${datasetLink}](${datasetLink})\n\n`;
      if (methodology) {
        md += '### Methodology\n\n';
        methodology.split('\n').forEach(line => {
          const l = line.trimEnd();
          if (l.trim().startsWith('###')) md += '\n' + l.trim() + '\n';
          else if (l.trim()) md += (l.trim().startsWith('-') ? l : '- ' + l.trim()) + '\n';
        });
        md += '\n';
      }
      if (bibtexCitation) md += `### Citation\n\n\`\`\`bibtex\n${bibtexCitation}\n\`\`\`\n\n`;
      md += '---\n\n';
    }
  }

  if (on('features') && features) {
    md += '## ✨ Features\n\n';
    features.split('\n').forEach(line => {
      const l = line.trimEnd();
      if (l.trim().startsWith('###')) md += '\n' + l.trim() + '\n';
      else if (l.trim()) md += (l.trim().startsWith('-') ? l : '- ' + l.trim()) + '\n';
    });
    md += '\n---\n\n';
  }

  if (on('techstack')) {
    const allTech = Array.from(selectedTechs);
    if (customTech) customTech.split(',').forEach(t => { const tr = t.trim(); if (tr) allTech.push(tr); });
    if (allTech.length) {
      md += '## 🛠️ Tech Stack\n\n| Layer | Technology |\n|---|---|\n';
      const front = allTech.filter(t => ['React','Vue','Next.js','TypeScript','JavaScript','Tailwind','HTML','CSS'].includes(t));
      const back = allTech.filter(t => ['Node.js','Express','Django','FastAPI','Flask','Spring','Go','Python','Rust','Java','C++'].includes(t));
      const db = allTech.filter(t => ['PostgreSQL','MySQL','MongoDB','SQLite','Redis'].includes(t));
      const infra = allTech.filter(t => ['Docker','Kubernetes','AWS','GCP','Azure','Nginx','Linux'].includes(t));
      const ml = allTech.filter(t => ['TensorFlow','PyTorch','GraphQL'].includes(t));
      const rest = allTech.filter(t => ![...front,...back,...db,...infra,...ml].includes(t));
      if (front.length) md += `| Frontend | ${front.join(', ')} |\n`;
      if (back.length) md += `| Backend  | ${back.join(', ')} |\n`;
      if (db.length) md += `| Database | ${db.join(', ')} |\n`;
      if (ml.length) md += `| AI / ML  | ${ml.join(', ')} |\n`;
      if (infra.length) md += `| DevOps   | ${infra.join(', ')} |\n`;
      if (rest.length) md += `| Other    | ${rest.join(', ')} |\n`;
      md += '\n---\n\n';
    }
  }

  if (on('installation')) {
    md += '## 🚀 Installation\n\n';
    if (prereqs) md += `**Prerequisites:** ${prereqs}\n\n`;
    if (installCmds) {
      md += '```bash\n' + installCmds + '\n```\n\n';
    } else {
      md += `\`\`\`bash\ngit clone https://github.com/${ghUser}/${repoSlug}.git\ncd ${repoSlug}\n\`\`\`\n\n`;
    }
    if (envVars) md += '**Environment Variables** — create a `.env` file:\n\n```env\n' + envVars + '\n```\n\n';
    if (usageCmd) md += '## 💻 Usage\n\n```bash\n' + usageCmd + '\n```\n\n';
    md += '---\n\n';
  }

  if (on('structure') && rawStructure.trim()) {
    md += '## 📁 Project Structure\n\n```\n' + convertStructure(rawStructure, name) + '\n```\n\n---\n\n';
  }

  if (on('screenshots')) {
    const hasContent = videoUrl || screenshots.length || imageUrls.trim();
    if (hasContent) {
      md += '## 🖼️ Screenshots\n\n';
      if (videoUrl) md += `▶️ **Demo Video:** [Watch Here](${videoUrl})\n\n`;
      screenshots.forEach(ss => {
        const label = ss.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        md += `### ${label}\n\n![${label}](${ss.dataUrl})\n\n`;
      });
      if (imageUrls.trim()) {
        imageUrls.split('\n').filter(l => l.trim()).forEach(line => {
          const parts = line.split('|').map(p => p.trim());
          if (parts.length >= 2) md += `### ${parts[0]}\n\n![${parts[0]}](${parts[1]})\n\n`;
          else if (parts[0]) md += `![Screenshot](${parts[0]})\n\n`;
        });
      }
      md += '---\n\n';
    }
  }

  if (on('api') && apiDocs.trim()) {
    md += '## ⚡ API Reference\n\n';
    if (apiBase) md += `**Base URL:** \`${apiBase}\`\n\n`;
    md += '| Method | Endpoint | Description |\n|--------|----------|-------------|\n';
    apiDocs.split('\n').filter(l => l.trim()).forEach(line => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 2) {
        const ep = parts[0].split(' ');
        md += `| \`${ep[0]}\` | \`${ep.slice(1).join(' ')}\` | ${parts[1]} |\n`;
      }
    });
    md += '\n---\n\n';
  }

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

  if (on('author')) {
    if (license !== 'none')
      md += `## 📄 License\n\nThis project is licensed under the **[${license} License](LICENSE)**.\n\n---\n\n`;
    md += '## 👤 Author\n\n';
    const displayName = authorName || authorGh || ghUser;
    md += `**${displayName}**\n\n`;
    if (authorGh) md += `- 🐙 GitHub: [@${authorGh}](https://github.com/${authorGh})\n`;
    if (authorEmail) md += `- 📧 Email: [${authorEmail}](mailto:${authorEmail})\n`;
    if (authorLinkedin) md += `- 💼 LinkedIn: [${displayName}](${authorLinkedin})\n`;
    if (authorWebsite) md += `- 🌐 Website: [${authorWebsite}](${authorWebsite})\n`;
    md += '\n---\n\n';
    md += `> Made with ❤️ by [${displayName}](https://github.com/${authorGh || ghUser})\n`;
  }

  if (on('support')) {
    const hasSupportUrls = supportBmac || supportKofi || supportPatreon || supportGhSponsors;
    if (supportMsg || hasSupportUrls) {
      md += '## ❤️ Support & Donation\n\n';
      if (supportMsg) {
        md += supportMsg + '\n\n';
      } else {
        md += 'If you find this project helpful, please consider supporting its development:\n\n';
      }
      const supportLinks = [];
      if (supportBmac) supportLinks.push(`[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/${supportBmac})`);
      if (supportKofi) supportLinks.push(`[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/${supportKofi})`);
      if (supportPatreon) supportLinks.push(`[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/${supportPatreon})`);
      if (supportGhSponsors) supportLinks.push(`[![GitHub Sponsors](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#EA4AAA)](https://github.com/sponsors/${supportGhSponsors})`);
      if (supportLinks.length) md += supportLinks.join(' ') + '\n\n';
      md += '---\n\n';
    }
  }

  return md;
}

export function getWordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(w => w && w !== '###' && w !== '-').length;
}
