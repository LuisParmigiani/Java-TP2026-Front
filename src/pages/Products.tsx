import type { ProductoResponse } from '../services/Interfaces.ts';
import { getActiveProducts } from '../services/ProductService.ts';
import { useEffect, useState } from 'react';

export default function Products() {
    const [products, setProducts] = useState<ProductoResponse[]>([]);

    useEffect(() => {
        async function fetchProducts() {
            const result = await getActiveProducts();
            setProducts(result);
        }
        fetchProducts();
    }, []);
    return (
        <div>
            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.nombre}</h3>
                    <p>Precio: ${product.precio}</p>
                    <p>Stock: {product.stock}</p>
                </div>
            ))}
        </div>
    );
}