
import { apiGet } from "./baseClient";
import type { UserResponse } from "./Interfaces";

export async function getUser(): Promise<UserResponse> {
    return await apiGet<UserResponse>(`/usuario/me`);
}


