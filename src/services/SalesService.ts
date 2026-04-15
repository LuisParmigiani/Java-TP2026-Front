import { apiGet, apiPut } from "./baseClient";

import type { VentaRequest, VentaResponse } from "./Interfaces";



export async function getByUserId(): Promise<VentaResponse[]> {
    return await apiGet<VentaResponse[]>(`/venta/token/ByUserId`);
}

export async function updateSale(id: number, sales: VentaRequest): Promise<VentaResponse> {
    return await apiPut<VentaResponse>(`/venta/${id}`, sales);

}