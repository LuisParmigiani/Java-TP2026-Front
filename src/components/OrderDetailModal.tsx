import { useState, useEffect } from "react";
import type {
  VentaResponse,
  VentaRequest,
  DiaZonaOrdenResponse,
  LineaPedidoResponse,
  ProductosDomicilio,
  productosDomicilioRequest,
} from "../services/Interfaces";
import { createDriverSale } from "../services/SalesService";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./Dialog";
import { Button } from "./Button";
import { getById } from "../services/DirectionService";
import { useAuth } from "../hooks/useAuth.ts";
interface Props {
  open: boolean;
  onClose: () => void;
  delivery: DiaZonaOrdenResponse | null;
  sale: VentaResponse | null;
  loading?: boolean;
  onSaleUpdated?: () => void;
}

export default function OrderDetailModal({
  open,
  onClose,
  delivery,
  sale,
  loading,
  onSaleUpdated,
}: Props) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [vaciosQty, setVaciosQty] = useState<productosDomicilioRequest[]>([]);
  const [pagado, setPagado] = useState(false);
  const [montoPagado, setMontoPagado] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [directionProducts, setDirectionProducts] = useState<ProductosDomicilio[] | null>(null);
  const { token } = useAuth();
  // linea.id comes as null from the API, so we key by productoZona.id
  const key = (l: LineaPedidoResponse) => l.productoZona?.id ?? 0;

  useEffect(() => {
    if (sale?.lineasPedido) {
      const init: Record<number, number> = {};
      for (const linea of sale.lineasPedido) init[key(linea)] = linea.cantidad;
      setQuantities(init);
      setPagado(sale.pagado ?? false);
    }
    const searchDirectionProducts = async () => {
      const results = await getById(delivery?.domicilio?.id ?? 0, token, ['productosDomicilio']);
      setDirectionProducts(results.productosDomicilio ?? null);
    };
    searchDirectionProducts();
  }, [sale, delivery, token]);
  const getPrice = (l: LineaPedidoResponse) =>
    l.productoZona?.producto?.precio ?? 0;

  const getSubtotal = (l: LineaPedidoResponse) =>
    (quantities[key(l)] ?? l.cantidad) * getPrice(l);

  const total =
    sale?.lineasPedido?.reduce((sum, l) => sum + getSubtotal(l), 0) ?? 0;

  const handleRealizado = async () => {
    if (!sale) return;
    setSaving(true);
    try {
      const ventaRequest: VentaRequest = {
        fecha: sale.fecha,
        total,
        estado: sale.estado,
        pagado,
        idDomicilio: sale.idDomicilio || sale.domicilio?.id,
        lineasPedido: sale.lineasPedido
          ?.filter(linea => (quantities[key(linea)] ?? linea.cantidad) > 0)
          .map(linea => ({
            cantidad: quantities[key(linea)] ?? linea.cantidad,
            subtotal: (quantities[key(linea)] ?? linea.cantidad) * getPrice(linea),
            productoZonaId: linea.productoZona?.id,
          })),
      };
      const response = await createDriverSale(ventaRequest, montoPagado, vaciosQty, token);

      console.log("Sale created for driver:", response);
      console.log("Monto pagado:", montoPagado);
      onSaleUpdated?.();
      onClose();
    } catch (e) {
      console.error("Error saving sale:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent aria-describedby={undefined} className="inset-0 left-0 top-0 max-w-none w-screen h-dvh max-h-dvh translate-x-0 translate-y-0 rounded-none sm:rounded-none flex flex-col overflow-hidden p-0 [&>button.absolute]:hidden">
        <DialogTitle className="sr-only">
          Detalles del Pedido — {delivery?.domicilio?.calle} {delivery?.domicilio?.numero}
        </DialogTitle>
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-xl font-bold">
            Detalles del Pedido —{" "}
            {delivery?.domicilio?.calle} {delivery?.domicilio?.numero}
          </h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground py-6 text-center flex-1">
            Cargando pedido...
          </p>
        ) : !sale ? (
          <p className="text-sm text-muted-foreground py-6 text-center flex-1">
            Sin pedido registrado para hoy.
          </p>
        ) : (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-3">
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <div className="flex px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-50 border-b border-gray-200">
                  <span className="flex-1">Producto</span>
                  <span className="w-24 text-center">Cant.</span>
                  <span className="w-20 text-right">Subtotal</span>
                </div>
                {sale.lineasPedido?.map((linea, i) => {
                  const qty = quantities[key(linea)] ?? linea.cantidad;
                  const dirProducto = directionProducts?.find(dp => dp.productoId === linea.productoZona?.producto?.id);
                  const maxVacios = dirProducto?.cantVaciosActuales;
                  const productoId = linea.productoZona?.producto?.id ?? 0;
                  const vaciosCount = vaciosQty.find(v => v.productoId === productoId)?.cantVaciosActuales ?? 0;
                  return (
                    <div
                      key={key(linea)}
                      className={i > 0 ? "border-t border-gray-100" : ""}
                    >
                      <div className="flex items-center gap-2 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm leading-snug">
                            {linea.productoZona?.producto?.nombre ?? "—"} {linea.productoZona?.producto?.id ?? ""}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            ${getPrice(linea).toLocaleString()} c/u
                          </p>
                        </div>
                        <div className="flex items-center gap-1 w-24 justify-center shrink-0">
                          <button
                            type="button"
                            onClick={() => setQuantities(prev => ({ ...prev, [key(linea)]: Math.max(0, qty - 1) }))}
                            className="h-8 w-8 rounded-lg bg-gray-100 active:bg-gray-200 text-lg font-semibold flex items-center justify-center select-none"
                          >−</button>
                          <span className="w-6 text-center font-semibold text-sm">{qty}</span>
                          <button
                            type="button"
                            onClick={() => setQuantities(prev => ({ ...prev, [key(linea)]: qty + 1 }))}
                            className="h-8 w-8 rounded-lg bg-gray-100 active:bg-gray-200 text-lg font-semibold flex items-center justify-center select-none"
                          >+</button>
                        </div>
                        <span className="w-20 text-right font-semibold text-sm text-gray-800 shrink-0">
                          ${getSubtotal(linea).toLocaleString()}
                        </span>
                      </div>
                      {maxVacios !== undefined && maxVacios > 0 && (
                        <div className="flex items-center gap-2 px-4 pb-3 bg-gray-200 pt-2">
                          <span className="flex-1 text-xs text-gray-400">Envases vacíos a retirar:</span>
                          <div className="flex items-center gap-1 w-24 justify-center shrink-0">
                            <button
                              type="button"
                              onClick={() => setVaciosQty(prev => {
                                const entry = { productoId, domicilioId: delivery?.domicilio?.id, cantVaciosActuales: Math.max(0, vaciosCount - 1) };
                                const idx = prev.findIndex(v => v.productoId === productoId);
                                if (idx >= 0) { const next = [...prev]; next[idx] = entry; return next; }
                                return [...prev, entry];
                              })}
                              className="h-7 w-7 rounded-lg bg-gray-100 active:bg-gray-200 text-lg font-semibold flex items-center justify-center select-none"
                            >−</button>
                            <span className="w-6 text-center font-semibold text-sm">{vaciosCount}</span>
                            <button
                              type="button"
                              onClick={() => setVaciosQty(prev => {
                                const entry = { productoId, domicilioId: delivery?.domicilio?.id, cantVaciosActuales: Math.min(maxVacios!, vaciosCount + 1) };
                                const idx = prev.findIndex(v => v.productoId === productoId);
                                if (idx >= 0) { const next = [...prev]; next[idx] = entry; return next; }
                                return [...prev, entry];
                              })}
                              className="h-7 w-7 rounded-lg bg-gray-100 active:bg-gray-200 text-lg font-semibold flex items-center justify-center select-none"
                            >+</button>
                          </div>
                          <span className="w-20 text-right text-xs text-gray-400 shrink-0">/ {maxVacios} dispon.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                <span className="text-sm text-gray-500 font-medium">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ${total.toLocaleString()}
                </span>
              </div>
            </div>

          </>
        )}

        {sale && (
          <div className="shrink-0 border-t px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="font-medium text-sm">Pagado</span>
              <button
                type="button"
                role="switch"
                aria-checked={pagado}
                onClick={() => setPagado((p) => !p)}
                className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                style={{ backgroundColor: pagado ? "#22c55e" : "#d1d5db" }}
              >
                <span
                  className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
                  style={{ transform: pagado ? "translateX(1.375rem)" : "translateX(0.2rem)" }}
                />
              </button>
              <span
                className="text-sm font-semibold w-5"
                style={{ color: pagado ? "#16a34a" : "#9ca3af" }}
              >
                {pagado ? "Sí" : "No"}
              </span>
            </div>
            {pagado && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500 shrink-0" htmlFor="monto-pagado">
                  Cantidad pagada:
                </label>
                <input
                  id="monto-pagado"
                  type="number"
                  min={0}
                  value={montoPagado}
                  onChange={(e) => {
                    setMontoPagado(e.target.value);
                    console.log(vaciosQty);
                  }}
                  placeholder="$0"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button size="sm" disabled={saving} onClick={handleRealizado}>
                {saving ? "Guardando..." : "Realizado"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
