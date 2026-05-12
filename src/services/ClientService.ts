import { apiGet, apiPutFormData } from "./baseClient";
import type { UserResponse, UserRequest } from "./Interfaces";

export async function getUser(
  token: string,
  populate?: string[],
): Promise<UserResponse> {
  let query = "";
  if (populate && populate.length > 0) {
    query = "?populate=" + populate.join(",");
  }
  return await apiGet<UserResponse>(`/usuario/me${query}`, token);
}

export async function UpdateUserAPersona(
  token: string,
  formData: UserRequest,
  file?: File,
  populate?: string[],
): Promise<UserResponse> {
  const multipartFormData = new FormData();
  multipartFormData.append(
    "entidad",
    new Blob([JSON.stringify(formData)], { type: "application/json" }),
  );

  if (file) {
    multipartFormData.append("file", file);
  }

  let query = "";
  if (populate && populate.length > 0) {
    query = "?populate=" + populate.join(",");
  }

  return await apiPutFormData<UserResponse>(
    `/usuario/updatePersona${query}`,
    multipartFormData,
    token,
  );
}

export async function getDriverInfo(
  token: string,
  populate?: string[],
): Promise<UserResponse> {
  let query = "";
  if (populate.length > 0) {
    query = "?populate=" + populate.join(",");
  }
  return await apiGet<UserResponse>(`/usuario/driver${query}`, token);
}
