import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'readmeforge-data';
const THEME_KEY = 'readmeforge-theme';

const DEFAULT_SECTIONS = {
  title: true, description: true, features: true, techstack: true,
  installation: true, structure: true, screenshots: true,
  api: false, contributing: true, author: true, support: false,
};

const DEFAULT_BADGES = new Set(['license', 'stars', 'prs']);

const initialState = {
  fields: {},
  license: 'MIT',
  sections: { ...DEFAULT_SECTIONS },
  selectedTechs: new Set(),
  selectedBadges: new Set(DEFAULT_BADGES),
  screenshots: [],
  theme: 'dark',
  currentTab: 'rendered',
  autoSaved: false,
  toastMsg: '',
  activeTemplate: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, fields: { ...state.fields, [action.id]: action.value } };
    case 'SET_LICENSE':
      return { ...state, license: action.value };
    case 'TOGGLE_SECTION':
      return { ...state, sections: { ...state.sections, [action.id]: action.value } };
    case 'TOGGLE_TECH': {
      const next = new Set(state.selectedTechs);
      next.has(action.tech) ? next.delete(action.tech) : next.add(action.tech);
      return { ...state, selectedTechs: next };
    }
    case 'TOGGLE_BADGE': {
      const next = new Set(state.selectedBadges);
      next.has(action.badge) ? next.delete(action.badge) : next.add(action.badge);
      return { ...state, selectedBadges: next };
    }
    case 'ADD_SCREENSHOTS':
      return { ...state, screenshots: [...state.screenshots, ...action.items] };
    case 'REMOVE_SCREENSHOT':
      return { ...state, screenshots: state.screenshots.filter((_, i) => i !== action.idx) };
    case 'SET_TAB':
      return { ...state, currentTab: action.tab };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SET_AUTOSAVED':
      return { ...state, autoSaved: action.value };
    case 'SHOW_TOAST':
      return { ...state, toastMsg: action.msg };
    case 'HIDE_TOAST':
      return { ...state, toastMsg: '' };
    case 'APPLY_TEMPLATE':
      return {
        ...state,
        fields: { ...state.fields, ...action.fields },
        selectedTechs: new Set(action.techs || []),
        activeTemplate: action.templateId || null,
      };
    case 'SET_ACTIVE_TEMPLATE':
      return { ...state, activeTemplate: action.id };
    case 'RESET_ALL':
      return {
        ...initialState,
        theme: state.theme,
        selectedBadges: new Set(DEFAULT_BADGES),
        activeTemplate: null,
      };
    case 'LOAD_SAVED':
      return {
        ...state,
        fields: action.data.fields || {},
        license: action.data.license || 'MIT',
        sections: { ...DEFAULT_SECTIONS, ...(action.data.sections || {}) },
        selectedTechs: new Set(action.data.techs || []),
        selectedBadges: new Set(action.data.badges || [...DEFAULT_BADGES]),
      };
    default:
      return state;
  }
}

const ReadmeContext = createContext(null);

export function ReadmeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Initialize from localStorage on mount ──
  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    const theme = isDark ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', theme });
    document.body.classList.toggle('light-mode', !isDark);

    // Load saved data
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'LOAD_SAVED', data: JSON.parse(raw) });
    } catch (e) { console.error('Failed to load saved data:', e); }
  }, []);

  // ── Sync theme to <body> class ──
  useEffect(() => {
    document.body.classList.toggle('light-mode', state.theme === 'light');
    localStorage.setItem(THEME_KEY, state.theme);
  }, [state.theme]);

  // ── Auto-save with 600ms debounce ──
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const data = {
          fields: state.fields,
          license: state.license,
          sections: state.sections,
          techs: Array.from(state.selectedTechs),
          badges: Array.from(state.selectedBadges),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        dispatch({ type: 'SET_AUTOSAVED', value: true });
        setTimeout(() => dispatch({ type: 'SET_AUTOSAVED', value: false }), 2000);
      } catch (e) { console.error('Auto-save failed:', e); }
    }, 600);
    return () => clearTimeout(timer);
  }, [state.fields, state.license, state.sections, state.selectedTechs, state.selectedBadges]);

  // ── Toast auto-hide ──
  useEffect(() => {
    if (!state.toastMsg) return;
    const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2500);
    return () => clearTimeout(t);
  }, [state.toastMsg]);

  const showToast = useCallback((msg) => dispatch({ type: 'SHOW_TOAST', msg }), []);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET_ALL' });
    showToast('✓ Cleared!');
  }, [showToast]);

  return (
    <ReadmeContext.Provider value={{ state, dispatch, showToast, clearSavedData }}>
      {children}
    </ReadmeContext.Provider>
  );
}

export function useReadme() {
  const ctx = useContext(ReadmeContext);
  if (!ctx) throw new Error('useReadme must be used inside ReadmeProvider');
  return ctx;
}
