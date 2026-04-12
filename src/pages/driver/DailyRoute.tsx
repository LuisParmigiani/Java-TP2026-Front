import Navbar from './../../components/NavBar';
import Footer from './../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from './../../components/Card';

import { Badge } from './../../components/Badge';
import { Button } from './../../components/Button';
import { MapPin, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.ts';
import { useEffect, useState } from "react";

const DailyRoutePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!isAuthenticated || !currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        //fetcheo la data de que clientes tocan ese día para ese camión
        //!Este endpoint va a ser bastante heavy, o no. Creo que con traer el camion del que esta encargado ese empleado ese dia
        //! Y hacer un endpoint que traiga los domicilios de ese camion para ese dia, con toda la info necesaria para mostrar en la ruta diaria, 
        //! va a ser suficiente. Sino habría que hacer un endpoint que traiga toda esa info pero filtrada por empleado y dia, pero creo que es mas trabajo y no aporta nada nuevo
        const response = await fetch('domicilio/entregasHoy'); // Reemplaza con tu endpoint real

        if (!response.ok) {
          throw new Error('Error al cargar los clientes');
        }

        const data = await response.json();
        setDeliveries(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching deliveries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [isAuthenticated, currentUser]);

  // Verificar si el usuario es empleado
  //! Falta verificar que esté asignado a un camión hoy

  if (!isAuthenticated || currentUser?.role !== 'Empleado') {
    console.log(currentUser);
    return <div>Acceso denegado. Solo empleados habilitados a un reparto.</div>;
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
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">Completado</Badge>
        );
      case 'pending':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30"
          >
            Pendiente
          </Badge>
        );
      default:
        return <Badge  className="" variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1
              className="text-3xl font-bold"
              style={{ letterSpacing: '-0.02em' }}
            >
              Ruta Diaria
            </h1>
            <div className="text-sm text-muted-foreground font-medium">
              {deliveries.filter((d) => d.status === 'completed').length} de{' '}
              {deliveries.length} entregas completadas
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deliveries.map((delivery, index) => (
              <Card
                key={delivery.id}
                className={`border-border shadow-sm ${delivery.status === 'completed' ? 'bg-muted/30' : 'bg-card'}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${delivery.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}
                      >
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">
                        {delivery.customer_name}
                      </CardTitle>
                    </div>
                    {getStatusBadge(delivery.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{delivery.address}</span>
                  </div>
                  <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                    <Package className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{delivery.items}</span>
                  </div>
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      Total: ${delivery.total.toFixed(2)}
                    </span>
                    {delivery.status === 'pending' && (
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Marcar Entregado
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DailyRoutePage;