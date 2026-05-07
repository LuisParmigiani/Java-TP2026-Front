import Navbar from "./../../components/NavBar";
import Footer from "./../../components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../../components/Card";

import { Button } from "./../../components/Button";
import { Link, MapPin, UserRound } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.ts";
import { useEffect, useState } from "react";
import { Helmet } from "../../components/Helmet.tsx";
import { getDiaZonasByTruckAndMe } from "../../services/TruckService.ts";
import Filter from "../../components/Filter.tsx";
import { type DiaZonaResponse, type DiaZonaOrdenResponse, type VentaResponse } from "../../services/Interfaces.ts";
import { getVentasHoyByDomicilioId } from "../../services/SalesService.ts";
import OrderDetailModal from "../../components/OrderDetailModal.tsx";
import ClientInfoModal from "../../components/ClientInfoModal.tsx";

const DailyRoutePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [deliveries, setDeliveries] = useState<DiaZonaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zonaOptions, setZonaOptions] = useState<string[]>([]);
  const [zona, setZona] = useState<string>('Todas');
  const [openDelivery, setOpenDelivery] = useState<DiaZonaOrdenResponse | null>(null);
  const [sale, setSale] = useState<VentaResponse | null>(null);
  const [saleLoading, setSaleLoading] = useState(false);
  const [clientInfoDelivery, setClientInfoDelivery] = useState<DiaZonaOrdenResponse | null>(null);



  const { token } = useAuth();

  // Fetch all available zones once on component mount
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const dayName = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
        // Get all zones by fetching with 'Todas'
        const response = await getDiaZonasByTruckAndMe(token, dayName, null, 'true', null, ['zona']);
        const uniqueZones = ['Todas', ...new Set(response.map(dz => dz.zona.nombre))];
        setZonaOptions(uniqueZones);
      } catch (err) {
        console.error("Error fetching zones:", err);
      }
    };
    fetchZones();
  }, [isAuthenticated, currentUser, token]);

  const fetchSales = async (domicilioId: number) => {
    setSaleLoading(true);
    setSale(null);
    try {
      const response = await getVentasHoyByDomicilioId(domicilioId, [
        'lineaPedido',
        'productoZona',
        'producto',

      ]);
      console.log("Fetched sales for delivery:", response);
      setSale(response);
    } catch (error) {
      console.error("Error fetching sales:", error);
      setSale(null);
    } finally {
      setSaleLoading(false);
    }
  };


  // Fetch deliveries when selected zone changes
  useEffect(() => {
    const fetchDeliveries = async () => {

      try {
        setLoading(true);
        const dayName = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
        const response = await getDiaZonasByTruckAndMe(token, dayName, zona, 'true', null, ['diaZonaOrden', 'venta', 'domicilio', 'persona', 'productosDomicilio']);


        setDeliveries(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching deliveries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [isAuthenticated, currentUser, token, zona]);


  if (!isAuthenticated || currentUser?.role !== "Empleado") {
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
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">Cargando entregas...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-600">
            <p className="text-lg font-medium">Error al cargar entregas</p>
            <p className="text-sm">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1
              className="text-3xl font-bold"
              style={{ letterSpacing: "-0.02em" }}
            >
              Ruta Diaria
            </h1>
            <div className="text-sm text-muted-foreground font-medium">
              {deliveries.reduce((sum, dz) => sum + dz.diaZonaOrdenes.length, 0)} entregas pendientes
            </div>
          </div>
          <Filter color="primary" size='md' options={zonaOptions} name={zona} onSave={(value) => setZona(value)} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deliveries?.flatMap((diaZona) =>
              diaZona.diaZonaOrdenes.map((delivery) => (

                <Card
                  key={delivery.id}
                  className={`border-border shadow-sm  "bg-card"`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold  bg-primary/10 text-primary`}
                        >
                          {delivery.orden}
                        </div>
                        <CardTitle className="text-lg">
                          {delivery.domicilio?.calle} {delivery.domicilio?.numero}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{delivery.domicilio?.casa}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                        <UserRound />
                        <span>{delivery.domicilio.persona.nombre}  {delivery.domicilio.persona.apellido}</span></div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setClientInfoDelivery(delivery)}
                      >Informacion del cliente</Button>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">


                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                        onClick={() => {
                          setOpenDelivery(delivery);
                          fetchSales(delivery.domicilio?.id || 0);
                        }}
                      >
                        Realizar Venta
                      </Button>

                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        <ClientInfoModal
          open={clientInfoDelivery !== null}
          onClose={() => setClientInfoDelivery(null)}
          persona={clientInfoDelivery?.domicilio?.persona}
          cantEn={clientInfoDelivery?.domicilio?.productosDomicilio?.reduce((sum, pd) => sum + pd.cantVaciosActuales, 0) ?? 0}
        />
        <OrderDetailModal
          open={openDelivery !== null}
          onClose={() => { setOpenDelivery(null); setSale(null); }}
          delivery={openDelivery}
          sale={sale}
          loading={saleLoading}
          onSaleUpdated={() => {
            if (openDelivery) {
              setDeliveries(prev =>
                prev
                  .map(diaZona => ({
                    ...diaZona,
                    diaZonaOrdenes: diaZona.diaZonaOrdenes.filter(d => d.id !== openDelivery.id),
                  }))
                  .filter(diaZona => diaZona.diaZonaOrdenes.length > 0)
              );
            }
          }}
        />
      </main>
      <Footer />
    </div >
  );
};

export default DailyRoutePage;
