import { apiGet, apiPost, apiPut } from "./baseClient";
import type { DomicilioRequest, DiaDomicilioRequest, DomicilioResponse, PaginationResponse, ErrorResponse } from "./Interfaces";

export async function updateDirection(
  direction: DomicilioResponse,
  token?: string,
): Promise<DomicilioResponse> {
  try {
    console.log("Updating direction with data:", direction);
    const response = await apiPut<DomicilioResponse>(
      `/domicilio/${direction.id}`,
      direction,
      token,
    );
    return response;
  } catch (error) {
    console.error("Error updating direction:", error);
    throw error;
  }
}

export async function postDirection(
  direction: DomicilioRequest,
  token: string,
): Promise<DomicilioResponse> {
  try {
    console.log("Posting new direction with data:", direction);
    const response = await apiPost<DomicilioResponse>(
      "/domicilio",
      direction,
      token,
    );
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error posting new direction:", errorResponse);
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
  try {
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
    console.log(`domicilio/token/usuario?${query}`);

    const response = await apiGet<PaginationResponse<DomicilioResponse>>(
      `/domicilio/token/usuario?${query}`,
      token,
    );
    console.log("Directions fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error fetching directions:", error);
    throw error;
  }
}
export async function fetchDomiciliosByCalleAndNumero(
  populate?: string[],
  calleYNumero?: string,
): Promise<DomicilioResponse[]> {
  try {
    let query = "";
    if (populate) {
      query = "populate=" + populate.join(",") + "&";
    }
    if (calleYNumero) {

      query = query + "calleNumero=" + calleYNumero;
    }
    console.log(`domicilio/search?${query}`);
    const response = await apiGet<DomicilioResponse[]>(
      `/domicilio/search?${query}`,
    );
    console.log("Domicilios fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error fetching directions:", error);
    throw error;
  }
}

export async function getById(
  id: number,
  token: string,
  populate?: string[],
): Promise<DomicilioResponse> {
  try {
    let query = "";
    if (populate) {
      query = "populate=" + populate.join(",");
    }
    const response = await apiGet<DomicilioResponse>(
      `/domicilio/${id}?${query}`,token
    );
    return response;
  } catch (error) {
    console.error("Error fetching direction by ID:", error);
    throw error;
  }
}
export async function updateDays(
  directionId: number,
  dias: DiaDomicilioRequest[],
): Promise<DomicilioResponse> {
  return await apiPut(
    `/domicilio/${directionId}/dias`,
    dias);
}

export async function getAll(token:string,populate?: string[]): Promise<DomicilioResponse[]> {

  try {
    const query = populate ? "populate=" + populate.join(",") : "";
    const response = await apiGet<DomicilioResponse[]>(
      `/domicilio?${query}`,token,
    );
    return response;
  } catch (error) {
    console.error("Error fetching direction by ID:", error);
    throw error;
  }



}



export async function postDirectionAdmin(
  direction: DomicilioRequest,
): Promise<DomicilioResponse> {
  try {
    console.log("Posting new direction with data:", direction);
    const response = await apiPost<DomicilioResponse>(
      "/domicilio/admin",
      direction
    );
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error posting new direction:", errorResponse);
    throw errorResponse;
  }
}

export async function getPending(
  token: string,
  populate?: string[],
): Promise<DomicilioResponse[]> {
  try {
    const query = populate ? "populate=" + populate.join(",") : "";
    const response = await apiGet<DomicilioResponse[]>(
      `/domicilio/pendientes?${query}`,token
    );
    return response;
  } catch (error) {
    console.error("Error fetching pending directions:", error);
    throw error;
  }
}