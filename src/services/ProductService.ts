import { apiGet,apiPost,apiPut} from  './baseClient.ts';
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
//! Método para agregar un nuevo producto
export async function addProduct(product: Omit<ProductoResponse, 'id'>): Promise<ProductoResponse> {
    try {
        const response = await apiPost<ProductoResponse>('/producto', product);
        console.log('Added product:', response);
        return response;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
}

//! Método para actualizar un producto existente
export async function updateProduct(productId: number, updatedData: Partial<Omit<ProductoResponse, 'id'>>): Promise<ProductoResponse> {
    try {
        const response = await apiPut<ProductoResponse>(`/producto/${productId}`, updatedData);
        console.log('Updated product:', response);
        return response;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}


