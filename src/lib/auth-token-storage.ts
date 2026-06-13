const ACCESS_TOKEN_KEY = 'relink.accessToken';
const REFRESH_TOKEN_KEY = 'relink.refreshToken';

type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export function getAccessToken() {
  return getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
}

export function getRefreshToken() {
  return getStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;
}

export function saveAuthTokens({ accessToken, refreshToken }: AuthTokens) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(ACCESS_TOKEN_KEY, accessToken);

  if (refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearAuthTokens() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
}
