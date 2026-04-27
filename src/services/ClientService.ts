import { apiGet, apiPut } from "./baseClient";
import type { UserResponse, UserRequest } from "./Interfaces";

<<<<<<< HEAD
export async function getUser(token: string, populate?: string[] | null): Promise<UserResponse> {
  let query = '';
  if (populate && populate.length > 0) {
    query = '?populate=' + populate.join(',');
=======
export async function getUser(
  token: string,
  populate?: string[],
): Promise<UserResponse> {
  let query = "";
  if (populate.length > 0) {
    query = "?populate=" + populate.join(",");
>>>>>>> f7537b194e71989f5ccc423498b981f0f3a6431a
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