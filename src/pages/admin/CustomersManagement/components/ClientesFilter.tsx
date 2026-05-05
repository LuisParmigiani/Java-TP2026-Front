import { useState } from 'react';
import Filter from '../../../../components/Filter';
import { Card, CardContent } from '../../../../components/Card';
import { Button } from '../../../../components/Button';
import { X } from 'lucide-react';

import type { FilterOption } from '../hooks/useCustomerFilterOptions';

interface ClientesFilterProps {
  onApplyFilters?: (filters: {
    zone?: string | number;
    truck?: string | number;
    day?: string | number;
    saldo?: string;
  }) => void;
  onReset?: () => void;

  zones: FilterOption[];
  trucks: FilterOption[];
  days: FilterOption[];
  saldoRanges: string[];

  selectedZone?: string | number;
  selectedTruck?: string | number;
  selectedDay?: string | number;
  selectedSaldo?: string;
}

export const ClientesFilter = ({
  onApplyFilters,
  onReset,
  zones = [],
  trucks = [],
  days = [],
  saldoRanges = [],
  selectedZone,
  selectedTruck,
  selectedDay,
  selectedSaldo,
}: ClientesFilterProps) => {
  const [tempZone, setTempZone] = useState<string | number | undefined>(
    selectedZone,
  );
  const [tempTruck, setTempTruck] = useState<string | number | undefined>(
    selectedTruck,
  );
  const [tempDay, setTempDay] = useState<string | number | undefined>(
    selectedDay,
  );
  const [tempSaldo, setTempSaldo] = useState<string | undefined>(selectedSaldo);

  const handleApplyFilters = () => {
    onApplyFilters?.({
      zone: tempZone,
      truck: tempTruck,
      day: tempDay,
      saldo: tempSaldo,
    });
  };

  const hasChanges = tempZone || tempTruck || tempDay || tempSaldo;

  return (
    <aside className="w-full lg:w-64">
      <Card className="lg:sticky lg:top-20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base sm:text-lg font-semibold">Filtros</h3>
            {hasChanges && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTempZone(undefined);
                  setTempTruck(undefined);
                  setTempDay(undefined);
                  setTempSaldo(undefined);
                  onReset?.();
                }}
                title="Limpiar filtros"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2 sm:space-y-4">
            {/* Filtro por Zona */}
            {zones.length > 0 && (
              <div>
                <Filter
                  name={
                    tempZone
                      ? zones.find((z) => z.id === tempZone)?.nombre || 'Zona'
                      : 'Zona'
                  }
                  options={zones.map((z) => z.nombre)}
                  onSave={(nombre) => {
                    const selectedId = zones.find(
                      (z) => z.nombre === nombre,
                    )?.id;
                    if (selectedId !== undefined) setTempZone(selectedId);
                  }}
                  color="primary"
                  size="md"
                  containerSize="full"
                />
              </div>
            )}

            {/* Filtro por Camión */}
            {trucks.length > 0 && (
              <div>
                <Filter
                  name={
                    tempTruck
                      ? trucks.find((t) => t.id === tempTruck)?.nombre ||
                        'Camión'
                      : 'Camión'
                  }
                  options={trucks.map((t) => t.nombre)}
                  onSave={(nombre) => {
                    const selectedId = trucks.find(
                      (t) => t.nombre === nombre,
                    )?.id;
                    if (selectedId !== undefined) setTempTruck(selectedId);
                  }}
                  color="secondary"
                  size="md"
                  containerSize="full"
                />
              </div>
            )}

            {/* Filtro por Día */}
            {days.length > 0 && (
              <div>
                <Filter
                  name={
                    tempDay
                      ? days.find((d) => d.id === tempDay)?.nombre || 'Día'
                      : 'Día'
                  }
                  options={days.map((d) => d.nombre)}
                  onSave={(nombre) => {
                    const selectedId = days.find(
                      (d) => d.nombre === nombre,
                    )?.id;
                    if (selectedId !== undefined) setTempDay(selectedId);
                  }}
                  color="green"
                  size="md"
                  containerSize="full"
                />
              </div>
            )}

            {/* Filtro por Saldo */}
            {saldoRanges.length > 0 && (
              <div>
                <Filter
                  name={tempSaldo || 'Saldo'}
                  options={saldoRanges}
                  onSave={(option) => setTempSaldo(option)}
                  color="red"
                  size="md"
                  containerSize="full"
                />
              </div>
            )}
          </div>

          <Button onClick={handleApplyFilters} className="w-full mt-6">
            Aplicar Filtros
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
};
