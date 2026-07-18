import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService, setAuthToken, setUnauthorizedHandler } from '../services/api';
import { getReadableError } from '../utils/errorUtils';

const AUTH_STORAGE_KEY = 'inventory_auth';
const AuthContext = createContext(null);

const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)) || {};
  } catch (error) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const storedAuth = getStoredAuth();
  const [user, setUser] = useState(storedAuth.user || null);
  const [token, setToken] = useState(storedAuth.token || '');
  const [authLoading, setAuthLoading] = useState(Boolean(storedAuth.token));

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setToken('');
      toast.error('Your session expired. Please login again.');
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await authService.getProfile();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
        setToken('');
      } finally {
        setAuthLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const persistAuth = (authData) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    setToken(authData.token);
    setUser(authData.user);
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      persistAuth({ token: response.token, user: response.user });
      toast.success(`Welcome back, ${response.user.fullName.split(' ')[0]}!`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: getReadableError(error, 'Invalid email or password')
      };
    }
  };

  const register = async (values) => {
    try {
      const response = await authService.register(values);
      persistAuth({ token: response.token, user: response.user });
      toast.success('Account created successfully');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: getReadableError(error, 'Unable to create account')
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setToken('');
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      authLoading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      register
    }),
    [authLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
