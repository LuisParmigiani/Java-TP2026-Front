import { useState } from 'react';
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
import { Trash2, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/Table.tsx';
import type {
  CargaResponse,
  CamionResponse,
  PersonaResponse,
  ProductoResponse,
  CargaRequest,
  CargaProductoRequest,
} from '../../../services/Interfaces.ts';

interface EditLoadDialogProps {
  initialData: CargaResponse; // La carga que vamos a editar
  onSave: (id: number, data: CargaRequest) => void;
  isLoading: boolean;
  showAlert: boolean;
  error: { errorMessage: string; errorTitle: string } | null;
  setShowAlert: (val: boolean) => void;
  trucks: CamionResponse[];
  employees: PersonaResponse[];
  products: ProductoResponse[];
  isDialogOpen: boolean;
  setIsDialogOpen: (val: boolean) => void;
}

interface LineaProducto {
  id: number;
  productoId: string;
  llenos: number;
  vacios: number;
  originalLlenos: number; // llenos al momento de abrir el diálogo
}

export const EditLoadDialog = ({
  initialData,
  onSave,
  isLoading,
  showAlert,
  error,
  setShowAlert,
  trucks,
  employees,
  products,
  isDialogOpen,
  setIsDialogOpen,
}: EditLoadDialogProps) => {
  // --- ESTADOS INICIALIZADOS CON LA DATA EXISTENTE ---
  const [tipo, setTipo] = useState(initialData.tipo);
  const [camionId, setCamionId] = useState(
    initialData.camion?.id.toString() || '',
  );
  const [empleadoId, setEmpleadoId] = useState(
    initialData.usuario?.id.toString() || '',
  );

  // Mapeamos los productos que ya tenía la carga al estado de líneas dinámicas
  const [lineas, setLineas] = useState<LineaProducto[]>(() => {
    if (initialData.cargasProducto && initialData.cargasProducto.length > 0) {
      return initialData.cargasProducto.map((cp, index) => ({
        id: index + 1,
        productoId: (cp.productoId ?? cp.producto?.id)?.toString() ?? '',
        llenos: cp.cantLleno,
        vacios: cp.cantVacio,
        originalLlenos: cp.cantLleno,
      }));
    }
    return [];
  });

  // --- ACCIONES DE LA TABLA ---
  const handleAddProducto = () => {
    setLineas([
      ...lineas,
      { id: Date.now(), productoId: '', llenos: 0, vacios: 0, originalLlenos: 0 },
    ]);
  };

  const handleRemoveProducto = (idToRemove: number) => {
    setLineas(lineas.filter((linea) => linea.id !== idToRemove));
  };

  const updateLinea = (id: number, field: keyof LineaProducto, value) => {
    setLineas(
      lineas.map((linea) =>
        linea.id === id ? { ...linea, [field]: value } : linea,
      ),
    );
  };

  // --- ENVÍO DE DATOS ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (lineas.length === 0) {
      alert('Debe haber al menos un producto en la carga');
      return;
    }

    const cargaProductos: CargaProductoRequest[] = lineas.map((linea) => ({
      cantLleno: linea.llenos,
      cantVacio: linea.vacios,
      idProducto: parseInt(linea.productoId, 10),
    }));

    const updateRequest: CargaRequest = {
      tipo,
      fechaHora: initialData.fechaHora, // Mantenemos la fecha original
      idUsuario: parseInt(empleadoId, 10),
      idCamion: parseInt(camionId, 10),
      cargaProductos,
    };

    onSave(initialData.id, updateRequest);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="border-3 border-primary max-w-2xl">
        <DialogHeader>
          <DialogTitle className="border-secondary border-b-3 w-fit rounded-xs">
            Editar Carga #{initialData.id}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Movimiento</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Carga">Partida</SelectItem>
                  <SelectItem value="Descarga">Llegada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Camión</Label>
              <Select value={camionId} onValueChange={setCamionId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {trucks.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.patente}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Responsable</Label>
              <Select value={empleadoId} onValueChange={setEmpleadoId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id.toString()}>
                      {e.nombre} {e.apellido}
                    </SelectItem>
                  ))}
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
                  <TableHead className="w-16">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineas.map((linea) => {
                  const selectedProduct = products.find(p => p.id.toString() === linea.productoId);
                  const isPartida = tipo === 'Carga';
                  const maxLlenos = isPartida && selectedProduct
                    ? linea.originalLlenos + selectedProduct.stock
                    : undefined;
                  return (
                    <TableRow key={linea.id}>
                      <TableCell>
                        <Select
                          value={linea.productoId}
                          onValueChange={(val) => {
                            const newProduct = products.find(p => p.id.toString() === val);
                            const newMax = isPartida && newProduct ? linea.originalLlenos + newProduct.stock : undefined;
                            const clampedLlenos = newMax !== undefined && linea.llenos > newMax ? newMax : linea.llenos;
                            setLineas(prev => prev.map(l =>
                              l.id === linea.id ? { ...l, productoId: val, llenos: clampedLlenos } : l
                            ));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Producto..." />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id.toString()}>
                                {p.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min="0"
                          max={maxLlenos}
                          value={linea.llenos}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const clamped = maxLlenos !== undefined ? Math.min(val, maxLlenos) : val;
                            updateLinea(linea.id, 'llenos', clamped);
                          }}
                          className="w-full border rounded-md px-2 py-1 text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min="0"
                          value={linea.vacios}
                          onChange={(e) =>
                            updateLinea(
                              linea.id,
                              'vacios',
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-full border rounded-md px-2 py-1 text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="danger"
                          size="icon"
                          onClick={() => handleRemoveProducto(linea.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {lineas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No hay productos agregados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleAddProducto}
          >
            <Plus className="w-4 h-4 mr-2" /> Agregar otro producto
          </Button>

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

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="danger"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Actualizando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
