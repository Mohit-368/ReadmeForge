import type { ReadmeState } from "./types";
import { EMPTY_FIELDS } from "./types";
import { SECTIONS } from "./data";

const KEY = "readmeforge-data-v2";

export function defaultState(): ReadmeState {
  const sections: Record<string, boolean> = {};
  SECTIONS.forEach((s) => (sections[s.id] = s.default));
  return {
    fields: { ...EMPTY_FIELDS },
    techs: [],
    badges: ["license", "stars", "prs"],
    sections,
    screenshots: [],
  };
}

export function loadState(): ReadmeState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return { ...defaultState(), ...parsed };
  } catch {
    return null;
  }
}

export function saveState(state: ReadmeState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function clearState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
