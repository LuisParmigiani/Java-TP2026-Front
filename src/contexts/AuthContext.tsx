import React, { useState, useEffect, type ReactNode } from "react";
import {
  login as loginAPI,
  register as registerAPI,
  verifyToken, // función de authService que valida token
  decodeToken, // función de authService que decodifica token para extraer datos confiables del usuario
} from "../services/authService";
import { AuthContext } from "./authContext";
import type { jwtDecoded } from "../services/Interfaces";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<jwtDecoded | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Cargar token del storage al montar
  useEffect(() => {
    let storedToken =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    setToken(storedToken || null);
    setLoading(false);
  }, []);

  // 2. Validar token y extraer datos confiables
  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      return;
    }

    setLoading(true);
    verifyToken(token)
      .then(() => {
        // Decodifica localmente después de validar con el backend
        const decoded = decodeToken(token);
        setCurrentUser({
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          username: decoded.username,
        });
        setIsAuthenticated(true);
      })
      .catch(() => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    try {
      const response = await loginAPI(email, password);

      if (response.success && response.token) {
        setToken(response.token);
        if (rememberMe) {
          localStorage.setItem("authToken", response.token);
        } else {
          sessionStorage.setItem("authToken", response.token);
        }
      } else {
        throw new Error(response.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
  };

  const register = async (
    email: string,
    password: string,
    persona_tipoDoc: string,
    persona_nroDoc: string,
    persona_nombre: string,
    persona_apellido: string,
    persona_telefono: string,
    usuario_nombre: string,
    usuario_nivelAcceso: string,
  ) => {
    try {
      const response = await registerAPI(
        email,
        password,
        persona_tipoDoc,
        persona_nroDoc,
        persona_nombre,
        persona_apellido,
        persona_telefono,
        usuario_nombre,
        usuario_nivelAcceso,
      );

      if (response.success) {
        // Registro exitoso, puedes manejarlo como desees
        // Nada, solo me importan los errores porque el componente redirige en caso de no haber errores
      } else {
        throw new Error(response.error || "Registro fallido");
      }
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        token,
        login,
        logout,
        register,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
