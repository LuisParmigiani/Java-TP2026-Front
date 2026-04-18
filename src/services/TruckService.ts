import { apiGet, apiPost, apiPut, apiPatch } from './baseClient.ts';
import type { CamionRequest, CamionResponse, ErrorResponse } from './Interfaces.ts';

export async function fetchTrucks(): Promise<CamionResponse[]> {
  try {
    const response = await apiGet<CamionResponse[]>('/camion');
    console.log('Fetched trucks:', response);

    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error fetching trucks:', errorResponse);
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
