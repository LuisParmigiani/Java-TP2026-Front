import type { DiaZonaResponse } from "../services/Interfaces";
import { useState } from "react";


interface Props {
    directions: DiaZonaResponse[] | null | undefined
}

export default function DirectionTable(
    prop: Props
) {
    const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

    const toggleRow = (key: string) => {
        setExpandedIndex(expandedIndex === key ? null : key);
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <div className="bg-background text-foreground flex flex-col">
                <div className="grid grid-cols-4 gap-2 border-b border-gray-200 bg-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    <p>Calle</p>
                    <p className="text-center">Numero</p>
                    <p className="text-right">Casa:</p>
                </div>
                {prop.directions && prop.directions.length > 0 ? (
                    prop.directions.map((diaZona) =>
                        diaZona.diaZonaOrdenes && diaZona.diaZonaOrdenes.length > 0 ? (
                            diaZona.diaZonaOrdenes.map((orden) => {
                                const key = `${diaZona.id}-${orden.id}`;
                                return (
                                    <div key={key}>
                                        <div
                                            onClick={() => toggleRow(key)}
                                            className={`grid grid-cols-4 gap-2 border-t border-gray-100 px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors`}
                                        >
                                            <p>{orden.domicilio?.calle || "N/A"}</p>
                                            <p className="text-center">{orden.domicilio?.numero || "N/A"}</p>
                                            <p className="text-right">{orden.domicilio?.casa || "N/A"}</p>
                                        </div>

                                        {expandedIndex === key && (
                                            <div className="bg-gray-50 border-t border-gray-100 px-3 py-4">
                                                <div className="space-y-3">
                                                    {orden.domicilio?.persona && (
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                                                                Persona: {orden.domicilio.persona.nombre} {orden.domicilio.persona.apellido}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-600 uppercase">Zona</p>
                                                            <p className="text-sm text-gray-900">{diaZona.zona?.nombre || "Sin asignar"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-600 uppercase">Orden</p>
                                                            <p className="text-sm text-gray-900">{orden.orden || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-600 uppercase">Habilitado</p>
                                                            <p className="text-sm text-gray-900">{orden.domicilio?.habilitado || "No especificado"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-600 uppercase">Dirección</p>
                                                            <p className="text-sm text-gray-900">
                                                                {orden.domicilio?.calle} {orden.domicilio?.numero}, Casa {orden.domicilio?.casa}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : null
                    )
                ) : (
                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        No hay direcciones disponibles
                    </div>
                )}
            </div>
        </div>
    )
}