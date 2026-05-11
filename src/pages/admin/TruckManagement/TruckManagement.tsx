import { useState, useEffect } from "react";
import { Helmet } from "../../../components/Helmet.tsx";
import NavBar from "../../../components/NavBar.tsx";
import Footer from "../../../components/Footer.tsx";
import { Card, CardContent } from "../../../components/Card.tsx";
import { Button } from "../../../components/Button.tsx";
import Input from "../../../components/Input.tsx";
import { Label } from "../../../components/Label.tsx";
import type { ErrorResponse } from "../../../services/Interfaces.ts";
import { formatErrorResponse } from "../../../lib/utils.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/Dialog.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/Table.tsx';
import { Badge } from '../../../components/Badge.tsx';
import { Plus, Edit, Trash2, Route, Link ,Loader2} from 'lucide-react';
import { toast } from 'sonner';
import { addTruck, disableTruck, fetchTrucks, updateTruck } from '../../../services/TruckService.ts';
import type { CamionResponse } from '../../../services/Interfaces.ts';
import { Alert, AlertTitle, AlertDescription } from '../../../components/Alert.tsx';
import { truckSchema, type TruckFormData } from './truckSchema';

const TrucksManagement = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState<CamionResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<CamionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<{
    errorTitle: string;
    errorMessage: string;
  } | null>(null);

  useEffect(() => {
    fetchTrucks(token)
      .then((data) => setTrucks(data))
      .catch((error) => console.error("Failed to fetch trucks:", error));
  }, [token]);
  const [formData, setFormData] = useState({
    modelo: "",
    patente: "",
    kilometraje: "",
    estado: "1",
    marca: "",
  });
  const rutaDeReparto = (truckId: number) => {
    navigate(`/admin/trucks/routes/${truckId}`);
  };
  const handleOpenDialog = (truck: CamionResponse | null = null) => {
    setFieldErrors({});
    setError(null);
    setShowAlert(false);
    if (truck) {
      setEditingTruck(truck);
      setFormData({
        modelo: truck.modelo,
        patente: truck.patente,
        kilometraje: truck.kilometraje.toString(),
        estado: truck.estado ? "1" : "0",
        marca: truck.marca,
      });
    } else {
      setEditingTruck(null);
      setFormData({
        modelo: "",
        patente: "",
        kilometraje: "",
        estado: "1",
        marca: "",
      });
    }
    setIsDialogOpen(true);
  };
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 1. Preparamos el payload para validar con Zod
    const payload: TruckFormData = {
      marca: formData.marca,
      modelo: formData.modelo,
      patente: formData.patente,
      kilometraje: formData.kilometraje as any, // Zod usa preprocess para pasarlo a número
      estado: formData.estado,
    };

    // 2. Ejecutamos la validación
    const result = truckSchema.safeParse(payload);

    if (!result.success) {
      const issues = result.error.issues;
      const errors: Record<string, string> = {};
      for (const issue of issues) {
        const key = issue.path[0] ? String(issue.path[0]) : '_form';
        errors[key] = (errors[key] ? errors[key] + '. ' : '') + issue.message;
      }
      setFieldErrors(errors);

      // Mostrar alerta general
      setError({
        errorTitle: 'Formulario incompleto',
        errorMessage:
          'Por favor, revisa y corrige los campos marcados en rojo.',
      });
      setShowAlert(true);
      return;
    }

    // 3. Si pasa la validación, limpiamos errores e iniciamos el loader
    setFieldErrors({});
    setError(null);
    setShowAlert(false);
    setIsLoading(true);

    try {
      const truckData = {
        modelo: formData.modelo,
        patente: formData.patente,
        kilometraje: Number(formData.kilometraje),
        estado: formData.estado === '1',
        marca: formData.marca,
      };

      if (editingTruck) {
        console.log('updateando camion');
        await updateTruck(editingTruck.id, truckData, token);
        toast.success('Camión actualizado correctamente.');
      } else {
        console.log('guardando camion');
        await addTruck(truckData, token);
        toast.success('Camión agregado correctamente.');
      }

      const updatedTrucks = await fetchTrucks(token);
      setTrucks(updatedTrucks);
      setIsDialogOpen(false);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      const formattedError = formatErrorResponse(errorResponse);
      setError(formattedError);
      setShowAlert(true);
      toast.error(errorResponse.mensaje || 'Ocurrió un error al guardar');
    } finally {
      setIsLoading(false);
    }
  };;

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este camion?")) {
      disableTruck(id, token)
        .then(() => {
          setTrucks((prev) => prev.filter((truck) => truck.id !== id));
          toast.success("Truck dado de baja.");
        })
        .catch((error) => {
          console.error("Error deshabilitando camion:", error);
          toast.error("Ocurrió un error al eliminar el camion.");
        });
    }
  };
  const { currentUser, isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (
    !isAuthenticated ||
    !currentUser ||
    currentUser.role !== "Administrador"
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Helmet>
          <title>Acceso Denegado - Sodas Rojas</title>
          <meta
            name="description"
            content="Acceso denegado al panel de administración"
          />
        </Helmet>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-lg mb-6">
            No tienes permiso para acceder a esta página.
          </p>
          <Link
            to="/"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }
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
                        <Button
                          variant="secondary"
                          size="icon"
                          className="mr-1"
                          onClick={() => rutaDeReparto(truck.id)}
                        >
                          <Route className="w-4 h-4" />
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
              <Label htmlFor="marca">Marca</Label>
              <Input
                color="primary"
                name="marca"
                type="text"
                value={formData.marca}
                onChange={(value) =>
                  setFormData({ ...formData, marca: value as string })
                }
              />
              {fieldErrors.marca && (
                <span className="text-xs text-red-500">
                  {fieldErrors.marca}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                color="primary"
                name="modelo"
                type="text"
                value={formData.modelo}
                onChange={(value) =>
                  setFormData({ ...formData, modelo: value as string })
                }
              />
              {fieldErrors.modelo && (
                <span className="text-xs text-red-500">
                  {fieldErrors.modelo}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="patente">Patente</Label>
              <Input
                color="primary"
                name="patente"
                type="text"
                value={formData.patente}
                onChange={(value) =>
                  setFormData({ ...formData, patente: value as string })
                }
              />
              {fieldErrors.patente && (
                <span className="text-xs text-red-500">
                  {fieldErrors.patente}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kilometraje">Kilometraje (km)</Label>
              <Input
                name="kilometraje"
                type="number"
                value={formData.kilometraje}
                onChange={(value) =>
                  setFormData({ ...formData, kilometraje: value as string })
                }
              />
              {fieldErrors.kilometraje && (
                <span className="text-xs text-red-500">
                  {fieldErrors.kilometraje}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
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
              {fieldErrors.estado && (
                <span className="text-xs text-red-500">
                  {fieldErrors.estado}
                </span>
              )}
            </div>

            <div>
              {showAlert && (
                <Alert
                  variant="danger"
                  autoClose={true}
                  onClose={() => {
                    setShowAlert(false);
                    setError(null);
                  }}
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
                disabled={isLoading}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Guardando...
                  </span>
                ) : (
                  'Guardar'
                )}
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
