import { apiGet, apiPost } from "./baseClient";
import type { PagoResponse, PagoRequest } from "./Interfaces";

export async function getPagos(token: string, populate?: string[]): Promise<PagoResponse[]> {
    let query = '';
    if (populate && populate.length > 0) {
        query = '?populate=' + populate.join(',');
    }
    return await apiGet<PagoResponse[]>(`/pago/me${query}`, token);
}

export async function createPago(token: string, pago: PagoRequest): Promise<PagoResponse> {
    return await apiPost<PagoResponse>('/pago/me', pago, token);
}

export async function getPagoById(): Promise<number> {

    return await apiGet<number>(`/pago/ingressos`);
}   
