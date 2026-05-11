// src/services/DiaService.ts

import { apiGet } from './baseClient';
import type { DiaResponse } from './Interfaces';

export async function getDias(token: string): Promise<DiaResponse[]> {
  try {
    const response = await apiGet<DiaResponse[]>('/dia', token);
    console.log('Fetched dias:', response);
    return response;
  } catch (error) {
    console.error('Error fetching dias:', error);
    throw error;
  }
}
