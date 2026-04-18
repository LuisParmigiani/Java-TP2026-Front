import { apiGet, apiPost, apiPut } from "./baseClient";
import type { DomicilioRequest, DomicilioResponse } from "./Interfaces";

export async function updateDirection(
  direction: DomicilioResponse,
  token?: string,
): Promise<DomicilioResponse> {
  try {
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
    const response = await apiPost<DomicilioResponse>(
      "/domicilio",
      direction,
      token,
    );
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
): Promise<DomicilioResponse[]> {
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
    const response = await apiGet<DomicilioResponse[]>(
      `/domicilio/token/usuario?${query}`,
      token,
    );
    return response;
  } catch (error) {
    console.error("Error fetching directions:", error);
    throw error;
  }
}
