import { apiGet, apiPostFormData, apiPutFormData } from "./baseClient.ts";
import type {
  ProductoRequest,
  ProductoResponse,
  PaginationResponse,
} from "./Interfaces.ts";

export async function fetchProducts(
  token: string,
): Promise<ProductoResponse[]> {
  try {
    const response = await apiGet<ProductoResponse[]>("/producto", token);
    console.log("Fetched products:", response);

    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
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

//! Método para actualizar un producto existente
/*export async function updateProduct(
  productId: number,
  updatedData: Partial<Omit<ProductoRequest, "id">>,
  token: string,
): Promise<ProductoResponse> {
  try {
    const response = await apiPut<ProductoResponse>(
      `/producto/${productId}`,
      updatedData,
      token,
    );
    console.log("Updated product:", response);
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}*/

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
  try {
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
    console.log("Fetching products with URL:", url);
    const response = await apiGet<PaginationResponse<ProductoResponse>>(
      url,
      token,
    );
    return response;
  } catch (error) {
    console.error("Error fetching active products:", error);
    throw error;
  }
}
