
import { apiGet } from "./baseClient";
import type { UserResponse } from "./Interfaces";

export async function getUser(id: number): Promise<UserResponse> {
    return await apiGet<UserResponse>(`/usuario/${id}`);
}