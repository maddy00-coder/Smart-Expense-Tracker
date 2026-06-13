import { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '../lib/api';

const AuthContext = createContext(null);

const storedToken = localStorage.getItem('smart-expense-token');
const storedUser = localStorage.getItem('smart-expense-user');

export function AuthProvider({ children }) {
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [loading, setLoading] = useState(Boolean(storedToken));

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/api/auth/me')
      .then((response) => {
        const nextUser = response.data?.data?.user || response.data?.user;
        setUser(nextUser);
        localStorage.setItem('smart-expense-user', JSON.stringify(nextUser));
      })
      .catch((error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          logout();
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = (payload) => {
    const authData = payload?.data || payload;
    const nextToken = authData?.token;
    const nextUser = authData?.user;

    if (!nextToken || !nextUser) {
      return;
    }

    setToken(nextToken);
    setUser(nextUser);
    setAuthToken(nextToken);
    localStorage.setItem('smart-expense-token', nextToken);
    localStorage.setItem('smart-expense-user', JSON.stringify(nextUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('smart-expense-token');
    localStorage.removeItem('smart-expense-user');
    sessionStorage.removeItem('smart-expense-token');
    sessionStorage.removeItem('smart-expense-user');
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
