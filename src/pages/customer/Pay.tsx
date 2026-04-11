import { useState } from "react";
import Footer from "../../components/Footer";


const pagos = [
    { id: '1', date: '2024-01-01', status: 'Pendiente', total: '100.00' },
    { id: '2', date: '2024-02-01', status: 'Completado', total: '200.00' },
    { id: '3', date: '2024-03-01', status: 'Cancelado', total: '12.34' },
    { id: '1', date: '2024-01-01', status: 'Pendiente', total: '100.00' },
    { id: '2', date: '2024-02-01', status: 'Completado', total: '200.00' },
    { id: '3', date: '2024-03-01', status: 'Cancelado', total: '12.34' },
];

export default function Pay() {
    const [saldo, setSaldo] = useState(0);
    return (
        <div>

            <div className="p-4 sm:p-6 lg:p-8 gap-4 felx flex-col  m-9 rounded-2xl">
                <h1 className="text-2xl font-semibold text-gray-900">Pago</h1>
                <p className="mt-2 text-sm text-gray-700">Aquí puedes gestionar tus métodos de pago.</p>
                <div className="mt-6 space-y-4 mb-10 bg-gray-100 p-4 rounded-lg flex flex-row justify-between items-center">
                    <div className="flex flex-col gap-5">

                        <h2 className="text-lg font-semibold text-gray-900">Subir comprobante de pago</h2>
                        <p className="text-sm text-gray-500">Por favor, sube una imagen del comprobante de pago.</p>
                        <input type="file" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    </div>
                    <div className={`${saldo < 0 ? "border-2 border-red-500 bg-red-100" : saldo == 0 ? "border-2 border-gray-500 bg-gray-100" : "border-2 border-green-500 bg-green-100"} rounded-2xl p-6`}>

                        <h2 className={`${saldo < 0 ? "text-red-500" : saldo == 0 ? "text-gray-500" : "text-green-500"} text-4xl `}>Saldo: ${saldo}</h2>
                    </div>
                </div>
                <div className="mt-6 space-y-4 mb-10 bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900">Actividad:</h2>
                    <p className="text-sm text-gray-500">Aquí puedes ver los pagos realizados.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pagos.map((pago) => (
                            <div className="rounded-lg border border-gray-200 bg-white p-4" key={pago.id}>
                                <h3 className="text-md font-medium text-gray-900">Pago #{pago.id}</h3>
                                <p className="text-sm text-gray-500">Fecha: {pago.date}</p>
                                <p className="text-sm text-gray-500">Monto: ${pago.total}</p>
                                <p className="text-sm text-gray-500">Estado: {pago.status}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <Footer />
        </div >

    );
}