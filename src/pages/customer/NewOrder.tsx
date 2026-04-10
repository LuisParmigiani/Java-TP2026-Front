import Footer from "../../components/Footer";
import NewOrderCard from "../../components/NewOrderCard";
import ProductCard from "../../components/ProductCard";
import { useState } from "react";

const products = [
    {
        id: '1',
        name: "Producto 1",
        description: "Descripción del producto 1",
        image: "https://via.placeholder.com/300x200",
        price: 19.99,
    },
    {
        id: '2',
        name: "Producto 2",
        description: "Descripción del producto 2",
        image: "https://via.placeholder.com/300x200",
        price: 29.99,
    },
    {
        id: '3',
        name: "Producto 3",
        description: "Descripción del producto 3",
        image: "https://via.placeholder.com/300x200",
        price: 39.99,
    }, {
        id: '4',
        name: "Producto 1",
        description: "Descripción del producto 1",
        image: "https://via.placeholder.com/300x200",
        price: 19.99,
    },
    {
        id: '5',
        name: "Producto 2",
        description: "Descripción del producto 2",
        image: "https://via.placeholder.com/300x200",
        price: 29.99,
    },
    {
        id: '6',
        name: "Producto 3",
        description: "Descripción del producto 3",
        image: "https://via.placeholder.com/300x200",
        price: 39.99,
    }, {
        id: '7',
        name: "Producto 1",
        description: "Descripción del producto 1",
        image: "https://via.placeholder.com/300x200",
        price: 19.99,
    },
    {
        id: '8',
        name: "Producto 2",
        description: "Descripción del producto 2",
        image: "https://via.placeholder.com/300x200",
        price: 29.99,
    },
    {
        id: '9',
        name: "Producto 3",
        description: "Descripción del producto 3",
        image: "https://via.placeholder.com/300x200",
        price: 39.99,
    }, {
        id: '10',
        name: "Producto 1",
        description: "Descripción del producto 1",
        image: "https://via.placeholder.com/300x200",
        price: 19.99,
    },
    {
        id: '11',
        name: "Producto 2",
        description: "Descripción del producto 2",
        image: "https://via.placeholder.com/300x200",
        price: 29.99,
    },
    {
        id: '12',
        name: "Producto 3",
        description: "Descripción del producto 3",
        image: "https://via.placeholder.com/300x200",
        price: 39.99,
    },
];

export default function NewOrder() {
    const [cant, setCant] = useState<number[]>(new Array(products.length).fill(0));
    const [open, setOpen] = useState(false);

    const total = cant.reduce((acc, curr, i) => acc + curr * products[i].price, 0);
    const hasProducts = cant.some((value) => value > 0);

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <NewOrderCard
                orderNumber="12345"
                open={open}
                setOpen={setOpen}
                cant={cant}
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
                                key={index}
                                id={index}
                                name={product.name}
                                description={product.description}
                                image={product.image}
                                price={product.price}
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
                </div>

            </div>
            <Footer />
        </div >
    );
}