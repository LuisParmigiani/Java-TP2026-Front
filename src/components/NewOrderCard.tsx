import { useEffect, useMemo } from 'react';
import type { DomicilioResponse, ProductoResponse } from '../services/Interfaces';


interface Props {
    products: ProductoResponse[];
    total: number;
    direction: DomicilioResponse;
    open: boolean;
    setOpen: (value: boolean) => void;
    complete: () => void;
    selectedProducts: { product: ProductoResponse, quantity: number }[];
}




export default function NewOrderCard(prop: Props) {

    useEffect(() => {
        if (prop.open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [prop.open]);

    const displayProducts = useMemo(() => {
        const merged = prop.selectedProducts.map(item => ({ ...item }));
        prop.direction?.pedidosSemanales?.forEach(pedido => {
            if (pedido.cantidad > 0) {
                const existingItem = merged.find(item => item.product.id === pedido.productoZona.producto.id);
                if (existingItem) {
                    existingItem.quantity += pedido.cantidad;
                } else {
                    merged.push({ product: pedido.productoZona.producto, quantity: pedido.cantidad });
                }
            }
        });
        return merged;
    }, [prop.selectedProducts, prop.direction]);

    return (
        <>
            {prop.open && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 sm:p-6"
                    onClick={() => prop.setOpen(false)}
                >
                    <div
                        className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">Detalle del pedido: </h2>
                                <h3 className="text-lg font-medium text-gray-700">En la proxima entrega se le entregaran todos estos productos</h3>
                                <p>Son los productos seleccionados con los semanales.</p>
                            </div>
                            <button
                                onClick={() => prop.setOpen(false)}
                                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">Direccion:</p>
                                <p className="mt-1 font-medium text-gray-900">{prop.direction.calle} {prop.direction.casa}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="mt-1 font-medium text-gray-900">$ {prop.total}</p>
                            </div>
                        </div>
                        <div>
                        </div>
                        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                            <p className="mb-4 text-sm font-semibold text-gray-700">Resumen del pedido</p>
                            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                                <div className="grid grid-cols-4 gap-2 border-b border-gray-200 bg-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    <p>Producto</p>
                                    <p className="text-center">Cant.</p>
                                    <p className="text-right">Unitario</p>
                                    <p className="text-right">Subtotal</p>
                                </div>
                                {displayProducts
                                    .filter(item => item.quantity > 0)
                                    .map((item, rowIndex) => (
                                        <div key={item.product.id} className={`grid grid-cols-4 gap-2 border-t border-gray-100 px-3 py-2 text-sm text-gray-700 ${rowIndex === 0 ? 'border-t-0' : ''}`}>
                                            <p>{item.product.nombre}</p>
                                            <p className="text-center">x{item.quantity}</p>
                                            <p className="text-right">$ {item.product.precio.toFixed(2)}</p>
                                            <p className="text-right font-medium">$ {(item.product.precio * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                                <p className="text-sm text-gray-500">Total final</p>
                                <p className="text-base font-semibold text-gray-900">$ {prop.total}</p>
                            </div>

                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-primary hover:bg-primary-hover`}

                                onClick={prop.complete}
                            >
                                Realizar Pedido
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}