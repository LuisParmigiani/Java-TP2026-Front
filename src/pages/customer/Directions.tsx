import { useState } from 'react';
import DireccionCard from '../../components/DirectionCard';
import Footer from '../../components/Footer';
import Filter from '../../components/Filter';

const recentDirections = [
    { id: '1', address: 'Calle Falsa', number: '123', house: 'A34', floor: '2', dias: ['true', 'false', 'true', 'true', 'false', 'false', 'true'], actived: true },
    { id: '2', address: 'Avenida Siempre Viva', number: '742', house: 'B12', floor: '1', dias: ['true', 'true', 'true', 'true', 'true', 'false', 'false'], actived: false },
    { id: '3', address: 'Boulevard de los Sueños Rotos', number: '456', house: 'C56', floor: '3', dias: ['false', 'false', 'true', 'false', 'true', 'true', 'false'], actived: true },
];


export default function Directions() {

    const [directions, setDirections] = useState(recentDirections);
    const handleSaveDirection = (updatedDirection: typeof recentDirections[number]) => {
        setDirections((current) => current.map((direction) => (direction.id === updatedDirection.id ? updatedDirection : direction)));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 gap-4 felx flex-col">
            <h1 className="text-2xl font-semibold text-gray-900">Direcciones</h1>
            <p className="mt-2 text-sm text-gray-700">Aquí puedes gestionar tus direcciones de entrega.</p>
            <div className='flex flex-row mt-5'>
                <Filter name="Estado" options={['activas', 'inactivas']} onSave={(value) => console.log('Filtro guardado:', value)} color="primary" size="md" />
                <Filter name="Día de entrega" options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']} onSave={(value) => console.log('Filtro guardado:', value)} color="primary" size="md" />
            </div>
            <div className="mt-6 space-y-4 mb-10">
                <div className="flex flex-col gap-6">
                    {directions.length === 0 ? (
                        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                            <p className="text-sm text-gray-500">No tenés direcciones cargadas. Agregá una dirección para verla aquí.</p>
                        </div>
                    ) : (
                        directions.map((direction) => (
                            <DireccionCard
                                key={direction.id}
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