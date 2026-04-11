import React, { useState, useEffect, type ReactNode } from 'react';
import { login as loginAPI } from '../services/authService';
import { AuthContext } from './authContext';

interface User {
  userId: number;
  email: string;
  role: 'Administrador' | 'Empleado' | 'Usuario';
  name?: string;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Cargar token del localStorage al montar
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginAPI(email, password);
      
      if (response.success && response.token && response.userId) {
        const user: User = {
          userId: response.userId,
          email: email,
          role: (response.role as 'Administrador' | 'Empleado' | 'Usuario') || 'Usuario',
          name: email.split('@')[0], // Fallback: usar parte del email
        };

        setToken(response.token);
        setCurrentUser(user);
        setIsAuthenticated(true);

        // Guardar en localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
