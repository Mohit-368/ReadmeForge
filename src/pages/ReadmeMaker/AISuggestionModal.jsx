import React, { useState, useEffect } from 'react';
import { getStoredKey, storeKey, clearKey, buildPrompt, callGemini } from '../../utils/aiUtils';
import { useToast } from '../../components/ui/Toast';

export default function AISuggestionModal({
  aiState,
  closeAIModal,
  setAIScope,
  setAILoading,
  setAISuggestions,
  setAIError,
  acceptSuggestion,
  rejectSuggestion,
  undoSuggestion,
  editSuggestion,
  toggleEditSuggestion,
  acceptAllSuggestions,
  formData,
  currentMd,
  updateField
}) {
  const toast = useToast();
  const [apiKeyInput, setApiKeyInput] = useState(getStoredKey());

  const runAIRequest = async () => {
    const apiKey = getStoredKey();

    if (!apiKey) {
      setAIError('INVALID_KEY');
      return;
    }

    setAILoading(true);

    try {
      const prompt = buildPrompt(aiState.scope, formData, currentMd);
      const suggestions = await callGemini(prompt, apiKey);
      setAISuggestions(suggestions);
    } catch (err) {
      setAIError(err.message || 'UNKNOWN');
    }
  };

  useEffect(() => {
    if (aiState.isOpen && aiState.suggestions.length === 0 && !aiState.isLoading && !aiState.lastError) {
      runAIRequest();
    }
  }, [aiState.isOpen, aiState.scope]);

  if (!aiState.isOpen) return null;

  const handleSaveKey = () => {
    if (!apiKeyInput.trim()) {
      toast('Please enter a key first.');
      return;
    }
    storeKey(apiKeyInput);
    runAIRequest();
  };

  const handleClearKey = () => {
    clearKey();
    setApiKeyInput('');
    setAIError('INVALID_KEY');
    toast('API key cleared.');
  };

  const handleAccept = (idx) => {
    const s = aiState.suggestions[idx];
    const val = s.edited !== null ? s.edited : s.after;
    const fieldMap = {
      "Description": "description",
      "Title/Tagline": "tagline",
      "Features": "features",
      "Installation": "installCmds"
    };
    const fieldId = fieldMap[s.section];
    if (fieldId) {
      updateField(fieldId, val);
      acceptSuggestion(idx);
      toast('✓ Suggestion applied!');
    }
  };

  const handleAcceptAll = () => {
    aiState.suggestions.forEach((s, idx) => {
      if (s.status === 'pending') {
        const val = s.edited !== null ? s.edited : s.after;
        const fieldMap = {
          "Description": "description",
          "Title/Tagline": "tagline",
          "Features": "features",
          "Installation": "installCmds"
        };
        const fieldId = fieldMap[s.section];
        if (fieldId) {
          updateField(fieldId, val);
        }
      }
    });
    acceptAllSuggestions();
    toast('✓ All suggestions applied!');
  };

  return (
    <div className="ai-modal-overlay" onClick={(e) => e.target.className === 'ai-modal-overlay' && closeAIModal()}>
      <div className="ai-modal">
        {/* Header */}
        <div className="ai-modal-header">
          <div className="ai-modal-header-left">
            <div className="ai-modal-icon">✨</div>
            <div>
              <h2 className="ai-modal-title">AI README Suggestions</h2>
              <div className="ai-modal-subtitle">Powered by Google Gemini</div>
            </div>
          </div>
          <button className="ai-modal-close" onClick={closeAIModal}>✕</button>
        </div>

        {/* Scope Selector */}
        <div className="ai-modal-scope">
          <span className="ai-scope-label">Scope:</span>
          {[
            { id: 'full', label: '🗂 Entire README' },
            { id: 'description', label: '📋 Description' },
            { id: 'features', label: '✨ Features' },
            { id: 'installation', label: '🚀 Installation' },
            { id: 'title', label: '📌 Title' }
          ].map(s => (
            <button
              key={s.id}
              className={`ai-scope-btn ${aiState.scope === s.id ? 'active' : ''}`}
              onClick={() => setAIScope(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="ai-modal-body">
          {aiState.isLoading ? (
            <div className="ai-loading-state">
              <div className="ai-loading-orb"><div className="ai-loading-icon">✨</div></div>
              <div className="ai-loading-text">
                <div className="ai-loading-title">Generating suggestions...</div>
                <div className="ai-loading-sub">Analyzing your README with Gemini AI</div>
              </div>
              <div className="ai-skeleton-list">
                <div className="ai-skeleton-row" style={{ width: '80%' }}></div>
                <div className="ai-skeleton-row" style={{ width: '60%' }}></div>
                <div className="ai-skeleton-row" style={{ width: '72%' }}></div>
                <div className="ai-skeleton-row" style={{ width: '55%' }}></div>
              </div>
            </div>
          ) : aiState.lastError ? (
            <div className="ai-error-state">
              <div className="ai-error-icon">⚠️</div>
              <div className="ai-error-title">Could not get suggestions</div>
              <div className="ai-error-msg">
                {aiState.lastError === 'RATE_LIMIT' ? "You've hit the API rate limit. Please wait a moment and try again." :
                 aiState.lastError === 'INVALID_KEY' ? "Your Gemini API key is invalid or missing. Please enter a valid key below." :
                 aiState.lastError === 'PARSE_EMPTY' ? "The AI returned an unexpected response. Please try again." :
                 "An unexpected error occurred. Check your internet connection and try again."}
              </div>
              <button className="ai-retry-btn" onClick={runAIRequest}>↺ Try Again</button>

              <div className="ai-key-banner" style={{ marginTop: 24, width: '100%' }}>
                <div className="ai-key-banner-icon">🔑</div>
                <div className="ai-key-banner-body">
                  <div className="ai-key-banner-title">Gemini API Key</div>
                  <div className="ai-key-banner-desc">
                    Enter your <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#a78bfa' }}>Google AI Studio</a> key.
                  </div>
                  <div className="ai-key-input-row">
                    <input
                      type="password"
                      className="ai-key-input"
                      placeholder="AIzaSy..."
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                    />
                    <button className="ai-key-save-btn" onClick={handleSaveKey}>✓ Save & Retry</button>
                    {getStoredKey() && <button className="ai-key-clear-btn" onClick={handleClearKey}>🗑 Clear</button>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="ai-suggestions-list">
              {aiState.suggestions.length === 0 ? (
                <div className="ai-error-state">
                  <div className="ai-error-icon">🎉</div>
                  <div className="ai-error-title">Your README looks great!</div>
                  <div className="ai-error-msg">No major improvements were found for the selected scope.</div>
                </div>
              ) : (
                aiState.suggestions.map((s, idx) => (
                  <div key={idx} className={`ai-suggestion-card ${s.status}`}>
                    <div className="ai-card-header">
                      <div className="ai-card-section-name">
                        <span className="ai-card-section-icon">{s.icon}</span>
                        {s.section}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`ai-card-badge ${s.type}`}>{s.type}</span>
                        {s.status !== 'pending' && (
                          <span className={`ai-card-status ${s.status}-badge`}>
                            {s.status === 'accepted' ? '✓ Accepted' : '✕ Rejected'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="ai-diff-view">
                      {s.before && (
                        <>
                          <div className="ai-diff-label">Before</div>
                          <div className="ai-diff-before">{s.before}</div>
                          <div className="ai-diff-divider"></div>
                        </>
                      )}
                      <div className="ai-diff-label">Suggested {s.edited !== null ? '(edited)' : ''}</div>
                      {s.isEditing ? (
                        <textarea
                          className="ai-edit-area"
                          value={s.edited !== null ? s.edited : s.after}
                          onChange={(e) => editSuggestion(idx, e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <div className="ai-diff-after">{s.edited !== null ? s.edited : s.after}</div>
                      )}
                      {s.reason && (
                        <div className="ai-diff-label" style={{ color: '#a78bfa', paddingBottom: 8 }}>💡 {s.reason}</div>
                      )}
                    </div>

                    <div className="ai-card-actions">
                      {s.status === 'pending' ? (
                        <>
                          <button className="ai-accept-btn" onClick={() => handleAccept(idx)}>✓ Accept</button>
                          <button className="ai-reject-btn" onClick={() => rejectSuggestion(idx)}>✕ Reject</button>
                          <button
                            className="ai-edit-toggle-btn"
                            onClick={() => toggleEditSuggestion(idx)}
                          >
                            {s.isEditing ? '✓ Save' : '✏️ Edit'}
                          </button>
                        </>
                      ) : (
                        <button className="ai-edit-toggle-btn" onClick={() => undoSuggestion(idx)}>↺ Undo</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ai-modal-footer">
          <div className="ai-footer-info">
            {aiState.isLoading ? 'Generating suggestions...' :
             aiState.lastError ? 'Error occurred' :
             `${aiState.suggestions.length} suggestions · ${aiState.suggestions.filter(s => s.status === 'accepted').length} accepted`}
          </div>
          <div className="ai-footer-actions">
            <button className="ai-dismiss-btn" onClick={closeAIModal}>Dismiss</button>
            <button
              className="ai-accept-all-btn"
              onClick={handleAcceptAll}
              disabled={aiState.isLoading || aiState.suggestions.filter(s => s.status === 'pending').length === 0}
            >
              ✓ Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
