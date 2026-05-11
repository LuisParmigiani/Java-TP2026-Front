import { apiDelete, apiGet, apiPost, apiPut } from "./baseClient.ts";
import type {
  PersonaResponse,
  ErrorResponse,
  PersonaRequest,
  PaginationResponse,
} from "./Interfaces.ts";

export async function fetchPersonas(
  token?: string,
  currentPage: number = 0,
  pageSize: number = 10,
  populate?: string[],
): Promise<PaginationResponse<PersonaResponse>> {
  try {
    const params = new URLSearchParams();

    // Paginación
    params.append("page", currentPage.toString());
    params.append("size", pageSize.toString());

    // Populate (relaciones)
    if (populate && populate.length > 0) {
      populate.forEach((pop) => {
        params.append("populate", pop);
      });
    }

    const url = `/persona/clientes?${params.toString()}`;
    console.log("Fetching personas with URL:", url);

    const response = await apiGet<PaginationResponse<PersonaResponse>>(
      url,
      token,
    );
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error fetching personas:", errorResponse);
    throw errorResponse;
  }
}
export async function searchPersonas(
  token: string,
  query?: string,
  zona?: string,
  camion?: string,
  dia?: string,
  ordenSaldo: string = "ascendente",
  nivelAcceso?: string,
  currentPage: number = 0,
  pageSize: number = 10,
  populate?: string[],
): Promise<PaginationResponse<PersonaResponse>> {
  try {
    const params = new URLSearchParams();

    // Agregar parámetros opcionales
    if (query) {
      params.append("query", query);
    }
    if (zona) {
      params.append("zona", zona);
    }
    if (camion) {
      params.append("camion", camion);
    }
    if (dia) {
      params.append("dia", dia);
    }
    if (ordenSaldo) {
      params.append("ordenSaldo", ordenSaldo);
    }
    if (nivelAcceso) {
      params.append("nivelAcceso", nivelAcceso);
    }

    // Paginación
    params.append("page", currentPage.toString());
    params.append("size", pageSize.toString());

    // Populate (relaciones)
    if (populate && populate.length > 0) {
      populate.forEach((pop) => {
        params.append("populate", pop);
      });
    }

    const url = `/persona/search?${params.toString()}`;
    console.log("Fetching personas with URL:", url);

    const response = await apiGet<PaginationResponse<PersonaResponse>>(
      url,
      token,
    );
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error searching personas:", errorResponse);
    throw errorResponse;
  }
}

export async function updatePersona(
  id: number,
  updatedData: Partial<Omit<PersonaRequest, "id">>,
  token?: string,
): Promise<PersonaResponse> {
  try {
    const response = await apiPut<PersonaResponse>(
      `/persona/${id}`,
      updatedData,
      token,
    );
    console.log("Updated persona:", response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error updating persona:", errorResponse);
    throw errorResponse;
  }
}

export async function addPersona(
  personaData: Omit<PersonaRequest, "id">,
  token?: string,
): Promise<PersonaResponse> {
  try {
    const response = await apiPost<PersonaResponse>(
      "/persona",
      personaData,
      token,
    );
    console.log("Created persona:", response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error creating persona:", errorResponse);
    throw errorResponse;
  }
}
export async function deletePersona(id: number, token?: string): Promise<void> {
  try {
    await apiDelete(`/persona/${id}/disable`, token);
    console.log(`Disabled persona with ID ${id}`);
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error(`Error disabling persona with ID ${id}:`, errorResponse);
    throw errorResponse;
  }
}

export async function getPersona(
  id: number,
  populate?: string[],
): Promise<PersonaResponse> {
  try {
    let query = "";
    if (populate) {
      query = "?populate=" + populate.join(",");
    }
    const response = await apiGet<PersonaResponse>(`/persona/${id}${query}`);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error(`Error fetching persona with ID ${id}:`, errorResponse);
    throw errorResponse;
  }
}

export async function getActiveClients(
  token: string,
): Promise<PersonaResponse[]> {
  try {
    const response = await apiGet<PersonaResponse[]>(
      `/persona/client/active`,
      token,
    );
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error(`Error fetching active clients:`, errorResponse);
    throw errorResponse;
  }
}
