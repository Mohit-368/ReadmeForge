const GIST_TOKEN_KEY = 'readmeforge-gist-token';

export function getGistToken() {
  try {
    return localStorage.getItem(GIST_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setGistToken(token) {
  try {
    if (token) localStorage.setItem(GIST_TOKEN_KEY, token);
    else localStorage.removeItem(GIST_TOKEN_KEY);
  } catch {}
}

export async function createGist({ description, content, filename = 'README.md', isPublic = true, token }) {
  if (!token?.trim()) {
    throw new Error('GitHub token required. Create a token with the "gist" scope at github.com/settings/tokens');
  }

  const res = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token.trim()}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      description: description || 'README generated with ReadmeForge',
      public: isPublic,
      files: {
        [filename]: { content },
      },
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || `GitHub API error (${res.status})`;
    throw new Error(msg);
  }

  return {
    htmlUrl: data.html_url,
    id: data.id,
  };
}
