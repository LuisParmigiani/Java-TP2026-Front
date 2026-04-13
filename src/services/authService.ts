import { apiPost } from "./baseClient";
import type { LoginResponse, RegisterResponse } from "./Interfaces";

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
