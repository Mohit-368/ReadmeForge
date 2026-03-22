(function () {
  // ── State ─────────────────────────────────────────────────────
  var currentMd = "";
  var currentTab = "rendered";
  var screenshots = [];
  var renderTimer = null;

  // ── Section definitions ───────────────────────────────────────
  var SECTIONS = [
    {
      id: "title",
      label: "Project Title",
      icon: "📌",
      el: "sec-title",
      default: true,
    },
    {
      id: "description",
      label: "Description",
      icon: "📋",
      el: "sec-description",
      default: true,
    },
    {
      id: "features",
      label: "Features",
      icon: "✨",
      el: "sec-features",
      default: true,
    },
    {
      id: "techstack",
      label: "Tech Stack",
      icon: "🛠️",
      el: "sec-techstack",
      default: true,
    },
    {
      id: "installation",
      label: "Installation",
      icon: "🚀",
      el: "sec-installation",
      default: true,
    },
    { id: "usage", label: "Usage", icon: "💻", el: "sec-usage", default: true },
    {
      id: "structure",
      label: "Folder Structure",
      icon: "📁",
      el: "sec-structure",
      default: true,
    },
    {
      id: "screenshots",
      label: "Screenshots",
      icon: "🖼️",
      el: "sec-screenshots",
      default: true,
    },
    { id: "api", label: "API Docs", icon: "⚡", el: "sec-api", default: false },
    {
      id: "contributing",
      label: "Contributing",
      icon: "🤝",
      el: "sec-contributing",
      default: true,
    },
    {
      id: "author",
      label: "License & Author",
      icon: "👤",
      el: "sec-author",
      default: true,
    },
  ];

  var sectionState = {};
  SECTIONS.forEach(function (s) {
    sectionState[s.id] = s.default;
  });

  // ── Tech chips ────────────────────────────────────────────────
  var TECHS = [
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

  var selectedTechs = new Set();

  // ── Badge chips ───────────────────────────────────────────────
  var BADGES = [
    { id: "license", label: "License" },
    { id: "stars", label: "⭐ Stars" },
    { id: "forks", label: "🍴 Forks" },
    { id: "issues", label: "Issues" },
    { id: "prs", label: "PRs Welcome" },
    { id: "build", label: "Build Passing" },
    { id: "coverage", label: "Coverage" },
    { id: "version", label: "Version" },
  ];
  var selectedBadges = new Set(["license", "stars", "prs"]);

  // ── Templates ─────────────────────────────────────────────────
  var TEMPLATES = {
    webapp: {
      name: "My Web App",
      tag: "A modern, full-stack web application",
      techs: ["React", "Node.js", "PostgreSQL", "Docker"],
      desc: "A full-stack web application built with modern technologies. Features user authentication, real-time updates, and a responsive UI.",
      features:
        "### 🔐 Authentication\n- JWT-based login & registration\n- OAuth support\n\n### 📊 Dashboard\n- Real-time data visualization\n- Export to CSV\n\n### 🌐 API\n- RESTful API with full CRUD\n- Rate limiting & caching",
    },
    ml: {
      name: "ML Project",
      tag: "Machine learning model for image classification",
      techs: ["Python", "TensorFlow", "FastAPI", "Docker"],
      desc: "A machine learning project that achieves state-of-the-art results on benchmark datasets. Includes training pipeline, model evaluation, and a REST API for inference.",
      features:
        "### 🧠 Model\n- Custom CNN architecture\n- Transfer learning support\n\n### 📈 Training\n- Mixed precision training\n- Early stopping & checkpointing\n\n### ⚡ Inference API\n- FastAPI endpoint\n- Batch prediction support",
    },
    api: {
      name: "Backend API",
      tag: "Production-ready REST API with authentication",
      techs: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker"],
      desc: "A scalable backend API built for production. Includes authentication, caching, rate limiting, and comprehensive API documentation.",
      features:
        "### 🔑 Auth\n- JWT + refresh tokens\n- Role-based access control\n\n### ⚡ Performance\n- Redis caching\n- Query optimization\n\n### 📚 Docs\n- Swagger / OpenAPI docs\n- Postman collection",
    },
    cli: {
      name: "CLI Tool",
      tag: "A powerful command-line tool",
      techs: ["Python", "Go"],
      desc: "A command-line tool that helps developers automate repetitive tasks. Supports plugins, configuration files, and shell completions.",
      features:
        "### ⚙️ Commands\n- Multiple sub-commands\n- Interactive prompts\n\n### 🔌 Plugins\n- Plugin system\n- Custom hooks\n\n### 🐚 Shell\n- Bash/Zsh/Fish completions\n- Cross-platform support",
    },
    mobile: {
      name: "Mobile App",
      tag: "Cross-platform mobile app",
      techs: ["React", "TypeScript", "MongoDB"],
      desc: "A cross-platform mobile application built with React Native. Features offline support, push notifications, and a native feel on both iOS and Android.",
      features:
        "### 📱 UI/UX\n- Native animations\n- Dark mode support\n\n### 🔔 Notifications\n- Push notifications\n- In-app messaging\n\n### 📡 Offline\n- Local data sync\n- Conflict resolution",
    },
    lib: {
      name: "AwesomeLib",
      tag: "A lightweight, zero-dependency library",
      techs: ["TypeScript", "JavaScript"],
      desc: "A lightweight, zero-dependency library that makes complex tasks simple. Tree-shakeable, fully typed, and battle-tested in production.",
      features:
        "### 🎯 Core\n- Zero dependencies\n- Tree-shakeable\n\n### 🔧 API\n- Fluent interface\n- Promise & callback support\n\n### 📦 Bundle\n- ESM + CJS + UMD\n- < 5kb gzipped",
    },
    hackathon: {
      name: "HackProject",
      tag: "Built in 24 hours at HackathonX 2025",
      techs: ["React", "Python", "FastAPI", "PostgreSQL"],
      desc: "Award-winning hackathon project built in 24 hours. Solves [problem] using [approach]. Won [prize] at [hackathon name].",
      features:
        "### 🏆 What We Built\n- Core feature 1\n- Core feature 2\n\n### 🚀 Tech Choices\n- Why we chose each tech\n- Architecture decisions\n\n### 🔮 Future Plans\n- Post-hackathon roadmap",
    },
    oss: {
      name: "OpenProject",
      tag: "An open-source tool loved by the community",
      techs: ["Python", "Docker"],
      desc: "An open-source project maintained by the community. We welcome contributions of all kinds — code, documentation, bug reports, and feature ideas.",
      features:
        "### ✨ Features\n- Feature 1\n- Feature 2\n\n### 🌍 Community\n- Active Discord\n- Weekly releases\n\n### 📖 Docs\n- Full documentation\n- Video tutorials",
    },
  };

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    buildSectionToggles();
    buildTechPicker();
    buildBadgePicker();
    setupDropZone();
    updateSectionCount();
    scheduleRender();
  }

  // ── Build UI components ───────────────────────────────────────
  function buildSectionToggles() {
    var el = document.getElementById("sectionToggles");
    el.innerHTML = "";
    SECTIONS.forEach(function (s) {
      var on = sectionState[s.id];
      var div = document.createElement("div");
      div.className = "sec-toggle" + (on ? " active" : "");
      div.id = "toggle-" + s.id;
      div.innerHTML =
        '<div class="sec-toggle-left"><span class="sec-toggle-icon">' +
        s.icon +
        "</span>" +
        s.label +
        "</div>" +
        '<label class="toggle-switch"><input type="checkbox"' +
        (on ? " checked" : "") +
        '><span class="tslider"></span></label>';
      div.querySelector("input").addEventListener("change", function (e) {
        sectionState[s.id] = e.target.checked;
        div.classList.toggle("active", e.target.checked);
        var secEl = document.getElementById(s.el);
        if (secEl) secEl.classList.toggle("hidden", !e.target.checked);
        updateSectionCount();
        scheduleRender();
      });
      var secEl = document.getElementById(s.el);
      if (secEl && !on) secEl.classList.add("hidden");
      el.appendChild(div);
    });
  }

  function buildTechPicker() {
    var el = document.getElementById("techPicker");
    el.innerHTML = "";
    TECHS.forEach(function (t) {
      var btn = document.createElement("button");
      btn.className = "tech-chip";
      btn.innerHTML = '<span class="emoji">' + t.emoji + "</span>" + t.label;
      btn.onclick = function () {
        if (selectedTechs.has(t.label)) {
          selectedTechs.delete(t.label);
          btn.classList.remove("selected");
        } else {
          selectedTechs.add(t.label);
          btn.classList.add("selected");
        }
        updateTechCount();
        scheduleRender();
      };
      el.appendChild(btn);
    });
  }

  function buildBadgePicker() {
    var el = document.getElementById("badgePicker");
    el.innerHTML = "";
    BADGES.forEach(function (b) {
      var btn = document.createElement("button");
      btn.className =
        "badge-chip" + (selectedBadges.has(b.id) ? " selected" : "");
      btn.textContent = b.label;
      btn.onclick = function () {
        if (selectedBadges.has(b.id)) {
          selectedBadges.delete(b.id);
          btn.classList.remove("selected");
        } else {
          selectedBadges.add(b.id);
          btn.classList.add("selected");
        }
        scheduleRender();
      };
      el.appendChild(btn);
    });
  }

  function updateTechCount() {
    var el = document.getElementById("techCount");
    var n = selectedTechs.size;
    if (n > 0) {
      el.style.display = "";
      el.textContent = n + " selected";
    } else el.style.display = "none";
  }

  function updateSectionCount() {
    var n = Object.values(sectionState).filter(Boolean).length;
    document.getElementById("sectionCount").textContent = n;
  }

  // ── Templates ─────────────────────────────────────────────────
  function applyTemplate(key) {
    var t = TEMPLATES[key];
    if (!t) return;
    document.querySelectorAll(".template-btn").forEach(function (b) {
      b.classList.remove("selected");
    });
    event.target.classList.add("selected");
    setVal("projName", t.name);
    setVal("tagline", t.tag);
    setVal("description", t.desc);
    setVal("features", t.features);
    selectedTechs.clear();
    document.querySelectorAll(".tech-chip").forEach(function (c) {
      c.classList.remove("selected");
    });
    t.techs.forEach(function (tech) {
      selectedTechs.add(tech);
      document.querySelectorAll(".tech-chip").forEach(function (c) {
        if (c.querySelector(".emoji") && c.textContent.includes(tech))
          c.classList.add("selected");
      });
    });
    updateTechCount();
    scheduleRender();
    toast("✓ Template applied!");
  }
  window.applyTemplate = applyTemplate;

  // ── Structure Visualizer ──────────────────────────────────────
  function convertStructure(raw) {
    if (!raw.trim()) return "";
    var lines = raw.split("\n");
    var result = [];
    var projectName = v("projName") || "project";
    result.push("📦 " + projectName);

    function getDepth(line) {
      var m = line.match(/^(\s*)/);
      return m ? Math.floor(m[1].length / 2) : 0;
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trimEnd();
      if (!line.trim()) continue;
      var depth = getDepth(line);
      var name = line.trim();
      var isDir = name.endsWith("/");
      var cleanName = name.replace(/\/$/, "");
      var isLast = true;
      for (var j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() && getDepth(lines[j]) === depth) {
          isLast = false;
          break;
        }
        if (lines[j].trim() && getDepth(lines[j]) < depth) break;
      }
      var prefix = "";
      for (var d = 0; d < depth; d++) {
        var parentIsLast = true;
        for (var k = i - 1; k >= 0; k--) {
          if (lines[k].trim() && getDepth(lines[k]) === d) {
            for (var l = i + 1; l < lines.length; l++) {
              if (lines[l].trim() && getDepth(lines[l]) === d) {
                parentIsLast = false;
                break;
              }
              if (lines[l].trim() && getDepth(lines[l]) < d) break;
            }
            break;
          }
        }
        prefix += parentIsLast ? "   " : " ┃ ";
      }
      var symbol = isLast ? " ┗ " : " ┣ ";
      var icon = isDir ? "📂 " : "📜 ";
      result.push(prefix + symbol + icon + cleanName);
    }
    return result.join("\n");
  }

  function updateStructurePreview() {
    var raw = v("rawStructure");
    var preview = convertStructure(raw);
    document.getElementById("structPreview").textContent =
      preview || "Paste structure above to preview...";
    scheduleRender();
  }
  window.updateStructurePreview = updateStructurePreview;

  // ── Screenshot Drop Zone ──────────────────────────────────────
  function setupDropZone() {
    var dz = document.getElementById("dropZone");
    var fi = document.getElementById("fileInput");
    dz.addEventListener("click", function () {
      fi.click();
    });
    dz.addEventListener("dragover", function (e) {
      e.preventDefault();
      dz.classList.add("dragover");
    });
    dz.addEventListener("dragleave", function () {
      dz.classList.remove("dragover");
    });
    dz.addEventListener("drop", function (e) {
      e.preventDefault();
      dz.classList.remove("dragover");
      handleFiles(e.dataTransfer.files);
    });
    fi.addEventListener("change", function () {
      handleFiles(fi.files);
    });
  }

  function handleFiles(files) {
    Array.from(files).forEach(function (file) {
      if (!file.type.startsWith("image/")) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        screenshots.push({ name: file.name, dataUrl: e.target.result });
        renderScreenshotList();
        scheduleRender();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderScreenshotList() {
    var el = document.getElementById("screenshotList");
    el.innerHTML = "";
    screenshots.forEach(function (ss, idx) {
      var div = document.createElement("div");
      div.className = "screenshot-item";
      div.innerHTML =
        '<img src="' +
        ss.dataUrl +
        '" alt="">' +
        '<span class="screenshot-item-name">' +
        ss.name +
        "</span>" +
        '<button class="screenshot-item-remove" onclick="removeScreenshot(' +
        idx +
        ')">✕</button>';
      el.appendChild(div);
    });
  }

  window.removeScreenshot = function (idx) {
    screenshots.splice(idx, 1);
    renderScreenshotList();
    scheduleRender();
  };

  // ── Generate Markdown ─────────────────────────────────────────
  function generateMarkdown() {
    var name = v("projName") || "My Project";
    var tagline = v("tagline");
    var ghUser = v("ghUser") || v("authorGh") || "username";
    var repoSlug = v("repoSlug") || name.toLowerCase().replace(/\s+/g, "-");
    var desc = v("description");
    var demoUrl = v("demoUrl");
    var features = v("features");
    var prereqs = v("prereqs");
    var installCmds = v("installCmds");
    var envVars = v("envVars");
    var usageCmd = v("usageCmd");
    var rawStruct = v("rawStructure");
    var videoUrl = v("videoUrl");
    var imageUrls = v("imageUrls");
    var apiDocs = v("apiDocs");
    var apiBase = v("apiBase");
    var contribNotes = v("contribNotes");
    var license = document.getElementById("license").value;
    var authorName = v("authorName");
    var authorGh = v("authorGh");
    var authorEmail = v("authorEmail");
    var authorLi = v("authorLinkedin");
    var authorWeb = v("authorWebsite");
    var customTech = v("customTech");

    var md = "";
    var on = function (id) {
      return sectionState[id];
    };

    // 1. Title & Badges
    if (on("title")) {
      md += "# " + name + "\n\n";
      if (tagline) md += "> **" + tagline + "**\n\n";
      var badges = [];
      if (selectedBadges.has("license") && license !== "none")
        badges.push(
          "[![License](https://img.shields.io/badge/license-" +
            encodeURIComponent(license) +
            "-green.svg)](LICENSE)",
        );
      if (selectedBadges.has("stars"))
        badges.push(
          "[![Stars](https://img.shields.io/github/stars/" +
            ghUser +
            "/" +
            repoSlug +
            "?style=social)](https://github.com/" +
            ghUser +
            "/" +
            repoSlug +
            ")",
        );
      if (selectedBadges.has("forks"))
        badges.push(
          "[![Forks](https://img.shields.io/github/forks/" +
            ghUser +
            "/" +
            repoSlug +
            "?style=social)](https://github.com/" +
            ghUser +
            "/" +
            repoSlug +
            "/fork)",
        );
      if (selectedBadges.has("issues"))
        badges.push(
          "[![Issues](https://img.shields.io/github/issues/" +
            ghUser +
            "/" +
            repoSlug +
            ")](https://github.com/" +
            ghUser +
            "/" +
            repoSlug +
            "/issues)",
        );
      if (selectedBadges.has("prs"))
        badges.push(
          "[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/" +
            ghUser +
            "/" +
            repoSlug +
            "/pulls)",
        );
      if (selectedBadges.has("build"))
        badges.push(
          "![Build](https://img.shields.io/badge/build-passing-brightgreen)",
        );
      if (selectedBadges.has("coverage"))
        badges.push(
          "![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)",
        );
      if (selectedBadges.has("version"))
        badges.push(
          "![Version](https://img.shields.io/badge/version-1.0.0-blue)",
        );
      if (badges.length) md += badges.join(" ") + "\n\n";
      md += "---\n\n";

      // TOC
      md += "## 📋 Table of Contents\n\n";
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
      md += "\n---\n\n";
    }

    // 2. Description
    if (on("description")) {
      md += "## 📌 Description\n\n";
      md += (desc || "_Add a description of your project here._") + "\n\n";
      if (demoUrl)
        md += "🔗 **Live Demo:** [" + demoUrl + "](" + demoUrl + ")\n\n";
      md += "---\n\n";
    }

    // 3. Features
    if (on("features") && features) {
      md += "## ✨ Features\n\n";
      features.split("\n").forEach(function (line) {
        var l = line.trimEnd();
        if (l.trim().startsWith("###")) md += "\n" + l.trim() + "\n";
        else if (l.trim())
          md += (l.trim().startsWith("-") ? l : "- " + l.trim()) + "\n";
      });
      md += "\n---\n\n";
    }

    // 4. Tech Stack
    if (on("techstack")) {
      var allTech = Array.from(selectedTechs);
      if (customTech)
        customTech.split(",").forEach(function (t) {
          var tr = t.trim();
          if (tr) allTech.push(tr);
        });
      if (allTech.length) {
        md += "## 🛠️ Tech Stack\n\n| Layer | Technology |\n|---|---|\n";
        var front = allTech.filter(function (t) {
          return [
            "React",
            "Vue",
            "Next.js",
            "TypeScript",
            "JavaScript",
            "Tailwind",
            "HTML",
            "CSS",
          ].includes(t);
        });
        var back = allTech.filter(function (t) {
          return [
            "Node.js",
            "Express",
            "Django",
            "FastAPI",
            "Flask",
            "Spring",
            "Go",
            "Python",
            "Rust",
            "Java",
            "C++",
          ].includes(t);
        });
        var db = allTech.filter(function (t) {
          return ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis"].includes(
            t,
          );
        });
        var infra = allTech.filter(function (t) {
          return [
            "Docker",
            "Kubernetes",
            "AWS",
            "GCP",
            "Azure",
            "Nginx",
            "Linux",
          ].includes(t);
        });
        var ml = allTech.filter(function (t) {
          return ["TensorFlow", "PyTorch", "GraphQL"].includes(t);
        });
        var rest = allTech.filter(function (t) {
          return ![].concat(front, back, db, infra, ml).includes(t);
        });
        if (front.length) md += "| Frontend | " + front.join(", ") + " |\n";
        if (back.length) md += "| Backend  | " + back.join(", ") + " |\n";
        if (db.length) md += "| Database | " + db.join(", ") + " |\n";
        if (ml.length) md += "| AI / ML  | " + ml.join(", ") + " |\n";
        if (infra.length) md += "| DevOps   | " + infra.join(", ") + " |\n";
        if (rest.length) md += "| Other    | " + rest.join(", ") + " |\n";
        md += "\n---\n\n";
      }
    }

    // 5. Installation
    if (on("installation")) {
      md += "## 🚀 Installation\n\n";
      if (prereqs) md += "**Prerequisites:** " + prereqs + "\n\n";
      if (installCmds) {
        md += "```bash\n" + installCmds + "\n```\n\n";
      } else {
        md +=
          "```bash\ngit clone https://github.com/" +
          ghUser +
          "/" +
          repoSlug +
          ".git\ncd " +
          repoSlug +
          "\n```\n\n";
      }
      if (envVars)
        md +=
          "**Environment Variables** — create a `.env` file:\n\n```env\n" +
          envVars +
          "\n```\n\n";
      md += "---\n\n";
    }

    // 6. Usage
    if (on("usage")) {
      md +=
        "## 💻 Usage\n\n```bash\n" +
        (usageCmd || "# Add your run command here") +
        "\n```\n\n---\n\n";
    }

    // 7. Structure
    if (on("structure") && rawStruct.trim()) {
      md +=
        "## 📁 Project Structure\n\n```\n" +
        convertStructure(rawStruct) +
        "\n```\n\n---\n\n";
    }

    // 8. Screenshots
    if (on("screenshots")) {
      var hasContent = videoUrl || screenshots.length || imageUrls.trim();
      if (hasContent) {
        md += "## 🖼️ Screenshots\n\n";
        if (videoUrl)
          md += "▶️ **Demo Video:** [Watch Here](" + videoUrl + ")\n\n";
        screenshots.forEach(function (ss) {
          var label = ss.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
          md += "### " + label + "\n\n![" + label + "](" + ss.dataUrl + ")\n\n";
        });
        if (imageUrls.trim()) {
          imageUrls
            .split("\n")
            .filter(function (l) {
              return l.trim();
            })
            .forEach(function (line) {
              var parts = line.split("|").map(function (p) {
                return p.trim();
              });
              if (parts.length >= 2)
                md +=
                  "### " +
                  parts[0] +
                  "\n\n![" +
                  parts[0] +
                  "](" +
                  parts[1] +
                  ")\n\n";
              else if (parts[0]) md += "![Screenshot](" + parts[0] + ")\n\n";
            });
        }
        md += "---\n\n";
      }
    }

    // 9. API Docs
    if (on("api") && apiDocs.trim()) {
      md += "## ⚡ API Reference\n\n";
      if (apiBase) md += "**Base URL:** `" + apiBase + "`\n\n";
      md +=
        "| Method | Endpoint | Description |\n|--------|----------|-------------|\n";
      apiDocs
        .split("\n")
        .filter(function (l) {
          return l.trim();
        })
        .forEach(function (line) {
          var parts = line.split("|").map(function (p) {
            return p.trim();
          });
          if (parts.length >= 2) {
            var ep = parts[0].split(" ");
            md +=
              "| `" +
              ep[0] +
              "` | `" +
              ep.slice(1).join(" ") +
              "` | " +
              parts[1] +
              " |\n";
          }
        });
      md += "\n---\n\n";
    }

    // 10. Contributing
    if (on("contributing")) {
      md += "## 🤝 Contributing\n\nContributions are always welcome!\n\n";
      md += "1. Fork the repository\n";
      md +=
        "2. Create your branch: `git checkout -b feature/amazing-feature`\n";
      md += '3. Commit your changes: `git commit -m "Add amazing feature"`\n';
      md +=
        "4. Push to the branch: `git push origin feature/amazing-feature`\n";
      md += "5. Open a Pull Request\n\n";
      if (contribNotes) md += contribNotes + "\n\n";
      md += "---\n\n";
    }

    // 11. License & Author
    if (on("author")) {
      if (license !== "none")
        md +=
          "## 📄 License\n\nThis project is licensed under the **[" +
          license +
          " License](LICENSE)**.\n\n---\n\n";
      md += "## 👤 Author\n\n";
      var displayName = authorName || authorGh || ghUser;
      md += "**" + displayName + "**\n\n";
      if (authorGh)
        md +=
          "- 🐙 GitHub: [@" +
          authorGh +
          "](https://github.com/" +
          authorGh +
          ")\n";
      if (authorEmail)
        md += "- 📧 Email: [" + authorEmail + "](mailto:" + authorEmail + ")\n";
      if (authorLi)
        md += "- 💼 LinkedIn: [" + displayName + "](" + authorLi + ")\n";
      if (authorWeb)
        md += "- 🌐 Website: [" + authorWeb + "](" + authorWeb + ")\n";
      md += "\n---\n\n";
      md +=
        "> Made with ❤️ by [" +
        displayName +
        "](https://github.com/" +
        (authorGh || ghUser) +
        ")\n";
    }

    return md;
  }

  // ── Render ────────────────────────────────────────────────────
  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 120);
  }
  window.scheduleRender = scheduleRender;

  function render() {
    currentMd = generateMarkdown();
    var body = document.getElementById("previewBody");
    if (!currentMd.trim()) {
      body.innerHTML =
        '<div class="empty-preview"><div class="icon">📄</div><h3>Live preview appears here</h3><p>Start filling in the editor →</p></div>';
      return;
    }
    if (currentTab === "rendered") {
      body.innerHTML =
        '<div class="gh-preview">' + md2html(currentMd) + "</div>";
    } else {
      body.innerHTML = '<div class="raw-view">' + esc(currentMd) + "</div>";
    }
  }

  function setTab(tab) {
    currentTab = tab;
    document
      .getElementById("tabRendered")
      .classList.toggle("active", tab === "rendered");
    document.getElementById("tabRaw").classList.toggle("active", tab === "raw");
    render();
  }
  window.setTab = setTab;

  // ── Badge renderer ────────────────────────────────────────────
  var BADGE_COLORS = {
    brightgreen: "#22c55e",
    green: "#22c55e",
    yellowgreen: "#84cc16",
    yellow: "#eab308",
    orange: "#f97316",
    red: "#ef4444",
    blue: "#3b82f6",
    lightgrey: "#94a3b8",
    grey: "#64748b",
    gray: "#64748b",
    blueviolet: "#8b5cf6",
    ff69b4: "#ec4899",
  };

  function shieldToBadge(label, url) {
    var isShield = url.indexOf("shields.io") !== -1;
    if (!isShield)
      return (
        '<span class="gh-badge" style="background:#555;color:#fff">' +
        label +
        "</span>"
      );
    var color = "#555",
      left = label || "",
      right = "",
      m;
    m = url.match(/\/badge\/([^?]+)/);
    if (m) {
      var parts = m[1].split("-");
      if (parts.length >= 3) {
        right = parts[parts.length - 2];
        var col = parts[parts.length - 1].split("?")[0];
        color = BADGE_COLORS[col] || "#" + col;
        left = parts
          .slice(0, parts.length - 2)
          .join(" ")
          .replace(/_/g, " ");
      } else if (parts.length === 2) {
        right = parts[1].split("?")[0];
        color = "#22c55e";
        left = parts[0].replace(/_/g, " ");
      } else {
        left = parts[0].replace(/_/g, " ");
        color = "#3b82f6";
      }
    }
    if (!m) {
      if (url.indexOf("/github/stars") !== -1) {
        left = "Stars";
        right = "★";
        color = "#f59e0b";
      } else if (url.indexOf("/github/forks") !== -1) {
        left = "Forks";
        right = "⑂";
        color = "#8b5cf6";
      } else if (url.indexOf("/github/issues") !== -1) {
        left = "Issues";
        right = "●";
        color = "#ef4444";
      } else {
        left = label;
        color = "#3b82f6";
      }
    }
    left = decodeURIComponent(left).replace(/\+/g, " ");
    right = decodeURIComponent(right).replace(/\+/g, " ");
    return (
      '<span class="gh-badge"><span class="gh-badge-left">' +
      left +
      "</span>" +
      (right
        ? '<span class="gh-badge-right" style="background:' +
          color +
          '">' +
          right +
          "</span>"
        : "") +
      "</span>"
    );
  }

  // ── Markdown to HTML ──────────────────────────────────────────
  function md2html(md) {
    var h = md;
    h = h.replace(/```(\w*)\n([\s\S]*?)```/g, function (_, lang, code) {
      return "<pre><code>" + esc(code) + "</code></pre>";
    });
    h = h.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    h = h.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    h = h.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    h = h.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/__(.+?)__/g, "<strong>$1</strong>");
    h = h.replace(/\*(.+?)\*/g, "<em>$1</em>");
    h = h.replace(/^---$/gm, "<hr>");
    // Linked badges [![alt](imgUrl)](linkUrl)
    h = h.replace(
      /\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g,
      function (_, alt, imgUrl, linkUrl) {
        return (
          '<a href="' +
          linkUrl +
          '" target="_blank" style="text-decoration:none">' +
          shieldToBadge(alt, imgUrl) +
          "</a>"
        );
      },
    );
    // Unlinked images/badges
    h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, imgUrl) {
      if (imgUrl.indexOf("shields.io") !== -1)
        return shieldToBadge(alt, imgUrl);
      return (
        '<img src="' +
        imgUrl +
        '" alt="' +
        alt +
        '" style="max-width:100%;border-radius:4px;margin:4px 0">'
      );
    });
    h = h.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank">$1</a>',
    );
    h = h.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
    h = h.replace(/((\|.+\|\n)+)/g, function (table) {
      var rows = table.trim().split("\n");
      var out = "<table>";
      rows.forEach(function (row, i) {
        if (row.match(/^\|[-| :]+\|$/)) return;
        var cells = row.split("|").filter(function (c, idx, a) {
          return idx > 0 && idx < a.length - 1;
        });
        var tag = i === 0 ? "th" : "td";
        out +=
          "<tr>" +
          cells
            .map(function (c) {
              return "<" + tag + ">" + c.trim() + "</" + tag + ">";
            })
            .join("") +
          "</tr>";
      });
      return out + "</table>";
    });
    h = h.replace(/^- (.+)$/gm, "<li>$1</li>");
    h = h.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
    h = h.replace(/(<li>[\s\S]*?<\/li>)/g, function (m) {
      return "<ul>" + m + "</ul>";
    });
    h = h
      .split("\n\n")
      .map(function (block) {
        if (/^<(h[1-6]|ul|ol|li|pre|blockquote|hr|table)/.test(block.trim()))
          return block;
        return "<p>" + block.replace(/\n/g, " ") + "</p>";
      })
      .join("\n");
    return h;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // ── Export ────────────────────────────────────────────────────
  function copyMarkdown() {
    if (!currentMd) {
      toast("Generate content first!");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(currentMd)
        .then(function () {
          toast("✓ Copied to clipboard!");
        })
        .catch(fbCopy);
    } else {
      fbCopy();
    }
    function fbCopy() {
      var ta = document.createElement("textarea");
      ta.value = currentMd;
      ta.style.cssText = "position:absolute;left:-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        toast("✓ Copied!");
      } catch (e) {
        toast("Copy failed");
      }
      document.body.removeChild(ta);
    }
  }
  window.copyMarkdown = copyMarkdown;

  function downloadMd() {
    if (!currentMd) {
      toast("Nothing to download yet!");
      return;
    }
    var blob = new Blob([currentMd], { type: "text/markdown" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast("✓ README.md downloaded!");
  }
  window.downloadMd = downloadMd;

  function resetAll() {
    document
      .querySelectorAll(
        "input[type=text],input[type=email],input[type=url],textarea",
      )
      .forEach(function (el) {
        el.value = "";
      });
    document.getElementById("license").value = "MIT";
    selectedTechs.clear();
    selectedBadges.clear();
    selectedBadges.add("license");
    selectedBadges.add("stars");
    selectedBadges.add("prs");
    screenshots = [];
    document.getElementById("screenshotList").innerHTML = "";
    document.getElementById("structPreview").textContent =
      "Paste structure above to preview...";
    document.querySelectorAll(".tech-chip").forEach(function (c) {
      c.classList.remove("selected");
    });
    document.querySelectorAll(".template-btn").forEach(function (c) {
      c.classList.remove("selected");
    });
    buildBadgePicker();
    updateTechCount();
    SECTIONS.forEach(function (s) {
      sectionState[s.id] = s.default;
    });
    buildSectionToggles();
    updateSectionCount();
    scheduleRender();
    toast("✓ Reset complete!");
  }
  window.resetAll = resetAll;

  // ── Helpers ───────────────────────────────────────────────────
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () {
      t.classList.remove("show");
    }, 2500);
  }

  function v(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }
  function setVal(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val;
  }

  init();
})();
const preview = document.getElementById("previewBody");
const btn = document.getElementById("backToTopBtn");

// Show button when scrolling
preview.addEventListener("scroll", () => {
  if (preview.scrollTop > 200) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
});

// Smooth scroll to top
btn.addEventListener("click", () => {
  preview.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

