import { apiGet, apiPut } from "./baseClient";
import type { domicilioResponse } from "./Interfaces";

export async function updateDirection(
  direction: domicilioResponse,
  token?: string,
): Promise<domicilioResponse> {
  try {
    const response = await apiPut<domicilioResponse>(
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

export async function getAllByUserId(
  token: string,
  status?: string,
  deliveryDay?: string,
): Promise<domicilioResponse[]> {
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
    const response = await apiGet<domicilioResponse[]>(
      `/domicilio/token/usuario?${query}`,
      token,
    );
    return response;
  } catch (error) {
    console.error("Error fetching directions:", error);
    throw error;
  }
}
