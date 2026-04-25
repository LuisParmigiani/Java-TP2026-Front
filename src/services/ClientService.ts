import { apiGet } from "./baseClient";
import type { UserResponse, } from "./Interfaces";

export async function getUser(token: string, populate?: string[] | null): Promise<UserResponse> {
  let query = '';
  if (populate && populate.length > 0) {
    query = '?populate=' + populate.join(',');
  }
  return await apiGet<UserResponse>(`/usuario/me${query}`, token);
}

