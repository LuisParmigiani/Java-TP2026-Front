import { useEffect, useState } from 'react';
import DireccionCard from '../../components/DirectionCard';
import Footer from '../../components/Footer';
import Filter from '../../components/Filter';
import type { domicilioResponse } from '../../services/Interfaces';
import { getAllByUserId } from '../../services/DirectionService';
import NavBar from '../../components/NavBar';
import { useAuth } from "../../hooks/useAuth";


export default function Directions() {
  const [directions, setDirections] = useState<domicilioResponse[]>([]);
  const [filter, setFilter] = useState({ status: "", deliveryDay: "" });
  const { token } = useAuth();
  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const result = await getAllByUserId(token, filter.status);
        setDirections(result);
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };
    fetchDirections();
  }, [filter, token]);

  const handleSaveDirection = (updatedDirection: domicilioResponse) => {
    setDirections((current) =>
      current.map((direction) =>
        direction.id === updatedDirection.id ? updatedDirection : direction,
      ),
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 gap-4 felx flex-col">
      <h1 className="text-2xl font-semibold text-gray-900">Direcciones</h1>
      <p className="mt-2 text-sm text-gray-700">
        Aquí puedes gestionar tus direcciones de entrega.
      </p>
      <div className="flex flex-row mt-5">
        <Filter
          name={filter.status || "Estado"}
          options={["Mostrar Todas", "Activas", "Inactivas"]}
          onSave={(value) => setFilter({ ...filter, status: value })}
          color="primary"
          size="md"
        />
      </div>
      <div className="mt-6 space-y-4 mb-10">
        <div className="flex flex-col gap-6">
          {directions.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
              <p className="text-sm text-gray-500">
                No tenés direcciones cargadas. Agregá una dirección para verla
                aquí.
              </p>
            </div>
          ) : (
            directions.map((direction) => (
              <DireccionCard
                direction={direction}
                onSave={handleSaveDirection}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
