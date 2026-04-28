import { createContext } from "react";
import type { jwtDecoded } from "../services/Interfaces";

export interface AuthContextType {
  currentUser: jwtDecoded | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<jwtDecoded | null>;
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
  loading: boolean; // NUEVO
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
