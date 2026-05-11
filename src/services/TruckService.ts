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
    console.error("Error fetching trucks:", errorResponse);
    throw errorResponse;
  }
}
export async function fetchTruckById(truckId: number, token: string): Promise<CamionResponse> {
  try {
    const response = await apiGet<CamionResponse>(`/camion/${truckId}`, token);

    console.log(`Fetched truck with ID ${truckId}:`, response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error(`Error fetching truck with ID ${truckId}:`, errorResponse);
    throw errorResponse;
  }
}
//! Método para agregar un nuevo camion
export async function addTruck(
  camion: Omit<CamionRequest, "id">,
  token: string,
): Promise<CamionResponse> {
  try {
<<<<<<< HEAD
    console.log('guardadno camion:', camion);
    const response = await apiPost<CamionResponse>('/camion', camion, token);
    console.log('Added camion:', response);
=======
    console.log("guardadno camion:", camion);
    const response = await apiPost<CamionResponse>("/camion", camion, token);
    console.log("Added camion:", response);
>>>>>>> ad31866e2de97c7de9eb361ec0b05d7538160d11
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error adding camion:", errorResponse);
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
    console.log("Updated camion:", response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error updating camion:", errorResponse);
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
    console.log("Disabled truck:", response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error disabling truck:", errorResponse);
    throw errorResponse;
  }
}

export async function getActiveTrucks(): Promise<CamionResponse[]> {
  try {
    const response = await apiGet<CamionResponse[]>("/camion/active");
    console.log("Fetched active trucks:", response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error fetching active trucks:", errorResponse);
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
<<<<<<< HEAD
      `/dia-zona/camion/${truckId}/dia/${day}?populate=zona&populate=diaZonaOrden&populate=domicilio`, token
=======
      `/dia-zona/camion/${truckId}/dia/${day}?populate=zona&populate=diaZonaOrden&populate=domicilio`,
      token,
>>>>>>> ad31866e2de97c7de9eb361ec0b05d7538160d11
    );

    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error(
      `Error fetching dia-zona for truck ${truckId}, day ${day}:`,
      errorResponse,
    );
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
    console.log(url);

    const response = await apiGet<DiaZonaResponse[]>(url, token);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error(
      `Error fetching dia-zona for truck, day ${day}:`,
      errorResponse,
    );
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
    console.log(`Updated dia-zona ${diaZonaId} with new ordenes:`, response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error(`Error updating dia-zona ${diaZonaId}:`, errorResponse);
    throw errorResponse;
  }
}

export async function active(token: string): Promise<CamionResponse[]> {
  try {
<<<<<<< HEAD
    const response = await apiGet<CamionResponse[]>('/camion/active', token);
    console.log('Activated truck:', response);
=======
    const response = await apiGet<CamionResponse[]>("/camion/active", token);
    console.log("Activated truck:", response);
>>>>>>> ad31866e2de97c7de9eb361ec0b05d7538160d11
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error activating truck:", errorResponse);
  }
}
