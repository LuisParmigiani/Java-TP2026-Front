import { apiGet } from "./baseClient";
import type { UserResponse } from "./Interfaces";

export async function getUser(token: string): Promise<UserResponse> {
  return await apiGet<UserResponse>(`/usuario/me`, token);
}
