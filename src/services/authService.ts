import { apiPost, apiGet } from "./baseClient";
import type { LoginResponse, RegisterResponse, jwtDecoded } from "./Interfaces";
import { jwtDecode } from "jwt-decode";

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return await apiPost<LoginResponse>("/auth/login", {
    email,
    contrasena: password,
  });
}

export async function register(
  email: string,
  password: string,
  persona_tipoDoc: string,
  persona_nroDoc: string,
  persona_nombre: string,
  persona_apellido: string,
  persona_telefono: string,
  usuario_nombre: string,
  usuario_nivelAcceso: string,
): Promise<RegisterResponse> {
  return await apiPost<RegisterResponse>("/auth/register", {
    email,
    usuario_contrasena: password,
    persona_tipoDoc,
    persona_nroDoc,
    persona_nombre,
    persona_apellido,
    persona_telefono,
    usuario_nombre,
    usuario_nivelAcceso,
  });
}

export async function verifyToken(token: string) {
  // Llama al backend para validar el token y obtener datos confiables
  return await apiGet("/auth/verify-token", token); // El backend debe leer el token del header Authorization
}

export function decodeToken(token: string): jwtDecoded | null {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
