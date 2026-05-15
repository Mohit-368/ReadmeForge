import { STORAGE_KEY, PREVIEW_ZOOM_KEY, FIELD_IDS, ZOOM_LEVELS } from '../utils/constants';

export function saveData({ formData, sectionState, selectedTechs, selectedBadges }) {
  try {
    const data = {
      fields: { ...formData },
      license: formData.license || 'MIT',
      techs: Array.from(selectedTechs),
      badges: Array.from(selectedBadges),
      sections: { ...sectionState },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || !data.fields) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearData() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function saveZoom(zoom) {
  try { localStorage.setItem(PREVIEW_ZOOM_KEY, String(zoom)); } catch {}
}

export function loadZoom() {
  try {
    const raw = localStorage.getItem(PREVIEW_ZOOM_KEY);
    if (!raw) return 1;
    const parsed = parseFloat(raw);
    if (isNaN(parsed)) return 1;
    return ZOOM_LEVELS.reduce((closest, c) =>
      Math.abs(c - parsed) < Math.abs(closest - parsed) ? c : closest, ZOOM_LEVELS[0]);
  } catch {
    return 1;
  }
}
