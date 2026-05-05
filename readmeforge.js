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
    "projName",
    "tagline",
    "ghUser",
    "repoSlug",
    "description",
    "demoUrl",
    "features",
    "prereqs",
    "installCmds",
    "envVars",
    "usageCmd",
    "rawStructure",
    "videoUrl",
    "imageUrls",
    "apiDocs",
    "apiBase",
    "contribNotes",
    "authorName",
    "authorGh",
    "authorEmail",
    "authorLinkedin",
    "authorWebsite",
    "customTech",
  ];

  function saveToLocalStorage() {
    var data = {
      fields: {},
      license: (document.getElementById("license") || {}).value || "MIT",
      techs: Array.from(selectedTechs),
      badges: Array.from(selectedBadges),
      sections: Object.assign({}, sectionState),
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
        if (el && typeof data.fields[id] === "string")
          el.value = data.fields[id];
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
      icon: "type",
      el: "sec-title",
      default: true,
    },
    {
      id: "description",
      label: "Description",
      icon: "file-text",
      el: "sec-description",
      default: true,
    },
    {
      id: "features",
      label: "Features",
      icon: "star",
      el: "sec-features",
      default: true,
    },
    {
      id: "techstack",
      label: "Tech Stack",
      icon: "layers",
      el: "sec-techstack",
      default: true,
    },
    {
      id: "installation",
      label: "Installation",
      icon: "download",
      el: "sec-installation",
      default: true,
    },
    {
      id: "usage",
      label: "Usage",
      icon: "terminal",
      el: "sec-usage",
      default: true,
    },
    {
      id: "structure",
      label: "Folder Structure",
      icon: "folder-tree",
      el: "sec-structure",
      default: true,
    },
    {
      id: "screenshots",
      label: "Screenshots",
      icon: "image",
      el: "sec-screenshots",
      default: true,
    },
    {
      id: "api",
      label: "API Docs",
      icon: "zap",
      el: "sec-api",
      default: false,
    },
    {
      id: "contributing",
      label: "Contributing",
      icon: "users",
      el: "sec-contributing",
      default: true,
    },
    {
      id: "author",
      label: "License & Author",
      icon: "shield",
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
    {
      label: "Python",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.25.3a5.25 5.25 0 00-4.39 2.02 5.25 5.25 0 00-1.11 3.23h5.25V7.8h-7.5A5.25 5.25 0 001.25 13v2.25a5.25 5.25 0 005.25 5.25h1.12a5.25 5.25 0 004.38-2.02 5.25 5.25 0 001.11-3.23V10.3h5.25V7.8h-5.25V5.55A5.25 5.25 0 0118.5.3H14.25zM9.25 3.3a1.13 1.13 0 110 2.25 1.13 1.13 0 010-2.25zM14.75 18.45a1.13 1.13 0 110 2.25 1.13 1.13 0 010-2.25z"/></svg>',
    },
    {
      label: "FastAPI",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L1 6v12l11 6 11-6V6l-11-6zm0 2.2L20.8 7 12 11.8 3.2 7 12 2.2zM12 21.8L3.2 17V8.5L12 13.3l8.8-4.8V17l-8.8 4.8z"/></svg>',
    },
    {
      label: "JavaScript",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.045-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.81-.12-1.26-.435-1.635-1.095-.45.315-1.525 1.065-1.525 1.065.42.6 1.005 1.155 1.77 1.56 1.02.51 2.4.51 3.27-.075 1.304-.9 1.484-2.325 1.14-3.435zM9.165 15.656c0-.96-.765-1.365-1.591-1.365-.735 0-1.485.405-1.485 1.365 0 1.035.734 1.455 1.589 1.455.856-.001 1.487-.421 1.487-1.455z"/></svg>',
    },
    {
      label: "TypeScript",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zM17.29 5.735h2.12V7.6h-2.12v8.94c0 1.23.41 1.83 1.5 1.83.25 0 .49-.02.7-.07v1.75c-.47.16-1.11.23-1.77.23-2.14 0-3.15-1.16-3.15-3.32V7.6h-1.63V5.735h1.63V3.13l2.72-.82v3.425zM6.165 7.6h1.92v2.12H6.165V18.15H3.45V9.72h-1.34V7.6h1.34V6.16c0-2.31 1.36-3.52 3.66-3.52.48 0 .91.03 1.25.1v1.94c-.16-.03-.39-.05-.62-.05-.98 0-1.57.45-1.57 1.53V7.6z"/></svg>',
    },
    {
      label: "React",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12c0 2.37-2.61 4.54-6.84 5.92-.47.15-.95.29-1.44.42a4.4 4.4 0 01-.13.88c-.28 1.15-.81 2.13-1.49 2.8-.75.75-1.57 1.11-2.4 1.11s-1.65-.36-2.4-1.11c-.68-.67-1.21-1.65-1.49-2.8-.05-.22-.09-.45-.13-.67-.5.13-.98.26-1.46.4-4.23 1.38-6.84-1.22-6.84-3.6 0-1.76 1.45-3.5 4.14-4.78.29-.14.58-.27.89-.39-.06-.29-.11-.59-.14-.88-.17-1.25-.13-2.45.14-3.5.34-1.31 1-2.38 1.86-3.1.84-.7 1.8-.97 2.76-.97s1.92.27 2.76.97c.86.72 1.52 1.79 1.86 3.1.27 1.05.31 2.25.14 3.5-.03.29-.08.59-.14.88.31.12.6.25.89.39 2.69 1.28 4.14 3.02 4.14 4.78zm-12 1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm9.64-1.5c0-1.07-1.18-2.5-3.64-3.67-.32-.15-.65-.29-1-.42-.23.63-.42 1.28-.58 1.95a12.8 12.8 0 001.35.53c2.47.8 3.87 1.61 3.87 2.4 0 .79-1.4 1.6-3.87 2.4a12.8 12.8 0 00-1.35.53c.16.67.35 1.32.58 1.95.35-.13.68-.27 1-.42 2.46-1.17 3.64-2.6 3.64-3.67zm-9.64 8.64c.56 0 1.07-.22 1.53-.68.51-.51.93-1.28 1.15-2.2.14-.6.21-1.22.21-1.85-.35-.07-.7-.16-1.04-.26a12.8 12.8 0 00-1.85-.36 12.8 12.8 0 00-1.85.36c-.34.1-.69.19-1.04.26 0 .63.07 1.25.21 1.85.22.92.64 1.69 1.15 2.2.46.46.97.68 1.53.68zm-7.64-8.64c0-.79 1.4-1.6 3.87-2.4a12.8 12.8 0 001.35-.53c-.16-.67-.35-1.32-.58-1.95-.35.13-.68.27-1 .42-2.46 1.17-3.64 2.6-3.64 3.67 0 1.07 1.18 2.5 3.64 3.67.32.15.65.29 1 .42.23-.63.42-1.28.58-1.95a12.8 12.8 0 00-1.35-.53c-2.47-.8-3.87-1.61-3.87-2.4zm7.64-8.64c-.56 0-1.07.22-1.53.68-.51.51-.93 1.28-1.15 2.2-.14.6-.21 1.22-.21 1.85.35.07.7.16 1.04.26a12.8 12.8 0 001.85.36 12.8 12.8 0 001.85-.36c.34-.1.69-.19-1.04-.26 0-.63-.07-1.25-.21-1.85-.22-.92-.64-1.69-1.15-2.2-.46-.46-.97-.68-1.53-.68z"/></svg>',
    },
    {
      label: "Next.js",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.2 3.2C19 1.4 15.6.4 12 .4 5.6.4.4 5.6.4 12c0 6.4 5.2 11.6 11.6 11.6 3.6 0 7-1 9.2-2.8l-8.6-11v8h-2V7.4l1.6 1.6 8.6 11c1.2-1.8 1.8-4 1.8-6.4 0-6.4-5.2-11.6-11.6-11.6z"/></svg>',
    },
    {
      label: "Vue",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24,1.6L12,22.4L0,1.6h4.8l7.2,12.5l7.2-12.5H24z M17.9,1.6l-5.9,10.2L6.1,1.6h4.3l1.6,2.8l1.6-2.8H17.9z"/></svg>',
    },
    {
      label: "Node.js",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 6.2v10.4L12 23l9-5.2V6.2L12 1zm7.4 14.8l-7.4 4.3-7.4-4.3V7.2l7.4-4.3 7.4 4.3v8.6zM12 6.5c-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5-2.5-5.5-5.5-5.5zm0 9.4c-2.1 0-3.9-1.7-3.9-3.9s1.7-3.9 3.9-3.9 3.9 1.7 3.9 3.9-1.8 3.9-3.9 3.9z"/></svg>',
    },
    {
      label: "Express",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0zm9.461 14.331c-.347.168-.693.252-1.039.252-.693 0-1.04-.42-1.04-1.26 0-.84.347-1.26 1.04-1.26.346 0 .692.084 1.039.252v2.016zm3.32 0c-.346.168-.693.252-1.039.252-.693 0-1.04-.42-1.04-1.26 0-.84.347-1.26 1.04-1.26.346 0 .692.084 1.039.252v2.016zm2.772-2.016c.347 0 .693.084 1.04.252v2.016c-.347.168-.693.252-1.04.252-.693 0-1.039-.42-1.039-1.26 0-.84.346-1.26 1.039-1.26zm-2.016-5.04c.346 0 .692.084 1.039.252v2.016c-.347.168-.693.252-1.039.252-.693 0-1.04-.42-1.04-1.26 0-.84.347-1.26 1.04-1.26zm-3.32 0c.347 0 .693.084 1.04.252v2.016c-.347.168-.693.252-1.04.252-.693 0-1.039-.42-1.039-1.26 0-.84.346-1.26 1.039-1.26z"/></svg>',
    },
    {
      label: "Redis",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    },
    {
      label: "PostgreSQL",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>',
    },
    {
      label: "MongoDB",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.193 9.555c-1.134-4.503-4.534-8.112-4.534-8.112a.419.419 0 0 0-.659 0s-3.4 3.609-4.533 8.112c-1.127 4.475 1.157 8.01 1.157 8.01 1.258 1.954 3.666 3.197 3.707 3.218a.418.418 0 0 0 .339 0c.041-.021 2.449-1.264 3.707-3.218 0 0 2.344-3.535 1.216-8.01zM12 17.585a2.535 2.535 0 1 1 2.535-2.535A2.535 2.535 0 0 1 12 17.585z"/></svg>',
    },
    {
      label: "Tailwind",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624-1.177-1.194-2.538-2.576-5.512-2.576z"/></svg>',
    },
    {
      label: "Docker",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.983 11.078h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119a.186.186 0 0 1-.186-.186v-2.119c0-.102.084-.186.186-.186zM11.078 11.078h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119a.186.186 0 0 1-.186-.186v-2.119c0-.102.084-.186.186-.186zM11.078 8.174h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119a.186.186 0 0 1-.186-.186V8.36c0-.102.084-.186.186-.186zm2.905 0h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119a.186.186 0 0 1-.186-.186V8.36c0-.102.084-.186.186-.186zM8.174 11.078h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186H8.174a.186.186 0 0 1-.186-.186v-2.119c0-.102.084-.186.186-.186zm2.905-2.904h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119a.186.186 0 0 1-.186-.186V8.36c0-.102.084-.186.186-.186zm-2.905 0h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186H8.174a.186.186 0 0 1-.186-.186V8.36c0-.102.084-.186.186-.186zm5.81 0h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186h-2.119a.186.186 0 0 1-.186-.186V8.36c0-.102.084-.186.186-.186zm-8.714 2.904h2.119c.102 0 .186.084.186.186v2.119c0 .102-.084.186-.186.186H5.269a.186.186 0 0 1-.186-.186v-2.119c0-.102.084-.186.186-.186zm15.111-2.483c-.156-.37-.478-.65-.89-.78l-1.3-.4c-.11-.03-.22-.05-.33-.05h-.11v.11l.1.33 1.3.4c.14.04.25.13.31.26.13.31-.02.66-.34.79l-1.3.4c-.11.03-.22.05-.33.05h-.11v.11l.1.33 1.3.4c.14.04.25.13.31.26.13.31-.02.66-.34.79l-1.3.4c-.11.03-.22.05-.33.05h-.11v.11l.1.33 1.3.4c.31.1.66-.02.79-.34l.4-1.3c.1-.31-.02-.66-.34-.79l1.3-.4c.31-.1.43-.45.34-.76z"/></svg>',
    },
    {
      label: "AWS",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.14 11.2c-.37 0-.74.05-1.12.16-.38.11-.7.29-.96.53-.25.24-.45.54-.6.89-.15.35-.22.75-.22 1.21 0 .61.12 1.13.36 1.57.24.44.62.77 1.13.99.51.22 1.16.33 1.95.33.43 0 .86-.03 1.29-.09.43-.06.84-.16 1.24-.29v-2.22c-.32.14-.66.24-1.02.3-.36.06-.72.09-1.07.09-.59 0-1.01-.13-1.27-.38-.26-.25-.39-.63-.39-1.14s.13-.89.39-1.14c.26-.25.68-.38 1.27-.38.35 0 .71.03 1.07.09.36.06.7.16 1.02.3v-2.22c-.4-.13-.81-.23-1.24-.29a8.17 8.17 0 00-1.29-.09zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>',
    },
    {
      label: "Rust",
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
    },
  ];

  // selectedTechs stores the user-selected tech chips for README output.
  var selectedTechs = new Set();

  // ── Badge chips ──
  // BADGES contains all available README badge options.
  var BADGES = [
    { id: "license", label: "License", icon: "shield" },
    { id: "stars", label: "Stars", icon: "star" },
    { id: "forks", label: "Forks", icon: "git-fork" },
    { id: "issues", label: "Issues", icon: "info" },
    { id: "prs", label: "PRs", icon: "git-pull-request" },
    { id: "build", label: "Build", icon: "check-circle" },
    { id: "coverage", label: "Coverage", icon: "pie-chart" },
    { id: "version", label: "Version", icon: "tag" },
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
        '### <img src="https://unpkg.com/lucide-static@latest/icons/shield-check.svg" width="18" height="18" style="vertical-align: middle;"> Authentication\n- JWT-based login & registration\n- OAuth support\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/layout-dashboard.svg" width="18" height="18" style="vertical-align: middle;"> Dashboard\n- Real-time data visualization\n- Export to CSV\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/globe.svg" width="18" height="18" style="vertical-align: middle;"> API\n- RESTful API with full CRUD\n- Rate limiting & caching',
    },
    ml: {
      name: "ML Project",
      tag: "Machine learning model for image classification",
      techs: ["Python", "TensorFlow", "FastAPI", "Docker"],
      desc: "A machine learning project that achieves state-of-the-art results on benchmark datasets. Includes training pipeline, model evaluation, and a REST API for inference.",
      features:
        '### <img src="public/favicon.png" width="18" height="18" style="vertical-align: middle;"> Model\n- Custom CNN architecture\n- Transfer learning support\n\n### <img src="public/favicon.png" width="18" height="18" style="vertical-align: middle;"> Training\n- Mixed precision training\n- Early stopping & checkpointing\n\n### <img src="public/favicon.png" width="18" height="18" style="vertical-align: middle;"> Inference API\n- FastAPI endpoint\n- Batch prediction support',
    },
    api: {
      name: "Backend API",
      tag: "Production-ready REST API with authentication",
      techs: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker"],
      desc: "A scalable backend API built for production. Includes authentication, caching, rate limiting, and comprehensive API documentation.",
      features:
        '### <img src="https://unpkg.com/lucide-static@latest/icons/key-round.svg" width="18" height="18" style="vertical-align: middle;"> Auth\n- JWT + refresh tokens\n- Role-based access control\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/zap.svg" width="18" height="18" style="vertical-align: middle;"> Performance\n- Redis caching\n- Query optimization\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/book-open.svg" width="18" height="18" style="vertical-align: middle;"> Docs\n- Swagger / OpenAPI docs\n- Postman collection',
    },
    cli: {
      name: "CLI Tool",
      tag: "A powerful command-line tool",
      techs: ["Python", "Go"],
      desc: "A command-line tool that helps developers automate repetitive tasks. Supports plugins, configuration files, and shell completions.",
      features:
        '### <img src="https://unpkg.com/lucide-static@latest/icons/settings.svg" width="18" height="18" style="vertical-align: middle;"> Commands\n- Multiple sub-commands\n- Interactive prompts\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/plug.svg" width="18" height="18" style="vertical-align: middle;"> Plugins\n- Plugin system\n- Custom hooks\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/terminal.svg" width="18" height="18" style="vertical-align: middle;"> Shell\n- Bash/Zsh/Fish completions\n- Cross-platform support',
    },
    mobile: {
      name: "Mobile App",
      tag: "Cross-platform mobile app",
      techs: ["React", "TypeScript", "MongoDB"],
      desc: "A cross-platform mobile application built with React Native. Features offline support, push notifications, and a native feel on both iOS and Android.",
      features:
        '### <img src="https://unpkg.com/lucide-static@latest/icons/smartphone.svg" width="18" height="18" style="vertical-align: middle;"> UI/UX\n- Native animations\n- Dark mode support\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/bell.svg" width="18" height="18" style="vertical-align: middle;"> Notifications\n- Push notifications\n- In-app messaging\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/radio-tower.svg" width="18" height="18" style="vertical-align: middle;"> Offline\n- Local data sync\n- Conflict resolution',
    },
    lib: {
      name: "AwesomeLib",
      tag: "A lightweight, zero-dependency library",
      techs: ["TypeScript", "JavaScript"],
      desc: "A lightweight, zero-dependency library that makes complex tasks simple. Tree-shakeable, fully typed, and battle-tested in production.",
      features:
        '### <img src="https://unpkg.com/lucide-static@latest/icons/target.svg" width="18" height="18" style="vertical-align: middle;"> Core\n- Zero dependencies\n- Tree-shakeable\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/wrench.svg" width="18" height="18" style="vertical-align: middle;"> API\n- Fluent interface\n- Promise & callback support\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/box.svg" width="18" height="18" style="vertical-align: middle;"> Bundle\n- ESM + CJS + UMD\n- < 5kb gzipped',
    },
    hackathon: {
      name: "HackProject",
      tag: "Built in 24 hours at HackathonX 2025",
      techs: ["React", "Python", "FastAPI", "PostgreSQL"],
      desc: "Award-winning hackathon project built in 24 hours. Solves [problem] using [approach]. Won [prize] at [hackathon name].",
      features:
        '### <img src="https://unpkg.com/lucide-static@latest/icons/trophy.svg" width="18" height="18" style="vertical-align: middle;"> What We Built\n- Core feature 1\n- Core feature 2\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/rocket.svg" width="18" height="18" style="vertical-align: middle;"> Tech Choices\n- Why we chose each tech\n- Architecture decisions\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/sparkles.svg" width="18" height="18" style="vertical-align: middle;"> Future Plans\n- Post-hackathon roadmap',
    },
    oss: {
      name: "OpenProject",
      tag: "An open-source tool loved by the community",
      techs: ["Python", "Docker"],
      desc: "An open-source project maintained by the community. We welcome contributions of all kinds — code, documentation, bug reports, and feature ideas.",
      features:
        '### <img src="https://unpkg.com/lucide-static@latest/icons/sparkles.svg" width="18" height="18" style="vertical-align: middle;"> Features\n- Feature 1\n- Feature 2\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/globe.svg" width="18" height="18" style="vertical-align: middle;"> Community\n- Active Discord\n- Weekly releases\n\n### <img src="https://unpkg.com/lucide-static@latest/icons/book-open.svg" width="18" height="18" style="vertical-align: middle;"> Docs\n- Full documentation\n- Video tutorials',
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
    // Check if we are on the forge page (the one with the editor)
    const editorInner = document.getElementById("editorInner");
    if (!editorInner) return;

    var hasData = loadFromLocalStorage();
    buildSectionToggles();
    buildTechPicker();
    if (hasData) {
      selectedTechs.forEach(function (tech) {
        document.querySelectorAll(".tech-chip").forEach(function (c) {
          if (c.textContent.trim() === tech) c.classList.add("active");
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
    if (!el) return;
    el.innerHTML = "";

    SECTIONS.forEach(function (s) {
      var on = sectionState[s.id];
      var div = document.createElement("div");
      div.className = "sec-toggle" + (on ? " active" : "");
      div.id = "toggle-" + s.id;
      div.setAttribute("data-section", s.id);

      // Initial visibility of the section in the editor
      var secEl = document.getElementById(s.el);
      if (secEl) {
        secEl.classList.toggle("hidden", !on);
      }

      div.addEventListener("click", function () {
        var on = !sectionState[s.id];
        sectionState[s.id] = on;
        div.classList.toggle("active", on);

        var indicator = div.querySelector(".st-indicator");
        if (indicator) {
          indicator.innerHTML = on
            ? '<i data-lucide="check" style="width:12px;height:12px;"></i>'
            : '<i data-lucide="plus" style="width:12px;height:12px;"></i>';
          lucide.createIcons();
        }

        var secEl = document.getElementById(s.el);
        if (secEl) {
          secEl.classList.toggle("hidden", !on);
        }

        updateSectionCount();
        scheduleSave();
        scheduleRender();
      });

      div.innerHTML =
        '<div class="sec-toggle-left"><i data-lucide="' +
        s.icon +
        '" class="sec-toggle-icon"></i><span>' +
        s.label +
        '</span></div><div class="st-indicator">' +
        (on
          ? '<i data-lucide="check" style="width:12px;height:12px;"></i>'
          : '<i data-lucide="plus" style="width:12px;height:12px;"></i>') +
        "</div>";
      el.appendChild(div);
    });
    lucide.createIcons();
  }

  /**
   * Toggles all sections on or off at once.
   * If any are off, it turns all on. If all are on, it turns all off.
   *
   * @function toggleAllSections
   * @returns {void}
   */
  function toggleAllSections() {
    var anyOff = SECTIONS.some(function (s) {
      return !sectionState[s.id];
    });
    var newState = anyOff;
    SECTIONS.forEach(function (s) {
      sectionState[s.id] = newState;
    });
    buildSectionToggles();
    updateSectionCount();
    scheduleSave();
    scheduleRender();
    toast(newState ? "✓ All sections enabled" : "✓ All sections disabled");
  }
  window.toggleAllSections = toggleAllSections;

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
    el.innerHTML = ""; // Clear previous chips

    // Create a chip button for each technology
    TECHS.forEach(function (t) {
      var btn = document.createElement("button");
      // Use 'active' class for selection state
      btn.className =
        "tech-chip" + (selectedTechs.has(t.label) ? " active" : "");
      btn.innerHTML = (t.svg || "") + " <span>" + t.label + "</span>";

      // Ensure the button type is button to prevent form submission
      btn.type = "button";

      // Toggle selection when clicked
      btn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (selectedTechs.has(t.label)) {
          selectedTechs.delete(t.label);
          btn.classList.remove("active");
        } else {
          selectedTechs.add(t.label);
          btn.classList.add("active");
        }
        updateTechCount();
        scheduleSave();
        scheduleRender();
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
    el.innerHTML = ""; // Clear previous chips

    // Create a chip button for each badge option
    BADGES.forEach(function (b) {
      var btn = document.createElement("button");
      btn.className =
        "badge-chip" + (selectedBadges.has(b.id) ? " selected" : ""); // Mark as selected if in Set
      btn.innerHTML = '<i data-lucide="' + b.icon + '"></i> ' + b.label;

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
        scheduleRender(); // Update preview to show/hide badges
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
    var n = selectedTechs.size; // Get the count of selected technologies

    if (n > 0) {
      el.style.display = ""; // Show the badge
      el.textContent = n + " selected"; // Display count
    } else {
      el.style.display = "none"; // Hide if no techs selected
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
    document.getElementById("sectionCount").textContent = n; // Update display
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
    if (!t) return; // Exit if template not found

    // Remove selected state from all template buttons
    document.querySelectorAll(".template-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    // Highlight the clicked template button so users see which template is active.
    if (event && event.target) {
      const btn = event.target.closest(".template-btn");
      if (btn) btn.classList.add("active");
    }

    // Fill form fields with template values
    setVal("projName", t.name);
    setVal("tagline", t.tag);
    setVal("description", t.desc);
    setVal("features", t.features);

    // Clear current technology selection and reset UI
    selectedTechs.clear();
    document.querySelectorAll(".tech-chip").forEach(function (c) {
      c.classList.remove("active");
    });

    // Select all technologies from the template
    t.techs.forEach(function (tech) {
      selectedTechs.add(tech);
      // Highlight corresponding tech chips in the UI
      document.querySelectorAll(".tech-chip").forEach(function (c) {
        if (c.textContent.trim().includes(tech)) c.classList.add("active");
      });
    });

    updateTechCount(); // Update tech count display
    scheduleRender(); // Trigger preview update
    toast("✓ Template applied!"); // Show success message
  }
  window.applyTemplate = applyTemplate; // Expose globally for HTML onclick handlers

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
    if (!raw.trim()) return ""; // Return empty if no input

    var lines = raw.split("\n");
    var result = [];
    var projectName = v("projName") || "project";
    result.push(projectName); // Add project name as root

    // Helper function to determine nesting depth based on leading spaces
    // Each 2 spaces = 1 level deep
    function getDepth(line) {
      var m = line.match(/^(\s*)/);
      return m ? Math.floor(m[1].length / 2) : 0;
    }

    // Process each line
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trimEnd();
      if (!line.trim()) continue; // Skip empty lines

      var depth = getDepth(line); // How deep is this item?
      var name = line.trim();
      var isDir = name.endsWith("/"); // Is it a directory (ends with /)?
      var cleanName = name.replace(/\/$/, ""); // Remove trailing slash

      // Check if this is the last item at this depth (determines symbol)
      var isLast = true;
      for (var j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() && getDepth(lines[j]) === depth) {
          isLast = false; // Found a sibling below
          break;
        }
        if (lines[j].trim() && getDepth(lines[j]) < depth) break; // Went back up a level
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
                parentIsLast = false; // Parent has siblings
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
      // No emojis, just clean tree structure
      result.push(prefix + symbol + cleanName + (isDir ? "/" : ""));
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
    var raw = v("rawStructure"); // Get raw input from textarea
    var preview = convertStructure(raw); // Convert to formatted tree
    // Display preview or placeholder message
    document.getElementById("structPreview").textContent =
      preview || "Paste structure above to preview...";
    scheduleRender(); // Update the main preview
  }
  window.updateStructurePreview = updateStructurePreview; // Expose globally for HTML

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
    var dz = document.getElementById("dropZone"); // Drop zone container
    var fi = document.getElementById("fileInput"); // Hidden file input

    // Click drop zone to open file picker
    dz.addEventListener("click", function () {
      fi.click();
    });

    // Show visual feedback when dragging files over drop zone
    dz.addEventListener("dragover", function (e) {
      e.preventDefault(); // Allow drop
      dz.classList.add("dragover"); // Highlight drop zone
    });

    // Remove highlight when user drags away
    dz.addEventListener("dragleave", function () {
      dz.classList.remove("dragover");
    });

    // Handle dropped files
    dz.addEventListener("drop", function (e) {
      e.preventDefault(); // Prevent browser default behavior
      dz.classList.remove("dragover"); // Remove highlight
      handleFiles(e.dataTransfer.files); // Process dropped files
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
        renderScreenshotList(); // Update screenshot list UI
        scheduleRender(); // Update preview
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
    el.innerHTML = ""; // Clear previous list

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
    screenshots.splice(idx, 1); // Remove screenshot from array
    renderScreenshotList(); // Update UI
    scheduleRender(); // Update preview
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
      if (selectedBadges.has("license") && license !== "none") {
        var licUrl = "https://img.shields.io/badge/License-";
        var licLink = "LICENSE";
        if (license === "MIT") {
          licUrl += "MIT-yellow.svg";
          licLink = "https://opensource.org/licenses/MIT";
        } else if (license === "Apache 2.0" || license === "Apache-2.0") {
          licUrl += "Apache_2.0-blue.svg";
          licLink = "https://opensource.org/licenses/Apache-2.0";
        } else if (license === "GPL 3.0" || license === "GPLv3") {
          licUrl += "GPLv3-blue.svg";
          licLink = "https://opensource.org/licenses/GPL-3.0";
        } else if (license === "BSD 3-Clause") {
          licUrl += "BSD_3--Clause-orange.svg";
          licLink = "https://opensource.org/licenses/BSD-3-Clause";
        } else if (license === "Unlicense") {
          licUrl += "Unlicense-blue.svg";
          licLink = "https://opensource.org/licenses/Unlicense";
        } else {
          licUrl += encodeURIComponent(license) + "-green.svg";
        }
        badges.push("[![License](" + licUrl + ")](" + licLink + ")");
      }
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
          "[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](http://makeapullrequest.com)",
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
      md +=
        '## <img src="https://unpkg.com/lucide-static@latest/icons/list.svg" width="20" height="20" style="vertical-align: middle;"> Table of Contents\n\n';
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
      md +=
        '## <img src="https://unpkg.com/lucide-static@latest/icons/file-text.svg" width="20" height="20" style="vertical-align: middle;"> Description\n\n';
      md += (desc || "_Add a description of your project here._") + "\n\n";
      if (demoUrl)
        md +=
          '<img src="https://unpkg.com/lucide-static@latest/icons/link.svg" width="16" height="16" style="vertical-align: middle;"> **Live Demo:** [' +
          demoUrl +
          "](" +
          demoUrl +
          ")\n\n";
      md += "---\n\n";
    }

    // ─ SECTION 3: Features ─
    if (on("features") && features) {
      md += '## <img src="https://unpkg.com/lucide-static@latest/icons/star.svg" width="20" height="20" style="vertical-align: middle;"> Features\n\n';
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
        md +=
          '## <img src="https://unpkg.com/lucide-static@latest/icons/layers.svg" width="20" height="20" style="vertical-align: middle;"> Tech Stack\n\n| Layer | Technology |\n|---|---|\n';
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
      md +=
        '## <img src="https://unpkg.com/lucide-static@latest/icons/download.svg" width="20" height="20" style="vertical-align: middle;"> Installation\n\n';
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
        '## <img src="https://unpkg.com/lucide-static@latest/icons/terminal.svg" width="20" height="20" style="vertical-align: middle;"> Usage\n\n```bash\n' +
        (usageCmd || "# Add your run command here") +
        "\n```\n\n---\n\n";
    }

    // ─ SECTION 7: Project Structure ─
    if (on("structure") && rawStruct.trim()) {
      md +=
        '## <img src="https://unpkg.com/lucide-static@latest/icons/folder-tree.svg" width="20" height="20" style="vertical-align: middle;"> Project Structure\n\n```\n' +
        convertStructure(rawStruct) +
        "\n```\n\n---\n\n";
    }

    // ─ SECTION 8: Screenshots & Demo ─
    if (on("screenshots")) {
      var hasContent = videoUrl || screenshots.length || imageUrls.trim();
      if (hasContent) {
        md +=
          '## <img src="https://unpkg.com/lucide-static@latest/icons/image.svg" width="20" height="20" style="vertical-align: middle;"> Screenshots\n\n';
        if (videoUrl)
          md +=
            '<img src="https://unpkg.com/lucide-static@latest/icons/play.svg" width="16" height="16" style="vertical-align: middle;"> **Demo Video:** [Watch Here](' +
            videoUrl +
            ")\n\n";
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
      md +=
        '## <img src="https://unpkg.com/lucide-static@latest/icons/zap.svg" width="20" height="20" style="vertical-align: middle;"> API Reference\n\n';
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
      md +=
        '## <img src="https://unpkg.com/lucide-static@latest/icons/users.svg" width="20" height="20" style="vertical-align: middle;"> Contributing\n\nContributions are always welcome!\n\n';
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
          '## <img src="https://unpkg.com/lucide-static@latest/icons/file-text.svg" width="20" height="20" style="vertical-align: middle;"> License\n\nThis project is licensed under the **[' +
          license +
          " License](LICENSE)**.\n\n---\n\n";
      md += "## <img src=\"https://unpkg.com/lucide-static@latest/icons/user.svg\" width=\"20\" height=\"20\" style=\"vertical-align: middle;\"> Author\n\n";
      var displayName = authorName || authorGh || ghUser;
      md += "**" + displayName + "**\n\n";
      if (authorGh)
        md += '- <img src="https://unpkg.com/lucide-static@latest/icons/github.svg" width="14" height="14" style="vertical-align: middle;"> GitHub: [@' + authorGh + "](https://github.com/" + authorGh + ")\n";
          authorGh +
          "](https://github.com/" +
          authorGh +
          ")\n";
      if (authorEmail)
        md +=
          '- <img src="https://unpkg.com/lucide-static@latest/icons/mail.svg" width="14" height="14" style="vertical-align: middle;"> Email: [' +
          authorEmail +
          "](mailto:" +
          authorEmail +
          ")\n";
      if (authorLi)
        md +=
          '- <img src="https://unpkg.com/lucide-static@latest/icons/linkedin.svg" width="14" height="14" style="vertical-align: middle;"> LinkedIn: [' +
          displayName +
          "](" +
          authorLi +
          ")\n";
      if (authorWeb)
        md +=
          '- <img src="https://unpkg.com/lucide-static@latest/icons/globe.svg" width="14" height="14" style="vertical-align: middle;"> Website: [' +
          authorWeb +
          "](" +
          authorWeb +
          ")\n";
      md += "\n---\n\n";
      md +=
        '> Made with <img src="https://unpkg.com/lucide-static@latest/icons/heart.svg" width="14" height="14" style="vertical-align: middle; filter: invert(27%) sepia(91%) saturate(2352%) hue-rotate(331deg) brightness(94%) contrast(94%);"> by [' +
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
      suggestions.push({
        icon: "info",
        text: "Add a project name to identify your project.",
      });
    }

    // Tagline (5 pts)
    var tagline = v("tagline");
    if (tagline) {
      score += 5;
    } else {
      suggestions.push({
        icon: "message-square",
        text: "Add a tagline — a one-line summary of what your project does.",
      });
    }

    // GitHub user + repo (5 pts)
    var ghUser = v("ghUser") || v("authorGh");
    var repoSlug = v("repoSlug");
    if (ghUser && repoSlug) {
      score += 5;
    } else {
      suggestions.push({
        icon: "link",
        text: "Fill in your GitHub username and repository name for accurate badge links.",
      });
    }

    // Description (15 pts — tiered by word count)
    var desc = v("description");
    var descWords = desc
      ? desc
          .trim()
          .split(/\s+/)
          .filter(function (w) {
            return w.length > 0;
          }).length
      : 0;
    if (descWords >= 30) {
      score += 15;
    } else if (descWords >= 15) {
      score += 8;
      suggestions.push({
        icon: "file-text",
        text: "Expand your description to at least 30 words for a better explanation of your project.",
      });
    } else if (descWords > 0) {
      score += 3;
      suggestions.push({
        icon: "file-text",
        text: "Your description is very short. Aim for at least 30 words to clearly explain your project.",
      });
    } else {
      suggestions.push({
        icon: "file-text",
        text: "Add a description explaining what your project does and the problem it solves.",
      });
    }

    // Features (15 pts)
    var features = v("features");
    if (sectionState["features"] && features && features.trim().length > 20) {
      score += 15;
    } else if (
      sectionState["features"] &&
      features &&
      features.trim().length > 0
    ) {
      score += 7;
      suggestions.push({
        icon: "star",
        text: "Expand the Features section with more detail — group features with ### headings and bullet points.",
      });
    } else {
      suggestions.push({
        icon: "star",
        text: "Enable and fill in the Features section to highlight what makes your project stand out.",
      });
    }

    // Tech stack (10 pts)
    var customTech = v("customTech");
    var totalTechs =
      selectedTechs.size +
      (customTech
        ? customTech.split(",").filter(function (t) {
            return t.trim();
          }).length
        : 0);
    if (totalTechs >= 3) {
      score += 10;
    } else if (totalTechs >= 1) {
      score += 5;
      suggestions.push({
        icon: "layers",
        text: "Select at least 3 technologies in the Tech Stack section for a complete picture.",
      });
    } else {
      suggestions.push({
        icon: "layers",
        text: "Select your tech stack — let readers know what technologies power your project.",
      });
    }

    // Installation commands (10 pts)
    var installCmds = v("installCmds");
    if (
      sectionState["installation"] &&
      installCmds &&
      installCmds.trim().length > 0
    ) {
      score += 10;
    } else if (sectionState["installation"]) {
      score += 4;
      suggestions.push({
        icon: "download",
        text: "Add installation commands so others can easily set up your project.",
      });
    } else {
      suggestions.push({
        icon: "download",
        text: "Enable the Installation section and add setup commands for your project.",
      });
    }

    // Usage (5 pts)
    var usageCmd = v("usageCmd");
    if (sectionState["usage"] && usageCmd && usageCmd.trim().length > 0) {
      score += 5;
    } else {
      suggestions.push({
        icon: "terminal",
        text: "Add usage instructions or a run command to the Usage section.",
      });
    }

    // Author info (5 pts)
    var authorName = v("authorName");
    var authorGh = v("authorGh");
    if (sectionState["author"] && (authorName || authorGh)) {
      score += 5;
    } else {
      suggestions.push({
        icon: "user",
        text: "Fill in author details (name or GitHub username) in the License & Author section.",
      });
    }

    // Screenshots / demo (5 pts)
    var videoUrl = v("videoUrl");
    var imageUrls = v("imageUrls");
    if (
      sectionState["screenshots"] &&
      (screenshots.length > 0 || videoUrl || imageUrls.trim())
    ) {
      score += 5;
    } else {
      suggestions.push({
        icon: "image",
        text: "Add screenshots or a demo video/link to give readers a visual preview.",
      });
    }

    // Live demo URL (5 pts)
    var demoUrl = v("demoUrl");
    if (demoUrl && demoUrl.trim()) {
      score += 5;
    } else {
      suggestions.push({
        icon: "globe",
        text: "Add a live demo URL if your project is deployed online.",
      });
    }

    // Contributing section active (5 pts)
    if (sectionState["contributing"]) {
      score += 5;
    } else {
      suggestions.push({
        icon: "users",
        text: "Enable the Contributing section to invite community contributions.",
      });
    }

    // License active (5 pts)
    var license = document.getElementById("license").value;
    if (sectionState["author"] && license !== "none") {
      score += 5;
    } else if (license === "none") {
      suggestions.push({
        icon: "shield-alert",
        text: "Choose a license to clarify how others can use your project.",
      });
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

    ringFill.setAttribute(
      "stroke-dasharray",
      fillAmount + " " + (maxPercentage - fillAmount),
    );
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
      perfect.innerHTML =
        '<span class="qs-icon"><i data-lucide="party-popper" style="width:14px;"></i></span><span class="qs-text">All key sections are complete — great job!</span>';
      suggestionsEl.appendChild(perfect);
    } else {
      var heading = document.createElement("div");
      heading.className = "quality-suggestions-heading";
      heading.textContent = "Suggestions to improve";
      suggestionsEl.appendChild(heading);
      quality.suggestions.forEach(function (s) {
        var item = document.createElement("div");
        item.className = "quality-suggestion";
        item.innerHTML =
          '<span class="qs-icon"><i data-lucide="' +
          s.icon +
          '" style="width:14px;"></i></span><span class="qs-text">' +
          s.text +
          "</span>";
        suggestionsEl.appendChild(item);
      });
    }
    lucide.createIcons();
  }

  function toggleQualityPanel() {
    var panel = document.getElementById("qualityPanel");
    if (panel) panel.classList.toggle("collapsed");
  }
  window.toggleQualityPanel = toggleQualityPanel;

  // ── Render ────────────────────────────────────────────────────
  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 120);
    scheduleSave();
  }
  window.scheduleRender = scheduleRender; // Expose globally for HTML

  /**
   * Renders the current markdown to the preview panel.
   * Displays either formatted HTML preview or raw markdown depending on currentTab.
   * Shows empty state if no content generated.
   *
   * @function render
   * @returns {void}
   */
  function render() {
    currentMd = generateMarkdown(); // Generate markdown from current state
    updateSidebarStats(currentMd);
    var body = document.getElementById("previewBody");

    // Show empty state if no content
    if (!currentMd.trim()) {
      body.innerHTML =
        '<div class="empty-preview"><div class="icon"><i data-lucide="file" style="width:40px;height:40px;"></i></div><h3>Live preview appears here</h3><p>Start filling in the editor →</p></div>';
      updateQualityPanel({ score: 0, suggestions: [] });
      lucide.createIcons();
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
    updateMetrics();
  }

  /**
   * Calculates and updates the word count and estimated read time.
   * @function updateMetrics
   * @returns {void}
   */
  function updateMetrics() {
    var totalWords = currentMd
      ? currentMd
          .trim()
          .split(/\s+/)
          .filter(function (w) {
            return w.length > 0;
          }).length
      : 0;
    var time = Math.ceil(totalWords / 200); // Average read speed 200 wpm

    var wordCountEl = document.getElementById("totalWordCount");
    var readTimeEl = document.getElementById("readTime");

    if (wordCountEl) wordCountEl.textContent = totalWords;
    if (readTimeEl)
      readTimeEl.textContent = time + " min" + (time !== 1 ? "" : "");
  }

  /**
   * Saves the current markdown to a GitHub Gist.
   * Prompts the user for a GitHub Personal Access Token.
   * @function saveToGist
   * @returns {void}
   */
  async function saveToGist() {
    if (!currentMd.trim()) {
      toast("Nothing to save!");
      return;
    }

    var token = prompt(
      "Enter your GitHub Personal Access Token (PAT) with 'gist' scope:",
    );
    if (!token) return;

    var projectName = v("projName") || "README";
    var filename = "README.md";

    toast("Saving to Gist...");

    try {
      var response = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
          Authorization: "token " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: "README generated by READMEForge - " + projectName,
          public: true,
          files: {
            [filename]: {
              content: currentMd,
            },
          },
        }),
      });

      if (response.ok) {
        var data = await response.json();
        toast("✓ Gist created successfully!");
        if (confirm("Gist created! Open it in a new tab?")) {
          window.open(data.html_url, "_blank");
        }
      } else {
        var err = await response.json();
        toast("Error: " + (err.message || "Failed to create Gist"));
      }
    } catch (e) {
      console.error(e);
      toast("Error connecting to GitHub");
    }
  }
  window.saveToGist = saveToGist;

  /**
   * Switches between rendered and raw markdown views.
   * Updates the active tab indicator and re-renders the preview.
   *
   * @function setTab
   * @param {string} tab - Tab to switch to: 'rendered' or 'raw'
   * @returns {void}
   */
  function setTab(tab) {
    currentTab = tab; // Update current tab state
    // Update tab button styling
    document
      .getElementById("tabRendered")
      .classList.toggle("active", tab === "rendered");
    document.getElementById("tabRaw").classList.toggle("active", tab === "raw");
    render(); // Re-render preview for selected tab
  }
  window.setTab = setTab; // Expose globally for HTML onclick handlers

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
    white: "#ffffff",
    black: "#000000",
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
    var color = "#555", // Default color (dark gray)
      left = label || "", // Left text (label part)
      right = "", // Right text (value part)
      m; // Regex match variable
    // Parse shields.io badge URL format: /badge/LEFT-RIGHT-COLOR
    m = url.match(/\/badge\/([^?]+)/);
    if (m) {
      var parts = m[1].split("-");
      if (parts.length >= 3) {
        // Format: label-label-value-color (3+ parts)
        right = parts[parts.length - 2]; // Value (second to last)
        var col = parts[parts.length - 1].split("?")[0].replace(".svg", ""); // Color (last, strip extension)
        color = BADGE_COLORS[col] || "#" + col; // Map to hex or use as-is
        left = parts
          .slice(0, parts.length - 2) // Everything except value and color
          .join(" ")
          .replace(/_/g, " "); // Replace underscores with spaces
      } else if (parts.length === 2) {
        // Format: label-value
        right = parts[1].split("?")[0]; // Value
        color = "#22c55e"; // Green
        left = parts[0].replace(/_/g, " "); // Label
      } else {
        // Format: single-part
        left = parts[0].replace(/_/g, " ");
        color = "#3b82f6"; // Blue
      }
    }
    // Handle GitHub API badges (they need special parsing)
    if (!m) {
      if (url.indexOf("/github/stars") !== -1) {
        // GitHub stars badge
        left = "Stars";
        right = "★";
        color = "#f59e0b"; // Amber
      } else if (url.indexOf("/github/forks") !== -1) {
        // GitHub forks badge
        left = "Forks";
        right = "⑂";
        color = "#8b5cf6"; // Purple
      } else if (url.indexOf("/github/issues") !== -1) {
        // GitHub issues badge
        left = "Issues";
        right = "●";
        color = "#ef4444"; // Red
      } else {
        // Unknown badge format
        left = label;
        color = "#3b82f6"; // Blue
      }
    }
    left = decodeURIComponent(left).replace(/\+/g, " ");
    right = decodeURIComponent(right).replace(/\+/g, " ");
    return (
      '<span class="gh-badge" style="user-select:none;">' +
      '<span class="gh-badge-left" style="background:#555; color:#fff">' +
      left.toUpperCase() +
      "</span>" +
      (right
        ? '<span class="gh-badge-right" style="background:' +
          color +
          "; color: " +
          (isColorLight(color) ? "#333" : "#fff") +
          '">' +
          right +
          "</span>"
        : "") +
      "</span>"
    );
  }

  function isColorLight(color) {
    if (!color) return false;
    var c = color.toLowerCase().replace("#", "");

    // Common light color names from shields.io (without #)
    var lightNames = [
      "white",
      "lightgrey",
      "yellow",
      "yellowgreen",
      "brightgreen",
      "green",
    ];
    if (lightNames.indexOf(c) !== -1) return true;

    // If it's a 3-digit hex, expand it
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }

    if (c.length !== 6) return false;

    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) return false;

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 185;
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
        .catch(fbCopy); // Fall back on error
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
      ta.select(); // Select all text
      try {
        document.execCommand("copy"); // Copy to clipboard
        toast("✓ Copied!");
      } catch (e) {
        toast("Copy failed");
      }
      document.body.removeChild(ta); // Clean up
    }
  }
  window.copyMarkdown = copyMarkdown; // Expose globally for HTML

  /**
   * Copies the rendered HTML of the README to the clipboard.
   * Useful for pasting into platforms that support HTML or for debugging.
   *
   * @function copyHtml
   * @returns {void}
   */
  function copyHtml() {
    if (!currentMd) {
      toast("Nothing to copy yet!");
      return;
    }
    var html = md2html(currentMd);
    navigator.clipboard
      .writeText(html)
      .then(function () {
        toast("✓ HTML copied to clipboard!");
      })
      .catch(function (err) {
        console.error("Failed to copy HTML:", err);
        toast("Error copying HTML");
      });
  }
  window.copyHtml = copyHtml;

  /**
   * Closes the download/export modal overlay.
   *
   * @function closeDownloadModal
   * @returns {void}
   */
  function closeDownloadModal() {
    var overlay = document.getElementById("downloadModalOverlay");
    if (overlay) overlay.classList.add("hidden"); // Hide modal
  }
  window.closeDownloadModal = closeDownloadModal; // Expose globally for HTML

  /**
   * Opens the browser's print dialog to save markdown as PDF.
   * Creates a hidden iframe with styled HTML content and triggers print.
   * The user can select "Save as PDF" from the print dialog.
   *
   * @function downloadPDF
   * @returns {void}
   */
  async function downloadPDF() {
    if (!currentMd) {
      toast("Nothing to download yet!");
      return;
    }

    toast("Generating professional PDF...");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;
    let y = 30;

    // Set font to a clean serif (simulating Cambria Math)
    doc.setFont("times", "bold");

    // Title
    doc.setFontSize(28);
    doc.setTextColor(15, 23, 42); // --accent color approx
    doc.text(v("projName") || "README", margin, y);
    y += 12;

    // Tagline
    doc.setFontSize(14);
    doc.setFont("times", "italic");
    doc.setTextColor(100, 116, 139); // --muted
    doc.text(v("tagline") || "", margin, y);
    y += 15;

    // Horizontal line
    doc.setDrawColor(226, 232, 240); // --border
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    // Content Parsing (simplified for jspdf)
    const lines = currentMd.split("\n");
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    lines.forEach((line) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      if (line.startsWith("# ")) {
        // Skip
      } else if (line.startsWith("## ")) {
        y += 10;
        const text = line
          .replace("## ", "")
          .replace(/<img.*?>/g, "")
          .trim();
        doc.setFillColor(56, 189, 248);
        doc.circle(margin + 2.5, y - 1, 2.5, "F");
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.setTextColor(30, 41, 59);
        doc.text(text, margin + 8, y);
        y += 10;
        doc.setFontSize(11);
        doc.setFont("times", "normal");
        doc.setTextColor(0, 0, 0);
      } else if (line.startsWith("### ")) {
        y += 5;
        const text = line.replace("### ", "").trim();
        doc.setFont("times", "bold");
        doc.setFontSize(13);
        doc.text(text, margin, y);
        y += 8;
        doc.setFontSize(11);
        doc.setFont("times", "normal");
      } else if (line.startsWith("- ")) {
        const text = line.replace("- ", "").trim();
        const splitText = doc.splitTextToSize("• " + text, contentWidth - 5);
        doc.text(splitText, margin + 5, y);
        y += splitText.length * 6;
      } else if (line.trim() !== "") {
        const text = line.trim();
        const splitText = doc.splitTextToSize(text, contentWidth);
        doc.text(splitText, margin, y);
        y += splitText.length * 6;
      }
    });

    doc.save(`${v("projName") || "README"}.pdf`);
    toast("✓ Professional PDF downloaded!");
  }
  window.downloadPDF = downloadPDF; // Expose globally for HTML

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
    a.download = "README.md"; // Set download filename
    document.body.appendChild(a);
    a.click(); // Trigger download
    document.body.removeChild(a); // Clean up
    toast("✓ README.md downloaded!");
  }
  window.downloadMd = downloadMd; // Expose globally for HTML

  /**
   * Opens the browser print dialog showing only the preview panel content.
   * Hides the editor panel and all UI controls using CSS print media queries.
   * Works across Chrome, Firefox, and Edge.
   *
   * @function printPreview
   * @returns {void}
   */
  function printPreview() {
    if (!currentMd) {
      toast("Nothing to print yet!");
      return;
    }
    toast("Opening print preview...");
    window.print();
  }
  window.printPreview = printPreview; // Expose globally for HTML

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
      c.classList.remove("active");
    });

    // Deselect all template buttons
    document.querySelectorAll(".template-btn").forEach(function (c) {
      c.classList.remove("active");
    });

    // Rebuild UI components with reset state
    buildBadgePicker();
    updateTechCount();

    // Reset all sections to their default enabled/disabled state
    SECTIONS.forEach(function (s) {
      sectionState[s.id] = s.default;
    });

    // Reset word count displays
    counts.forEach((count) => (count.textContent = "0"));

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
  window.resetAll = resetAll; // Expose globally for HTML

  function updateSidebarStats(md) {
    var words = md ? md.trim().split(/\s+/).length : 0;
    if (md.trim() === "") words = 0;
    var time = Math.ceil(words / 200); // ~200 words per minute

    var wordEl = document.getElementById("totalWords");
    var timeEl = document.getElementById("readTime");

    if (wordEl) wordEl.innerText = words;
    if (timeEl) timeEl.innerText = time + " min";
  }

  function copyHTML() {
    var md = generateMarkdown();
    if (!md) {
      toast("Nothing to copy yet!");
      return;
    }

    var html = md2html(md);
    navigator.clipboard.writeText(html).then(function () {
      toast("✓ HTML copied to clipboard!");
    }).catch(function () {
      toast("Error copying HTML");
    });
  }
  window.copyHTML = copyHTML;

  function downloadReadme() {
    downloadMd();
  }
  window.downloadReadme = downloadReadme;

  // ── Actions ───────────────────────────────────────────────────
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
    var t = document.getElementById("toast"); // Get toast element
    t.textContent = msg; // Set message
    t.classList.add("show"); // Show toast
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
      words = words.filter((word) => word !== "###" && word !== "-");

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

  // ── DARK MODE TOGGLE ──
  /**
   * Initialize dark mode from localStorage preference
   * @function initializeDarkMode
   * @returns {void}
   */
  function initializeDarkMode() {
    var savedTheme = localStorage.getItem("readmeforge-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDarkMode = savedTheme ? savedTheme === "dark" : prefersDark;

    // Apply saved preference or system preference
    if (isDarkMode) {
      document.body.classList.remove("light-mode");
      updateThemeIcon("dark");
    } else {
      document.body.classList.add("light-mode");
      updateThemeIcon("light");
    }

    // Setup theme toggle button listener
    var themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.checked = isDarkMode;
      themeToggle.addEventListener("change", function () {
        toggleDarkMode();
      });
    }
  }

  /**
   * Toggle between dark and light mode
   * @function toggleDarkMode
   * @returns {void}
   */
  function toggleDarkMode() {
    var isDarkMode = !document.body.classList.contains("light-mode");

    if (isDarkMode) {
      // Switch to light mode
      document.body.classList.add("light-mode");
      localStorage.setItem("readmeforge-theme", "light");
      updateThemeIcon("light");
    } else {
      // Switch to dark mode
      document.body.classList.remove("light-mode");
      localStorage.setItem("readmeforge-theme", "dark");
      updateThemeIcon("dark");
    }
  }

  /**
   * Update the theme toggle button icon
   * @function updateThemeIcon
   * @param {string} mode - "dark" or "light"
   * @returns {void}
   */
  function updateThemeIcon(mode) {
    var themeToggle = document.getElementById("themeToggle");
    if (themeToggle) themeToggle.checked = mode === "dark";
  }

  // Initialize dark mode on page load
  initializeDarkMode();

  /**
   * Toggle mobile navigation menu
   * @function toggleMobileMenu
   * @returns {void}
   */
  window.toggleMobileMenu = function () {
    var navLinks = document.getElementById("navLinks");
    if (navLinks) {
      navLinks.classList.toggle("active");
    }
  };

  init();
})();
