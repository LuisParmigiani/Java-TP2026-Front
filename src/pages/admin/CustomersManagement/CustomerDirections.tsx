import { useParams } from 'react-router-dom';
import { Helmet } from '../../../components/Helmet';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import { useCustomerDirections } from './hooks/useCustomerDomicilios';
import { useAuth } from '../../../hooks/useAuth.ts';
import DirectionAdminCard from './components/DirectionAdminCard.tsx';
import { useEffect, useState } from 'react';
import type { CamionResponse } from '../../../services/Interfaces.ts';
import { fetchTrucks } from '../../../services/TruckService.ts';
import { useNavigate } from 'react-router-dom';

export default function CustomerDirections() {
  const { customerId } = useParams<{ customerId: string }>();
  const { token, isAuthenticated } = useAuth();
  const customerData = useCustomerDirections(customerId);
  //Defino useState para traer los camiones para asignar a los domicilios en el back
  const [trucks, setTrucks] = useState<{ id: number; nombre: string }[]>([]);
  // Proteger ruta
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchAndSetTrucks = async () => {
      try {
        const camionesData = await fetchTrucks(token);
        setTrucks(
          camionesData.map((camion: CamionResponse) => ({
            id: camion.id,
            nombre: camion.patente,
          })),
        );
      } catch (error) {
        console.error("Error fetching trucks:", error);
      }
    };

    fetchAndSetTrucks();
  }, [token]);

  console.log(customerData.directions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Domicilios del Cliente - Sodas Rojas</title>
      </Helmet>
      <NavBar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight mb-8">
            Gestión de Domicilios -{" "}
            {customerData.persona
              ? `${customerData.persona.nombre} ${customerData.persona.apellido}`
              : "Cargando..."}
          </h1>
          {customerData.error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              {customerData.error}
            </div>
          )}

          <div className="flex flex-col gap-6">
            {customerData.directions.map((direction) => (
              <DirectionAdminCard
                key={direction.id}
                direction={direction}
                onSave={customerData.handleSaveDirection}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
