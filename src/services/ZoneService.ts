import { apiGet } from "./baseClient";
import type { ZonaResponse } from "./Interfaces";

export async function getZonas(): Promise<ZonaResponse[]> {
    return await apiGet<ZonaResponse[]>("/zona");
}
