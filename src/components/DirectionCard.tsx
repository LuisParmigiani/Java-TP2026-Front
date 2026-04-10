import { useEffect, useState } from 'react';

export type Direction = {
    id: string;
    address: string;
    number: string;
    house: string;
    floor: string;
    actived: boolean;
    dias: string[];
};

interface Props {
    direction: Direction;
    onSave: (direction: Direction) => void;
}

const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function DireccionCard({ direction, onSave }: Props) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Direction>(direction);
    const activeDays = direction.dias.filter((dia) => dia === 'true').length;

    useEffect(() => {
        setFormData(direction);
    }, [direction]);

    const handleDayToggle = (index: number) => {
        setFormData((current) => ({
            ...current,
            dias: current.dias.map((dia, dayIndex) => (dayIndex === index ? (dia === 'true' ? 'false' : 'true') : dia)),
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave(formData);
        setOpen(false);
        // Lo que falta es hacer en update en la base de datos asi queda persistido. 

    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className={`flex w-full items-start justify-between gap-4 ${direction.actived ? 'bg-green-100' : 'bg-red-100'} px-5 py-4 text-left transition-colors hover:from-gray-50 hover:to-gray-100`}
            >
                <div className="flex-1">
                    <div className="flex items-center gap-2">

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {direction.address} {direction.number}
                            </h3>
                            <p className="text-sm text-gray-500"> {direction.floor && `Piso ${direction.floor} · `} {direction.house && `Casa ${direction.house}`}</p>
                            <p className='text-md my-2 '>Estado: {direction.actived ? 'Activa' : 'Inactiva'}</p>
                        </div>
                    </div>
                </div>
                <span className="mt-1 rounded-full border bg-gray-50 border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                    {open ? 'Cerrar edición' : 'Editar'}
                </span>
            </button>

            <div className="px-5 pb-5">
                <div className="mt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-gray-600">Días de entrega</span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            {activeDays} activos
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                        {direction.dias.map((dia, index) => (
                            <div
                                key={index}
                                className={`rounded-full px-3 py-2 text-center text-sm font-medium ${dia === 'true' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}
                            >
                                {dayLabels[index]}
                            </div>
                        ))}
                    </div>
                </div>

                {open && (
                    <form onSubmit={handleSubmit} className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-inner">
                        <h2 className="text-lg font-semibold text-gray-900">Editar Dirección</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Dirección</span>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Número</span>
                                <input
                                    type="text"
                                    value={formData.number}
                                    onChange={(event) => setFormData((current) => ({ ...current, number: event.target.value }))}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Piso</span>
                                <input
                                    type="text"
                                    value={formData.floor}
                                    onChange={(event) => setFormData((current) => ({ ...current, floor: event.target.value }))}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Casa:</span>
                                <input
                                    type="text"
                                    value={formData.house}
                                    onChange={(event) => setFormData((current) => ({ ...current, house: event.target.value }))}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </label>
                        </div>

                        <button
                            type="button"
                            onClick={() => setFormData((current) => ({ ...current, actived: !current.actived }))}
                            className={`${formData.actived ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} mt-5 w-full rounded-2xl py-1`}
                        >
                            {formData.actived ? 'Desactivar dirección' : 'Activar dirección'}
                        </button>

                        <div className="mt-4">
                            <span className="text-sm font-medium text-gray-700">Editar días</span>
                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                                {formData.dias.map((dia, index) => {
                                    const active = dia === 'true';
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleDayToggle(index)}
                                            className={`rounded-full px-3 py-2 text-sm font-medium transition ${active ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                                        >
                                            {dayLabels[index]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData(direction);
                                    setOpen(false);
                                }}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}