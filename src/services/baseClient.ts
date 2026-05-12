const DEFAULT_API_BASE_URL = "http://localhost:8080/api"; //después se borra y se usa el .env
import type { ErrorResponse } from "./Interfaces.ts";

interface CustomError extends Error {
  mensaje?: string;
  errores?: unknown;
  codigo?: number;
  status?: number;
}

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

const buildHeaders = (token?: string, extra?: HeadersInit): HeadersInit => {
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...extra,
  };
};

export async function apiFetch<T>(
  path: string,
  token?: string,
  options?: RequestInit,
): Promise<T> {
  const url = buildApiUrl(path);
  const response = await fetch(url, {
    ...options,
    headers: buildHeaders(token, options?.headers),
  });

  let result;
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
      const error: CustomError = new Error(result.mensaje);
      error.mensaje = errorResponse.mensaje;
      error.errores = errorResponse.errores;
      error.codigo = errorResponse.codigo;
      throw error;
    }

    // Fallback si no tiene estructura ErrorResponse
    const error: CustomError = new Error(
      result.error || `Error: ${response.status} ${response.statusText}`,
    );
    error.status = response.status;
    error.codigo = response.status;
    throw error;
  }

  return result;
}

// GET
export async function apiGet<T>(path: string, token?: string): Promise<T> {
  return apiFetch<T>(path, token);
}

// POST
export async function apiPost<T>(
  path: string,
  data,
  token?: string,
): Promise<T> {
  return apiFetch<T>(path, token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiPostFormData<T>(
  path: string,
  formData: FormData,
  token?: string,
): Promise<T> {
  const url = buildApiUrl(path);
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // No pongas Content-Type, el navegador lo setea solo
    },
  });

  let result;
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    // Manejo de error igual que apiFetch
    const error: CustomError = new Error(
      result.error || `Error: ${response.status} ${response.statusText}`,
    );
    error.status = response.status;
    throw error;
  }

  return result;
}

// PUT
export async function apiPut<T>(
  path: string,
  data?,
  token?: string,
): Promise<T> {
  return apiFetch<T>(path, token, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUT FormData
export async function apiPutFormData<T>(
  path: string,
  formData: FormData,
  token?: string,
): Promise<T> {
  const url = buildApiUrl(path);
  const response = await fetch(url, {
    method: "PUT",
    body: formData,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // No Content-Type aquí
    },
  });
  let result;
  try {
    result = await response.json();
  } catch {
    result = {};
  }
  if (!response.ok) {
    const error: CustomError = new Error(
      result.error || `Error: ${response.status} ${response.statusText}`,
    );
    error.status = response.status;
    throw error;
  }
  return result;
}

//PATCH
export async function apiPatch<T>(
  path: string,
  data?,
  token?: string,
): Promise<T> {
  return apiFetch<T>(path, token, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE
export async function apiDelete<T>(path: string, token?: string): Promise<T> {
  return apiFetch<T>(path, token, {
    method: "DELETE",
  });
}
