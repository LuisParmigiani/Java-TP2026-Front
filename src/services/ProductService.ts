import {
  apiGet,
  apiPostFormData,
  apiPutFormData,
  apiDelete,
} from "./baseClient.ts";
import type {
  ProductoRequest,
  ProductoResponse,
  PaginationResponse,
} from "./Interfaces.ts";

export async function fetchProducts(
  token: string,
): Promise<ProductoResponse[]> {
  const response = await apiGet<ProductoResponse[]>('/producto', token);
  return response;
}
export async function fetchProductsActivos(
  token: string,
): Promise<ProductoResponse[]> {
  const response = await apiGet<ProductoResponse[]>("/producto/activo/sinPag", token);

  return response;
}

export async function deleteProduct(id: number, token?: string): Promise<void> {
  await apiDelete<void>(`/producto/${id}`, token);
}

export async function addProduct(
  producto: ProductoRequest,
  imageFile: File | null,
  token: string,
): Promise<ProductoResponse> {
  const formData = new FormData();
  formData.append(
    "entidad",
    new Blob([JSON.stringify(producto)], { type: "application/json" }),
  );
  if (imageFile) {
    formData.append("file", imageFile);
  }
  return apiPostFormData<ProductoResponse>("/producto", formData, token);
}

export async function updateProduct(
  id: number,
  producto: ProductoRequest,
  imageFile: File | null,
  token: string,
): Promise<ProductoResponse> {
  const formData = new FormData();
  formData.append(
    "entidad",
    new Blob([JSON.stringify(producto)], { type: "application/json" }),
  );
  if (imageFile) {
    formData.append("file", imageFile);
  }
  return apiPutFormData<ProductoResponse>(`/producto/${id}`, formData, token);
}

export async function getActiveProducts(
  token: string,
  userType?: string,
  sortOption?: string,
  searchTerm?: string,
  minPrice?: number | "",
  maxPrice?: number | "",
  direction?: string,
  currentPage?: number,
  pageSize?: number,
): Promise<PaginationResponse<ProductoResponse>> {
  let url = "";
  if (userType == "Usuario") {
    url = "/producto/customer/active";
  } else {
    url = "/producto/active";
  }
  const params = new URLSearchParams();

  if (sortOption && sortOption !== "Ordenar por:") {
    params.append("sort", sortOption);
  }
  if (searchTerm) {
    params.append("search", searchTerm);
  }
  if (direction) {
    params.append("direction", direction);
  }
  if (minPrice !== "" && !isNaN(Number(minPrice))) {
    params.append("minPrice", Number(minPrice).toString());
  }
  if (maxPrice !== "" && !isNaN(Number(maxPrice))) {
    params.append("maxPrice", Number(maxPrice).toString());
  }
  if (currentPage !== undefined) {
    params.append("page", currentPage.toString());
  }
  if (pageSize !== undefined) {
    params.append("size", pageSize.toString());
  }
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  const response = await apiGet<PaginationResponse<ProductoResponse>>(
    url,
    token
  );
  return response;
}

export async function getZonaProducts(zona: number): Promise<ProductoResponse[]> {
  const response = await apiGet<ProductoResponse[]>(`/producto/Zona/${zona}`);

  return response;

}



export async function getAllProducts(token: string): Promise<ProductoResponse[]> {
  const response = await apiGet<ProductoResponse[]>('/producto', token);
  return response;
}
