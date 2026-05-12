import type { ReadmeState } from "./types";
import { convertStructure } from "./structure";

export function generateMarkdown(state: ReadmeState): string {
  const f = state.fields;
  const on = (id: string) => state.sections[id];
  const has = (arr: string[], id: string) => arr.includes(id);

  const name = f.projName || "My Project";
  const ghUser = f.ghUser || f.authorGh || "username";
  const repoSlug = f.repoSlug || name.toLowerCase().replace(/\s+/g, "-");
  let md = "";

  if (on("title")) {
    md += `# ${name}\n\n`;
    if (f.tagline) md += `> **${f.tagline}**\n\n`;
    const badges: string[] = [];
    if (has(state.badges, "license") && f.license !== "none")
      badges.push(`[![License](https://img.shields.io/badge/license-${encodeURIComponent(f.license)}-green.svg)](LICENSE)`);
    if (has(state.badges, "stars"))
      badges.push(`[![Stars](https://img.shields.io/github/stars/${ghUser}/${repoSlug}?style=social)](https://github.com/${ghUser}/${repoSlug})`);
    if (has(state.badges, "forks"))
      badges.push(`[![Forks](https://img.shields.io/github/forks/${ghUser}/${repoSlug}?style=social)](https://github.com/${ghUser}/${repoSlug}/fork)`);
    if (has(state.badges, "issues"))
      badges.push(`[![Issues](https://img.shields.io/github/issues/${ghUser}/${repoSlug})](https://github.com/${ghUser}/${repoSlug}/issues)`);
    if (has(state.badges, "prs"))
      badges.push(`[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/${ghUser}/${repoSlug}/pulls)`);
    if (has(state.badges, "build"))
      badges.push(`![Build](https://img.shields.io/badge/build-passing-brightgreen)`);
    if (has(state.badges, "coverage"))
      badges.push(`![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)`);
    if (has(state.badges, "version"))
      badges.push(`![Version](https://img.shields.io/badge/version-1.0.0-blue)`);
    if (badges.length) md += badges.join(" ") + "\n\n";
    md += "---\n\n## 📋 Table of Contents\n\n";
    if (on("description")) md += "- [Description](#-description)\n";
    if (on("features")) md += "- [Features](#-features)\n";
    if (on("techstack")) md += "- [Tech Stack](#-tech-stack)\n";
    if (on("installation")) md += "- [Installation](#-installation)\n";
    if (on("usage")) md += "- [Usage](#-usage)\n";
    if (on("structure")) md += "- [Project Structure](#-project-structure)\n";
    if (on("screenshots")) md += "- [Screenshots](#-screenshots)\n";
    if (on("api")) md += "- [API Reference](#-api-reference)\n";
    if (on("contributing")) md += "- [Contributing](#-contributing)\n";
    if (on("author")) md += "- [License](#-license)\n- [Author](#-author)\n";
    if (on("support")) md += "- [Support & Donation](#️-support--donation)\n";
    md += "\n---\n\n";
  }

  if (on("description")) {
    md += "## 📌 Description\n\n";
    md += (f.description || "_Add a description of your project here._") + "\n\n";
    if (f.demoUrl) md += `🔗 **Live Demo:** [${f.demoUrl}](${f.demoUrl})\n\n`;
    md += "---\n\n";
  }

  if (on("features") && f.features) {
    md += "## ✨ Features\n\n";
    f.features.split("\n").forEach((line) => {
      const l = line.trimEnd();
      if (l.trim().startsWith("###")) md += "\n" + l.trim() + "\n";
      else if (l.trim()) md += (l.trim().startsWith("-") ? l : "- " + l.trim()) + "\n";
    });
    md += "\n---\n\n";
  }

  if (on("techstack")) {
    const all = [...state.techs];
    if (f.customTech) f.customTech.split(",").forEach((t) => { const tr = t.trim(); if (tr) all.push(tr); });
    if (all.length) {
      md += "## 🛠️ Tech Stack\n\n| Layer | Technology |\n|---|---|\n";
      const front = all.filter((t) => ["React","Vue","Next.js","TypeScript","JavaScript","Tailwind","HTML","CSS"].includes(t));
      const back = all.filter((t) => ["Node.js","Express","Django","FastAPI","Flask","Spring","Go","Python","Rust","Java","C++"].includes(t));
      const db = all.filter((t) => ["PostgreSQL","MySQL","MongoDB","SQLite","Redis"].includes(t));
      const infra = all.filter((t) => ["Docker","Kubernetes","AWS","GCP","Azure","Nginx","Linux"].includes(t));
      const ml = all.filter((t) => ["TensorFlow","PyTorch","GraphQL"].includes(t));
      const used = new Set([...front, ...back, ...db, ...infra, ...ml]);
      const rest = all.filter((t) => !used.has(t));
      if (front.length) md += `| Frontend | ${front.join(", ")} |\n`;
      if (back.length) md += `| Backend  | ${back.join(", ")} |\n`;
      if (db.length) md += `| Database | ${db.join(", ")} |\n`;
      if (ml.length) md += `| AI / ML  | ${ml.join(", ")} |\n`;
      if (infra.length) md += `| DevOps   | ${infra.join(", ")} |\n`;
      if (rest.length) md += `| Other    | ${rest.join(", ")} |\n`;
      md += "\n---\n\n";
    }
  }

  if (on("installation")) {
    md += "## 🚀 Installation\n\n";
    if (f.prereqs) md += `**Prerequisites:** ${f.prereqs}\n\n`;
    if (f.installCmds) md += "```bash\n" + f.installCmds + "\n```\n\n";
    else md += `\`\`\`bash\ngit clone https://github.com/${ghUser}/${repoSlug}.git\ncd ${repoSlug}\n\`\`\`\n\n`;
    if (f.envVars) md += "**Environment Variables** — create a `.env` file:\n\n```env\n" + f.envVars + "\n```\n\n";
    md += "---\n\n";
  }

  if (on("usage")) {
    md += "## 💻 Usage\n\n```bash\n" + (f.usageCmd || "# Add your run command here") + "\n```\n\n---\n\n";
  }

  if (on("structure") && f.rawStructure.trim()) {
    md += "## 📁 Project Structure\n\n```\n" + convertStructure(f.rawStructure, name) + "\n```\n\n---\n\n";
  }

  if (on("screenshots")) {
    const hasContent = f.videoUrl || state.screenshots.length || f.imageUrls.trim();
    if (hasContent) {
      md += "## 🖼️ Screenshots\n\n";
      if (f.videoUrl) md += `▶️ **Demo Video:** [Watch Here](${f.videoUrl})\n\n`;
      state.screenshots.forEach((ss) => {
        const label = ss.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        md += `### ${label}\n\n![${label}](${ss.dataUrl})\n\n`;
      });
      if (f.imageUrls.trim()) {
        f.imageUrls.split("\n").filter((l) => l.trim()).forEach((line) => {
          const parts = line.split("|").map((p) => p.trim());
          if (parts.length >= 2) md += `### ${parts[0]}\n\n![${parts[0]}](${parts[1]})\n\n`;
          else if (parts[0]) md += `![Screenshot](${parts[0]})\n\n`;
        });
      }
      md += "---\n\n";
    }
  }

  if (on("api") && f.apiDocs.trim()) {
    md += "## ⚡ API Reference\n\n";
    if (f.apiBase) md += `**Base URL:** \`${f.apiBase}\`\n\n`;
    md += "| Method | Endpoint | Description |\n|--------|----------|-------------|\n";
    f.apiDocs.split("\n").filter((l) => l.trim()).forEach((line) => {
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length >= 2) {
        const ep = parts[0].split(" ");
        md += `| \`${ep[0]}\` | \`${ep.slice(1).join(" ")}\` | ${parts[1]} |\n`;
      }
    });
    md += "\n---\n\n";
  }

  if (on("contributing")) {
    md += "## 🤝 Contributing\n\nContributions are always welcome!\n\n";
    md += "1. Fork the repository\n2. Create your branch: `git checkout -b feature/amazing-feature`\n";
    md += '3. Commit your changes: `git commit -m "Add amazing feature"`\n';
    md += "4. Push to the branch: `git push origin feature/amazing-feature`\n5. Open a Pull Request\n\n";
    if (f.contribNotes) md += f.contribNotes + "\n\n";
    md += "---\n\n";
  }

  if (on("author")) {
    if (f.license !== "none") md += `## 📄 License\n\nThis project is licensed under the **[${f.license} License](LICENSE)**.\n\n---\n\n`;
    md += "## 👤 Author\n\n";
    const displayName = f.authorName || f.authorGh || ghUser;
    md += `**${displayName}**\n\n`;
    if (f.authorGh) md += `- 🐙 GitHub: [@${f.authorGh}](https://github.com/${f.authorGh})\n`;
    if (f.authorEmail) md += `- 📧 Email: [${f.authorEmail}](mailto:${f.authorEmail})\n`;
    if (f.authorLinkedin) md += `- 💼 LinkedIn: [${displayName}](${f.authorLinkedin})\n`;
    if (f.authorWebsite) md += `- 🌐 Website: [${f.authorWebsite}](${f.authorWebsite})\n`;
    md += `\n---\n\n> Made with ❤️ by [${displayName}](https://github.com/${f.authorGh || ghUser})\n`;
  }

  if (on("support")) {
    const hasUrls = f.supportBmac || f.supportKofi || f.supportPatreon || f.supportGhSponsors;
    if (f.supportMsg || hasUrls) {
      md += "## ❤️ Support & Donation\n\n";
      if (f.supportMsg) md += f.supportMsg + "\n\n";
      else md += "If you find this project helpful, please consider supporting its development:\n\n";
      const links: string[] = [];
      if (f.supportBmac) links.push(`[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/${f.supportBmac})`);
      if (f.supportKofi) links.push(`[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/${f.supportKofi})`);
      if (f.supportPatreon) links.push(`[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/${f.supportPatreon})`);
      if (f.supportGhSponsors) links.push(`[![GitHub Sponsors](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#EA4AAA)](https://github.com/sponsors/${f.supportGhSponsors})`);
      if (links.length) md += links.join(" ") + "\n\n";
      md += "---\n\n";
    }
  }

  return md;
}

// Lightweight markdown -> HTML for live preview (not a full parser).
export function renderMarkdownToHtml(md: string): string {
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = md.split("\n");
  const out: string[] = [];
  let inCode = false;
  let codeLang = "";
  let codeBuf: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (!inTable) return;
    if (tableRows.length >= 2) {
      const [head, , ...body] = tableRows;
      out.push(`<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${
        body.map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")
      }</tbody></table>`);
    }
    inTable = false;
    tableRows = [];
  };

  const inline = (s: string) =>
    escape(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  for (const raw of lines) {
    const line = raw;
    if (/^```/.test(line)) {
      if (inCode) {
        out.push(`<pre><code class="language-${codeLang}">${escape(codeBuf.join("\n"))}</code></pre>`);
        inCode = false; codeBuf = []; codeLang = "";
      } else {
        flushTable();
        inCode = true;
        codeLang = line.replace(/^```/, "").trim();
      }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }
    if (/^\s*\|.*\|\s*$/.test(line)) {
      inTable = true;
      tableRows.push(line.trim().slice(1, -1).split("|").map((c) => c.trim()));
      continue;
    } else if (inTable) flushTable();

    if (/^---+$/.test(line.trim())) { out.push("<hr />"); continue; }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); continue; }
    if (/^>\s?/.test(line)) { out.push(`<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`); continue; }
    if (/^[-*]\s+/.test(line)) { out.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`); continue; }
    if (line.trim() === "") { out.push(""); continue; }
    out.push(`<p>${inline(line)}</p>`);
  }
  flushTable();
  if (inCode) out.push(`<pre><code>${escape(codeBuf.join("\n"))}</code></pre>`);

  // wrap consecutive <li>
  const html = out.join("\n").replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
  return html;
}
