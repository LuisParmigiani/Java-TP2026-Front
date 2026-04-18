import type { LineaPedidoResponse } from "../services/Interfaces";

interface ProductTableProps {
    lineasPedido: LineaPedidoResponse[];
    total: number;
}


export default function SemanalOrder(prop: ProductTableProps) {
    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <div className="bg-background text-foreground flex flex-col">
                    <div className="grid grid-cols-4 gap-2 border-b border-gray-200 bg-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        <p>Producto</p>
                        <p className="text-center">Cant.</p>
                        <p className="text-right">Unitario</p>
                        <p className="text-right">Subtotal</p>
                    </div>
                    {
                        prop.lineasPedido.map((linea, index) => (
                            <div key={index} className={`grid grid-cols-4 gap-2 border-t border-gray-100 px-3 py-2 text-sm text-gray-700 ${index === 0 ? 'border-t-0' : ''}`}>
                                <p>{linea.productoZona.producto.nombre}</p>
                                <p className="text-center">x{linea.cantidad}</p>
                                <p className="text-right">$ {linea.productoZona.producto.precio}</p>
                                <p className="text-right font-medium">$ {linea.subtotal}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                <p className="text-sm text-gray-500">Total final</p>
                <p className="text-base font-semibold text-gray-900">$ {prop.total}</p>
            </div>
        </>
    );
} 