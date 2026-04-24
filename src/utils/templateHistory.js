const STORAGE_KEY = 'recentlyUsedTemplates';
const MAX_HISTORY = 5;

export function getRecentTemplates() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToRecentTemplates(template) {
  let history = getRecentTemplates();
  // Remove if already exists (avoid duplicates)
  history = history.filter(t => t.id !== template.id);
  // Add to front
  history.unshift(template);
  // Keep only last 5
  history = history.slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearRecentTemplates() {
  localStorage.removeItem(STORAGE_KEY);
}
