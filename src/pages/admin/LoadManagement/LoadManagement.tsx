
import NavBar from '../../../components/NavBar.tsx';
import Footer from '../../../components/Footer.tsx';
import { Card, CardContent } from '../../../components/Card.tsx';
import { Helmet } from '../../../components/Helmet.tsx';
import { AddLoadDialog } from './AddLoadDialog.tsx';
import {  fetchProductsActivos } from '../../../services/ProductService.ts';
import { ViewLoadDialog } from './ViewLoadDialog.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/Table.tsx';
import { addCarga, fetchCargas, updateCarga } from '../../../services/LoadService.ts';
import { Button } from '../../../components/Button.tsx';
import { formatErrorResponse } from '../../../lib/utils.ts';
import { Plus, Edit, Info, Link, CheckCheck } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth.ts';
import { useEffect, useState } from 'react';
import { fetchTrucks } from '../../../services/TruckService.ts';
import type { CargaResponse, ErrorResponse,CamionResponse,ProductoResponse, PersonaResponse,UserResponse, CargaRequest} from '../../../services/Interfaces.ts';
import { toast } from 'sonner';
import { fetchEmployees } from '../../../services/EmployeeService.ts';
import { CloseLoadDialog } from './CloseLoadDialog.tsx';
import { EditLoadDialog } from './EditLoadDialog.tsx';
export function LoadManagement() {
  const [cargas, setCargas] = useState<CargaResponse[]>([]);
  const [trucks, setTrucks] = useState<CamionResponse[]>([]);
  const [productos, setProductos] = useState<ProductoResponse[]>([]);
  const [employees, setEmployees] = useState<PersonaResponse[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCloseLoadDialogOpen, setIsCloseLoadDialogOpen] = useState(false);
  const [selectedCarga, setSelectedCarga] = useState<CargaResponse | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [cargaToEdit, setCargaToEdit] = useState<CargaResponse | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewCargaPartida, setViewCargaPartida] =
    useState<CargaResponse | null>(null);
  const [viewCargaLlegada, setViewCargaLlegada] =
    useState<CargaResponse | null>(null);
  const [error, setError] = useState<{
    errorMessage: string;
    errorTitle: string;
  } | null>(null);
  const date = new Date();
  const formatedDate = date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const { token } = useAuth();
  useEffect(() => {
    const load = async () => {
      // EVITA EJECUTAR SI NO HAY TOKEN
      if (!token) return;

      try {
        // Asegúrate de actualizar fetchCargas en tu LoadService para que reciba el token
        const data = await fetchCargas( ['camion', 'usuario','cargasProducto'],token);
        setCargas(data);
      } catch (error) {
        const err = error as ErrorResponse;
        const formatted = formatErrorResponse(err);
        setError(formatted);
        setShowAlert(true);
        toast.error(err.mensaje || 'Error al cargar cargas');
      }

      try {
        const data = await fetchProductsActivos(token);
        setProductos(data);
      } catch (err) {
        const error = err as ErrorResponse;
        setError(formatErrorResponse(error));
        setShowAlert(true);
        toast.error(error.mensaje || 'Error al cargar productos');
      }

      try {
        // Asegúrate de actualizar fetchTrucks en tu TruckService para que reciba el token
        const t = await fetchTrucks(token);
        setTrucks(t);
      } catch (err) {
        const error = err as ErrorResponse;
        setError(formatErrorResponse(error));
        setShowAlert(true);
        toast.error(error.mensaje || 'Error al cargar camiones');
      }

      try {
        const data: UserResponse[] = await fetchEmployees(
          token,
          ['persona'],
          'Empleado',
          'Habilitado',
          'no',
        );
        const personas = data
          .map((user) => user.persona)
          .filter((p): p is PersonaResponse => p !== undefined);
        setEmployees(personas);
      } catch (err) {
        // ... (tu lógica de catch actual)
        const error = err as ErrorResponse;
        setError(formatErrorResponse(error));
        setShowAlert(true);
        toast.error(error.mensaje || 'Error al cargar empleados');

      }
    };

    load();
  }, [token]); // <- MUY IMPORTANTE: agregar el token como dependencia

  const handleOpenCarga = (val: boolean) => {
    setIsDialogOpen(val);
  };

  const handleOpenCloseDialog = (carga: CargaResponse) => {
    setSelectedCarga(carga);
    setIsCloseLoadDialogOpen(true);
  };
  const handleOpenInfo = (carga: CargaResponse) => {
    // carga SIEMPRE será la Partida ("Carga") porque tu tabla dibuja esas filas.
    setViewCargaPartida(carga);

    // Si el viaje terminó, buscamos la Llegada ("Descarga") correspondiente
    if (carga.estado === 'Terminada') {
      const descargaAsociada = cargas
        .filter(
          (c) =>
            c.tipo === 'Descarga' &&
            c.camion?.id === carga.camion?.id &&
            c.usuario?.id === carga.usuario?.id &&
            new Date(c.fechaHora).getTime() >
              new Date(carga.fechaHora).getTime(),
        )
        .sort(
          (a, b) =>
            new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime(),
        )[0];

      setViewCargaLlegada(descargaAsociada || null);
    } else {
      setViewCargaLlegada(null); // Está en curso, no hay llegada aún
    }

    setIsViewOpen(true);
  };

  const { currentUser, isAuthenticated } = useAuth();

  if (
    !isAuthenticated ||
    !currentUser ||
    currentUser.role !== 'Administrador'
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
  const cargasConEstado: CargaResponse[] = [];
  const gruposPorViaje = new Map<string, CargaResponse[]>();

  // 1. Agrupar por Camión y Chofer
  cargas.forEach((evento) => {
    const clave = `${evento.camion.id}-${evento.usuario.id}`;
    if (!gruposPorViaje.has(clave)) {
      gruposPorViaje.set(clave, []);
    }
    gruposPorViaje.get(clave)!.push(evento);
  });

  // 2. Procesar cada grupo
  gruposPorViaje.forEach((eventosDelGrupo) => {
    // ¡NUEVO!: Ordenamiento obligatorio por hora.
    // Asumimos que 'fecha' es un string ISO (ej: "2026-05-09T14:30:00") o compatible con Date.
    eventosDelGrupo.sort((a, b) => {
      return new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime();
    });

    let cargaActiva: CargaResponse | null = null;

    // 3. Lógica de máquina de estados (ahora garantizada en orden cronológico)
    eventosDelGrupo.forEach((evento) => {
      if (evento.tipo === 'Carga') {
        if (cargaActiva) {
          // El camión volvió a cargar sin registrar la descarga anterior
          cargaActiva.estado = 'En curso';
          cargasConEstado.push({ ...cargaActiva });
        }
        cargaActiva = { ...evento };
      } else if (evento.tipo === 'Descarga') {
        if (cargaActiva) {
          // Se completó el ciclo carga -> descarga
          cargaActiva.estado = 'Terminada';
          cargasConEstado.push({ ...cargaActiva });
          cargaActiva = null;
        }
      }
    });

    if (cargaActiva) {
      cargaActiva.estado = 'En curso';
      cargasConEstado.push({ ...cargaActiva });
    }
  });
  console.log('Cargas procesadas con estado:', cargasConEstado);

  // Filtrar camiones que están en cargas "En curso"
  const truckIdsEnCurso = cargasConEstado
    .filter((carga) => carga.estado === 'En curso')
    .map((carga) => carga.camion.id);

  const availableTrucks = trucks.filter(
    (truck) => !truckIdsEnCurso.includes(truck.id),
  );

  //Filtrar empleados que están en cargas en curso
  const employeeIdsEnCurso = cargasConEstado
    .filter((carga) => carga.estado === 'En curso')
    .map((carga) => carga.usuario.id);

  const availableEmployees = employees.filter(
    (employee) => !employeeIdsEnCurso.includes(employee.id),
  );

  const handleOpenEdit = (carga: CargaResponse) => {
    // Si el viaje ya terminó, queremos editar el evento de "Descarga" (la llegada)
    if (carga.estado === 'Terminada') {
      // Buscamos la descarga correspondiente:
      // Mismo tipo, camión, chofer, y que haya ocurrido DESPUÉS de esta carga
      const descargaAsociada = cargas
        .filter(
          (c) =>
            c.tipo === 'Descarga' &&
            c.camion?.id === carga.camion?.id &&
            c.usuario?.id === carga.usuario?.id &&
            new Date(c.fechaHora).getTime() >
              new Date(carga.fechaHora).getTime(),
        )
        // Las ordenamos cronológicamente y tomamos la primera que encontremos
        .sort(
          (a, b) =>
            new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime(),
        )[0];

      if (descargaAsociada) {
        // Mandamos a editar la Descarga y cortamos la ejecución
        setCargaToEdit(descargaAsociada);
        setIsEditOpen(true);
        return;
      }
    }

    // Si está "En curso" o por alguna razón no se encontró la descarga, editamos la Carga original
    setCargaToEdit(carga);
    setIsEditOpen(true);
  };;
  const handleUpdateCarga = async (id: number, data: CargaRequest) => {
    try {
      // Suponiendo que tienes esta función en LoadService
      await updateCarga(id, data,['cargasProducto'], token);
      toast.success('Carga actualizada');
      // Refrescar lista
      const updated = await fetchCargas(
        ['camion', 'usuario', 'cargasProducto'],
        token,
      );
      setCargas(updated);
      setIsEditOpen(false);
    } catch (err) {
      const formattedError = formatErrorResponse(err as ErrorResponse);
      setError(formattedError);
      setShowAlert(true);
      toast.error(
        (err as ErrorResponse).mensaje || 'Error al agregar la carga',
      );
    }
  };
  // Agregar esta función fuera del return, antes del JSX
  const handleSaveCarga = async (data) => {
    console.log('Datos a guardar:', data);
    try {
      // Asegúrate de actualizar addCarga en LoadService para recibir el token
      const carga = await addCarga(data,['cargasProducto'], token);
      console.log('Carga agregada:', carga);
      toast.success('Carga agregada exitosamente');

      // Asegúrate de actualizar fetchCargas para recibir el token
      const updatedCargas = await fetchCargas(['camion', 'usuario', 'cargasProducto'], token);
      setCargas(updatedCargas);
      setIsDialogOpen(false);
      setIsCloseLoadDialogOpen(false);
    } catch (err) {
      const formattedError = formatErrorResponse(err as ErrorResponse);
      setError(formattedError);
      setShowAlert(true);
      toast.error(
        (err as ErrorResponse).mensaje || 'Error al agregar la carga',
      );
    }
  };

  // Luego en el JSX del AddLoadDialog:
  <AddLoadDialog
    onSave={handleSaveCarga} // ← Pasar la función directamente
    isLoading={false}
    showAlert={showAlert}
    error={error}
    setShowAlert={setShowAlert}
    products={productos}
    employees={employees}
    trucks={availableTrucks}
    isDialogOpen={isDialogOpen}
    setIsDialogOpen={setIsDialogOpen}
  />;
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Gestión de Cargas - Sodas Rojas</title>
      </Helmet>
      <NavBar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Cargas {formatedDate}
            </h1>
            <Button
              variant="primary"
              onClick={() => {
                handleOpenCarga(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Agregar Carga
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Camion</TableHead>
                    <TableHead>Chofer</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right pr-5">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cargasConEstado.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No hay cargas el día de hoy
                      </TableCell>
                    </TableRow>
                  ) : (
                    cargasConEstado.map((carga) => (
                      <TableRow key={carga.id}>
                        <TableCell>{carga.id}</TableCell>
                        <TableCell>{carga.camion?.patente || 'N/A'}</TableCell>
                        <TableCell>
                          {employees.find((e) => e.id === carga.usuario.id)
                            ?.nombre +
                            ' ' +
                            employees.find((e) => e.id === carga.usuario.id)
                              ?.apellido || 'N/A'}
                        </TableCell>
                        <TableCell>{carga.estado}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            className="mr-1"
                            variant="secondary" // O el color que prefieras
                            size="icon"
                            onClick={() => handleOpenInfo(carga)}
                          >
                            <Info className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="primary"
                            size="icon"
                            className="mr-1"
                            disabled={carga.estado === 'Terminada'}
                            onClick={() => handleOpenCloseDialog(carga)}
                          >
                            <CheckCheck className="w-4 h-4" />
                          </Button>
                          <Button
                            className="mr-1"
                            variant="accent"
                            size="icon"
                            onClick={() => handleOpenEdit(carga)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      {isDialogOpen && (
        <AddLoadDialog
          onSave={handleSaveCarga}
          isLoading={false} // Cambiar a true si se implementa la lógica de guardado
          showAlert={showAlert}
          error={error}
          setShowAlert={setShowAlert}
          products={productos}
          employees={availableEmployees}
          trucks={availableTrucks}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}
      {isCloseLoadDialogOpen && selectedCarga && (
        <CloseLoadDialog
          onSave={handleSaveCarga}
          isLoading={false}
          showAlert={showAlert}
          error={error}
          setShowAlert={setShowAlert}
          products={productos}
          cargasProducto={selectedCarga.cargasProducto || []} // Asegúrate de que cargasProducto esté disponible en la carga seleccionada
          employee={
            // Buscamos el empleado que coincida con el usuario de la carga
            employees.find(
              (e) =>
                e.id === selectedCarga.usuario.id ||
                e.id === selectedCarga.usuario.personaId,
            )!
          }
          truck={selectedCarga.camion}
          isDialogOpen={isCloseLoadDialogOpen}
          setIsDialogOpen={(val) => {
            setIsCloseLoadDialogOpen(val);
            if (!val) setSelectedCarga(null); // Limpiamos la carga al cerrar
          }}
        />
      )}
      {isEditOpen && cargaToEdit && (
        <EditLoadDialog
          initialData={cargaToEdit}
          onSave={handleUpdateCarga}
          isLoading={false}
          showAlert={showAlert}
          error={error}
          setShowAlert={setShowAlert}
          trucks={availableTrucks}
          employees={availableEmployees}
          selectedEmployee={employees.find(
            (e) =>
              e.id === cargaToEdit.usuario.id ||
              e.id === cargaToEdit.usuario.personaId,
          )!}
          selectedTruck={cargaToEdit.camion}
          products={productos}
          isDialogOpen={isEditOpen}
          setIsDialogOpen={setIsEditOpen}
        />
      )}
      {isViewOpen && viewCargaPartida && (
        <ViewLoadDialog
          cargaPartida={viewCargaPartida}
          cargaLlegada={viewCargaLlegada}
          empleado={employees.find(
            (e) =>
              e.id === viewCargaPartida.usuario.id ||
              e.id === viewCargaPartida.usuario.personaId,
          )}
          products={productos}
          isDialogOpen={isViewOpen}
          setIsDialogOpen={setIsViewOpen}
        />
      )}

      <Footer />
    </div>
  );
}
