import { apiGet, apiPost, apiPut } from './baseClient.ts';
import type { ProductoRequest, ProductoResponse } from './Interfaces.ts';

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
export async function uploadImage(file: File, productoId: number): Promise<string> {
    try {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('productoId', productoId.toString());
        console.log('Uploading image for product ID:', productoId);
        const response = await fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            body: formData,

        });

        if (!response.ok) {
            throw new Error('Error uploading image');
        }
        console.log('Image upload response:', response);
        const data = await response.json();
        return data.filePath; // Asegúrate de que el backend devuelva la URL de la imagen

    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

//! Método para actualizar un producto existente
export async function updateProduct(productId: number, updatedData: Partial<Omit<ProductoRequest, 'id'>>): Promise<ProductoResponse> {
    try {
        const response = await apiPut<ProductoResponse>(`/producto/${productId}`, updatedData);
        console.log('Updated product:', response);
        return response;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}



export async function getActiveProducts(): Promise<ProductoResponse[]> {
    try {
        const response = await apiGet<ProductoResponse[]>('/producto/active');
        console.log('Fetched active products:', response);
        return response;
    } catch (error) {
        console.error('Error fetching active products:', error);
        throw error;
    }
}
