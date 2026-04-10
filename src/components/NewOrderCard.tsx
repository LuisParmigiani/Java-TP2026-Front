import { useEffect } from 'react';


interface Props {
    orderNumber: string;
    cant: number[];
    products: {
        name: string;
        description: string;
        image: string;
        price: number;
    }[];
    total: number;
    open: boolean;
    setOpen: (value: boolean) => void;
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
                                <h2 className="text-2xl font-semibold text-gray-900">Detalle del pedido #{prop.orderNumber}</h2>
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
                                <p className="text-sm text-gray-500">Llegada estimada:</p>
                                <p className="mt-1 font-medium text-gray-900">30 de septiembre, 2024</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="mt-1 font-medium text-gray-900">$ {prop.total}</p>
                            </div>
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
                                {prop.cant
                                    .map((quantity, index) => ({ quantity, index }))
                                    .filter((item) => item.quantity > 0)
                                    .map((item, rowIndex) => (
                                        <div key={item.index} className={`grid grid-cols-4 gap-2 border-t border-gray-100 px-3 py-2 text-sm text-gray-700 ${rowIndex === 0 ? 'border-t-0' : ''}`}>
                                            <p>{prop.products[item.index].name}</p>
                                            <p className="text-center">x{item.quantity}</p>
                                            <p className="text-right">$ {prop.products[item.index].price.toFixed(2)}</p>
                                            <p className="text-right font-medium">$ {(prop.products[item.index].price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                                <p className="text-sm text-gray-500">Total final</p>
                                <p className="text-base font-semibold text-gray-900">$ {prop.total}</p>
                            </div>

                        </div>

                        <div className="mt-6 flex justify-end">
                            <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                                Realizar Pedido.
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}