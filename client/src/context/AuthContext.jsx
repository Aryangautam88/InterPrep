import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import { setAccessToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const applySession = useCallback((payload) => {
    setAccessToken(payload?.accessToken || null);
    setUser(payload?.user || null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await authApi.refresh();
        if (!cancelled) applySession(data.data);
      } catch {
        if (!cancelled) applySession(null);
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applySession]);

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);
    applySession(data.data);
    return data.data;
  }, [applySession]);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    if (!data.data.pendingApproval) {
      applySession(data.data);
    }
    return data.data;
  }, [applySession]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      applySession(null);
    }
  }, [applySession]);

  const value = useMemo(
    () => ({ user, bootstrapping, login, register, logout }),
    [user, bootstrapping, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
