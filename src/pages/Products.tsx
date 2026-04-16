import { useAuth } from "../hooks/useAuth.ts";
import type { ProductoResponse } from "../services/Interfaces.ts";
import { getActiveProducts } from "../services/ProductService.ts";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState<ProductoResponse[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchProducts() {
      const result = await getActiveProducts(token);
      setProducts(result);
    }
    fetchProducts();
  }, [token]);
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.nombre}</h3>
          <p>Precio: ${product.precio}</p>
          <p>Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
