import { apiGet, apiPost, apiPut, apiPatch } from './baseClient.ts';
import type { CamionRequest, CamionResponse, ErrorResponse, DiaZonaResponse, DiaZonaDTORequestWithOrdenes } from './Interfaces.ts';

export async function fetchTrucks(): Promise<CamionResponse[]> {
  try {
    const response = await apiGet<CamionResponse[]>('/camion');
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error fetching trucks:', errorResponse);
    throw errorResponse;
  }
}
export async function fetchTruckById(truckId: number): Promise<CamionResponse> {
  try {
    const response = await apiGet<CamionResponse>(`/camion/${truckId}`);
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
  product: Omit<CamionRequest, 'id'>,
): Promise<CamionResponse> {
  try {
    const response = await apiPost<CamionResponse>('/camion', product);
    console.log('Added product:', response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error adding product:', errorResponse);
    throw errorResponse;
  }
}

//! Método para actualizar un camion existente
export async function updateTruck(
  productId: number,
  updatedData: Partial<Omit<CamionRequest, 'id'>>,
): Promise<CamionResponse> {
  try {
    const response = await apiPut<CamionResponse>(
      `/camion/${productId}`,
      updatedData,
    );
    console.log('Updated product:', response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error updating product:', errorResponse);
    throw errorResponse;
  }
}

export async function disableTruck(
  truckId: number,
): Promise<CamionResponse> {
  try {
    const response = await apiPatch<CamionResponse>(
      `/camion/${truckId}/disable`
    );
    console.log('Disabled truck:', response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error disabling truck:', errorResponse);
    throw errorResponse;
  }
}

export async function getActiveTrucks(): Promise<CamionResponse[]> {
  try {
    const response = await apiGet<CamionResponse[]>('/camion/active');
    console.log('Fetched active trucks:', response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error fetching active trucks:', errorResponse);
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
): Promise<DiaZonaResponse[]> {
  try {
    const response = await apiGet<DiaZonaResponse[]>(
      `/dia-zona/camion/${truckId}/dia/${day}?populate=zona&populate=diaZonaOrden`,
    );
    console.log(`Fetched dia-zona for truck ${truckId}, day ${day}:`, response);
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
