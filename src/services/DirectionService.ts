import { apiPut } from './baseClient';
import type { domicilioResponse } from './Interfaces';

export async function updateDirection(direction: domicilioResponse): Promise<domicilioResponse> {
    try {
        const response = await apiPut<domicilioResponse>(`/domicilio/${direction.id}`, direction);
        return response;
    } catch (error) {
        console.error('Error updating direction:', error);
        throw error;
    }
}