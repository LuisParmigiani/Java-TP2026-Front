import { apiGet, apiPut } from "./baseClient";
import type { UserResponse, UserRequest } from "./Interfaces";

export async function getUser(
  token: string,
  populate?: string[],
): Promise<UserResponse> {
  let query = "";
  if (populate.length > 0) {
    query = "?populate=" + populate.join(",");
  }
  return await apiGet<UserResponse>(`/usuario/me${query}`, token);
}

export async function UpdateUserAPersona(token: string, formData: UserRequest): Promise<void> {
  try {
    await apiPut(`/usuario/updatePersona`, formData, token);
  } catch (error) {
    console.error("Error updating user persona:", error);
  }

}


export async function getDriverInfo(token: string, populate?: string[]): Promise<UserResponse> {
  let query = "";
  if (populate.length > 0) {
    query = "?populate=" + populate.join(",");
  }
  return await apiGet<UserResponse>(`/usuario/driver${query}`, token);
}