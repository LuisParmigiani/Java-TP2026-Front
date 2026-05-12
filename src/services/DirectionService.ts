import { apiGet, apiPost, apiPut } from "./baseClient";
import type {
  DomicilioRequest,
  DiaDomicilioRequest,
  DomicilioResponse,
  PaginationResponse,
  ErrorResponse,
} from "./Interfaces";

export async function updateDirection(
  direction: DomicilioResponse,
  token?: string,
): Promise<DomicilioResponse> {
  const response = await apiPut<DomicilioResponse>(
    `/domicilio/${direction.id}`,
    direction,
    token,
  );
  return response;
}

export async function postDirection(
  direction: DomicilioRequest,
  token: string,
): Promise<DomicilioResponse> {
  try {
    const response = await apiPost<DomicilioResponse>(
      "/domicilio",
      direction,
      token,
    );
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    throw errorResponse;
  }
}

export async function getAllByUserId(
  token: string,
  status?: string,
  deliveryDay?: string,
  orderBy?: string,
  nameSearch?: string,
  enabledStatus?: string,
  populate?: string[],
  page?: number,
  size?: number,
): Promise<PaginationResponse<DomicilioResponse>> {
  let query;
  if (deliveryDay) {
    query = "&deliveryDay=" + deliveryDay;
  } else {
    query = "";
  }
  if (status) {
    query = "&estado=" + status + query;
  }
  if (populate) {
    query = "populate=" + populate.join(",") + query;
  }
  if (orderBy) {
    query = "orderBy=" + orderBy + "&" + query;
  }
  if (nameSearch) {
    query = "nameSearch=" + nameSearch + "&" + query;
  }
  if (page !== undefined && size !== undefined) {
    query = "page=" + page + "&size=" + size + "&" + query;
  }
  if (enabledStatus) {
    query = "enabledStatus=" + enabledStatus + "&" + query;
  }

  const response = await apiGet<PaginationResponse<DomicilioResponse>>(
    `/domicilio/token/usuario?${query}`,
    token,
  );
  return response;
}
export async function fetchDomiciliosByCalleAndNumero(
  token: string,
  populate?: string[],
  calleYNumero?: string,
): Promise<DomicilioResponse[]> {
  let query = "";
  if (populate) {
    query = "populate=" + populate.join(",") + "&";
  }
  if (calleYNumero) {
    query = query + "calleNumero=" + calleYNumero;
  }
  const response = await apiGet<DomicilioResponse[]>(
    `/domicilio/search?${query}`, token
  );
  return response;
}

export async function getById(
  id: number,
  token: string,
  populate?: string[],
): Promise<DomicilioResponse> {
  let query = "";
  if (populate) {
    query = "populate=" + populate.join(",");
  }
  const response = await apiGet<DomicilioResponse>(
    `/domicilio/${id}?${query}`,
    token,
  );
  return response;
}
export async function updateDays(
  directionId: number,
  dias: DiaDomicilioRequest[],
): Promise<DomicilioResponse> {
  return await apiPut(`/domicilio/${directionId}/dias`, dias);
}

export async function getAll(
  token: string,
  populate?: string[],
): Promise<DomicilioResponse[]> {
  const query = populate ? "populate=" + populate.join(",") : "";
  const response = await apiGet<DomicilioResponse[]>(
    `/domicilio?${query}`,
    token,
  );
  return response;
}

export async function postDirectionAdmin(
  direction: DomicilioRequest,
  token: string,
): Promise<DomicilioResponse> {
  try {
    const response = await apiPost<DomicilioResponse>(
      "/domicilio/admin",
      direction,
      token,
    );
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    throw errorResponse;
  }
}

export async function getPending(
  token: string,
  populate?: string[],
): Promise<DomicilioResponse[]> {
  const query = populate ? "populate=" + populate.join(",") : "";
  const response = await apiGet<DomicilioResponse[]>(
    `/domicilio/pendientes?${query}`,
    token,
  );
  return response;
}
