import { createContext } from "react";

interface User {
  userId: number;
  email: string;
  role: "Administrador" | "Empleado" | "Usuario";
  name?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    persona_tipoDoc: string,
    persona_nroDoc: string,
    persona_nombre: string,
    persona_apellido: string,
    persona_telefono: string,
    usuario_nombre: string,
    usuario_nivelAcceso: string,
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
