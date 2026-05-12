// src/services/DiaService.ts

import { apiGet, apiPost } from './baseClient';
import type { GastoRequest, GastoResponse, PaginationResponse } from './Interfaces';



export async function getAll(
    page: number = 0,
    size: number = 10,
): Promise<PaginationResponse<GastoResponse>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    return apiGet<PaginationResponse<GastoResponse>>(`/gasto?${params.toString()}`);
}

export async function postExpense(
    expense: GastoRequest,
): Promise<GastoResponse> {
    const response = await apiPost<GastoResponse>(
        "/gasto",
        expense
    );
    return response;
}