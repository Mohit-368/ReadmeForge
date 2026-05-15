import { useState, useCallback, useRef } from 'react';
import { SECTIONS, DEFAULT_BADGES } from '../utils/constants';
import { loadData, saveData, clearData } from './useLocalStorage';

const initialFormData = {
  projName: '', tagline: '', ghUser: '', repoSlug: '',
  description: '', demoUrl: '', features: '', prereqs: '',
  installCmds: '', envVars: '', usageCmd: '', rawStructure: '',
  videoUrl: '', imageUrls: '', apiDocs: '', apiBase: '',
  contribNotes: '', authorName: '', authorGh: '', authorEmail: '',
  authorLinkedin: '', authorWebsite: '', customTech: '', license: 'MIT',
  supportMsg: '', supportBmac: '', supportKofi: '', supportPatreon: '', supportGhSponsors: '',
};

function buildDefaultSectionState() {
  const s = {};
  SECTIONS.forEach(sec => { s[sec.id] = sec.default; });
  return s;
}

export function useReadmeState() {
  const saved = loadData();

  const [formData, setFormData] = useState(() => {
    if (saved?.fields) return { ...initialFormData, ...saved.fields };
    return initialFormData;
  });

  const [sectionState, setSectionState] = useState(() => {
    const defaults = buildDefaultSectionState();
    if (saved?.sections) {
      Object.keys(defaults).forEach(id => {
        if (id in saved.sections) defaults[id] = !!saved.sections[id];
      });
    }
    return defaults;
  });

  const [selectedTechs, setSelectedTechs] = useState(() =>
    saved?.techs ? new Set(saved.techs) : new Set()
  );

  const [selectedBadges, setSelectedBadges] = useState(() =>
    saved?.badges ? new Set(saved.badges) : new Set(DEFAULT_BADGES)
  );

  const [screenshots, setScreenshots] = useState([]);
  const [autoSaved, setAutoSaved] = useState(false);
  const saveTimerRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  // ── AI Suggestion State ──────────────────────────────────────
  const [aiState, setAIState] = useState({
    isOpen: false,
    isLoading: false,
    scope: 'full',     // 'full' | 'description' | 'features' | 'installation' | 'title'
    suggestions: [],   // { id, section, icon, type, before, after, reason, status, edited }
    lastError: null,   // null | 'RATE_LIMIT' | 'INVALID_KEY' | 'PARSE_EMPTY' | 'UNKNOWN'
  });

  const openAIModal = useCallback((scope = 'full') => {
    setAIState(prev => ({ ...prev, isOpen: true, scope, suggestions: [], lastError: null }));
  }, []);

  const closeAIModal = useCallback(() => {
    setAIState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const setAIScope = useCallback((scope) => {
    setAIState(prev => ({ ...prev, scope, suggestions: [], lastError: null }));
  }, []);

  const setAILoading = useCallback((loading) => {
    setAIState(prev => ({ ...prev, isLoading: loading, lastError: null }));
  }, []);

  const setAISuggestions = useCallback((suggestions) => {
    setAIState(prev => ({ ...prev, isLoading: false, suggestions, lastError: null }));
  }, []);

  const setAIError = useCallback((code) => {
    setAIState(prev => ({ ...prev, isLoading: false, lastError: code }));
  }, []);

  const acceptSuggestion = useCallback((idx, editedValue = null) => {
    setAIState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map((s, i) =>
        i === idx ? { ...s, status: 'accepted', edited: editedValue ?? s.edited } : s
      ),
    }));
  }, []);

  const rejectSuggestion = useCallback((idx) => {
    setAIState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map((s, i) =>
        i === idx ? { ...s, status: 'rejected' } : s
      ),
    }));
  }, []);

  const undoSuggestion = useCallback((idx) => {
    setAIState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map((s, i) =>
        i === idx ? { ...s, status: 'pending' } : s
      ),
    }));
  }, []);

  const editSuggestion = useCallback((idx, value) => {
    setAIState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map((s, i) =>
        i === idx ? { ...s, edited: value } : s
      ),
    }));
  }, []);

  const toggleEditSuggestion = useCallback((idx) => {
    setAIState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map((s, i) =>
        i === idx ? { ...s, isEditing: !s.isEditing } : s
      ),
    }));
  }, []);

  const acceptAllSuggestions = useCallback(() => {
    setAIState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map(s =>
        s.status === 'pending' ? { ...s, status: 'accepted' } : s
      ),
    }));
  }, []);
  // ────────────────────────────────────────────────────────────

  const scheduleSave = useCallback((fd, ss, st, sb) => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveData({ formData: fd, sectionState: ss, selectedTechs: st, selectedBadges: sb });
      setAutoSaved(true);
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => setAutoSaved(false), 2000);
    }, 600);
  }, []);

  const updateField = useCallback((field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      scheduleSave(next, sectionState, selectedTechs, selectedBadges);
      return next;
    });
  }, [sectionState, selectedTechs, selectedBadges, scheduleSave]);

  const toggleSection = useCallback((id, checked) => {
    setSectionState(prev => {
      const next = { ...prev, [id]: checked };
      scheduleSave(formData, next, selectedTechs, selectedBadges);
      return next;
    });
  }, [formData, selectedTechs, selectedBadges, scheduleSave]);

  const toggleTech = useCallback((label) => {
    setSelectedTechs(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label); else next.add(label);
      scheduleSave(formData, sectionState, next, selectedBadges);
      return next;
    });
  }, [formData, sectionState, selectedBadges, scheduleSave]);

  const toggleBadge = useCallback((id) => {
    setSelectedBadges(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      scheduleSave(formData, sectionState, selectedTechs, next);
      return next;
    });
  }, [formData, sectionState, selectedTechs, scheduleSave]);

  const applyTemplate = useCallback((template) => {
    setFormData(prev => {
      const next = {
        ...prev,
        projName: template.name,
        tagline: template.tag,
        description: template.desc,
        features: template.features,
      };
      scheduleSave(next, sectionState, new Set(template.techs), selectedBadges);
      return next;
    });
    setSelectedTechs(new Set(template.techs));
  }, [sectionState, selectedBadges, scheduleSave]);

  const resetAll = useCallback(() => {
    setFormData(initialFormData);
    setSectionState(buildDefaultSectionState());
    setSelectedTechs(new Set());
    setSelectedBadges(new Set(DEFAULT_BADGES));
    setScreenshots([]);
    clearData();
  }, []);

  const clearSaved = useCallback(() => {
    clearData();
  }, []);

  const addScreenshots = useCallback((files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshots(prev => [...prev, { name: file.name, dataUrl: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeScreenshot = useCallback((idx) => {
    setScreenshots(prev => prev.filter((_, i) => i !== idx));
  }, []);

  return {
    formData, updateField,
    sectionState, toggleSection,
    selectedTechs, toggleTech,
    selectedBadges, toggleBadge,
    screenshots, addScreenshots, removeScreenshot,
    applyTemplate, resetAll, clearSaved,
    autoSaved,
    // AI suggestion system
    aiState,
    openAIModal, closeAIModal, setAIScope,
    setAILoading, setAISuggestions, setAIError,
    acceptSuggestion, rejectSuggestion, undoSuggestion,
    editSuggestion, toggleEditSuggestion, acceptAllSuggestions,
  };
}
