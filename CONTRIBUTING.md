# Contributing to ReadmeForge

Thank you for your interest in contributing to ReadmeForge! 🎉  
Whether you are fixing a bug, adding a feature, or improving documentation — every contribution matters.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Code Style](#code-style)
- [Need Help?](#need-help)

---

## 🚀 Getting Started

### Prerequisites
No installation required. ReadmeForge runs entirely in the browser.  
You only need:
- A code editor (VS Code recommended)
- A modern web browser (Chrome, Firefox, Edge)
- Git installed on your machine

### Fork and Clone the Repository

1. **Fork** this repository by clicking the Fork button at the top right of this page
2. **Clone** your forked repository to your local machine:
```bash
   git clone https://github.com/YOUR-USERNAME/ReadmeForge.git
   cd ReadmeForge
```
3. **Open** the project in your browser:
```bash
   open index.html
   # or simply double-click index.html in your file explorer
```
4. **Add upstream remote** to keep your fork in sync:
```bash
   git remote add upstream https://github.com/Mohit-368/ReadmeForge.git
```

---

## 🤝 How to Contribute

### Step 1 — Find an Issue
- Browse the [Issues](../../issues) tab
- Look for issues labeled `good first issue` if you are contributing for the first time
- Comment on the issue saying "I would like to work on this" before starting
- Wait for the issue to be assigned to you

### Step 2 — Create a Branch
- Always create a new branch for your work (never work directly on `main`)
- Follow the branch naming convention below

### Step 3 — Make Your Changes
- Make your changes in the new branch
- Test your changes by opening `index.html` in the browser
- Make sure the live preview still works correctly
- Make sure the Copy Raw button still generates valid Markdown
- Check that your changes look good on both desktop and mobile

### Step 4 — Commit Your Changes
- Follow the commit message guidelines below
- Keep commits small and focused — one feature or fix per commit

### Step 5 — Push and Open a PR
- Push your branch to your forked repository
- Open a Pull Request against the `main` branch of this repository
- Fill in the PR template completely
- Link the issue your PR resolves using `Closes #issue-number`

---

## 🌿 Branch Naming Convention

Use this format for all branches:
```
type/short-description
```

Examples:
```
feature/dark-mode
fix/mobile-responsiveness
docs/update-contributing
chore/add-issue-templates
```

Types: `feature`, `fix`, `docs`, `chore`, `refactor`

---

## ✍️ Commit Message Guidelines

Use clear, descriptive commit messages in this format:
```
type: short description (max 72 characters)
```

Examples:
```
feature: add dark mode toggle
fix: resolve mobile layout overflow
docs: update README with new screenshots
chore: add GitHub Actions workflow
```

---

## 📬 Pull Request Process

1. Make sure your PR title clearly describes what it does
2. Link the related issue using `Closes #issue-number` in the PR description
3. Add screenshots or a screen recording if your PR includes UI changes
4. Make sure `index.html` opens without any console errors
5. Your PR will be reviewed within 48 hours
6. Address any review comments and push updates to the same branch
7. Once approved, your PR will be merged into `main`

---

## 🐛 Issue Guidelines

### Reporting a Bug
- Search existing issues first to avoid duplicates
- Use the Bug Report issue template
- Include steps to reproduce, expected behavior, and screenshots if possible

### Requesting a Feature
- Use the Feature Request issue template
- Explain the problem your feature solves
- Include mockups or examples if possible

---

## 🎨 Code Style

Since ReadmeForge uses vanilla HTML, CSS, and JavaScript, follow these simple guidelines:

- Use 2 spaces for indentation (not tabs)
- Use meaningful variable and function names
- Add a comment above any complex logic explaining what it does
- Keep functions small and focused on one task
- Test in Chrome, Firefox, and Edge before submitting

---

## 🙋 Need Help?

If you are stuck or have any questions:
- Comment on the relevant issue
- Open a [Discussion](../../discussions)
- Reach out to the project admin: [@Mohit-368](https://github.com/Mohit-368)

We are here to help — no question is too small. Happy contributing! 🚀
