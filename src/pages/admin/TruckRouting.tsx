import { Helmet } from "../../components/Helmet.tsx"
import NavBar from "../../components/NavBar.tsx"
import { useParams } from "react-router-dom";
import { fetchTruckById} from "../../services/TruckService.ts";
import { useEffect, useState } from "react";
import { formatErrorResponse } from "../../lib/utils.ts";
import type { CamionResponse,ErrorResponse } from "../../services/Interfaces.ts";
import { Card, CardContent } from "../../components/Card.tsx";

const TruckRouting = () => {
  const { truckId } = useParams<{truckId: string}>();
  const [truck, setTruck] = useState<CamionResponse | null>(null);
  const [error, setError] = useState<{errorTitle: string, errorMessage: string} | null>(null);
  
useEffect(() => {
  if (!truckId) return;

  const id = parseInt(truckId, 10);

  const loadTruck = async () => {
    try {
      const data = await fetchTruckById(id);
      setTruck(data);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      const formattedError = formatErrorResponse(errorResponse);
      setError({
        errorTitle: formattedError.errorTitle,
        errorMessage: formattedError.errorMessage,
      });
      console.error('Error fetching truck data:', error);
    }
  };
  loadTruck();
}, [truckId]);

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
              Gestion de Camiones - Rutas de Reparto
            </h1>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Rutas del Camion {truckId}: {truck?.modelo}</h2>
          </div>
          <Card>
            <CardContent className="p-0">
            </CardContent>

          </Card>
        </div>
      </main>
    </div>

  )




}

export default TruckRouting