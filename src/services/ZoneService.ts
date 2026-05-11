import { apiGet,apiPut,apiPost,apiDelete } from "./baseClient";
import type { ZonaResponse,ErrorResponse, DiaZonaRequest } from "./Interfaces";
import { formatErrorResponse } from "../lib/utils.ts";

export async function fetchZones( token: string,pupulate?: string[]): Promise<ZonaResponse[]> {
    try{
        
        const response = await apiGet('/zona?populate=' + (pupulate?.join(',') || ''),token);
        return response as ZonaResponse[];
        console.log('Fetched zones:', response);

    }catch(error){
        const errorResponse = error as ErrorResponse;
        const formattedError = formatErrorResponse(error as ErrorResponse);
        console.log('Error fetching zones:', formattedError);
        throw errorResponse;
    }
}

export async function updateZone(id: number, dataInput: { nombre: string; detalle: string ; camionId:number , diasZona: DiaZonaRequest[] },token: string): Promise<ZonaResponse> {
    try{
        const diaZonaList = []
        for (const diaZona of dataInput.diasZona) {
            diaZonaList.push({
                diaId: diaZona.diaId,
                zonaId: diaZona.zonaId,
            })
        }
        const entidad = {
            nombre: dataInput.nombre,
            detalle: dataInput.detalle,
            camionId: dataInput.camionId,
            diasZona: diaZonaList,
        }
        console.log('Data to update zone:', entidad);
        const response = await apiPut(`/zona/${id}`, entidad,token);
        return response as ZonaResponse;
    }
    catch(error){
    const errorResponse = error as ErrorResponse;
    const formattedError = formatErrorResponse(error as ErrorResponse);
    console.log('Error updating zone:', formattedError);
    throw errorResponse;
}
}

export async function addZone(dataInput: { nombre: string; detalle: string ; camionId:number,diasZona: DiaZonaRequest[] }, token: string): Promise<ZonaResponse> {
    try{
        const diaZonaList = []
        for (const diaZona of dataInput.diasZona) {
            diaZonaList.push({
                diaId: diaZona.diaId,
                zonaId: diaZona.zonaId,
            })
        }
        const entidad = {
            nombre: dataInput.nombre,
            detalle: dataInput.detalle,
            camionId: dataInput.camionId,
            diasZona: diaZonaList,
        }
        console.log('Data to add zone:', entidad);
        const response = await apiPost(`/zona`, entidad,token);
        return response as ZonaResponse;
    }
    catch(error){
        const errorResponse = error as ErrorResponse;
        const formattedError = formatErrorResponse(error as ErrorResponse);
        console.log('Error adding zone:', formattedError);
    throw errorResponse;
}
}

export async function deleteZone(id: number, token: string): Promise<void> {
    try {
        await apiDelete(`/zona/${id}`,token);
    } catch (error) {
        const errorResponse = error as ErrorResponse;
        const formattedError = formatErrorResponse(error as ErrorResponse);
        console.log('Error deleting zone:', formattedError);
        throw errorResponse;
    }
}




