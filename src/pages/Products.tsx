import Footer from "../components/Footer.tsx";
import NavBar from "../components/NavBar.tsx";
import ProductCard from "../components/ProductCard.tsx";
import type { ProductoResponse } from "../services/Interfaces.ts";
import { getActiveProducts } from "../services/ProductService.ts";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import ProductsFilter from "../components/ProductsFilter.tsx";
import Pagination from "../components/Pagination.tsx";

export default function Products() {
  // VAriable para guardar todos los productos
  const [products, setProducts] = useState<ProductoResponse[]>([]);
  // UI filtros y orden
  const [sortOption, setSortOption] = useState<string>("Ordenar por:");
  // Filtros aplicados (para mantener el estado de los filtros al cambiar el orden)
  const [appliedSearchTerm, setAppliedSearchTerm] = useState<string>("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | "">("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | "">("");
  const [appliedDirection, setAppliedDirection] = useState<string>("");

  // Pagination information (if needed in the future)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12; // Número de productos por página
  const [totalItems, setTotalItems] = useState<number>(0);

  // UI direction filter (for select)
  const [direction, setDirection] = useState<string>("");
  // Variable para poder ver el tipo de usuairo.
  const { currentUser } = useAuth();
  const { token } = useAuth();

  // Fetch productos con filtros y orden, usando useCallback para evitar recrear la función en cada renderizado y evitar loops infinitos
  const fetchProducts = useCallback(
    async (
      sort?: string,
      search?: string,
      min?: number | "",
      max?: number | "",
      directionParam?: string,
      userType?: string,
    ) => {
      try {
        const response = await getActiveProducts(
          token,
          userType ?? currentUser?.role,
          sort ?? sortOption,
          search ?? appliedSearchTerm,
          min ?? appliedMinPrice,
          max ?? appliedMaxPrice,
          directionParam ?? appliedDirection,
          currentPage - 1,
          pageSize, // Tamaño de página fijo, se puede hacer dinámico si se desea (numero de elementos por página)
        );
        setTotalItems(response.totalElements);
        setCurrentPage(response.number + 1);
        setProducts(response.content);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    [
      currentUser,
      sortOption,
      appliedSearchTerm,
      appliedMinPrice,
      appliedMaxPrice,
      appliedDirection,
      token,
      currentPage,
      pageSize,
    ],
  );

  // Fetch inicial de productos o de cuando se cambia el orden o filtros aplicados
  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
  }, [fetchProducts]);

  return (
    <div className="m-3">
      <NavBar />
      <ProductsFilter
        setAppliedSearchTerm={setAppliedSearchTerm}
        setAppliedMinPrice={setAppliedMinPrice}
        setAppliedMaxPrice={setAppliedMaxPrice}
        setAppliedDirection={setAppliedDirection}
        sortOption={sortOption}
        setSortOption={setSortOption}
        direction={direction}
        setDirection={setDirection}
        currentUserRole={currentUser?.role}
      />
      {totalItems === 0 ? (
        <div className="flex flex-col items-center justify-center my-16 text-gray-500">
          <span className="text-lg font-semibold mb-2">
            No hay productos disponibles con las características seleccionadas.
          </span>
          <span className="text-sm">
            Prueba ajustando los filtros o revisa más tarde.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-10 xl:grid-cols-4 my-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <Pagination
        page={currentPage}
        totalPerPage={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />
      <Footer />
    </div>
  );
}
