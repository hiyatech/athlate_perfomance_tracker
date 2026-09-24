import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Load user data on startup if token exists
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await authApi.getMe();
          setUser(res.user);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  // Login handler
  const login = async (emailOrToken, passwordOrUser) => {
    if (typeof emailOrToken === 'string' && typeof passwordOrUser === 'object' && passwordOrUser !== null) {
      localStorage.setItem('token', emailOrToken);
      setToken(emailOrToken);
      setUser(passwordOrUser);
      return { token: emailOrToken, user: passwordOrUser };
    }
    const data = await authApi.login({ email: emailOrToken, password: passwordOrUser });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  // Signup handler
  const signup = async (nameOrToken, emailOrUser, password) => {
    if (typeof nameOrToken === 'string' && typeof emailOrUser === 'object' && emailOrUser !== null) {
      localStorage.setItem('token', nameOrToken);
      setToken(nameOrToken);
      setUser(emailOrUser);
      return { token: nameOrToken, user: emailOrUser };
    }
    const data = await authApi.signup({ name: nameOrToken, email: emailOrUser, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
