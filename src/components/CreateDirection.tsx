import { useEffect, useRef, useState } from "react";
import type { PersonaResponse, ZonaResponse, domicilioRequest } from "../services/Interfaces";
import { Button } from "./Button";
import Input from "./Input";
import { fetchZones } from "../services/ZoneService";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { z } from "zod";
import { fetchPersonas } from "../services/PersonaService";
import { postDirectionAdmin } from "../services/DirectionService";

const initialForm: domicilioRequest = {
    calle: "",
    numero: "",
    casa: "",
};

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function NewDirection({ open, onClose }: Props) {
    const [formInformation, setFormInformation] = useState<domicilioRequest>(initialForm);
    const [zonas, setZonas] = useState<ZonaResponse[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [direction, setDirection] = useState<domicilioRequest | null>(null);
    const [persons, setPersons] = useState<PersonaResponse[]>([]);
    const [clientSearch, setClientSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredPersons = persons.filter((p) => {
        const fullName = `${p.nombre} ${p.apellido}`.toLowerCase();
        return fullName.includes(clientSearch.toLowerCase());
    });

    const handleSelectPerson = (person: PersonaResponse) => {
        setFormInformation((current) => ({ ...current, personaId: person.id }));
        setClientSearch(`${person.nombre} ${person.apellido}`);
        setShowDropdown(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!open) return;
        const loadData = async () => {
            try {
                const [zonaResponse, personResponse] = await Promise.all([
                    fetchZones(),
                    fetchPersonas(0, 1000000000),
                ]);
                setZonas(zonaResponse);
                setPersons(personResponse.content);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        loadData();
    }, [open]);

    const domicilioSchema = z.object({
        personaId: z.number().min(1, "El cliente no puede estar vacío"),
        calle: z.string().min(1, "La calle no puede estar vacía"),
        numero: z
            .string()
            .min(1, "El número no puede estar vacío")
            .regex(/^\d{1,5}$/, "El número debe tener entre 1 y 5 dígitos"),
        casa: z
            .string()
            .regex(/^\d{0,5}$/, "El número de casa debe tener entre 0 y 5 dígitos")
            .optional()
            .or(z.literal("")),
        zonaId: z.number().min(1, "El id de la zona no puede estar vacío"),
    });

    const saveDirection = async () => {
        if (direction) {
            const result = await postDirectionAdmin(direction);
            console.log("Direction created successfully:", result);
            setFormInformation(initialForm);
        }
    };

    const checkForm = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const result = domicilioSchema.safeParse(formInformation);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});
        setDirection(formInformation);
        onClose();
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Agregar Dirección</h2>
                <form className="grid grid-cols-1 gap-6" onSubmit={checkForm}>
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-gray-700">Cliente</span>
                        <div className="relative" ref={dropdownRef} onFocusCapture={() => setShowDropdown(true)}>
                            <Input
                                type="text"
                                name="clientSearch"
                                placeholder="Buscar cliente por nombre..."
                                value={clientSearch}
                                onChange={(value) => {
                                    setClientSearch(typeof value === "string" ? value : "");
                                    setFormInformation((current) => ({ ...current, personaId: undefined }));
                                    setShowDropdown(true);
                                }}
                            />
                            {showDropdown && filteredPersons.length > 0 && (
                                <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                                    {filteredPersons.map((person) => (
                                        <li
                                            key={person.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm text-gray-800"
                                            onMouseDown={() => handleSelectPerson(person)}
                                        >
                                            {person.nombre} {person.apellido}
                                            <span className="ml-2 text-xs text-gray-400">#{person.id}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {showDropdown && clientSearch.length > 0 && filteredPersons.length === 0 && (
                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 text-sm text-gray-400">
                                    Sin resultados
                                </div>
                            )}
                        </div>
                        {errors.personaId && <span className="text-xs text-red-500">{errors.personaId}</span>}
                    </label>

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
                                    calle: typeof value === "string" ? value : "",
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
                                        numero: typeof value === "string" ? value : "",
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
                                        casa: typeof value === "string" ? value : "",
                                    }))
                                }
                            />
                            {errors.casa && <span className="text-xs text-red-500">{errors.casa}</span>}
                        </label>

                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-700">Zona</span>
                            <Select
                                value={formInformation.zonaId ? formInformation.zonaId.toString() : ""}
                                onValueChange={(value) =>
                                    setFormInformation((current) => ({
                                        ...current,
                                        zonaId: parseInt(value),
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar zona" />
                                </SelectTrigger>
                                <SelectContent>
                                    {zonas.map((zona) => (
                                        <SelectItem key={zona.id} value={zona.id.toString()}>
                                            {zona.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.zonaId && <span className="text-xs text-red-500">{errors.zonaId}</span>}
                        </label>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <Button color="red" size="md" onClick={onClose} className="px-6" type="button">
                            Cerrar
                        </Button>
                        <Button color="primary" size="md" className="px-6" type="submit" onClick={saveDirection}>
                            Crear
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
