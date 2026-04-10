import { apiPost } from "./baseClient";

interface LoginResponse {
  success: boolean;
  token?: string;
  userId?: number;
  role?: string;
  error?: string;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return await apiPost<LoginResponse>("/auth/login", {
    email,
    contrasena: password,
  });
}
