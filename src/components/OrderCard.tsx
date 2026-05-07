import { useEffect, useState } from 'react';
import type { VentaResponse } from '../services/Interfaces';
import { updateSale } from '../services/SalesService';
import ProductTable from './ProductTable';
import { MapPin } from 'lucide-react';




const statusColors = {
    'Pendiente': 'bg-yellow-100 text-yellow-800',
    'Enviado': 'bg-blue-100 text-blue-800',
    'Completada': 'bg-green-100 text-green-800',
    'Cancelada': 'bg-red-100 text-red-800',
    'En proceso': 'bg-purple-100 text-purple-800',
}
interface OrderCardProps {
    prop: VentaResponse;
    setAlert: (integer: number) => void;
}
export default function OrderCard({ prop, setAlert }: OrderCardProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const cancelOrder = async () => {

        try {

            await updateSale(prop.id, { estado: 'Cancelada' });
            setAlert(prop.id);
            setOpen(false)
        } catch {
            setAlert(-1)
            setOpen(false)

        }
    }

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm overflow-y-auto sm:p-6"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="w-full min-h-screen sm:min-h-0 sm:mx-auto sm:max-w-3xl sm:rounded-2xl sm:my-6 sm:border sm:border-gray-200 bg-white p-6 sm:p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">Detalle del pedido #{prop.id}</h2>
                                <p> {new Date(prop.fecha).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                <p></p>

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
                                <p className="mt-1 font-medium text-gray-900">{prop.estado}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="mt-1 font-medium text-gray-900">$ {prop.total}</p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                            <p className="mb-4 text-sm font-semibold text-gray-700">Resumen del pedido</p>
                            <ProductTable lineasPedido={prop.lineasPedido} total={prop.total} />
                        </div>
                        {prop.estado === 'Pendiente' && (
                            <div className="mt-6 flex justify-end">
                                <button onClick={cancelOrder} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                                    Cancelar Pedido
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button onClick={() => setOpen(true)} className="hover:bg-gray-100 w-full h-full justify-center bg-white  flex flex-col gap-3 rounded-lg p-4 size-sm border border-gray-300 shadow-sm text-left">
                <div className="flex flex-row  items-center justify-between mb-4">
                    <p className={`text-lg text-gray-800`}>Pedido #{prop.id}</p>
                    <div className={`px-2 py-1 rounded-full text-sm ${statusColors[prop.estado]}`}>
                        {prop.estado}
                    </div>
                </div>

                <div className="flex felx-row items-center gap-2">
                    <MapPin />
                    <h3 className={`text-md  text-gray-600`}>
                        Al domicilio: {prop?.domicilio?.calle} {prop?.domicilio?.numero}, {prop?.domicilio?.casa}
                    </h3>
                </div>

                <div className="flex felx-row items-center gap-2">
                    <svg viewBox="0 0 24 24" className='w-7 h-7' fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9H21M17 13.0014L7 13M10.3333 17.0005L7 17M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    <h3 className={`text-md  text-gray-600`}>
                        Realizado el {new Date(prop.fecha).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                </div>
                <p className={`text-lg mt-2 text-black`}>Total: $ {prop.total}</p>
            </button>
        </>
    );
}