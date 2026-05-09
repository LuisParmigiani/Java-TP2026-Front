import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/Dialog.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/Table.tsx';
import { Button } from '../../../components/Button.tsx';
import type {
  CargaResponse,
  PersonaResponse,
  ProductoResponse,
} from '../../../services/Interfaces.ts';
// 💡 Esta es la estructura que deberás traer de tu backend eventualmente
export interface BackendCargaStat {
  productoId: number;
  vendidos: number;
  vaciosJuntados: number;
}

interface ViewLoadDialogProps {
  cargaPartida: CargaResponse;
  cargaLlegada: CargaResponse | null; // Puede ser null si aún está "En curso"
  empleado: PersonaResponse | undefined;
  products: ProductoResponse[];
  isDialogOpen: boolean;
  setIsDialogOpen: (val: boolean) => void;
}

export const ViewLoadDialog = ({
  cargaPartida,
  cargaLlegada,
  empleado,
  products,
  isDialogOpen,
  setIsDialogOpen,
}: ViewLoadDialogProps) => {
  // Recopilamos todos los IDs únicos de productos involucrados en este viaje
  // (ya sea que los llevó, los trajo, o figuran en las estadísticas del backend)
  const productIds = new Set<number>();
  cargaPartida.cargasProducto?.forEach((cp) => productIds.add(cp.productoId));
  cargaLlegada?.cargasProducto?.forEach((cp) => productIds.add(cp.productoId));

  // Armamos las filas cruzando toda la información
  const filasResumen = Array.from(productIds).map((id) => {
    const producto = products.find((p) => p.id === id);
    const llevado =
      cargaPartida.cargasProducto?.find((cp) => cp.productoId === id)
        ?.cantLleno || 0;

    const cantVendidos =
      cargaPartida.cargasProducto?.find((cp) => cp.productoId === id)
        ?.cantVendidos || 0;
    const traidoLleno =
      cargaLlegada?.cargasProducto?.find((cp) => cp.productoId === id)
        ?.cantLleno || 0;
    const vacioTraido =
      cargaLlegada?.cargasProducto?.find((cp) => cp.productoId === id)
        ?.cantVacio || 0;
    const vacioJuntado =
      cargaLlegada?.cargasProducto?.find((cp) => cp.productoId === id)
        ?.cantDevueltos || 0;

    return {
      productoId: id,
      nombre: producto?.nombre || `Producto #${id}`,
      llevado,
      vendidos: cantVendidos,
      traidoLleno,
      vaciosJuntados: vacioJuntado,
      vacioTraido,
    };
  });
  // Helper para determinar el color de los Envases Llenos (Reconciliación)
  const getLlenoStyle = (llevado: number, vendidos: number, traido: number) => {
    const saldoTeorico = llevado - vendidos;
    if (saldoTeorico === traido) return 'bg-[#22c55e] text-black'; // OK
    if (saldoTeorico < traido) return 'bg-[#3b82f6] text-black'; // SOBRAN
    return 'bg-[#ef4444] text-black'; // FALTAN (ROBO)
  };

  // Helper para determinar el color de los Envases Vacíos
  const getVacioStyle = (juntados: number, traido: number) => {
    if (juntados === traido) return 'bg-[#22c55e] text-black'; // OK
    if (juntados > traido) return 'bg-[#3b82f6] text-black'; // SOBRAN
    return 'bg-[#ef4444] text-black'; // SE PERDIERON
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="border-3 border-primary max-w-4xl">
        <DialogHeader>
          <DialogTitle className="border-secondary border-b-3 w-fit rounded-xs">
            Resumen del Viaje #{cargaPartida.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tarjetas de Información Cabecera */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Camión Asignado</p>
              <p className="font-semibold">
                {cargaPartida.camion?.patente} - {cargaPartida.camion?.marca}{' '}
                {cargaPartida.camion?.modelo}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Chofer Responsable
              </p>
              <p className="font-semibold">
                {empleado
                  ? `${empleado.nombre} ${empleado.apellido}`
                  : 'Desconocido'}
              </p>
            </div>
          </div>

          {/* Tabla de Resumen de Productos */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">
                    Envases Llevados
                  </TableHead>
                  <TableHead className="text-center">
                    Envases Vendidos
                  </TableHead>
                  <TableHead className="text-center">Envases Traídos</TableHead>
                  <TableHead className="text-center">Vacíos Juntados</TableHead>
                  <TableHead className="text-center">Vacíos Traídos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filasResumen.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No hay productos registrados en este viaje.
                    </TableCell>
                  </TableRow>
                ) : (
                  filasResumen.map((fila) => (
                    <TableRow key={fila.productoId}>
                      <TableCell className="font-medium">
                        {fila.nombre}
                      </TableCell>
                      <TableCell className="text-center">
                        {fila.llevado}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-blue-600">
                        {fila.vendidos}
                      </TableCell>

                      {/* Columna Envases Traídos con lógica condicional */}
                      <TableCell
                        className={`text-center font-bold ${getLlenoStyle(fila.llevado, fila.vendidos, fila.traidoLleno)}`}
                      >
                        {fila.traidoLleno}
                      </TableCell>

                      <TableCell className="text-center font-semibold text-green-600">
                        {fila.vaciosJuntados}
                      </TableCell>

                      {/* Columna Vacíos Traídos con lógica condicional */}
                      <TableCell
                        className={`text-center font-bold ${getVacioStyle(fila.vaciosJuntados, fila.vacioTraido)}`}
                      >
                        {fila.vacioTraido}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cerrar Resumen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};;
