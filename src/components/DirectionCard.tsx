import { useEffect, useState } from 'react';
import type { DomicilioResponse } from '../services/Interfaces';
import { updateDirection } from '../services/DirectionService';
import { useAuth } from "../hooks/useAuth";
interface Props {
    direction: DomicilioResponse;
    onSave: (direction: DomicilioResponse) => void;
}

const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function DirectionCard(props: Props) {
    const { direction, onSave } = props;
    const [open, setOpen] = useState(false);
    const { token } = useAuth();

    const [formData, setFormData] = useState<DomicilioResponse>(direction);
    // Contar días activos (valor 1)
    const activeDays = direction.diasDomicilio.filter((dia) => dia.estado === "ACTIVO").length;



    const handleDayToggle = (diaId: number) => {
        setFormData((current) => ({
            ...current,
            diasDomicilio: current.diasDomicilio.map((dia) =>
                dia.id === diaId
                    ? {
                        ...dia,
                        estado: dia.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO',
                    }
                    : dia
            ),
        }));
    }

    useEffect(() => {
        setFormData(direction);
    }, [direction]);


    const handleSubmit = async () => {

        const result = await updateDirection(formData, token);
        console.log(result);
        onSave({ ...result, activo: formData.activo, diasDomicilio: result.diasDomicilio ?? formData.diasDomicilio });
        setOpen(false);
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className={`flex w-full items-start justify-between gap-4 ${direction.activo ? 'bg-green-100' : 'bg-red-100'} px-5 py-4 text-left transition-colors hover:from-gray-50 hover:to-gray-100`}
            >
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {direction.calle} {direction.numero}
                            </h3>
                            <p className="text-sm text-gray-500">{direction.zona?.nombre && `Zona: ${direction.zona.nombre}`} {direction.casa && `· Casa ${direction.casa}`}</p>
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
                        {direction.diasDomicilio.map((dia, index) => (
                            <div
                                key={index}
                                className={`rounded-full px-3 py-2 text-center text-sm font-medium ${dia.estado === 'ACTIVO'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : dia.estado === 'INACTIVO'
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'bg-gray-300 text-gray-500'
                                    }`}
                            >
                                {dayLabels[index]}
                            </div>
                        ))}
                    </div>
                </div>

                {open && (
                    <form onSubmit={handleSubmit} className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-inner">
                        <h2 className="text-lg font-semibold text-gray-900">Editar Dirección</h2>
                        <div className='w-full gap-8 display flex flex-row items-center my-4'>
                            <label >Modificar estado de dirección:</label>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData((current) => ({
                                        ...current,
                                        activo: !current.activo,
                                    }));
                                }}
                                className={`rounded-full px-3 py-2 text-sm w-xl font-medium transition ${formData.activo
                                    ? 'bg-emerald-500 text-white shadow-sm hover:bg-red-300 hover:text-gray-700'
                                    : 'bg-gray-300 text-gray-500 hover:bg-emerald-500 hover:text-white'
                                    }`}
                            >
                                {formData.activo ? 'Desactivar dirección' : 'Activar dirección'}
                            </button>
                        </div>
                        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Calle</span>
                                <input
                                    type="text"
                                    value={formData.calle}
                                    onChange={(event) => setFormData((current) => ({ ...current, calle: event.target.value }))}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Número</span>
                                <input
                                    type="text"
                                    value={formData.numero}
                                    onChange={(event) => setFormData((current) => ({ ...current, numero: event.target.value }))}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Casa</span>
                                <input
                                    type="text"
                                    value={formData.casa}
                                    onChange={(event) => setFormData((current) => ({ ...current, casa: event.target.value }))}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </label> 
                        </div>
                            */}
                        <div className="mt-4">
                            <span className="text-sm font-medium text-gray-700">Editar días de envio:</span>
                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                                {formData.diasDomicilio.map((dia, index) => {

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            disabled={dia.estado === 'NODISPONIBLE'}
                                            title={dia.estado === 'NODISPONIBLE' ? 'Día no disponible para este domicilio' : dia.estado === 'ACTIVO' ? 'Desactivar día' : 'Activar día'}
                                            onClick={() => handleDayToggle(dia.id)}
                                            className={`rounded-full px-3 py-2 text-sm font-medium transition ${dia.estado === 'ACTIVO'
                                                ? 'bg-emerald-500 text-white shadow-sm'
                                                : dia.estado === 'INACTIVO'
                                                    ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
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

export default DirectionCard;
