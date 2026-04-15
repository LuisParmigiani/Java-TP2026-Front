import { apiGet, apiPut } from './baseClient';
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


export async function getAllByUserId(status?: string, deliveryDay?: string): Promise<domicilioResponse[]> {
    try {
        let query;
        if (deliveryDay) {
            query = '&deliveryDay=' + deliveryDay;
        } else {
            query = '';
        }
        if (status) {
            query = '&estado=' + status + query;
        }
        const response = await apiGet<domicilioResponse[]>(`/domicilio/token/usuario?${query}`);
        return response;
    } catch (error) {
        console.error('Error fetching directions:', error);
        throw error;
    }
}