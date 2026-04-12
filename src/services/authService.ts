import { apiPost } from "./baseClient";
import type { LoginResponse } from "./Interfaces";


export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return await apiPost<LoginResponse>("/auth/login", {
    email,
    contrasena: password,
  });
}




