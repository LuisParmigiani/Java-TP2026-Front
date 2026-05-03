import { apiGet, apiPost, apiPut } from "./baseClient";
import type { DomicilioRequest, DomicilioResponse, PaginationResponse } from "./Interfaces";

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
  token?: string,
): Promise<DomicilioResponse> {
  try {
    console.log("Posting new direction with data:", direction);
    const response = await apiPost<DomicilioResponse>(
      "/domicilio",
      direction,
      token,
    );
    console.log("Direction posted successfully:", response);
    return response;
  } catch (error) {
    console.error("Error posting direction:", error);
    throw error;
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
    const response = await apiGet<PaginationResponse<DomicilioResponse>>(
      `/domicilio/token/usuario?${query}`,
      token,
    );
    return response;
  } catch (error) {
    console.error("Error fetching directions:", error);
    throw error;
  }
}
export async function fetchDomiciliosByCalleAndNumero(
  populate?: string[],
  calleYNumero ?: string,
  ): Promise<DomicilioResponse[]> {
  try {
    let query = "";
    if (populate) {
      query = "populate=" + populate.join(",") + "&";
    }
    if (calleYNumero) {
      
      query = query + "calleNumero=" + calleYNumero ;
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
  populate?: string[],
): Promise<DomicilioResponse> {
  try {
    let query = "";
    if (populate) {
      query = "populate=" + populate.join(",");
    }
    const response = await apiGet<DomicilioResponse>(
      `/domicilio/${id}?${query}`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching direction by ID:", error);
    throw error;
  }
}
