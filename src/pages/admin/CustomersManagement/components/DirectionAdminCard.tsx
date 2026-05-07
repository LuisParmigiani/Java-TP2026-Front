import { useEffect, useState } from 'react';
import type { DiaDomicilioResponse, DomicilioResponse } from '../../../../services/Interfaces';
import { updateDays, updateDirection } from '../../../../services/DirectionService';
import { useAuth } from '../../../../hooks/useAuth';
interface Props {
  direction: DomicilioResponse;
  onSave: (direction: DomicilioResponse) => void;
}

const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function DirectionAdminCard(props: Props) {
  const { direction, onSave } = props;
  const [open, setOpen] = useState(false);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<DomicilioResponse>(direction);
  // Contar días activos (valor 1)
 const activeDays = (direction.diasDomicilio || []).filter(
   (dia) => dia.estado === 'ACTIVO',
 ).length;

  const handleDayToggle = (diaId: number) => {
    setFormData((current) => ({
      ...current,
      diasDomicilio: current.diasDomicilio.map((dia) =>
        dia.id === diaId
          ? {
              ...dia,
              estado: dia.estado === 'ACTIVO' ? 'NODISPONIBLE' : 'ACTIVO',
            }
          : dia,
      ),
    }));
  };

  useEffect(() => {
    setFormData(direction);
  }, [direction]);

const handleSubmit = async () => {
  setLoading(true);
  setError(null);

  try {
    if (!formData.calle?.trim() || !formData.numero?.trim()) {
      setError('Calle y número son requeridos');
      setLoading(false);
      return;
    }

    // Esta línea hace el UPDATE al backend
    console.log('Enviando datos al backend:', formData);
    const result = await updateDirection(formData, token);
    const diasRequest = []
    formData.diasDomicilio.map((dia:DiaDomicilioResponse)=>{
      diasRequest.push({
        estado: dia.estado,
        diaId: dia.diaId,
        domicilioId:dia.domicilioId,
      })
    })
    console.log(diasRequest)
    await updateDays(formData.id, diasRequest );
    // Solo si el backend confirma el éxito, actualiza el estado local
  onSave({
    ...result,
    diasDomicilio: result.diasDomicilio || formData.diasDomicilio,
  });
    setOpen(false);
  } catch (err) {
    setError((err as Error).message || 'Error al guardar la dirección');
    console.error('Error updating direction:', err);
  } finally {
    setLoading(false);
  }
};

  const isPending = direction.habilitado === 'Pendiente';

  const headerBg = isPending
    ? 'bg-yellow-100'
    : direction.activo === 'Activa'
      ? 'bg-green-100'
      : 'bg-red-100';

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`group flex w-full items-start justify-between gap-4 ${headerBg} px-5 py-4 text-left transition-colors hover:from-gray-50 hover:to-gray-100`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {direction.calle} {direction.numero}
              </h3>
              <p className="text-sm text-gray-500">
                {direction.zona?.nombre && `Zona: ${direction.zona.nombre}`}{' '}
                {direction.casa && `· Casa ${direction.casa}`}
                {direction.zona?.camion &&
                  ` · Camión: ${direction.zona.camion.patente} ${direction.zona.camion.marca}, ${direction.zona.camion.modelo}`}
              </p>
              {isPending && (
                <span className="mt-1 inline-block rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-yellow-900">
                  Pendiente de aprobación
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="mt-1 rounded-full border bg-gray-50 border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition-colors group-hover:bg-tertiary-300 group-hover:border-tertiary-400 group-hover:text-tertiary-900">
          {open ? 'Cerrar edición' : 'Editar'}
        </span>
      </button>

      <div className="px-5 pb-5">
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-600">
              Días de entrega
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {activeDays} activos
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {(direction.diasDomicilio || []).map((dia, index) => (
              <div
                key={index}
                className={`rounded-full px-3 py-2 text-center text-sm font-medium ${
                  dia.estado === 'ACTIVO'
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
          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-inner">
            <h2 className="text-lg font-semibold text-gray-900">
              Editar Dirección
            </h2>
            {error && (
              <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="w-full gap-8 display flex flex-row items-center my-4">
              <label>Modificar estado de dirección:</label>
              <button
                type="button"
                onClick={() => {
                  setFormData((current) => ({
                    ...current,
                    activo: current.activo === 'Activa' ? 'Inactiva' : 'Activa',
                  }));
                }}
                className={`rounded-full px-3 py-2 text-sm w-xl font-medium transition ${
                  formData.activo === 'Activa'
                    ? 'bg-emerald-500 text-white shadow-sm hover:bg-red-300 hover:text-gray-700'
                    : 'bg-gray-300 text-gray-500 hover:bg-emerald-500 hover:text-white'
                }`}
              >
                {formData.activo === 'Activa'
                  ? 'Desactivar dirección'
                  : 'Activar dirección'}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Calle</span>
                <input
                  type="text"
                  value={formData.calle}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      calle: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Número
                </span>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      numero: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Casa</span>
                <input
                  type="text"
                  value={formData.casa}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      casa: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-700">
                Editar días de envio:
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {(formData.diasDomicilio || []).map((dia, index) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      title={
                        dia.estado === 'NODISPONIBLE'
                          ? 'Día no disponible para este domicilio'
                          : dia.estado === 'ACTIVO'
                            ? 'Desactivar día'
                            : 'Activar día'
                      }
                      onClick={() => handleDayToggle(dia.id)}
                      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                        dia.estado === 'ACTIVO'
                          ? 'bg-emerald-500 text-white shadow-sm hover:bg-gray-300 hover:text-gray-600 hover:border hover:border-gray-600 '
                          : dia.estado === 'NODISPONIBLE'
                            ? 'bg-white text-gray-600 border border-gray-200   hover:bg-emerald-200 hover:text-white cursor-pointer'
                            : 'bg-gray-300 text-gray-500 hover:bg-emerald-500 hover:text-white cursor-pointer'}`}
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
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DirectionAdminCard;
