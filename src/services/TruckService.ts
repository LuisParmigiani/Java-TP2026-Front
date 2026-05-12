import { apiGet, apiPost, apiPut, apiPatch } from "./baseClient.ts";
import type {
  CamionRequest,
  CamionResponse,
  ErrorResponse,
  DiaZonaResponse,
  DiaZonaDTORequestWithOrdenes,
} from "./Interfaces.ts";

export async function fetchTrucks(token: string): Promise<CamionResponse[]> {
  try {
    const response = await apiGet<CamionResponse[]>("/camion", token);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    throw errorResponse;
  }
}
export async function fetchTruckById(
  truckId: number,
  token: string,
): Promise<CamionResponse> {
  try {
    const response = await apiGet<CamionResponse>(`/camion/${truckId}`, token);

    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    throw errorResponse;
  }
}
//! Método para agregar un nuevo camion
export async function addTruck(
  camion: Omit<CamionRequest, "id">,
  token: string,
): Promise<CamionResponse> {
  try {
    const response = await apiPost<CamionResponse>("/camion", camion, token);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    throw errorResponse;
  }
}

//! Método para actualizar un camion existente
export async function updateTruck(
  productId: number,
  updatedData: Partial<Omit<CamionRequest, "id">>,
  token: string,
): Promise<CamionResponse> {
  try {
    const response = await apiPut<CamionResponse>(
      `/camion/${productId}`,
      updatedData,
      token,
    );
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    throw errorResponse;
  }
}

export async function disableTruck(
  truckId: number,
  token: string,
): Promise<CamionResponse> {
  try {
    const response = await apiPatch<CamionResponse>(
      `/camion/${truckId}/disable`,
      null,
      token,
    );
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    throw errorResponse;
  }
}

export async function getActiveTrucks(): Promise<CamionResponse[]> {
  try {
    const response = await apiGet<CamionResponse[]>("/camion/active");
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    throw errorResponse;
  }
}

/**
 * Obtiene los dias-zonas del camión para un día específico
 * Incluye los domicilios con su orden dentro de cada zona
 */
export async function getDiaZonasByTruckAndDay(
  truckId: number,
  day: number,
  token: string,
): Promise<DiaZonaResponse[]> {
  try {
    const response = await apiGet<DiaZonaResponse[]>(
      `/dia-zona/camion/${truckId}/dia/${day}?populate=zona&populate=diaZonaOrden&populate=domicilio`,
      token,
    );

    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;

    throw errorResponse;
  }
}
export async function getDiaZonasByTruckAndMe(
  token: string,
  day: string,
  zona?: string,
  venta?: string,
  direccion?: string,
  populate?: string[],
): Promise<DiaZonaResponse[]> {
  try {
    let query = "";
    if (zona) {
      query += `&zona=${zona}`;
    }
    if (venta) {
      query += `&venta=${venta}`;
    }
    if (direccion) {
      query += `&direccion=${direccion}`;
    }
    const url = `dia-zona/camion/me/dia/${day}?${populate ? `populate=${populate.join(",")}` : ""}${query}`;

    const response = await apiGet<DiaZonaResponse[]>(url, token);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;

    throw errorResponse;
  }
}

/**
 * Actualiza el orden de los domicilios en una dia-zona
 * Envía al backend las nuevas órdenes para persistirlas
 */
export async function updateDiaZonaWithOrdenes(
  diaZonaId: number,
  request: DiaZonaDTORequestWithOrdenes,
): Promise<DiaZonaResponse> {
  try {
    const response = await apiPut<DiaZonaResponse>(
      `/dia-zona/${diaZonaId}/ordenes`,
      request,
    );
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    throw errorResponse;
  }
}

export async function active(token: string): Promise<CamionResponse[]> {
  try {
    const response = await apiGet<CamionResponse[]>("/camion/active", token);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    throw errorResponse;
  }
}
