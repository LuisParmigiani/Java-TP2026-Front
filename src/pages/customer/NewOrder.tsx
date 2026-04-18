import Footer from "../../components/Footer";
import NewOrderCard from "../../components/NewOrderCard";
import ProductCard from "../../components/ProductCard";
import { useEffect, useState } from "react";
import { getActiveProducts } from "../../services/ProductService";
import NavBar from "../../components/NavBar";
import type { ProductoResponse } from "../../services/Interfaces";
import type { domicilioResponse } from "../../services/Interfaces";
import { getAllByUserId } from "../../services/DirectionService";
import { useAuth } from "../../hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Select.tsx';

export default function NewOrder() {
    const [products, setProducts] = useState<ProductoResponse[]>([]);
    const [cant, setCant] = useState<number[]>([]);
    const [directions, setDirections] = useState<domicilioResponse[]>([]);
    const [selectedDirection, setSelectedDirection] = useState<string>("");
    const [open, setOpen] = useState(false);
    const total = cant.reduce((acc, quantity, index) => acc + quantity * (products[index]?.precio || 0), 0);
    const hasProducts = cant.some((value) => value > 0);
    const { currentUser } = useAuth();
    const { token } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getActiveProducts(token, currentUser?.role, undefined, undefined, undefined, undefined, selectedDirection);
                setProducts(response);


                setCant(new Array(response.length).fill(0));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [currentUser?.role, selectedDirection, token]);

    useEffect(() => {
        const fetchDirections = async () => {
            try {
                const response = await getAllByUserId(token);
                setDirections(response);
            } catch (error) {
                console.error("Error fetching directions:", error);
            }
        };
        fetchDirections();
    }, [token]);

    const SaveOrder = () => {
        const orderDetails = products
            .map((product, index) => ({
                productId: product.id,
                nombre: product.nombre,
                quantity: cant[index],
                price: product.precio
            }))
            .filter(item => item.quantity > 0);


        console.log("Detalles del pedido:", orderDetails);
        console.log("Dirección seleccionada:", selectedDirection);
        console.log("Total:", total);
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <NavBar />

            <NewOrderCard
                orderNumber="12345"
                open={open}
                complete={SaveOrder}
                setOpen={setOpen}
                cant={cant}
                direction={directions.find(dir => String(dir.id) == selectedDirection)}
                products={products}
                total={total}
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
                            <Select value={selectedDirection} onValueChange={setSelectedDirection}>
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
                    ) : (
                        <>
                            <button
                                className=" mb-6 w-full px-6 py-3 rounded-md bg-primary text-white hover:bg-primary-hover text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setOpen(true)}
                                disabled={!hasProducts}
                            >
                                Pedir
                            </button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        Cant={cant[index]}
                                        setCant={(value) =>
                                            setCant((prev) => {
                                                const next = [...prev];
                                                next[index] = value;
                                                return next;
                                            })
                                        }
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>
            <Footer />
        </div >
    );
}