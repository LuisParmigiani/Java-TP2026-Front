import { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./Table";
import { Button } from "./Button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import {  getPending, updateDirection } from "../services/DirectionService";
import type { DomicilioResponse } from "../services/Interfaces";
import { useAuth } from "../hooks/useAuth.ts";

export function PendingDomiciliosTable() {
  const {token, loading: loadingAuth} = useAuth();
  const [domicilios, setDomicilios] = useState<DomicilioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchPending = useCallback(async () => {
    if (loadingAuth) return; // Evitar hacer fetch mientras se resuelve la autenticación
    setLoading(true);
    try {
      const all = await getPending(token,["persona", "zona"]);
      setDomicilios(all);
    } catch (error) {
      console.error("Error fetching pending domicilios:", error);
    } finally {
      setLoading(false);
    }
  }, [token, loadingAuth]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleEstado = async (
    domicilio: DomicilioResponse,
    habilitado: "Habilitado" | "Deshabilitado",
  ) => {
    setUpdatingId(domicilio.id);
    try {
      await updateDirection({ ...domicilio, habilitado },token);
      setDomicilios((prev) => prev.filter((d) => d.id !== domicilio.id));
    } catch (error) {
      console.error("Error actualizando domicilio:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (domicilios.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-6">
        No hay domicilios pendientes de habilitación
      </p>
    );
  }

  return (
    <>
      {/* Mobile: cards */}
      <div className="md:hidden space-y-3">
        {domicilios.map((dom) => {
          const isUpdating = updatingId === dom.id;
          return (
            <div
              key={dom.id}
              className="border border-border rounded-lg p-4 bg-background space-y-1"
            >
              <p className="font-semibold text-sm">
                {dom.calle} {dom.numero}
                {dom.casa ? ` (${dom.casa})` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                Cliente:{" "}
                {dom.persona
                  ? `${dom.persona.nombre} ${dom.persona.apellido}`
                  : "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                Zona: {dom.zona?.nombre ?? "—"}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="green"
                  size="sm"
                  className="flex-1"
                  disabled={isUpdating}
                  onClick={() => handleEstado(dom, "Habilitado")}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Habilitar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  disabled={isUpdating}
                  onClick={() => handleEstado(dom, "Deshabilitado")}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Rechazar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Zona</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domicilios.map((dom) => {
              const isUpdating = updatingId === dom.id;
              return (
                <TableRow key={dom.id}>
                  <TableCell className="font-medium">{dom.id}</TableCell>
                  <TableCell>
                    {dom.calle} {dom.numero}
                    {dom.casa ? ` (${dom.casa})` : ""}
                  </TableCell>
                  <TableCell>
                    {dom.persona
                      ? `${dom.persona.nombre} ${dom.persona.apellido}`
                      : "—"}
                  </TableCell>
                  <TableCell>{dom.zona?.nombre ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="green"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleEstado(dom, "Habilitado")}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Habilitar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleEstado(dom, "Deshabilitado")}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Rechazar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
