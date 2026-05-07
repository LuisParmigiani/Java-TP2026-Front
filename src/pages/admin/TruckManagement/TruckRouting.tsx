import { Helmet } from "../../../components/Helmet.tsx"
import NavBar from "../../../components/NavBar.tsx"
import Footer from "../../../components/Footer.tsx"
import { Link, useParams } from "react-router-dom";
import { fetchTruckById, getDiaZonasByTruckAndDay, updateDiaZonaWithOrdenes } from "../../../services/TruckService.ts";
import { useEffect, useState } from "react";
import { formatErrorResponse } from "../../../lib/utils.ts";
import type { CamionResponse, ErrorResponse } from "../../../services/Interfaces.ts";
import { Card, CardContent } from "../../../components/Card.tsx";
import DraggableTable, { type Domicilio } from "../../../components/DraggableTable.tsx";
import { Button } from "../../../components/Button.tsx";
import { Alert, AlertTitle, AlertDescription } from "../../../components/Alert.tsx";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth.ts";

// Etiquetas de los días de la semana (1 = Lunes, 6 = Sábado)
const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const TruckRouting = () => {
  const { truckId } = useParams<{ truckId: string }>();
  const [truck, setTruck] = useState<CamionResponse | null>(null);
  const [error, setError] = useState<{ errorTitle: string; errorMessage: string } | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1); // 1 = Lunes, 6 = Sábado
  const [domiciliosDelDia, setDomiciliosDelDia] = useState<Domicilio[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDiaId, setCurrentDiaId] = useState<number | null>(null);
  // Mapa de zona -> {diaZonaId, zonaId} para manejar múltiples zonas
  const [zonaIdMap, setZonaIdMap] = useState<Map<string, { diaZonaId: number; zonaId: number }>>(new Map());

  // Cargar el camión al montar el componente
  useEffect(() => {
    if (!truckId) return;

    const id = parseInt(truckId, 10);

    const loadTruck = async () => {
      try {
        // Obtener datos del camión para mostrar info
        const truckData = await fetchTruckById(id);
        setTruck(truckData);
        // Cargar domicilios del primer día (lunes = 1)
        await loadDomiciliosForDay(id, 1);
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        const formattedError = formatErrorResponse(errorResponse);
        setError(formattedError);
        console.error('Error fetching truck data:', error);
      }
    };
    loadTruck();
  }, [truckId]);
  const { currentUser, isAuthenticated } = useAuth();
  if (!isAuthenticated || !currentUser || currentUser.role !== 'Administrador') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Helmet>
          <title>Acceso Denegado - Sodas Rojas</title>
          <meta name="description" content="Acceso denegado al panel de administración" />
        </Helmet>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-lg mb-6">No tienes permiso para acceder a esta página.</p>
          <Link to="/" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }
  /**
   * Obtiene los domicilios del camión para un día específico
   * Usa el endpoint que devuelve datos agrupados por día-zona con orden
   * Transforma los datos a la estructura Domicilio para la tabla
   */
  const loadDomiciliosForDay = async (truckIdParam: number, day: number) => {
    setIsLoading(true);
    try {
      // Llamar al endpoint que devuelve dia-zona con domicilios ordenados
      const diaZonas = await getDiaZonasByTruckAndDay(truckIdParam, day);

      // Transformar la respuesta a array de Domicilios
      // Iteramos cada dia-zona y sus domicilios ordenados
      const domicilios: Domicilio[] = [];

      // Construir mapa de zona -> IDs
      const newZonaIdMap = new Map<string, { diaZonaId: number; zonaId: number }>();

      diaZonas.forEach((diaZona, index) => {
        // Guardar el diaId del primer elemento
        if (index === 0 && diaZona.diaId) {
          setCurrentDiaId(diaZona.diaId);
        }

        // Mapear cada zona a su diaZonaId y zonaId
        if (diaZona.zona?.nombre && diaZona.id && diaZona.zonaId) {
          newZonaIdMap.set(diaZona.zona.nombre, {
            diaZonaId: diaZona.id,
            zonaId: diaZona.zonaId,
          });
        }

        if (diaZona.diaZonaOrdenes && diaZona.diaZonaOrdenes.length > 0) {
          diaZona.diaZonaOrdenes.forEach((diaZonaOrden) => {
            const domicilio = diaZonaOrden.domicilio;
            domicilios.push({
              id: domicilio.id,
              orden: diaZonaOrden.orden, // Orden ya viene del backend
              calle: domicilio.calle,
              altura: domicilio.numero,
              casa_dpto: domicilio.casa,
              piso: diaZona.zona?.nombre || "", // Usa el nombre de zona del diaZona
              zona: diaZona.zona?.nombre || "Sin zona", // Zona para validación
              diaZonaOrdenId: diaZonaOrden.id, // Guardar ID para actualizaciones
            });
          });
        }
      });

      // Ordenar los domicilios por zona y luego por orden dentro de cada zona
      domicilios.sort((a, b) => {
        if (a.zona !== b.zona) {
          return a.zona.localeCompare(b.zona);
        }
        return a.orden - b.orden;
      });

      setZonaIdMap(newZonaIdMap);
      setDomiciliosDelDia(domicilios);
    } catch (error) {
      console.error('Error loading domicilios for day:', error);
      const errorResponse = error as ErrorResponse;
      const formattedError = formatErrorResponse(errorResponse);
      setError(formattedError);
      setShowAlert(true);
      toast.error(errorResponse.mensaje || 'No se pudieron cargar los domicilios');
      setDomiciliosDelDia([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejo del cambio de día
  const handleDayChange = async (day: number) => {
    setSelectedDay(day);
    if (truckId) {
      const id = parseInt(truckId, 10);
      await loadDomiciliosForDay(id, day);
    }
  };

  // Manejo del reordenamiento de domicilios
  const handleReorder = (reorderedData: Domicilio[]) => {
    // Agrupar domicilios por zona y renumerar dentro de cada zona
    const zonaGroups = new Map<string, Domicilio[]>();

    // Agrupar por zona
    reorderedData.forEach((domicilio) => {
      if (!zonaGroups.has(domicilio.zona)) {
        zonaGroups.set(domicilio.zona, []);
      }
      zonaGroups.get(domicilio.zona)!.push(domicilio);
    });

    // Renumerar dentro de cada zona (1, 2, 3...)
    const updatedData: Domicilio[] = [];
    zonaGroups.forEach((items) => {
      items.forEach((item, index) => {
        updatedData.push({
          ...item,
          orden: index + 1, // Nueva posición dentro de la zona
        });
      });
    });

    setDomiciliosDelDia(updatedData);
  };

  // Guardar el nuevo orden en el backend
  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      if (!currentDiaId || zonaIdMap.size === 0) {
        throw new Error('No se encontraron los datos necesarios del dia-zona');
      }

      // Agrupar domicilios por zona para enviar al backend
      const zonaGroups = new Map<string, Domicilio[]>();

      domiciliosDelDia.forEach((domicilio) => {
        if (!zonaGroups.has(domicilio.zona)) {
          zonaGroups.set(domicilio.zona, []);
        }
        zonaGroups.get(domicilio.zona)!.push(domicilio);
      });

      // Enviar actualización para cada zona
      for (const [zonaNombre, domicilios] of zonaGroups.entries()) {
        const zoneData = zonaIdMap.get(zonaNombre);
        if (!zoneData) continue;

        const diaZonaOrdenes = domicilios.map((domicilio) => ({
          id: domicilio.diaZonaOrdenId || 0,
          orden: domicilio.orden, // Orden ya está renumerado por zona
          domicilioId: Number(domicilio.id),
          diaZonaId: zoneData.diaZonaId,
        }));

        // Enviar al backend para esta zona
        await updateDiaZonaWithOrdenes(zoneData.diaZonaId, {
          diaId: currentDiaId,
          zonaId: zoneData.zonaId,
          diaZonaOrdenes,
        });
      }

      toast.success('Orden de ruta guardado correctamente');
      setShowAlert(false);
    } catch (error) {
      console.error('Error saving route order:', error);
      const errorResponse = error as ErrorResponse;
      const formattedError = formatErrorResponse(errorResponse);
      setError(formattedError);
      setShowAlert(true);
      toast.error(errorResponse.mensaje || 'Error al guardar el orden de la ruta');
    } finally {
      setIsSaving(false);
    }
  };

  if (error && !truck) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Helmet>
          <title>Gestión de Reparto de camiones - Sodas Rojas</title>
        </Helmet>
        <NavBar />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <Alert variant="danger">
              <AlertTitle>{error.errorTitle}</AlertTitle>
              <AlertDescription>{error.errorMessage}</AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Gestión de Reparto de camiones - Sodas Rojas</title>
      </Helmet>
      <NavBar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Rutas de Reparto
            </h1>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Camión {truck?.id}: {truck?.marca} {truck?.modelo} ({truck?.patente})
              </h2>

              {/* Selector de días - Similar a DirectionCard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Selecciona un día para ver su ruta:</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {domiciliosDelDia.length} domicilios
                  </span>
                </div>

                {/* Grid de días (Lunes a Sábado) */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  {dayLabels.map((label, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDayChange(index + 1)}
                      disabled={isLoading}
                      className={`rounded-lg px-4 py-3 text-sm font-medium transition ${selectedDay === index + 1
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de domicilios draggable */}
          <Card className="mb-6">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Cargando domicilios...
                </div>
              ) : (
                <DraggableTable data={domiciliosDelDia} onReorder={handleReorder} />
              )}
            </CardContent>
          </Card>

          {/* Botón de guardar */}
          <div className="flex justify-end gap-3">
            {showAlert && (
              <Alert variant="danger" autoClose={true} onClose={() => setShowAlert(false)}>
                <AlertTitle>{error?.errorTitle}</AlertTitle>
                <AlertDescription>{error?.errorMessage}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleSaveOrder} disabled={isSaving || domiciliosDelDia.length === 0 || isLoading}>
              {isSaving ? 'Guardando...' : 'Guardar Orden'}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TruckRouting;