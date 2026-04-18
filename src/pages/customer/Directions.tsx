import { useEffect, useState } from 'react';
import DireccionCard from '../../components/DirectionCard';
import Footer from '../../components/Footer';
import Filter from '../../components/Filter';
import type { DomicilioResponse } from '../../services/Interfaces';
import { getAllByUserId, postDirection } from '../../services/DirectionService';
import NavBar from '../../components/NavBar';
import { useAuth } from "../../hooks/useAuth";
import { Button } from '../../components/Button';
import type { DomicilioRequest } from '../../services/Interfaces';
import NewDirection from '../../components/NewDirection';


export default function Directions() {
  const [directions, setDirections] = useState<DomicilioResponse[]>([]);
  const [filter, setFilter] = useState({ status: "", deliveryDay: "" });
  const [open, setOpen] = useState(false);
  const { token } = useAuth();

  const handleSaveNewDirection = (direction: DomicilioRequest) => {
    const save = async () => {
      try {
        const result = await postDirection(direction, token);
        console.log("New direction saved:", result);
        console.log("Saving new direction:", direction);
      } catch (error) {
        console.error("Error saving new direction:", error);
      }

      setOpen(false);
    }
    save();
  }


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
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  return (
    <>
      <NavBar />
      {open && (
        <NewDirection close={() => setOpen(false)} setDirection={handleSaveNewDirection} />
      )}
      <div className="p-4 sm:p-6 lg:p-8 gap-4 felx flex-col">

        <div className='flex flex-row justify-between '>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Direcciones</h1>
            <p className="mt-2 text-sm text-gray-700">
              Aquí puedes gestionar tus direcciones de entrega.
            </p>
          </div>
          <Button color='primary' size='md' onClick={() => setOpen(!open)} className="px-4">Agregar Dirección</Button>
        </div>
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
    </>

  );
}
