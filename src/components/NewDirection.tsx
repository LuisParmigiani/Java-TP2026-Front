import { useEffect, useState } from "react";
import type { ZonaResponse, domicilioRequest } from "../services/Interfaces";
import { Button } from "./Button";
import Input from "./Input";
import { fetchZones } from "../services/ZoneService";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth.ts";

interface Props {
    close: () => void;
    setDirection: (direction: domicilioRequest) => void;
}

// Default initial state for form
const initialForm: domicilioRequest = {
    calle: "",
    numero: "",
    casa: "",
};

export default function NewDirection({ close, setDirection }: Props) {
    const {token  ,loading  } = useAuth();
    const [formInformation, setFormInformation] = useState<domicilioRequest>(initialForm);
    const [zonas, setZonas] = useState<ZonaResponse[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (loading) return; // Esperar a que se resuelva el estado de autenticación
        const fetchZonas = async () => {
            try {
                const response = await fetchZones(token);
                setZonas(response);
            } catch (error) {
                console.error("Error fetching zonas:", error);
            }
        };
        fetchZonas();
    }, [token, loading]);



    // Esquema Zod para domicilioRequest
    const domicilioSchema = z.object({
        calle: z.string().min(1, "La calle no puede estar vacía"),
        numero: z.string()
            .min(1, "El número no puede estar vacío")
            .regex(/^\d{1,5}$/, "El número debe tener entre 1 y 5 dígitos"),
        casa: z.string()
            .regex(/^\d{0,5}$/, "El número de casa debe tener entre 0 y 5 dígitos")
            .optional()
            .or(z.literal("")),

        zonaId: z.number().min(1, "El id de la zona no puede estar vacío"),
    });

    const checkForm = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (formInformation) {
            const result = domicilioSchema.safeParse(formInformation);
            if (!result.success) {
                const fieldErrors: Record<string, string> = {};
                result.error.issues.forEach(err => {
                    if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
                });
                setErrors(fieldErrors);
                return;
            }
            setErrors({});
            setDirection(formInformation);
            close();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={close}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-200"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Agregar Dirección</h2>
                <form className="grid grid-cols-1 gap-6" onSubmit={checkForm}>
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-gray-700">Calle</span>
                        <Input
                            type="text"
                            name="calle"
                            placeholder="Ej: Av. Siempre Viva"
                            value={formInformation.calle}
                            onChange={(value) =>
                                setFormInformation((current) => ({
                                    ...current,
                                    calle: typeof value === 'string' ? value : ''
                                }))
                            }
                        />
                        {errors.calle && <span className="text-xs text-red-500">{errors.calle}</span>}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-700">Número</span>
                            <Input
                                type="text"
                                name="numero"
                                placeholder="Ej: 742"
                                value={formInformation.numero}
                                onChange={(value) =>
                                    setFormInformation((current) => ({
                                        ...current,
                                        numero: typeof value === 'string' ? value : ''
                                    }))
                                }
                            />
                            {errors.numero && <span className="text-xs text-red-500">{errors.numero}</span>}
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-700">Casa (opcional)</span>
                            <Input
                                type="text"
                                name="casa"
                                placeholder="Ej: B"
                                value={formInformation.casa}
                                onChange={(value) =>
                                    setFormInformation((current) => ({
                                        ...current,
                                        casa: typeof value === 'string' ? value : ''
                                    }))
                                }
                            />
                            {errors.casa && <span className="text-xs text-red-500">{errors.casa}</span>}
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-700">Zona:</span>
                            <Select value={formInformation.zonaId ? formInformation.zonaId.toString() : ""} onValueChange={(value) => setFormInformation(current => ({
                                ...current,
                                zonaId: parseInt(value)
                            }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por direccion" />
                                </SelectTrigger>
                                <SelectContent>
                                    {zonas.map(zona => (
                                        <SelectItem key={zona.id} value={zona.id.toString()}>{zona.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.zonaId && <span className="text-xs text-red-500">{errors.zonaId}</span>}
                        </label>
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                        <Button color='red' size='md' onClick={close} className="px-6" type="button">Cerrar</Button>
                        <Button color='primary' size='md' className="px-6" type="submit">Crear</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}