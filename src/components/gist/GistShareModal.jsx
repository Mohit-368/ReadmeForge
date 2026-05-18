import { useState } from 'react';
import { createGist, getGistToken, setGistToken } from '../../utils/gistUtils';

export default function GistShareModal({ open, onClose, markdown, projectName, onSuccess }) {
  const [token, setToken] = useState(() => getGistToken());
  const [rememberToken, setRememberToken] = useState(!!getGistToken());
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gistUrl, setGistUrl] = useState('');

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (rememberToken) setGistToken(token);
      else setGistToken('');

      const result = await createGist({
        description: `${projectName || 'README'} — created with ReadmeForge`,
        content: markdown,
        isPublic,
        token,
      });

      setGistUrl(result.htmlUrl);
      onSuccess?.(result.htmlUrl);
    } catch (err) {
      setError(err.message || 'Failed to create gist');
    } finally {
      setLoading(false);
    }
  }

  async function copyGistUrl() {
    if (!gistUrl) return;
    try {
      await navigator.clipboard.writeText(gistUrl);
    } catch {}
  }

  return (
    <div className="gist-modal-overlay" onClick={onClose} role="presentation">
      <div className="gist-modal" onClick={e => e.stopPropagation()} role="dialog" aria-labelledby="gist-modal-title">
        <button type="button" className="gist-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="gist-modal-header">
          <span className="gist-modal-icon">📎</span>
          <div>
            <h2 id="gist-modal-title">Save to GitHub Gist</h2>
            <p>Publish your README as a shareable Gist link</p>
          </div>
        </div>

        {gistUrl ? (
          <div className="gist-success">
            <div className="gist-success-badge">✓ Gist created</div>
            <a href={gistUrl} target="_blank" rel="noreferrer" className="gist-url">{gistUrl}</a>
            <SuccessActions copyGistUrl={copyGistUrl} gistUrl={gistUrl} onClose={onClose} />
          </div>
        ) : (
          <form className="gist-form" onSubmit={handleSubmit}>
            <label>
              GitHub Personal Access Token
              <input
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                autoComplete="off"
                required
              />
              <small>
                Needs <code>gist</code> scope.{' '}
                <a href="https://github.com/settings/tokens/new?scopes=gist&description=ReadmeForge" target="_blank" rel="noreferrer">
                  Create token →
                </a>
              </small>
            </label>

            <label className="gist-checkbox">
              <input
                type="checkbox"
                checked={rememberToken}
                onChange={e => setRememberToken(e.target.checked)}
              />
              Remember token in this browser
            </label>

            <label className="gist-checkbox">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
              />
              Public gist (anyone with the link can view)
            </label>

            {error && <p className="gist-error">{error}</p>}

            <div className="gist-form-actions">
              <button type="button" className="gist-btn gist-btn--ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="gist-btn gist-btn--primary" disabled={loading || !markdown?.trim()}>
                {loading ? 'Creating…' : 'Create Gist'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function SuccessActions({ copyGistUrl, gistUrl, onClose }) {
  return (
    <div className="gist-form-actions">
      <button type="button" className="gist-btn gist-btn--ghost" onClick={copyGistUrl}>Copy link</button>
      <a href={gistUrl} target="_blank" rel="noreferrer" className="gist-btn gist-btn--primary">Open Gist</a>
      <button type="button" className="gist-btn gist-btn--ghost" onClick={onClose}>Done</button>
    </div>
  );
}
