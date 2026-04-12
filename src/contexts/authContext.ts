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
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
