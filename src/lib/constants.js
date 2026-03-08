export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';
export const OAUTH_PROXY_URL = import.meta.env.VITE_OAUTH_PROXY_URL || '';
export const REPO_OWNER = import.meta.env.VITE_REPO_OWNER || 'RigTree';
export const REPO_NAME = import.meta.env.VITE_REPO_NAME || 'website';
export const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;
export const DATA_DIR = 'data';

export const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
export const GITHUB_API = 'https://api.github.com';

export const OAUTH_SCOPES = 'public_repo read:user';

export function getAuthUrl() {
  let state = sessionStorage.getItem('oauth_state');
  if (!state) {
    state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);
  }
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: `${window.location.origin}/callback`,
    scope: OAUTH_SCOPES,
    state,
  });
  return `${GITHUB_AUTH_URL}?${params}`;
}
