const DEFAULT_API_BASE_URL = "http://localhost:8080/api"; //después se borra y se usa el .env
import type { ErrorResponse } from './Interfaces.ts';

export const API_BASE_URL =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined) ??
  DEFAULT_API_BASE_URL;

export const buildApiUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const getAuthToken = (): string | null =>
  localStorage.getItem("authToken") ?? sessionStorage.getItem("authToken");

const buildHeaders = (extra?: HeadersInit): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...extra,
  };
};

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = buildApiUrl(path);
  const response = await fetch(url, {
    ...options,
    headers: buildHeaders(options?.headers),
  });

  let result: any;
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    // Si el resultado tiene estructura de ErrorResponse, úsalo
    if (result.mensaje && result.codigo) {
      const errorResponse: ErrorResponse = {
        mensaje: result.mensaje,
        errores: result.errores,
        codigo: result.codigo,
      };
      const error: any = new Error(result.mensaje);
      error.mensaje = errorResponse.mensaje;
      error.errores = errorResponse.errores;
      error.codigo = errorResponse.codigo;
      throw error;
    }
    
    // Fallback si no tiene estructura ErrorResponse
    const error: any = new Error(
      result.error || `Error: ${response.status} ${response.statusText}`,
    );
    error.status = response.status;
    error.codigo = response.status;
    throw error;
  }

  return result;
}

// GET
export async function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path);
}

// POST
export async function apiPost<T>(path: string, data: any): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT
export async function apiPut<T>(path: string, data?: any): Promise<T> {
  return apiFetch<T>(path, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}
//PATCH
export async function apiPatch<T>(path: string, data?: any): Promise<T> {
  return apiFetch<T>(path, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE
export async function apiDelete<T>(path: string): Promise<T> {
  return apiFetch<T>(path, {
    method: "DELETE",
  });
}
