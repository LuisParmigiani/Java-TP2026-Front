import { useEffect, useState } from 'react';
import type { VentaResponse } from '../services/Interfaces';
import ProductTable from './ProductTable';
import { Button } from './Button';
import { MapPin, User, Map } from 'lucide-react';

const statusColors: Record<string, string> = {
  Pendiente: 'bg-yellow-100 text-yellow-800',
  Enviado: 'bg-blue-100 text-blue-800',
  Completada: 'bg-green-100 text-green-800',
  Cancelada: 'bg-red-100 text-red-800',
  'En proceso': 'bg-purple-100 text-purple-800',
};

interface AdminOrderCardProps {
  order: VentaResponse;
  onAccept: (id: number) => void;
  onDeny: (id: number) => void;
}

export default function AdminOrderCard({ order, onAccept, onDeny }: AdminOrderCardProps) {
  const [open, setOpen] = useState(false);
  const isPendiente = order.estado === 'Pendiente';

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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
                <h2 className="text-2xl font-semibold text-gray-900">Pedido #{order.id}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {new Date(order.fecha).toLocaleDateString('es-AR', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Estado</p>
                <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-sm font-medium ${statusColors[order.estado] ?? 'bg-gray-100 text-gray-800'}`}>
                  {order.estado}
                </span>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Total</p>
                <p className="mt-1 font-medium text-gray-900">$ {order.total}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Pagado</p>
                <p className="mt-1 font-medium text-gray-900">{order.pagado ? 'Sí' : 'No'}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500 mb-1">Dirección</p>
                <p className="font-medium text-gray-900">
                  {order.domicilio?.calle} {order.domicilio?.numero}, {order.domicilio?.casa}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500 mb-1">Zona</p>
                <p className="font-medium text-gray-900">{order.domicilio?.zona?.nombre ?? '—'}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 sm:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Cliente</p>
                <p className="font-medium text-gray-900">
                  {order.domicilio?.persona?.nombre} {order.domicilio?.persona?.apellido}
                </p>
                <p className="text-sm text-gray-500">{order.domicilio?.persona?.email}</p>
                <p className="text-sm text-gray-500">{order.domicilio?.persona?.telefono}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
              <p className="mb-4 text-sm font-semibold text-gray-700">Productos del pedido</p>
              <ProductTable lineasPedido={order.lineasPedido ?? []} total={order.total} />
            </div>

            {isPendiente && (
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="danger" onClick={() => { onDeny(order.id); setOpen(false); }}>
                  Denegar
                </Button>
                <Button variant="green" onClick={() => { onAccept(order.id); setOpen(false); }}>
                  Aceptar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        onClick={() => setOpen(true)}
        className="hover:bg-gray-50 cursor-pointer w-full h-full bg-white flex flex-col gap-3 rounded-lg p-4 border border-gray-300 shadow-sm text-left transition-colors"
      >
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-gray-800">Pedido #{order.id}</p>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.estado] ?? 'bg-gray-100 text-gray-800'}`}>
            {order.estado}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4 shrink-0" />
          <p className="text-sm truncate">
            {order.domicilio?.persona?.nombre} {order.domicilio?.persona?.apellido}
          </p>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 shrink-0" />
          <p className="text-sm truncate">
            {order.domicilio?.calle} {order.domicilio?.numero}, {order.domicilio?.casa}
          </p>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Map className="w-4 h-4 shrink-0" />
          <p className="text-sm">Zona: {order.domicilio?.zona?.nombre ?? '—'}</p>
        </div>

        <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-100">
          <p className="text-base font-semibold text-gray-900">$ {order.total}</p>
          {isPendiente && (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Button size="sm" variant="danger" onClick={() => onDeny(order.id)}>Denegar</Button>
              <Button size="sm" variant="green" onClick={() => onAccept(order.id)}>Aceptar</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
