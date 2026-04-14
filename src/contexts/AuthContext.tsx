import React, { useState, useEffect, type ReactNode } from "react";
import {
  login as loginAPI,
  register as registerAPI,
} from "../services/authService";
import { AuthContext } from "./authContext";

interface User {
  userId: number;
  email: string;
  role: "Administrador" | "Empleado" | "Usuario";
  name?: string;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Cargar token del localStorage al montar
  useEffect(() => {
    let storedToken = localStorage.getItem("authToken");
    let storedUser = localStorage.getItem("currentUser");

    // Si no hay en localStorage, intenta sessionStorage
    if (!storedToken || !storedUser) {
      storedToken = sessionStorage.getItem("authToken");
      storedUser = sessionStorage.getItem("currentUser");
    }

    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    try {
      const response = await loginAPI(email, password);

      if (response.success && response.token && response.userId) {
        const user: User = {
          userId: response.userId,
          email: email,
          role:
            (response.role as "Administrador" | "Empleado" | "Usuario") ||
            "Usuario",
          name: email.split("@")[0], // Fallback: usar parte del email
        };

        setToken(response.token);
        setCurrentUser(user);
        setIsAuthenticated(true);
        if (rememberMe) {
          //Guardar en localStorage
          localStorage.setItem("authToken", response.token);
          localStorage.setItem("currentUser", JSON.stringify(user));
        } else {
          // Guardar en sessionStorage
          sessionStorage.setItem("authToken", response.token);
          sessionStorage.setItem("currentUser", JSON.stringify(user));
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
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("currentUser");
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
      value={{ currentUser, isAuthenticated, token, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
