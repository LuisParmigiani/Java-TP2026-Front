// src/services/DiaService.ts

import { apiGet } from './baseClient';
import type { DiaResponse } from './Interfaces';

export async function getDias(token: string): Promise<DiaResponse[]> {
  const response = await apiGet<DiaResponse[]>('/dia', token);
  return response;
}
