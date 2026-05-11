import { useState, useEffect } from 'react';
import { Helmet } from '../../../components/Helmet.tsx';
import NavBar from '../../../components/NavBar.tsx';
import Footer from '../../../components/Footer.tsx';
import { Card, CardContent } from '../../../components/Card.tsx';
import { Button } from '../../../components/Button.tsx';
import Input from '../../../components/Input.tsx';
import { Label } from '../../../components/Label.tsx';
import type { ErrorResponse,CamionResponse,DiaZonaRequest } from '../../../services/Interfaces.ts';
import { formatErrorResponse } from '../../../lib/utils.ts';
import { useAuth } from '../../../hooks/useAuth.ts';
import { zoneSchema, type ZoneFormData } from './zoneSchema';
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
import { Plus, Edit, Trash2, Link ,Loader2} from 'lucide-react';
import { toast } from 'sonner';
import type { ZonaResponse } from '../../../services/Interfaces.ts';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '../../../components/Alert.tsx';
import { fetchZones,addZone,updateZone,deleteZone} from '../../../services/ZoneService.ts';
import { fetchTrucks } from '../../../services/TruckService.ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/Select.tsx';

const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const ZoneManagement = () => {
  const {token, loading} = useAuth();
  const [zones, setZones] = useState<ZonaResponse[]>([]);
  const [trucks, setTrucks] = useState<CamionResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ZonaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<{
    errorTitle: string;
    errorMessage: string;
  } | null>(null);

useEffect(() => {
  if (loading) return; // Esperar a que se resuelva el estado de autenticación
  const load = async () => {
    try {
      const data = await fetchZones(token,['camion', 'diasZona']);
      setZones(data);
    } catch (error) {
      const err = error as ErrorResponse;
      const formatted = formatErrorResponse(err);
      setError(formatted);
      setShowAlert(true);
      toast.error(err.mensaje);
    }

    try {
      const t = await fetchTrucks(token);
      setTrucks(t);
    } catch (error) {
      const err = error as ErrorResponse;
      const formatted = formatErrorResponse(err);
      setError(formatted);
      setShowAlert(true);
      toast.error(err.mensaje);
    }
  };

  load();
}, [token, loading]);
  const [formData, setFormData] = useState({
    nombre: '',
    detalle: '',
    camionId: 0,
    diasZona: [] as DiaZonaRequest[]
  });
  console.log("zonas",zones);
const handleDayToggle = (diaId: number) => {
  setFormData((current) => {
    const isDaySelected = current.diasZona?.some((dia) => dia.diaId === diaId);

    if (isDaySelected) {
      // Eliminar el día si ya está seleccionado
      return {
        ...current,
        diasZona: current.diasZona?.filter((dia) => dia.diaId !== diaId) || [],
      };
    } else {
      // Agregar el día si no está seleccionado
      const newDay = {
        diaId,
        zonaId: editingZone?.id || 0,
      } as DiaZonaRequest;

      return {
        ...current,
        diasZona: [...(current.diasZona || []), newDay],
      };
    }
  });
};
  const handleOpenDialog = (zone: ZonaResponse | null = null) => {
    setFieldErrors({});
    setError(null);
    setShowAlert(false);
    if (zone) {
      setEditingZone(zone);
      setFormData({
        nombre: zone.nombre,
        detalle: zone.detalle,
        camionId: zone.camion?.id || 0,
        diasZona: zone.diasZona || []
      });
    } else {
      setEditingZone(null);
      setFormData({
        nombre: '',
        detalle: '',
        camionId: 0,
        diasZona: [] as DiaZonaRequest[]
      });
    }
    setIsDialogOpen(true);
  };

const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Construir payload simple para validar (dias como array de diaId)
  const payload: ZoneFormData = {
    nombre: formData.nombre,
    detalle: formData.detalle,
    camionId: formData.camionId ,
    dias: formData.diasZona?.map((d) => d.diaId) || [],
  };

  const result = zoneSchema.safeParse(payload);
  if (!result.success) {
    const issues = result.error.issues;
    const errors: Record<string, string> = {};
    for (const issue of issues) {
      const key = issue.path[0] ? String(issue.path[0]) : '_form';
      errors[key] = (errors[key] ? errors[key] + '. ' : '') + issue.message;
    }
    setFieldErrors(errors);

    // Poblamos el estado general para la Alerta
    setError({
      errorTitle: 'Formulario incompleto',
      errorMessage: 'Por favor, revisa y corrige los campos marcados en rojo.',
    });
    setShowAlert(true);
    return;
  }

  setFieldErrors({});
  setError(null);
  setShowAlert(false);
  setIsLoading(true);

  try {
    const zoneData = {
      nombre: formData.nombre,
      detalle: formData.detalle,
      camionId: formData.camionId ,
      diasZona: formData.diasZona,
    };

    if (editingZone) {
      console.log('Actualizando zona:', zoneData);
      await updateZone(editingZone.id, zoneData, token);
      toast.success('Zona actualizada correctamente.');
    } else {
      console.log('Guardando zona');
      await addZone(zoneData,token);
      toast.success('Zona agregada correctamente.');
    }

    const updatedZones = await fetchZones(token,['camion', 'diasZona']);
    setZones(updatedZones);
    setIsDialogOpen(false);
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    const formattedError = formatErrorResponse(errorResponse);
    setError(formattedError);
    setShowAlert(true);
    toast.error(errorResponse.mensaje || 'Ocurrió un error al guardar la zona');
  } finally {
    setIsLoading(false);
  }
};

const handleDelete = (id: number) => {
  if (
    window.confirm(
      '¿Estás seguro de eliminar esta zona?. Esta acción no se puede deshacer',
    )
  ) {
    deleteZone(id, token)
      .then(() => {
        setZones((prev) => prev.filter((zone) => zone.id !== id));
        toast.success('Zona eliminada correctamente');
      })
      .catch((error) => {
        const err = error as ErrorResponse;
        const formatted = formatErrorResponse(err);
        setError(formatted);
        setShowAlert(true);
        toast.error(err.mensaje);
      });
  }
};

  const { currentUser, isAuthenticated } = useAuth();
  if (!isAuthenticated || !currentUser || currentUser.role !== 'Administrador') {
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
        <title>Gestión de Zonas - Sodas Rojas</title>
      </Helmet>
      <NavBar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Zonas
            </h1>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Zona
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>Camión Asignado</TableHead>
                    <TableHead className="text-right pr-5">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell>{zone.id}</TableCell>
                      <TableCell>{zone.nombre}</TableCell>
                      <TableCell>{zone.detalle}</TableCell>
                      <TableCell>
                        {zone.camion
                          ? `${zone.camion.patente} - ${zone.camion.marca} ${zone.camion.modelo}`
                          : 'Sin camión asignado'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          className="mr-1"
                          variant="accent"
                          size="icon"
                          onClick={() => handleOpenDialog(zone)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(zone.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {zones.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No hay zonas registradas.
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
              {editingZone ? 'Editar Zona' : 'Agregar Zona'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                color="primary"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={(value) =>
                  setFormData({ ...formData, nombre: value as string })
                }
              />
              {fieldErrors.nombre && (
                <span className="text-xs text-red-500">
                  {fieldErrors.nombre}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="detalle">Detalle</Label>
              <Input
                color="primary"
                name="detalle"
                type="text"
                value={formData.detalle}
                onChange={(value) =>
                  setFormData({ ...formData, detalle: value as string })
                }
              />
              {fieldErrors.detalle && (
                <span className="text-xs text-red-500">
                  {fieldErrors.detalle}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="camionId">Camión Asignado</Label>
              <Select
                value={formData.camionId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, camionId: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un camión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sin camión asignado</SelectItem>
                  {trucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id.toString()}>
                      {truck.patente} - {truck.marca} {truck.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.camionId && (
                <span className="text-xs text-red-500">
                  {fieldErrors.camionId}
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-gray-600">
                  Días de entrega
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {dayLabels.map((label, index) => {
                  const diaId = index + 1;
                  const isSelected = formData.diasZona?.some(
                    (dia) => dia.diaId === diaId,
                  );
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDayToggle(diaId)}
                      className={`rounded-full px-3 py-2 text-center text-sm font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-sm hover:bg-red-300 hover:text-gray-700'
                          : 'bg-gray-300 text-gray-500 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {fieldErrors.dias && (
                <span className="text-xs text-red-500">{fieldErrors.dias}</span>
              )}
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

              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    {/* Usamos el ícono de Lucide con la clase de animación de Tailwind */}
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

export default ZoneManagement;
