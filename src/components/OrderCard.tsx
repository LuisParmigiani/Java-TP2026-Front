import { useEffect, useState } from 'react';


interface Props {
    orderNumber: string;
    status: string;
    date: string;
    total: string;
}


const LineaPedidos = [
    { producto: 'Producto 1', cantidad: 2, precioUnitario: 1200, subtotal: 2400 },
    { producto: 'Producto 2', cantidad: 1, precioUnitario: 950, subtotal: 950 },
    { producto: 'Producto 3', cantidad: 3, precioUnitario: 450, subtotal: 1350 },

]

const statusColors= {
    'Pendiente': 'bg-yellow-100 text-yellow-800',
    'Enviado': 'bg-blue-100 text-blue-800',
    'Entregado': 'bg-green-100 text-green-800',
    'Cancelado': 'bg-red-100 text-red-800',
}
export default function OrderCard(prop: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [open]);

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 sm:p-6"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">Detalle del pedido #{prop.orderNumber}</h2>
                                <p className="mt-1 text-sm text-gray-500">Realizado el {prop.date}</p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">Estado</p>
                                <p className="mt-1 font-medium text-gray-900">{prop.status}</p>
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
                                {
                                    LineaPedidos.map((linea, index) => (
                                        <div key={index} className={`grid grid-cols-4 gap-2 border-t border-gray-100 px-3 py-2 text-sm text-gray-700 ${index === 0 ? 'border-t-0' : ''}`}>
                                            <p>{linea.producto}</p>
                                            <p className="text-center">x{linea.cantidad}</p>
                                            <p className="text-right">$ {linea.precioUnitario}</p>
                                            <p className="text-right font-medium">$ {linea.subtotal}</p>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                                <p className="text-sm text-gray-500">Total final</p>
                                <p className="text-base font-semibold text-gray-900">$ {prop.total}</p>
                            </div>

                        </div>
                        {prop.status === 'Pendiente' && (
                            <div className="mt-6 flex justify-end">
                                <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                                    Cancelar Pedido
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button onClick={() => setOpen(true)} className="hover:bg-gray-100 w-full h-full justify-center bg-white  flex flex-col gap-3 rounded-lg p-4 size-sm border border-gray-300 shadow-sm text-left">
                <div className="flex flex-row  items-center justify-between mb-4">
                    <p className={`text-lg text-gray-800`}>Pedido #{prop.orderNumber}</p>
                    <div className={`px-2 py-1 rounded-full text-sm ${statusColors[prop.status]}`}>
                        {prop.status}
                    </div>
                </div>

                <div className="flex felx-row items-center gap-2">
                    <svg viewBox="0 0 24 24" className='w-7 h-7' fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9H21M17 13.0014L7 13M10.3333 17.0005L7 17M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    <h3 className={`text-md  text-gray-600`}>
                        Realizado el {prop.date}
                    </h3>
                </div>
                <div className="flex felx-row items-center gap-2">
                    <svg
                        viewBox="0 0 24 24"
                        className="w-7 h-7 "
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 21C12 21 18 15.5 18 10.5C18 7.18629 15.3137 4.5 12 4.5C8.68629 4.5 6 7.18629 6 10.5C6 15.5 12 21 12 21Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg><p className="text-md text-gray-600">Dia: Lunes</p>

                </div>
                <p className={`text-lg mt-2 text-black`}>Total: $ {prop.total}</p>
            </button>
        </>
    );
}