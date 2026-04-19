/**
 * 📄 readmeforge.js
 * ===============================================================
 * Main script for the README Forge - an interactive README generator.
 *
 * 🎯 PURPOSE:
 * This file provides all the client-side logic for generating
 * professional README.md files through an intuitive web interface.
 * Users can customize sections, add tech stacks, upload screenshots,
 * and preview the final Markdown in real-time.
 *
 * 🔧 RESPONSIBILITIES:
 * - Manage application state (sections, tech stack, badges, screenshots)
 * - Handle all user interactions (inputs, toggles, file uploads, template selection)
 * - Generate dynamically constructed Markdown content based on user input
 * - Render Markdown preview as styled HTML for real-time visualization
 * - Handle export operations (copy to clipboard, download as .md, print to PDF)
 * - Manage event listeners and UI updates
 *
 * 📦 ARCHITECTURE:
 * The code is organized into logical sections (marked with ── separators):
 * 1. STATE - Global variables and initial data structures
 * 2. SECTIONS & CONFIGS - SECTIONS array, TECHS array, BADGES array, TEMPLATES
 * 3. INITIALIZATION - init() to set up the app on page load
 * 4. UI BUILDERS - Functions to dynamically create UI elements
 * 5. TEMPLATES - Logic to apply pre-configured project templates
 * 6. STRUCTURE VISUALIZER - Tree structure display converter
 * 7. SCREENSHOT MANAGEMENT - File upload and screenshot handling
 * 8. MARKDOWN GENERATION - Core logic for generating README markdown
 * 9. RENDERING - Preview rendering and tab switching
 * 10. MARKDOWN UTILITIES - Badge rendering, markdown-to-HTML conversion
 * 11. EXPORT - Functionality for copying, downloading, and printing
 * 12. HELPERS - Utility functions used throughout the code
 *
 * ⚠️ TECHNICAL NOTES:
 * - Pure vanilla JavaScript (no frameworks like React or Vue)
 * - DOM-driven architecture (no virtual DOM)
 * - Uses event listeners for interactivity
 * - Debounced rendering with scheduleRender() for performance
 */

(function () {
  // ── State ──
  // currentMd holds the last generated markdown text for preview and export.
  var currentMd = "";
  // currentTab controls whether the preview is rendered HTML or raw markdown.
  var currentTab = "rendered";
  // screenshots stores image uploads for the Screenshots section.
  var screenshots = [];
  // renderTimer is used for debounced preview rendering.
  var renderTimer = null;
  var saveTimer = null;
  var autoSaveTimer = null;

  // ── localStorage Auto-Save ────────────────────────────────────
  var STORAGE_KEY = "readmeforge-data";

  var FIELD_IDS = [
    "projName", "tagline", "ghUser", "repoSlug", "description", "demoUrl",
    "features", "prereqs", "installCmds", "envVars", "usageCmd", "rawStructure",
    "videoUrl", "imageUrls", "apiDocs", "apiBase", "contribNotes", "authorName",
    "authorGh", "authorEmail", "authorLinkedin", "authorWebsite", "customTech"
  ];

  function saveToLocalStorage() {
    var data = {
      fields: {},
      license: (document.getElementById("license") || {}).value || "MIT",
      techs: Array.from(selectedTechs),
      badges: Array.from(selectedBadges),
      sections: Object.assign({}, sectionState)
    };
    FIELD_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) data.fields[id] = el.value;
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      showAutoSavedIndicator();
    } catch (e) {
      console.error("Auto-save failed:", e);
    }
  }

  function loadFromLocalStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);

      if (!data || typeof data !== "object" || !data.fields) {
        console.warn("Auto-save: stored data is malformed, discarding.");
        localStorage.removeItem(STORAGE_KEY);
        return false;
      }

      FIELD_IDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && typeof data.fields[id] === "string") el.value = data.fields[id];
      });

      var licenseEl = document.getElementById("license");
      if (licenseEl && data.license) licenseEl.value = data.license;

      if (Array.isArray(data.techs)) selectedTechs = new Set(data.techs);
      if (Array.isArray(data.badges)) selectedBadges = new Set(data.badges);

      if (data.sections && typeof data.sections === "object") {
        Object.keys(data.sections).forEach(function (id) {
          if (Object.prototype.hasOwnProperty.call(sectionState, id)) {
            sectionState[id] = !!data.sections[id];
          }
        });
      }

      return true;
    } catch (e) {
      console.error("Auto-save: failed to restore data:", e);
      return false;
    }
  }

  function showAutoSavedIndicator() {
    var el = document.getElementById("autoSaveStatus");
    if (!el) return;
    el.classList.add("visible");
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(function () {
      el.classList.remove("visible");
    }, 2000);
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveToLocalStorage, 600);
  }

  function clearSavedData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear saved data:", e);
    }
    toast("✓ Saved data cleared!");
  }
  window.clearSavedData = clearSavedData;

  // Query inputs used by the word count feature on text areas.
  const inputs = document.querySelectorAll(".textInput");
  const counts = document.querySelectorAll(".wordCount");
  const wordCountText = document.querySelectorAll(".wordCountText");

  // Enable live word count updates for each text input.
  inputs.forEach((input, index) => {
    // Connect the input field with its count display and label.
    enableWordCount(input, counts[index], wordCountText[index]);
  });

  // Section definitions describe each README section, its label, icon, editor element,
  // and whether it starts enabled by default.
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

  // sectionState tracks which README sections are currently enabled.
  var sectionState = {};
  SECTIONS.forEach(function (s) {
    sectionState[s.id] = s.default;
  });

  // ── Tech chips ──
  // TECHS contains all technology chips that can be selected by the user.
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

  // selectedTechs stores the user-selected tech chips for README output.
  var selectedTechs = new Set();

  // ── Badge chips ──
  // BADGES contains all available README badge options.
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

  // selectedBadges tracks which badge options are currently active.
  var selectedBadges = new Set(["license", "stars", "prs"]);

  // ── Templates ──
  // TEMPLATES stores predefined project templates for quick form filling.
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

  // ── INITIALIZATION ──
  /**
   * Initializes the entire application on page load.
   * Sets up all UI components, event listeners, and renders the initial state.
   *
   * @function init
   * @returns {void}
   */
  function init() {
    var hasData = loadFromLocalStorage();
    buildSectionToggles();
    buildTechPicker();
    if (hasData) {
      selectedTechs.forEach(function (tech) {
        document.querySelectorAll(".tech-chip").forEach(function (c) {
          if (c.textContent.includes(tech)) c.classList.add("selected");
        });
      });
    }
    buildBadgePicker();
    setupDropZone();
    updateSectionCount();
    updateTechCount();
    if (hasData) {
      document.querySelectorAll(".textInput").forEach(function (el) {
        el.dispatchEvent(new Event("input"));
      });
      updateStructurePreview();
    }
    scheduleRender();
  }

  // ── UI BUILDERS ───────────────────────────────────────────────
  /**
   * Builds and renders all section toggle switches in the UI.
   * Each section can be toggled on/off, updating both the state and the DOM.
   * Hidden sections are not included in the generated Markdown.
   *
   * @function buildSectionToggles
   * @returns {void}
   */
  function buildSectionToggles() {
    var el = document.getElementById("sectionToggles");
    el.innerHTML = "";  // Clear previous toggles
    // Create one toggle switch for each section and attach interaction logic.
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
      
      // Add change event listener to update state and UI
      div.querySelector("input").addEventListener("change", function (e) {
        sectionState[s.id] = e.target.checked;  // Update state
        div.classList.toggle("active", e.target.checked);  // Toggle active class
        
        // Show/hide the corresponding section in the editor
        var secEl = document.getElementById(s.el);
        if (secEl) secEl.classList.toggle("hidden", !e.target.checked);
        updateSectionCount();
        scheduleSave();
        scheduleRender();
      });
      
      // Hide the section editor if this section is disabled
      var secEl = document.getElementById(s.el);
      if (secEl && !on) secEl.classList.add("hidden");
      
      el.appendChild(div);
    });
  }

  /**
   * Builds and renders all technology selection chips.
   * Each tech chip is a clickable button that toggles selection.
   * Selected technologies are stored in the selectedTechs Set.
   *
   * @function buildTechPicker
   * @returns {void}
   */
  function buildTechPicker() {
    var el = document.getElementById("techPicker");
    el.innerHTML = "";  // Clear previous chips
    
    // Create a chip button for each technology
    TECHS.forEach(function (t) {
      var btn = document.createElement("button");
      btn.className = "tech-chip";
      btn.innerHTML = '<span class="emoji">' + t.emoji + "</span>" + t.label;
      
      // Toggle selection when clicked
      btn.onclick = function () {
        if (selectedTechs.has(t.label)) {
          // Deselect if already selected
          selectedTechs.delete(t.label);
          btn.classList.remove("selected");
        } else {
          // Select if not already selected
          selectedTechs.add(t.label);
          btn.classList.add("selected");
        }
        updateTechCount();  // Update display of selected count
        scheduleRender();   // Update preview
      };
      el.appendChild(btn);
    });
  }

  /**
   * Builds and renders all badge selection chips.
   * Badges appear in the README as shields.io badges (stars, forks, license, etc.).
   * Selected badges are stored in the selectedBadges Set.
   *
   * @function buildBadgePicker
   * @returns {void}
   */
  function buildBadgePicker() {
    var el = document.getElementById("badgePicker");
    el.innerHTML = "";  // Clear previous chips
    
    // Create a chip button for each badge option
    BADGES.forEach(function (b) {
      var btn = document.createElement("button");
      btn.className =
        "badge-chip" + (selectedBadges.has(b.id) ? " selected" : "");  // Mark as selected if in Set
      btn.textContent = b.label;
      
      // Toggle selection when clicked
      btn.onclick = function () {
        if (selectedBadges.has(b.id)) {
          // Deselect if already selected
          selectedBadges.delete(b.id);
          btn.classList.remove("selected");
        } else {
          // Select if not already selected
          selectedBadges.add(b.id);
          btn.classList.add("selected");
        }
        scheduleRender();  // Update preview to show/hide badges
      };
      el.appendChild(btn);
    });
  }

  /**
   * Updates the technology count display badge.
   * Shows the number of selected technologies, or hides if zero are selected.
   *
   * @function updateTechCount
   * @returns {void}
   */
  function updateTechCount() {
    var el = document.getElementById("techCount");
    var n = selectedTechs.size;  // Get the count of selected technologies
    
    if (n > 0) {
      el.style.display = "";           // Show the badge
      el.textContent = n + " selected";  // Display count
    } else {
      el.style.display = "none";       // Hide if no techs selected
    }
  }

  /**
   * Updates the section count display.
   * Shows the number of currently enabled sections.
   *
   * @function updateSectionCount
   * @returns {void}
   */
  function updateSectionCount() {
    // Count how many sections are enabled (value is true)
    var n = Object.values(sectionState).filter(Boolean).length;
    document.getElementById("sectionCount").textContent = n;  // Update display
  }


  // ── TEMPLATES ─────────────────────────────────────────────────
  /**
   * Applies a pre-configured project template to the form.
   * Populates fields with template values and selects appropriate technologies.
   *
   * @function applyTemplate
   * @param {string} key - The template key (e.g., 'webapp', 'ml', 'api', 'cli')
   * @returns {void}
   */
  function applyTemplate(key) {
    var t = TEMPLATES[key];
    if (!t) return;  // Exit if template not found
    
    // Remove selected state from all template buttons
    document.querySelectorAll(".template-btn").forEach(function (b) {
      b.classList.remove("selected");
    });
    // Highlight the clicked template button so users see which template is active.
    event.target.classList.add("selected");
    
    // Fill form fields with template values
    setVal("projName", t.name);
    setVal("tagline", t.tag);
    setVal("description", t.desc);
    setVal("features", t.features);
    
    // Clear current technology selection and reset UI
    selectedTechs.clear();
    document.querySelectorAll(".tech-chip").forEach(function (c) {
      c.classList.remove("selected");
    });
    
    // Select all technologies from the template
    t.techs.forEach(function (tech) {
      selectedTechs.add(tech);
      // Highlight corresponding tech chips in the UI
      document.querySelectorAll(".tech-chip").forEach(function (c) {
        if (c.querySelector(".emoji") && c.textContent.includes(tech))
          c.classList.add("selected");
      });
    });
    
    updateTechCount();  // Update tech count display
    scheduleRender();   // Trigger preview update
    toast("✓ Template applied!");  // Show success message
  }
  window.applyTemplate = applyTemplate;  // Expose globally for HTML onclick handlers

  // ── STRUCTURE VISUALIZER ──────────────────────────────────────
  /**
   * Converts a simple text-based folder structure into a visually formatted tree.
   * Supports indentation (via spaces) and converts to tree symbols (├─, └─, │).
   *
   * @function convertStructure
   * @param {string} raw - Raw text structure with indentation (2 spaces per level)
   * @returns {string} - Formatted tree structure with box-drawing characters
   *
   * EXAMPLE INPUT:
   *   src/
   *     components/
   *       Button.js
   *     index.js
   *
   * EXAMPLE OUTPUT:
   *   📦 MyProject
   *    ┣ 📂 src
   *    ┃  ┣ 📂 components
   *    ┃  ┃  ┗ 📜 Button.js
   *    ┗ 📜 index.js
   */
  function convertStructure(raw) {
    if (!raw.trim()) return "";  // Return empty if no input
    
    var lines = raw.split("\n");
    var result = [];
    var projectName = v("projName") || "project";
    result.push("📦 " + projectName);  // Add project name as root

    // Helper function to determine nesting depth based on leading spaces
    // Each 2 spaces = 1 level deep
    function getDepth(line) {
      var m = line.match(/^(\s*)/);
      return m ? Math.floor(m[1].length / 2) : 0;
    }

    // Process each line
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trimEnd();
      if (!line.trim()) continue;  // Skip empty lines
      
      var depth = getDepth(line);  // How deep is this item?
      var name = line.trim();
      var isDir = name.endsWith("/");  // Is it a directory (ends with /)?
      var cleanName = name.replace(/\/$/, "");  // Remove trailing slash
      
      // Check if this is the last item at this depth (determines symbol)
      var isLast = true;
      for (var j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() && getDepth(lines[j]) === depth) {
          isLast = false;  // Found a sibling below
          break;
        }
        if (lines[j].trim() && getDepth(lines[j]) < depth) break;  // Went back up a level
      }
      
      // Build the prefix (vertical lines and indentation)
      var prefix = "";
      for (var d = 0; d < depth; d++) {
        // Check if parent at this level is the last child
        var parentIsLast = true;
        for (var k = i - 1; k >= 0; k--) {
          if (lines[k].trim() && getDepth(lines[k]) === d) {
            // Found parent at level d, check if it's last
            for (var l = i + 1; l < lines.length; l++) {
              if (lines[l].trim() && getDepth(lines[l]) === d) {
                parentIsLast = false;  // Parent has siblings
                break;
              }
              if (lines[l].trim() && getDepth(lines[l]) < d) break;
            }
            break;
          }
        }
        // Add vertical line (│) or space depending on parent's status
        prefix += parentIsLast ? "   " : " ┃ ";
      }
      
      // Choose the connector symbol: ┗ for last, ┣ for others
      var symbol = isLast ? " ┗ " : " ┣ ";
      // Choose the icon: folder or file
      var icon = isDir ? "📂 " : "📜 ";
      result.push(prefix + symbol + icon + cleanName);
    }
    return result.join("\n");
  }

  /**
   * Updates the structure preview when the user types in the raw structure input.
   * Calls convertStructure() to format the input and displays it in preview element.
   *
   * @function updateStructurePreview
   * @returns {void}
   */
  function updateStructurePreview() {
    var raw = v("rawStructure");  // Get raw input from textarea
    var preview = convertStructure(raw);  // Convert to formatted tree
    // Display preview or placeholder message
    document.getElementById("structPreview").textContent =
      preview || "Paste structure above to preview...";
    scheduleRender();  // Update the main preview
  }
  window.updateStructurePreview = updateStructurePreview;  // Expose globally for HTML

  // ── SCREENSHOT MANAGEMENT ────────────────────────────────────────
  /**
   * Sets up file drop zone for screenshot uploads.
   * Allows users to click or drag-and-drop image files to upload.
   * Only image files are processed.
   *
   * @function setupDropZone
   * @returns {void}
   */
  function setupDropZone() {
    var dz = document.getElementById("dropZone");  // Drop zone container
    var fi = document.getElementById("fileInput");  // Hidden file input
    
    // Click drop zone to open file picker
    dz.addEventListener("click", function () {
      fi.click();
    });
    
    // Show visual feedback when dragging files over drop zone
    dz.addEventListener("dragover", function (e) {
      e.preventDefault();  // Allow drop
      dz.classList.add("dragover");  // Highlight drop zone
    });
    
    // Remove highlight when user drags away
    dz.addEventListener("dragleave", function () {
      dz.classList.remove("dragover");
    });
    
    // Handle dropped files
    dz.addEventListener("drop", function (e) {
      e.preventDefault();  // Prevent browser default behavior
      dz.classList.remove("dragover");  // Remove highlight
      handleFiles(e.dataTransfer.files);  // Process dropped files
    });
    
    // Handle files selected from file picker
    fi.addEventListener("change", function () {
      handleFiles(fi.files);
    });
  }

  /**
   * Processes uploaded files and converts images to data URLs.
   * Only image files are accepted; other file types are ignored.
   * Stores screenshots in the screenshots array.
   *
   * @function handleFiles
   * @param {FileList} files - Files from file input or drop event
   * @returns {void}
   */
  function handleFiles(files) {
    // Process each file
    Array.from(files).forEach(function (file) {
      // Skip non-image files
      if (!file.type.startsWith("image/")) return;
      
      // Create FileReader to convert file to data URL
      var reader = new FileReader();
      reader.onload = function (e) {
        // Store screenshot with name and base64 data URL
        screenshots.push({ name: file.name, dataUrl: e.target.result });
        renderScreenshotList();  // Update screenshot list UI
        scheduleRender();        // Update preview
      };
      // Convert file to data URL (base64)
      reader.readAsDataURL(file);
    });
  }

  /**
   * Renders the list of uploaded screenshots in the UI.
   * Shows thumbnail preview, file name, and delete button for each screenshot.
   *
   * @function renderScreenshotList
   * @returns {void}
   */
  function renderScreenshotList() {
    var el = document.getElementById("screenshotList");
    el.innerHTML = "";  // Clear previous list
    
    // Create a card for each screenshot
    screenshots.forEach(function (ss, idx) {
      var div = document.createElement("div");
      div.className = "screenshot-item";
      // Build HTML with image preview, name, and delete button
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

  /**
   * Removes a screenshot from the list by its index.
   * Updates the UI and preview after removal.
   *
   * @function removeScreenshot
   * @param {number} idx - Index of the screenshot to remove
   * @returns {void}
   */
  window.removeScreenshot = function (idx) {
    screenshots.splice(idx, 1);  // Remove screenshot from array
    renderScreenshotList();      // Update UI
    scheduleRender();            // Update preview
  };

  // ── MARKDOWN GENERATION ───────────────────────────────────────
  /**
   * Generates the complete README markdown based on current form state.
   * Builds sections dynamically based on which sections are enabled.
   * Includes title, description, features, tech stack, installation, usage,
   * project structure, screenshots, API docs, contributing, and author info.
   *
   * @function generateMarkdown
   * @returns {string} - Complete README markdown content
   *
   * LOGIC:
   * 1. Collects all form input values
   * 2. Iterates through each section
   * 3. For enabled sections, builds appropriate markdown
   * 4. Formats lists, tables, badges, and links as needed
   * 5. Returns complete markdown string
   */
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

    // ─ SECTION 1: Title, Badges & Table of Contents ─
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

    // ─ SECTION 2: Description ─
    if (on("description")) {
      md += "## 📌 Description\n\n";
      md += (desc || "_Add a description of your project here._") + "\n\n";
      if (demoUrl)
        md += "🔗 **Live Demo:** [" + demoUrl + "](" + demoUrl + ")\n\n";
      md += "---\n\n";
    }

    // ─ SECTION 3: Features ─
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

    // ─ SECTION 4: Tech Stack (organized by layer) ─
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

    // ─ SECTION 5: Installation & Prerequisites ─
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

    // ─ SECTION 6: Usage ─
    if (on("usage")) {
      md +=
        "## 💻 Usage\n\n```bash\n" +
        (usageCmd || "# Add your run command here") +
        "\n```\n\n---\n\n";
    }

    // ─ SECTION 7: Project Structure ─
    if (on("structure") && rawStruct.trim()) {
      md +=
        "## 📁 Project Structure\n\n```\n" +
        convertStructure(rawStruct) +
        "\n```\n\n---\n\n";
    }

    // ─ SECTION 8: Screenshots & Demo ─
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

    // ─ SECTION 9: API Reference ─
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

    // ─ SECTION 10: Contributing Guidelines ─
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

    // ─ SECTION 11: License & Author ─
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

  // ── README Quality Score ──────────────────────────────────────
  var qualityPanelOpen = false;

  function calculateQuality() {
    var score = 0;
    var suggestions = [];

    // Project name (10 pts)
    var name = v("projName");
    if (name) {
      score += 10;
    } else {
      suggestions.push({ icon: "📌", text: "Add a project name to identify your project." });
    }

    // Tagline (5 pts)
    var tagline = v("tagline");
    if (tagline) {
      score += 5;
    } else {
      suggestions.push({ icon: "💬", text: "Add a tagline — a one-line summary of what your project does." });
    }

    // GitHub user + repo (5 pts)
    var ghUser = v("ghUser") || v("authorGh");
    var repoSlug = v("repoSlug");
    if (ghUser && repoSlug) {
      score += 5;
    } else {
      suggestions.push({ icon: "🔗", text: "Fill in your GitHub username and repository name for accurate badge links." });
    }

    // Description (15 pts — tiered by word count)
    var desc = v("description");
    var descWords = desc ? desc.trim().split(/\s+/).filter(function(w) { return w.length > 0; }).length : 0;
    if (descWords >= 30) {
      score += 15;
    } else if (descWords >= 15) {
      score += 8;
      suggestions.push({ icon: "📋", text: "Expand your description to at least 30 words for a better explanation of your project." });
    } else if (descWords > 0) {
      score += 3;
      suggestions.push({ icon: "📋", text: "Your description is very short. Aim for at least 30 words to clearly explain your project." });
    } else {
      suggestions.push({ icon: "📋", text: "Add a description explaining what your project does and the problem it solves." });
    }

    // Features (15 pts)
    var features = v("features");
    if (sectionState["features"] && features && features.trim().length > 20) {
      score += 15;
    } else if (sectionState["features"] && features && features.trim().length > 0) {
      score += 7;
      suggestions.push({ icon: "✨", text: "Expand the Features section with more detail — group features with ### headings and bullet points." });
    } else {
      suggestions.push({ icon: "✨", text: "Enable and fill in the Features section to highlight what makes your project stand out." });
    }

    // Tech stack (10 pts)
    var customTech = v("customTech");
    var totalTechs = selectedTechs.size + (customTech ? customTech.split(",").filter(function(t) { return t.trim(); }).length : 0);
    if (totalTechs >= 3) {
      score += 10;
    } else if (totalTechs >= 1) {
      score += 5;
      suggestions.push({ icon: "🛠️", text: "Select at least 3 technologies in the Tech Stack section for a complete picture." });
    } else {
      suggestions.push({ icon: "🛠️", text: "Select your tech stack — let readers know what technologies power your project." });
    }

    // Installation commands (10 pts)
    var installCmds = v("installCmds");
    if (sectionState["installation"] && installCmds && installCmds.trim().length > 0) {
      score += 10;
    } else if (sectionState["installation"]) {
      score += 4;
      suggestions.push({ icon: "🚀", text: "Add installation commands so others can easily set up your project." });
    } else {
      suggestions.push({ icon: "🚀", text: "Enable the Installation section and add setup commands for your project." });
    }

    // Usage (5 pts)
    var usageCmd = v("usageCmd");
    if (sectionState["usage"] && usageCmd && usageCmd.trim().length > 0) {
      score += 5;
    } else {
      suggestions.push({ icon: "💻", text: "Add usage instructions or a run command to the Usage section." });
    }

    // Author info (5 pts)
    var authorName = v("authorName");
    var authorGh = v("authorGh");
    if (sectionState["author"] && (authorName || authorGh)) {
      score += 5;
    } else {
      suggestions.push({ icon: "👤", text: "Fill in author details (name or GitHub username) in the License & Author section." });
    }

    // Screenshots / demo (5 pts)
    var videoUrl = v("videoUrl");
    var imageUrls = v("imageUrls");
    if (sectionState["screenshots"] && (screenshots.length > 0 || videoUrl || imageUrls.trim())) {
      score += 5;
    } else {
      suggestions.push({ icon: "🖼️", text: "Add screenshots or a demo video/link to give readers a visual preview." });
    }

    // Live demo URL (5 pts)
    var demoUrl = v("demoUrl");
    if (demoUrl && demoUrl.trim()) {
      score += 5;
    } else {
      suggestions.push({ icon: "🔗", text: "Add a live demo URL if your project is deployed online." });
    }

    // Contributing section active (5 pts)
    if (sectionState["contributing"]) {
      score += 5;
    } else {
      suggestions.push({ icon: "🤝", text: "Enable the Contributing section to invite community contributions." });
    }

    // License active (5 pts)
    var license = document.getElementById("license").value;
    if (sectionState["author"] && license !== "none") {
      score += 5;
    } else if (license === "none") {
      suggestions.push({ icon: "📄", text: "Choose a license to clarify how others can use your project." });
    }

    return { score: Math.min(score, 100), suggestions: suggestions };
  }

  function updateQualityPanel(quality) {
    var panel = document.getElementById("qualityPanel");
    var badge = document.getElementById("qualityScoreBadge");
    var label = document.getElementById("qualityLabel");
    var ringFill = document.getElementById("qualityRingFill");
    var ringNum = document.getElementById("qualityRingNum");
    var scoreMain = document.getElementById("qualityScoreMain");
    var scoreSub = document.getElementById("qualityScoreSub");
    var barFill = document.getElementById("qualityBarFill");
    var suggestionsEl = document.getElementById("qualitySuggestions");

    if (!panel) return;

    var score = quality.score;
    var maxPercentage = 100; // stroke-dasharray uses a 0–100 percentage scale
    var fillAmount = score;

    // Color tier
    var color, labelText, subText;
    if (score >= 80) {
      color = "#10b981"; // green
      labelText = "Excellent";
      subText = "Your README is comprehensive and well-structured!";
    } else if (score >= 55) {
      color = "#f59e0b"; // yellow
      labelText = "Good";
      subText = "A few improvements will make your README stand out.";
    } else if (score >= 30) {
      color = "#f97316"; // orange
      labelText = "Needs Work";
      subText = "Add more details to make your README more helpful.";
    } else {
      color = "#f43f5e"; // red
      labelText = "Incomplete";
      subText = "Fill in the key sections to get started.";
    }

    // Show panel
    if (currentMd.trim()) {
      panel.style.display = "";
    } else {
      panel.style.display = "none";
      return;
    }

    badge.textContent = score;
    badge.style.background = color + "33";
    badge.style.borderColor = color + "66";
    badge.style.color = color;

    label.textContent = labelText;
    label.style.color = color;

    ringFill.setAttribute("stroke-dasharray", fillAmount + " " + (maxPercentage - fillAmount));
    ringFill.style.stroke = color;

    ringNum.textContent = score;
    ringNum.style.color = color;

    scoreMain.textContent = score + " / 100";
    scoreMain.style.color = color;

    scoreSub.textContent = subText;

    barFill.style.width = score + "%";
    barFill.style.background = color;

    // Suggestions
    suggestionsEl.innerHTML = "";
    if (quality.suggestions.length === 0) {
      var perfect = document.createElement("div");
      perfect.className = "quality-suggestion quality-suggestion--good";
      perfect.innerHTML = '<span class="qs-icon">🎉</span><span class="qs-text">All key sections are complete — great job!</span>';
      suggestionsEl.appendChild(perfect);
    } else {
      var heading = document.createElement("div");
      heading.className = "quality-suggestions-heading";
      heading.textContent = "Suggestions to improve";
      suggestionsEl.appendChild(heading);
      quality.suggestions.forEach(function(s) {
        var item = document.createElement("div");
        item.className = "quality-suggestion";
        item.innerHTML = '<span class="qs-icon">' + s.icon + '</span><span class="qs-text">' + s.text + '</span>';
        suggestionsEl.appendChild(item);
      });
    }
  }

  function toggleQualityPanel() {
    qualityPanelOpen = !qualityPanelOpen;
    var body = document.getElementById("qualityPanelBody");
    var chevron = document.getElementById("qualityChevron");
    if (body) body.style.display = qualityPanelOpen ? "" : "none";
    if (chevron) chevron.style.transform = qualityPanelOpen ? "" : "rotate(-90deg)";
  }
  window.toggleQualityPanel = toggleQualityPanel;

  // ── Render ────────────────────────────────────────────────────
  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 120);
    scheduleSave();
  }
  window.scheduleRender = scheduleRender;  // Expose globally for HTML

  /**
   * Renders the current markdown to the preview panel.
   * Displays either formatted HTML preview or raw markdown depending on currentTab.
   * Shows empty state if no content generated.
   *
   * @function render
   * @returns {void}
   */
  function render() {
    currentMd = generateMarkdown();  // Generate markdown from current state
    var body = document.getElementById("previewBody");
    
    // Show empty state if no content
    if (!currentMd.trim()) {
      body.innerHTML =
        '<div class="empty-preview"><div class="icon">📄</div><h3>Live preview appears here</h3><p>Start filling in the editor →</p></div>';
      updateQualityPanel({ score: 0, suggestions: [] });
      return;
    }
    
    // Render appropriate view based on tab selection
    if (currentTab === "rendered") {
      // Display as formatted HTML (GitHub-style preview)
      body.innerHTML =
        '<div class="gh-preview">' + md2html(currentMd) + "</div>";
    } else {
      // Display raw markdown (escaped for viewing)
      body.innerHTML = '<div class="raw-view">' + esc(currentMd) + "</div>";
    }
    updateQualityPanel(calculateQuality());
  }

  /**
   * Switches between rendered and raw markdown views.
   * Updates the active tab indicator and re-renders the preview.
   *
   * @function setTab
   * @param {string} tab - Tab to switch to: 'rendered' or 'raw'
   * @returns {void}
   */
  function setTab(tab) {
    currentTab = tab;  // Update current tab state
    // Update tab button styling
    document
      .getElementById("tabRendered")
      .classList.toggle("active", tab === "rendered");
    document.getElementById("tabRaw").classList.toggle("active", tab === "raw");
    render();  // Re-render preview for selected tab
  }
  window.setTab = setTab;  // Expose globally for HTML onclick handlers

  // ── MARKDOWN UTILITIES ────────────────────────────────────────
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

  /**
   * Parses shields.io URLs and renders them as styled badge HTML.
   * Extracts color, left text, and right text from shields.io URL format.
   * Handles both shields.io format and custom badges.
   *
   * @function shieldToBadge
   * @param {string} label - Display label for the badge
   * @param {string} url - shields.io URL or badge image URL
   * @returns {string} - HTML span with styled badge
   *
   * URL FORMAT EXAMPLES:
   * - https://img.shields.io/badge/license-MIT-green
   * - https://img.shields.io/github/stars/user/repo?style=social
   */
  function shieldToBadge(label, url) {
    var isShield = url.indexOf("shields.io") !== -1;
    if (!isShield)
      return (
        '<span class="gh-badge" style="background:#555;color:#fff">' +
        label +
        "</span>"
      );
    // Initialize badge parts - extracted from URL or defaults
    var color = "#555",  // Default color (dark gray)
      left = label || "",   // Left text (label part)
      right = "",           // Right text (value part)
      m;                    // Regex match variable
    // Parse shields.io badge URL format: /badge/LEFT-RIGHT-COLOR
    m = url.match(/\/badge\/([^?]+)/);
    if (m) {
      var parts = m[1].split("-");
      if (parts.length >= 3) {
        // Format: label-label-value-color (3+ parts)
        right = parts[parts.length - 2];  // Value (second to last)
        var col = parts[parts.length - 1].split("?")[0];  // Color (last)
        color = BADGE_COLORS[col] || "#" + col;  // Map to hex or use as-is
        left = parts
          .slice(0, parts.length - 2)  // Everything except value and color
          .join(" ")
          .replace(/_/g, " ");  // Replace underscores with spaces
      } else if (parts.length === 2) {
        // Format: label-value
        right = parts[1].split("?")[0];  // Value
        color = "#22c55e";  // Green
        left = parts[0].replace(/_/g, " ");  // Label
      } else {
        // Format: single-part
        left = parts[0].replace(/_/g, " ");
        color = "#3b82f6";  // Blue
      }
    }
    // Handle GitHub API badges (they need special parsing)
    if (!m) {
      if (url.indexOf("/github/stars") !== -1) {
        // GitHub stars badge
        left = "Stars";
        right = "★";
        color = "#f59e0b";  // Amber
      } else if (url.indexOf("/github/forks") !== -1) {
        // GitHub forks badge
        left = "Forks";
        right = "⑂";
        color = "#8b5cf6";  // Purple
      } else if (url.indexOf("/github/issues") !== -1) {
        // GitHub issues badge
        left = "Issues";
        right = "●";
        color = "#ef4444";  // Red
      } else {
        // Unknown badge format
        left = label;
        color = "#3b82f6";  // Blue
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

  /**
   * Converts Markdown syntax to HTML.
   * Supports: headings, bold, italic, code, links, images, tables,
   * blockquotes, lists, and GitHub-style shields.io badges.
   *
   * @function md2html
   * @param {string} md - Markdown text to convert
   * @returns {string} - HTML string
   *
   * FEATURES:
   * - Headings (h1, h2, h3)
   * - Bold (**), Italic (*), Code backticks (`)
   * - Links [text](url) and images ![alt](url)
   * - Tables (GitHub-flavored markdown)
   * - Lists (unordered and ordered)
   * - Blockquotes (>
   * - Horizontal rules (---)
   * - Special handling for shields.io badges
   */
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

  /**
   * Escapes HTML special characters to prevent XSS and formatting issues.
   * Converts &, <, > to HTML entities.
   *
   * @function esc
   * @param {*} s - String to escape
   * @returns {string} - Escaped HTML string
   *
   * PURPOSE: Used when displaying raw markdown code to prevent
   * the browser from interpreting HTML tags
   */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // ── EXPORT UTILITIES ──────────────────────────────────────────
  /**
   * Copies the generated markdown to the user's clipboard.
   * Uses modern Clipboard API if available, falls back to older method.
   * Shows toast notification on success or failure.
   *
   * @function copyMarkdown
   * @returns {void}
   */
  function copyMarkdown() {
    if (!currentMd) {
      toast("Generate content first!");
      return;
    }
    
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(currentMd)
        .then(function () {
          toast("✓ Copied to clipboard!");
        })
        .catch(fbCopy);  // Fall back on error
    } else {
      // Fall back to older method
      fbCopy();
    }
    
    // Fallback copy method for older browsers
    function fbCopy() {
      // Create temporary textarea (off-screen)
      var ta = document.createElement("textarea");
      ta.value = currentMd;
      ta.style.cssText = "position:absolute;left:-9999px";
      document.body.appendChild(ta);
      ta.select();  // Select all text
      try {
        document.execCommand("copy");  // Copy to clipboard
        toast("✓ Copied!");
      } catch (e) {
        toast("Copy failed");
      }
      document.body.removeChild(ta);  // Clean up
    }
  }
  window.copyMarkdown = copyMarkdown;  // Expose globally for HTML

  /**
   * Closes the download/export modal overlay.
   *
   * @function closeDownloadModal
   * @returns {void}
   */
  function closeDownloadModal() {
    var overlay = document.getElementById("downloadModalOverlay");
    if (overlay) overlay.classList.add("hidden");  // Hide modal
  }
  window.closeDownloadModal = closeDownloadModal;  // Expose globally for HTML

  /**
   * Opens the browser's print dialog to save markdown as PDF.
   * Creates a hidden iframe with styled HTML content and triggers print.
   * The user can select "Save as PDF" from the print dialog.
   *
   * @function downloadPDF
   * @returns {void}
   */
  function downloadPDF() {
    if (!currentMd) {
      toast("Nothing to download yet!");
      return;
    }

    toast("Opening print dialog...");

    // Create hidden iframe for print rendering
    var printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.top = '-9999px';  // Move off-screen
    printIframe.style.left = '-9999px';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);

    // Write styled HTML to iframe
    var doc = printIframe.contentWindow.document;
    var htmlContent = md2html(currentMd);  // Convert markdown to HTML

    // Write complete HTML document with print styling
    doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>README Preview</title>
          <link rel="stylesheet" href="readmeforge.css">
          <style>
            :root {
              --bg: #ffffff;          /* Light background for print */
              --text: #000000;        /* Black text for print */
              --border: #e2e8f0;
              --surface: #ffffff;
            }
            body { 
              background: white !important; 
              color: black !important; 
              padding: 40px !important;
              font-family: sans-serif;
            }
            .gh-preview { 
              max-width: 900px; 
              margin: 0 auto; 
            }
            @media print {
              body { padding: 0 !important; }   /* Remove padding when printing */
              .gh-preview { width: 100%; }      /* Full width on paper */
            }
          </style>
        </head>
        <body>
          <div class="gh-preview">
            ${htmlContent}
          </div>
          <script>
            // Auto-open print dialog and cleanup after done
            window.onload = function() {
              setTimeout(function() {
                window.print();  // Open browser print dialog
                // Remove iframe after print (whether user prints or cancels)
                setTimeout(function() {
                  window.frameElement.parentNode.removeChild(window.frameElement);
                }, 1000);
              }, 500);
            };
          </script>
        </body>
        </html>
      `);
    doc.close();  // Finish writing to document
  }
  window.downloadPDF = downloadPDF;  // Expose globally for HTML

  /**
   * Downloads the generated markdown as a README.md file.
   * Creates a blob from the markdown text and triggers browser download.
   *
   * @function downloadMd
   * @returns {void}
   */
  function downloadMd() {
    if (!currentMd) {
      toast("Nothing to download yet!");
      return;
    }
    
    // Create a blob from the markdown content
    var blob = new Blob([currentMd], { type: "text/markdown" });
    // Create a temporary download link
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "README.md";  // Set download filename
    document.body.appendChild(a);
    a.click();  // Trigger download
    document.body.removeChild(a);  // Clean up
    toast("✓ README.md downloaded!");
  }
  window.downloadMd = downloadMd;  // Expose globally for HTML


  /**
   * Resets all form fields and application state to defaults.
   * Clears all user input, selections, and uploaded files.
   * Re-initializes UI components to show default state.
   *
   * @function resetAll
   * @returns {void}
   */
  function resetAll() {
    // Clear all text inputs, email inputs, URLs, and textareas
    document
      .querySelectorAll(
        "input[type=text],input[type=email],input[type=url],textarea",
      )
      .forEach(function (el) {
        el.value = "";
      });
    
    // Reset license to default
    document.getElementById("license").value = "MIT";
    
    // Clear all selections and reset to defaults
    selectedTechs.clear();
    selectedBadges.clear();
    // Re-add default badges
    selectedBadges.add("license");
    selectedBadges.add("stars");
    selectedBadges.add("prs");
    
    // Clear screenshots
    screenshots = [];
    document.getElementById("screenshotList").innerHTML = "";
    
    // Reset structure preview
    document.getElementById("structPreview").textContent =
      "Paste structure above to preview...";
    
    // Deselect all tech chips ui
    document.querySelectorAll(".tech-chip").forEach(function (c) {
      c.classList.remove("selected");
    });
    
    // Deselect all template buttons
    document.querySelectorAll(".template-btn").forEach(function (c) {
      c.classList.remove("selected");
    });
    
    // Rebuild UI components with reset state
    buildBadgePicker();
    updateTechCount();
    
    // Reset all sections to their default enabled/disabled state
    SECTIONS.forEach(function (s) {
      sectionState[s.id] = s.default;
    });
    
    // Reset word count displays
    counts.forEach((count) => count.textContent = '0')
    
    // Rebuild section toggles UI
    buildSectionToggles();
    updateSectionCount();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear saved data on reset:", e);
    }
    scheduleRender();
    toast("✓ Reset complete!");
  }
  window.resetAll = resetAll;  // Expose globally for HTML

  // ── HELPERS ───────────────────────────────────────────────────
  /**
   * Shows a temporary notification toast message.
   * Displays for 2.5 seconds then fades out.
   * Used for user feedback (success, error, info messages).
   *
   * @function toast
   * @param {string} msg - Message to display
   * @returns {void}
   */
  function toast(msg) {
    var t = document.getElementById("toast");  // Get toast element
    t.textContent = msg;  // Set message
    t.classList.add("show");  // Show toast
    // Hide after 2.5 seconds
    setTimeout(function () {
      t.classList.remove("show");
    }, 2500);
  }

  /**
   * Gets the trimmed value from a form element by ID.
   * Returns empty string if element not found.
   *
   * @function v
   * @param {string} id - Element ID
   * @returns {string} - Trimmed value or empty string
   */
  function v(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }
  
  /**
   * Sets the value of a form element by ID.
   * Does nothing if element not found.
   *
   * @function setVal
   * @param {string} id - Element ID
   * @param {string} val - Value to set
   * @returns {void}
   */
  function setVal(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val;
  }

  /**
   * Enables real-time word counting on a text input element.
   * Updates a counter display as user types.
   * Filters out special markdown tokens (### and -) to show actual word count.
   * Handles singular/plural display ("Word" vs "Words").
   *
   * @function enableWordCount
   * @param {HTMLElement} inputEl - Text input or textarea element
   * @param {HTMLElement} countEl - Element to display word count number
   * @param {HTMLElement} wordCountText - Element to display "Word" or "Words"
   * @returns {void}
   */
  function enableWordCount(inputEl, countEl, wordCountText) {
    inputEl.addEventListener("input", () => {
      const text = inputEl.value.trim();

      // Split text by whitespace to get word array
      let words = text ? text.split(/\s+/) : [];

      // Filter out markdown syntax tokens (### for headings, - for lists)
      words = words.filter(word => word !== "###" && word !== "-");

      // Update counter display
      countEl.textContent = words.length;
      
      // Update label (singular/plural)
      if (words.length === 1) {
        wordCountText.textContent = "Word";
      } else {
        wordCountText.textContent = "Words";
      }
    });
  }


  init();
})();
