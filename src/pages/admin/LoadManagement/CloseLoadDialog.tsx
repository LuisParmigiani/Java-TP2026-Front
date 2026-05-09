import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/Dialog.tsx';
import { Label } from '../../../components/Label.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/Select.tsx';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../../components/Alert.tsx';
import { Button } from '../../../components/Button.tsx';
import type {
  CamionResponse,
  CargaProductoRequest,
  CargaProductoResponse,
  CargaRequest,
  PersonaResponse,
  ProductoResponse,
} from '../../../services/Interfaces.ts';
import {  Trash2 } from 'lucide-react';
import {   useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/Table.tsx';
// Asumo que tendrás una interfaz para los productos. Añadí 'products' a los props.
interface CloseLoadDialogProps {
  onSave: (data: any) => void; // Idealmente tipar esto luego con la estructura final
  isLoading: boolean;
  showAlert: boolean;
  error: { errorMessage: string; errorTitle: string } | null;
  setShowAlert: (val: boolean) => void;
  truck: CamionResponse;
  employee: PersonaResponse;
  products: ProductoResponse[]; // <-- Añadido para mostrar los productos reales
  cargasProducto?: CargaProductoResponse[]; // <-- Añadido para iterar los productos reales
  isDialogOpen: boolean;
  setIsDialogOpen: (val: boolean) => void;
}

// Interfaz para el estado de las filas dinámicas
interface LineaProducto {
  id: number; // Un ID único temporal para el renderizado
  productoId: string;
  llenos: number;
  vacios: number;
}

export const CloseLoadDialog = ({
  onSave,
  isLoading,
  showAlert,
  error,
  setShowAlert,
  truck,
  employee,
  products,
  cargasProducto , // Default vacío por si no lo pasas aún
  isDialogOpen,
  setIsDialogOpen,
}: CloseLoadDialogProps) => {
  // Estado para manejar las filas de la tabla
  const [tipo, setTipo] = useState('Descarga');
  const [camionId, setCamionId] = useState(truck?.id?.toString() || '');
  const [empleadoId, setEmpleadoId] = useState(employee?.id?.toString() || '');

  // 2. Estado inicial con función Lazy (Borra el useEffect por completo)
  console.log('CargasProducto recibidos en el diálogo:', cargasProducto);
  const [lineas, setLineas] = useState<LineaProducto[]>(() => {
    if (cargasProducto && cargasProducto.length > 0) {
      return cargasProducto.map((cp, index) => ({
        id: index + 1,
        productoId: cp.productoId.toString(),
        llenos: cp.cantLleno, // ← Ahora la tabla arranca con la cantidad exacta que llevó el camión
        vacios: cp.cantVacio,
      }));
    }
    return [];
  });

  const handleRemoveProducto = (idToRemove: number) => {
    setLineas(lineas.filter((linea) => linea.id !== idToRemove));
  };

  const updateLinea = (id: number, field: keyof LineaProducto, value: any) => {
    setLineas(
      lineas.map((linea) =>
        linea.id === id ? { ...linea, [field]: value } : linea,
      ),
    );
  };
  // Función envoltorio para armar el payload antes de guardar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que haya productos
    if (lineas.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    // Mapear lineas a CargaProductoRequest
    const cargaProductos: CargaProductoRequest[] = lineas.map((linea) => ({
      cantLleno: linea.llenos,
      cantVacio: linea.vacios,
      idProducto: parseInt(linea.productoId, 10),
    }));

    // Construir CargaRequest
    const cargaRequest: CargaRequest = {
      tipo: tipo || undefined,
      fechaHora: new Date(), // Hora actual
      idUsuario: empleadoId ? parseInt(empleadoId, 10) : undefined,
      idCamion: camionId ? parseInt(camionId, 10) : undefined,
      cargaProductos,
    };

    console.log('Carga a guardar:', cargaRequest);

    // Enviar al padre
    onSave(cargaRequest);

    // Limpiar formulario
    setTipo('');
    setCamionId('');
    setEmpleadoId('');
    setLineas([]);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="border-3 border-primary max-w-2xl">
        <DialogHeader>
          <DialogTitle className="border-secondary border-b-3 w-fit rounded-xs">
            Cerrar Carga {/* Corregido el título de "Zona" a "Carga" */}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Carga</Label>
              <Select value={tipo} onValueChange={(val) => setTipo(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Descarga"> Llegada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="camionId">Camión Asignado</Label>
              <Select value={camionId} onValueChange={setCamionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un camión" />
                </SelectTrigger>
                <SelectContent>
                  {truck && (
                    <SelectItem value={truck.id.toString()}>
                      {truck.patente} - {truck.marca} {truck.modelo}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="empleadoId">Empleado Responsable</Label>
              <Select value={empleadoId} onValueChange={setEmpleadoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employee && (
                    <SelectItem value={employee.id.toString()}>
                      {employee.nombre} {employee.apellido}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="border rounded-md mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="w-24">Llenos</TableHead>
                  <TableHead className="w-24">Vacíos</TableHead>
                  <TableHead className="w-16">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineas.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-500 py-4"
                    >
                      No hay productos agregados. Haz clic en "Agregar
                      producto".
                    </TableCell>
                  </TableRow>
                )}
                {lineas.map((linea) => (
                  <TableRow key={linea.id}>
                    <TableCell>
                      <Select
                        value={linea.productoId}
                        onValueChange={(val) =>
                          updateLinea(linea.id, 'productoId', val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Mapeo de productos reales, con fallback a hardcodeados para pruebas */}
                          {products.length > 0 ? (
                            products.map(
                              (p) =>
                                p.id === parseInt(linea.productoId) && (
                                  <SelectItem
                                    key={p.id}
                                    value={p.id.toString()}
                                  >
                                    {p.nombre}
                                  </SelectItem>
                                ),
                            )
                          ) : (
                            <SelectItem value="1">Producto 1</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        min="0"
                        value={linea.llenos || ''}
                        onChange={(e) =>
                          updateLinea(
                            linea.id,
                            'llenos',
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full border rounded-md px-2 py-1 text-center"
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        min="0"
                        value={linea.vacios || ''}
                        onChange={(e) =>
                          updateLinea(
                            linea.id,
                            'vacios',
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full border rounded-md px-2 py-1 text-center"
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button" // Previene submit accidental
                        variant="danger"
                        size="icon"
                        onClick={() => handleRemoveProducto(linea.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* <Button
            type="button" // CRÍTICO: Si no es 'button', envía el formulario
            variant="secondary"
            className="w-full"
            onClick={handleAddProducto}
          >
            <Plus className="w-4 h-4 mr-2" /> Agregar producto
          </Button> */}

          <div>
            {showAlert && (
              <Alert
                variant="danger"
                autoClose={true}
                onClose={() => setShowAlert(false)}
              >
                <AlertTitle>{error?.errorTitle}</AlertTitle>
                <AlertDescription>{error?.errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="danger"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
