import {apiGet} from  './baseClient.ts';
import type { ProductoResponse } from './Interfaces.ts';

export async function fetchProducts(): Promise<ProductoResponse[]> {
    try {
        const response = await apiGet<ProductoResponse[]>('/producto');
        console.log('Fetched products:', response);
        return response;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}