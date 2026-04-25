import { apiPost } from "./baseClient";
import type { PedidoSemanalRequest, PedidoSemanalResponse } from "./Interfaces";

export async function createWeeklyOrder(
    weeklyOrder: PedidoSemanalRequest[],
    addressId: number,
    populate: string[],
): Promise<PedidoSemanalResponse[]> {

    let queryParams = `?addressId=${addressId}`;
    if (populate.length > 0)
        queryParams += `&populate=${populate.join(',')}`;

    return await apiPost<PedidoSemanalResponse[]>(
        `/pedidoSemanal/createMany${queryParams}`,
        weeklyOrder   // ← solo el array, sin wrappear
    );
}