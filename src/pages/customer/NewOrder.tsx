import Footer from "../../components/Footer";
import NewOrderCard from "../../components/NewOrderCard";
import ProductCard from "../../components/ProductCard";
import { useEffect, useState } from "react";
import { getActiveProducts } from "../../services/ProductService";
import NavBar from "../../components/NavBar";
import type { ProductoResponse } from "../../services/Interfaces";
import type { DomicilioResponse } from "../../services/Interfaces";
import { getAllByUserId } from "../../services/DirectionService";
import { useAuth } from "../../hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Select.tsx';
import ProductsFilter from "../../components/ProductsFilter.tsx";
import { createSale } from "../../services/SalesService.ts";


export default function NewOrder() {
    const [products, setProducts] = useState<ProductoResponse[]>([]);
    // Estado para productos seleccionados: 
    const [selectedProducts, setSelectedProducts] = useState<{ product: ProductoResponse, quantity: number }[]>([]);
    const [directions, setDirections] = useState<DomicilioResponse[]>([]);
    const [selectedDirection, setSelectedDirection] = useState<string>("");
    const [open, setOpen] = useState(false);
    // Calcula el total basado en los productos seleccionados
    const total = selectedProducts.reduce((tot, item) => tot + item.quantity * (item.product.precio || 0), 0);
    const [appliedSearchTerm, setAppliedSearchTerm] = useState<string>('');
    const [appliedMinPrice, setAppliedMinPrice] = useState<number | ''>('');
    const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | ''>('');
    const [sortOption, setSortOption] = useState<string>('Ordenar por:');
    const [showAlert, setShowAlert] = useState(false);
    const [pendingDirection, setPendingDirection] = useState<string>("");
    const hasProducts = selectedProducts.length > 0 && selectedProducts.some(item => item.quantity > 0);
    const { currentUser } = useAuth();
    const { token } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getActiveProducts(token, currentUser?.role, sortOption, appliedSearchTerm, appliedMinPrice, appliedMaxPrice, selectedDirection);
                setProducts(response);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [currentUser?.role, selectedDirection, token, sortOption, appliedSearchTerm, appliedMinPrice, appliedMaxPrice]);


    useEffect(() => {
        const fetchDirections = async () => {
            try {
                const status = "Activas";
                const response = await getAllByUserId(token, status, null, null, null, ['pedidoSemanal', 'productoZona', 'producto']);
                console.log("Direcciones obtenidas:", response);
                setDirections(response);
            } catch (error) {
                console.error("Error fetching directions:", error);
            }
        };
        fetchDirections();
    }, [token]);

    const SaveOrder = async () => {
        const orderDetails = {
            idDomicilio: Number(selectedDirection),
            lineasPedido: selectedProducts.map(item => ({
                productoId: item.product.id,
                cantidad: item.quantity
            }))
        }
        const response = await createSale(orderDetails);
        console.log("Respuesta del servidor:", response);


    }

    const changeDirection = (value: string) => {
        if (selectedDirection === "" && directions.length > 0) {
            setSelectedDirection(value);
        }
        else {
            setPendingDirection(value);
            setShowAlert(true);
        }
    }



    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            {showAlert && (
                <div className="fixed inset-0 flex items-center shadow-lg justify-center z-50 bg-transparent backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold mb-4">Cambiar dirección</h2>
                        <p className="mb-6">¿Estás seguro que deseas cambiar la dirección? Esto reseteará los productos seleccionados.</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setSelectedProducts([]);
                                    setSelectedDirection(pendingDirection);
                                    setShowAlert(false);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Sí, cambiar
                            </button>
                            <button
                                onClick={() => setShowAlert(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                                No, mantener
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <NavBar />

            <NewOrderCard
                open={open}
                complete={SaveOrder}
                setOpen={setOpen}
                direction={directions.find(dir => String(dir.id) == selectedDirection)}
                products={products}
                total={total}
                selectedProducts={selectedProducts}
            />

            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                <div className="rounded-2xl  p-6 md:p-8 ">

                    <div className="flex flex-row items-center justify-between">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Nuevo Pedido</h1>
                        <p className="font-bold text-2xl">Total: ${total.toFixed(2)}</p>
                    </div>
                    <p className="text-gray-600 mt-2 mb-6">Crea un nuevo pedido seleccionando los productos que deseas comprar.</p>
                    {directions.length > 0 ? (
                        <div className="mb-6">
                            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                                Seleccione la dirección de entrega
                            </label>
                            <Select value={selectedDirection} onValueChange={changeDirection}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione una direccion" />
                                </SelectTrigger>
                                <SelectContent>
                                    {directions.map(dir => (
                                        <SelectItem key={dir.id} value={dir.id.toString()}>{dir.calle + ' ' + dir.casa} </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="mb-6 rounded-md bg-yellow-50 p-4">
                            <p className="text-sm text-yellow-700">No se encontraron direcciones de entrega. Por favor, agregue una dirección en su perfil para continuar con su pedido.</p>
                        </div>
                    )
                    }
                    {selectedDirection === "" && directions.length > 0 ? (
                        <div className="mb-6 rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-700">Por favor, seleccione una dirección de entrega para continuar con su pedido.</p>
                        </div>
                    ) : (directions.length > 0 &&
                        <>
                            <button
                                className=" mb-6 w-full px-6 py-3 rounded-md bg-primary text-white hover:bg-primary-hover text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setOpen(true)}
                                disabled={!hasProducts}
                            >
                                Pedir
                            </button>

                            <ProductsFilter
                                setAppliedSearchTerm={setAppliedSearchTerm}
                                setAppliedMinPrice={setAppliedMinPrice}
                                setAppliedMaxPrice={setAppliedMaxPrice}
                                sortOption={sortOption}
                                setSortOption={setSortOption}
                                currentUserRole={currentUser?.role}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product) => {
                                    // Busca si el producto ya está seleccionado
                                    const selected = selectedProducts.find(item => item.product.id === product.id);
                                    return (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            Cant={selected ? selected.quantity : 0}
                                            setCant={(value) => {
                                                setSelectedProducts(prev => {
                                                    // Si ya está seleccionado, actualiza la cantidad
                                                    const exists = prev.find(item => item.product.id === product.id);
                                                    if (exists) {
                                                        if (value === 0) {
                                                            // Si la cantidad es 0, lo elimina de la selección
                                                            return prev.filter(item => item.product.id !== product.id);
                                                        }
                                                        return prev.map(item =>
                                                            item.product.id === product.id
                                                                ? { ...item, quantity: value }
                                                                : item
                                                        );
                                                    } else {
                                                        // Si no está, lo agrega si value > 0
                                                        if (value > 0) {
                                                            return [...prev, { product, quantity: value }];
                                                        }
                                                        return prev;
                                                    }
                                                });
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

            </div>

            <Footer />
        </div >
    );
}