import { apiGet } from "./baseClient";
import type { VentaResponse } from "./Interfaces";



export async function getByUserId(userId: number): Promise<VentaResponse[]> {
    return await apiGet<VentaResponse[]>(`/venta/ByUserId/${userId}`);
}