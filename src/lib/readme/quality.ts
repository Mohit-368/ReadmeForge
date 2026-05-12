import type { ReadmeState } from "./types";

export interface QualityCheck {
  id: string;
  label: string;
  weight: number;
  passed: boolean;
  icon: string;
  suggestion: string;
}

export interface QualityResult {
  score: number;
  status: string;
  subtitle: string;
  tone: "great" | "good" | "ok" | "low" | "bad";
  checks: QualityCheck[];
  passedCount: number;
  totalCount: number;
}

export function computeQuality(state: ReadmeState): QualityResult {
  const f = state.fields;
  const has = (s: string) => !!s && s.trim().length > 0;
  const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

  const checks: QualityCheck[] = [
    { id: "name", label: "Project name", weight: 8, passed: has(f.projName), icon: "🏷️",
      suggestion: "Add a clear project name so people instantly know what this is." },
    { id: "tagline", label: "Tagline", weight: 5, passed: has(f.tagline), icon: "✏️",
      suggestion: "Add a short one-line tagline that summarizes your project." },
    { id: "description", label: "Description (30+ words)", weight: 12, passed: wordCount(f.description) >= 30, icon: "📝",
      suggestion: "Your description is very short. Aim for at least 30 words to clearly explain your project." },
    { id: "features", label: "Features section", weight: 12, passed: f.features.trim().length >= 20, icon: "✨",
      suggestion: "Enable and fill in the Features section to highlight what makes your project stand out." },
    { id: "tech", label: "Tech stack", weight: 10, passed: state.techs.length + (has(f.customTech) ? 1 : 0) >= 2, icon: "🛠️",
      suggestion: "Pick at least 2 technologies so visitors understand your stack." },
    { id: "install", label: "Installation steps", weight: 10, passed: has(f.installCmds), icon: "🚀",
      suggestion: "Add install commands so others can get up and running quickly." },
    { id: "usage", label: "Usage instructions", weight: 8, passed: has(f.usageCmd), icon: "💻",
      suggestion: "Show users how to actually run or use your project." },
    { id: "structure", label: "Project structure", weight: 5, passed: has(f.rawStructure), icon: "📁",
      suggestion: "Paste your folder tree to help contributors navigate the codebase." },
    { id: "screenshots", label: "Screenshots / demo", weight: 8, passed: state.screenshots.length > 0 || has(f.imageUrls) || has(f.videoUrl) || has(f.demoUrl), icon: "🖼️",
      suggestion: "Add a screenshot, demo link, or video — visuals dramatically boost engagement." },
    { id: "badges", label: "Badges with repo info", weight: 4, passed: state.badges.length >= 1 && has(f.ghUser) && has(f.repoSlug), icon: "🎖️",
      suggestion: "Pick a few badges and fill in your GitHub user & repo to display them." },
    { id: "author", label: "Author info", weight: 8, passed: has(f.authorName) && has(f.authorGh), icon: "👤",
      suggestion: "Add your name and GitHub username so people know who made this." },
    { id: "license", label: "License", weight: 5, passed: has(f.license) && f.license !== "none", icon: "⚖️",
      suggestion: "Pick a license so others know how they can use your project." },
    { id: "contact", label: "Contact link", weight: 5, passed: has(f.authorEmail) || has(f.authorLinkedin) || has(f.authorWebsite), icon: "📬",
      suggestion: "Add an email, LinkedIn, or portfolio link so people can reach you." },
  ];

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.filter((c) => c.passed).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((earned / totalWeight) * 100);

  let status: string, subtitle: string, tone: QualityResult["tone"];
  if (score >= 90) { status = "Outstanding"; subtitle = "Your README is in great shape — ship it!"; tone = "great"; }
  else if (score >= 75) { status = "Looking Good"; subtitle = "A few small additions will make it shine."; tone = "good"; }
  else if (score >= 55) { status = "Getting There"; subtitle = "Solid start — keep filling in the details."; tone = "ok"; }
  else if (score >= 30) { status = "Needs Work"; subtitle = "Add more details to make your README more helpful."; tone = "low"; }
  else { status = "Just Starting"; subtitle = "Start filling in sections to grow your score."; tone = "bad"; }

  return {
    score, status, subtitle, tone, checks,
    passedCount: checks.filter((c) => c.passed).length,
    totalCount: checks.length,
  };
}
