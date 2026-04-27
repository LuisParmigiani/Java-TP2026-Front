import { useState, useEffect } from 'react';
import { Helmet } from '../../components/Helmet.tsx';
import NavBar from '../../components/NavBar.tsx';
import Footer from '../../components/Footer.tsx';
import { Card, CardContent  } from '../../components/Card.tsx';
import { Button } from '../../components/Button.tsx';
import Input from '../../components/Input.tsx';
import { Label } from '../../components/Label.tsx';
import type { ErrorResponse } from '../../services/Interfaces.ts';
import { formatErrorResponse } from '../../lib/utils.ts';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/Select.tsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/Dialog.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/Table.tsx';
import { Badge } from '../../components/Badge.tsx';
import { Plus, Edit, Trash2, Route } from 'lucide-react';
import { toast } from 'sonner';
import { addTruck, disableTruck, fetchTrucks, updateTruck } from '../../services/TruckService.ts';
import type { CamionResponse } from '../../services/Interfaces.ts';
import { Alert, AlertTitle, AlertDescription } from '../../components/Alert.tsx';

const TrucksManagement = () => {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState<CamionResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<CamionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<{errorTitle: string, errorMessage: string} | null>(null);

  useEffect(() => {
    fetchTrucks()
      .then(data => setTrucks(data))
      .catch(error => console.error('Failed to fetch products:', error));
  }, []);
  const [formData, setFormData] = useState({
    modelo: '',
    patente: '',
    kilometraje: '',
    estado: '1',
    marca: ''
  });
  const rutaDeReparto = (truckId: number) => {
    // Aquí puedes implementar la lógica para redirigir a la página de rutas de reparto del camión
    // Por ejemplo, podrías usar React Router para navegar a una ruta específica:
    navigate(`/admin/trucks/routes/${truckId}`);

  }
  const handleOpenDialog = (truck: CamionResponse | null = null) => {
    if (truck) {
      setEditingTruck(truck);
      setFormData({
        modelo: truck.modelo,
        patente: truck.patente,
        kilometraje: truck.kilometraje.toString(),
        estado: truck.estado ? '1' : '0',
        marca: truck.marca
      });
    } else {
      setEditingTruck(null);
      setFormData({
        modelo: '',
        patente: '',
        kilometraje: '',
        estado: '1',
        marca: ''
      });
    }
    setIsDialogOpen(true);
  };
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.modelo || !formData.marca || !formData.patente || !formData.kilometraje) {
      toast.error('Por favor completa todos los campos requeridos.');
      return;
    }
    if (Number(formData.kilometraje) < 0) {
      toast.error('El kilometraje debe ser un valor válido.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Crear/actualizar camion
      const truckData = {
        modelo: formData.modelo,
        patente: formData.patente,
        kilometraje: Number(formData.kilometraje),
        estado: formData.estado === '1' ,
        marca: formData.marca
      };
      if (editingTruck) {
        console.log("updateando camion")
         await updateTruck(editingTruck.id, truckData);
        toast.success('Truck actualizado correctamente.');
      } else {
        console.log("guardando camion")
        await addTruck(truckData);
        toast.success('Truck agregado correctamente.');
      } 

      const updatedTrucks = await fetchTrucks();
      setTrucks(updatedTrucks);
      setIsDialogOpen(false);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      const formattedError = formatErrorResponse(errorResponse);
      setError(formattedError);
      setShowAlert(true);
      toast.error(errorResponse.mensaje )
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este camion?')) {
      disableTruck(id)
        .then(() => {
          setTrucks((prev) => prev.filter((truck) => truck.id !== id));
        })
        .catch((error) => {
          console.error('Error deshabilitando camion:', error);
          toast.error('Ocurrió un error al eliminar el camion.');
      });
      toast.success('Truck dado de baja.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Gestión de Camiones - Sodas Rojas</title>
      </Helmet>
      <NavBar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestion de Camiones
            </h1>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Camion
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Patente</TableHead>
                    <TableHead>Kilometraje</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right pr-5">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trucks.map((truck) => (
                    <TableRow key={truck.id}>
                      <TableCell className="font-medium">{truck.id}</TableCell>
                      <TableCell>{truck.marca}</TableCell>
                      <TableCell>{truck.modelo}</TableCell>
                      <TableCell>{truck.patente}</TableCell>
                      <TableCell>{truck.kilometraje}</TableCell>
                      <TableCell>
                        <Badge variant={truck.estado ? 'default' : 'secondary'}>
                          {truck.estado ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="secondary" size="icon" className="mr-1" onClick={() => rutaDeReparto(truck.id)}>
                          <Route className='w-4 h-4' />
                        </Button>
                        <Button
                          className="mr-1"
                          variant="accent"
                          size="icon"
                          onClick={() => handleOpenDialog(truck)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(truck.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {trucks.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No hay camiones registrados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-3 border-primary">
          <DialogHeader>
            <DialogTitle className="border-secondary border-b-3 w-fit rounded-xs">
              {editingTruck ? 'Editar Camión' : 'Agregar Camión'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modelo">Marca</Label>
              <Input
                color="primary"
                name="modelo"
                type="text"
                value={formData.marca}
                onChange={(value) =>
                  setFormData({ ...formData, marca: value as string })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detalle">Modelo</Label>
              <Input
                color="primary"
                name="detalle"
                type="text"
                value={formData.modelo}
                onChange={(value) =>
                  setFormData({ ...formData, modelo: value as string })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detalle">Patente</Label>
              <Input
                color="primary"
                name="detalle"
                type="text"
                value={formData.patente}
                onChange={(value) =>
                  setFormData({ ...formData, patente: value as string })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio">Kilometraje ($)</Label>
              <Input
                name="precio"
                type="number"
                value={formData.kilometraje}
                onChange={(value) =>
                  setFormData({ ...formData, kilometraje: value as string })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activo">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(val) =>
                  setFormData({ ...formData, estado: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Activo</SelectItem>
                  <SelectItem value="0">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
      <Footer />
    </div>
  );
};

export default TrucksManagement;
