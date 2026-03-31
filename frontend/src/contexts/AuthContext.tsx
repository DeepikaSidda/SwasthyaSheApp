import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getAuthConfig, AuthConfig } from '../config/authConfig';

// --- Interfaces ---

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

// --- Constants ---

const USE_DEMO_MODE = false;
const AUTH_TOKENS_KEY = 'swasthyashe-auth-tokens';
const DEMO_USER_KEY = 'swasthyashe-demo-user';

const DEMO_USER: AuthUser = {
  sub: 'demo-user-001',
  email: 'demo@swasthyashe.com',
  name: 'Swasthyashe User',
  picture: undefined,
};

// --- Pure helper functions (exported for testing) ---

export function buildSignInUrl(config: AuthConfig): string {
  const baseUrl = `https://${config.domain}/oauth2/authorize`;
  const params = new URLSearchParams({
    response_type: 'token',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: 'openid email profile',
  });
  return `${baseUrl}?${params.toString()}`;
}

export function decodeIdToken(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const claims = JSON.parse(decoded);

    if (!claims.sub || !claims.email) {
      return null;
    }

    return {
      sub: claims.sub,
      email: claims.email,
      name: claims.name || claims.email.split('@')[0],
      picture: claims.picture || undefined,
    };
  } catch {
    return null;
  }
}

// --- Helper: check if token is expired ---

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const claims = JSON.parse(decoded);
    if (!claims.exp) return false;
    return Date.now() >= claims.exp * 1000;
  } catch {
    return true;
  }
}

// --- Helper: persist tokens to localStorage ---

function persistTokens(tokens: { id_token: string; access_token: string; refresh_token?: string }): void {
  try {
    localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));
  } catch {
    // localStorage unavailable (e.g. private browsing) — session won't persist
  }
}

function loadTokens(): { id_token: string; access_token: string; refresh_token?: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_TOKENS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearTokens(): void {
  try {
    localStorage.removeItem(AUTH_TOKENS_KEY);
  } catch {
    // ignore
  }
}

// --- Context ---

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
});

// --- Provider ---

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const config = getAuthConfig();

  const signIn = useCallback(() => {
    if (USE_DEMO_MODE) {
      try {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(DEMO_USER));
      } catch { /* ignore */ }
      setUser(DEMO_USER);
      return;
    }
    const cfg = getAuthConfig();
    if (!cfg) {
      console.warn('No auth config - cannot sign in');
      return;
    }
    const url = buildSignInUrl(cfg);
    window.location.href = url;
  }, []);

  const signOut = useCallback(() => {
    if (USE_DEMO_MODE) {
      try {
        localStorage.removeItem(DEMO_USER_KEY);
      } catch { /* ignore */ }
      setUser(null);
      return;
    }
    clearTokens();
    setUser(null);
    if (!config) return;
    const logoutUrl = `https://${config.domain}/logout?client_id=${config.clientId}&logout_uri=${encodeURIComponent(config.signOutUri)}`;
    window.location.href = logoutUrl;
  }, [config]);

  useEffect(() => {
    if (USE_DEMO_MODE) {
      try {
        const stored = localStorage.getItem(DEMO_USER_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch { /* ignore */ }
      setIsLoading(false);
      return;
    }

    if (!config) {
      setIsLoading(false);
      return;
    }

    async function init() {
      // 1. Check for tokens in URL hash (implicit grant flow)
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const idToken = hashParams.get('id_token');
      const accessToken = hashParams.get('access_token');

      if (idToken) {
        try {
          const decoded = decodeIdToken(idToken);

          if (!decoded) {
            throw new Error('Failed to decode id_token');
          }

          persistTokens({
            id_token: idToken,
            access_token: accessToken || '',
          });

          // Clean the URL of the tokens — replace location to trigger a clean page load
          window.location.replace('/');
          return;
        } catch (err) {
          console.warn('Auth token decode failed:', err);
          clearTokens();
          setUser(null);
        }

        setIsLoading(false);
        return;
      }

      // 2. Also handle authorization code flow (fallback)
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          const tokenUrl = `https://${config!.domain}/oauth2/token`;
          const body = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: config!.clientId,
            code,
            redirect_uri: config!.redirectUri,
          });

          const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
          });

          if (!response.ok) {
            throw new Error(`Token exchange failed: ${response.status}`);
          }

          const tokens = await response.json();
          const decoded = decodeIdToken(tokens.id_token);

          if (!decoded) {
            throw new Error('Failed to decode id_token');
          }

          persistTokens({
            id_token: tokens.id_token,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          });
          setUser(decoded);

          // Clean the URL of the auth code
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.warn('Auth token exchange failed:', err);
          clearTokens();
          setUser(null);
        }

        setIsLoading(false);
        return;
      }

      // 2. Try to restore session from localStorage
      const storedTokens = loadTokens();
      if (storedTokens?.id_token) {
        if (isTokenExpired(storedTokens.id_token)) {
          clearTokens();
          setUser(null);
        } else {
          const decoded = decodeIdToken(storedTokens.id_token);
          if (decoded) {
            setUser(decoded);
          } else {
            clearTokens();
            setUser(null);
          }
        }
      }

      setIsLoading(false);
    }

    init();
  }, [config]);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Hook ---

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
