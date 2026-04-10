const DEFAULT_API_BASE_URL = "http://localhost:8080/api"; //después se borra y se usa el .env

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

// Función genérica para hacer requests con fetch y manejo de errores
export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = buildApiUrl(path);
  const response = await fetch(url, options);

  let result: any;
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    const error: any = new Error(
      result.error || `Error: ${response.status} ${response.statusText}`,
    );
    error.status = response.status;
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// PUT
export async function apiPut<T>(path: string, data?: any): Promise<T> {
  return apiFetch<T>(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE
export async function apiDelete<T>(path: string): Promise<T> {
  return apiFetch<T>(path, {
    method: "DELETE",
  });
}
