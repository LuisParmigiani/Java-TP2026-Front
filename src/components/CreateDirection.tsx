import { useEffect, useRef, useState } from "react";
import type {
  PersonaResponse,
  ZonaResponse,
  domicilioRequest,
} from "../services/Interfaces";
import { Button } from "./Button";
import Input from "./Input";
import { fetchZones } from "../services/ZoneService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./Select";
import { z } from "zod";
import { searchPersonasByNameOnly } from "../services/PersonaService";
import { postDirectionAdmin } from "../services/DirectionService";
import { useAuth } from "../hooks/useAuth.ts";
import { Loader2 } from "lucide-react";

const initialForm: domicilioRequest = {
  calle: "",
  numero: "",
  casa: "",
  zonaId: 0,
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewDirection({ open, onClose }: Props) {
  const [formInformation, setFormInformation] =
    useState<domicilioRequest>(initialForm);
  const [zonas, setZonas] = useState<ZonaResponse[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dropdownRef = useRef<HTMLDivElement>(null);
  //Combobox
  // Estados para el Combobox de Clientes
  const [persons, setPersons] = useState<PersonaResponse[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const { token, loading } = useAuth();

  // Función para buscar clientes por nombre en el backend
  const searchClientsByName = async (query: string) => {
    // Limpiar timeout anterior (debounce)
    if (searchTimeout) clearTimeout(searchTimeout);

    // Esperar 500ms antes de hacer la llamada
    const timeout = setTimeout(async () => {
      try {
        const search = query;
        const results = await searchPersonasByNameOnly(search, token);
        setPersons(results);
      } catch (error) {
        console.error("Error searching clients:", error);
        setPersons([]); // Limpiar si hay error
      }
    }, 500);

    setSearchTimeout(timeout);
  };

  // Ya no necesitamos filteredPersons porque buscamos en el backend
  const filteredPersons = persons; // Ahora persons ya contiene los resultados filtrados del backend

  const handleSelectPerson = (person: PersonaResponse) => {
    setFormInformation((current) => ({ ...current, personaId: person.id }));
    setClientSearch(`${person.nombre} ${person.apellido}`);
    setShowDropdown(false);
    // Limpiamos el error si existía al seleccionar
    setErrors((prev) => ({ ...prev, personaId: "" }));
  };
  // Cerrar el dropdown al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Limpiar timeout al desmontar
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  // Cargar Zonas al abrir el modal (Personas se cargan al buscar) y limpiar al cerrar
  useEffect(() => {
    if (!open) {
      setFormInformation(initialForm);
      setClientSearch("");
      setErrors({});
      setPersons([]);
      setShowDropdown(false);
      return;
    }
    if (loading) return;

    const loadData = async () => {
      try {
        const zonaResponse = await fetchZones(token);
        setZonas(zonaResponse);
        // Ya no cargamos todas las personas aquí
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, [open, loading, token]);

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
    if (formInformation) {
      const result = await postDirectionAdmin(formInformation, token);
      console.log("Direction created successfully:", result);
      setFormInformation(initialForm);
    }
  };

  // Lógica Unificada de Envío (Solución a la Condición de Carrera)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validar el formulario
    const result = domicilioSchema.safeParse(formInformation);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // 2. Si es válido, limpiar errores y hacer la petición
    setErrors({});
    setIsLoading(true);

    try {
      const resultApi = await postDirectionAdmin(formInformation, token); // Asegúrate de pasar el token aquí si es necesario
      console.log("Dirección creada exitosamente:", resultApi);

      // 3. Resetear el estado y cerrar el modal
      setFormInformation(initialForm);
      setClientSearch("");
      onClose();
    } catch (error) {
      console.error("Error al crear la dirección:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative"
          ref={dropdownRef}
          onFocusCapture={() => setShowDropdown(true)}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Agregar Dirección
          </h2>

          {/* Ahora usamos onSubmit en el formulario para todo el proceso */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            {/* BUSCADOR DE CLIENTES (COMBOBOX) */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">
                Cliente
              </span>
              <div className="relative" ref={dropdownRef}>
                <Input
                  type="text"
                  name="clientSearch"
                  placeholder="Escribe para buscar un cliente..."
                  value={clientSearch}
                  onChange={(value) => {
                    const searchValue = typeof value === "string" ? value : "";
                    setClientSearch(searchValue);
                    setFormInformation((current) => ({
                      ...current,
                      personaId: undefined,
                    }));

                    // Buscar en el backend
                    searchClientsByName(searchValue);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />

                {/* Menú Flotante de Resultados */}
                {showDropdown && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredPersons.length > 0 ? (
                      <ul className="py-1">
                        {filteredPersons.map((person) => (
                          <li
                            key={person.id}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center transition-colors"
                            // Usamos onMouseDown en lugar de onClick para que se dispare ANTES que el onBlur del input
                            onMouseDown={(e) => {
                              e.preventDefault(); // Evita que el input pierda el foco
                              handleSelectPerson(person);
                            }}
                          >
                            <span className="font-medium">
                              {person.nombre} {person.apellido}
                            </span>
                            <span className="text-xs text-gray-400">
                              ID: {person.id}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No se encontraron clientes.
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.personaId && (
                <span className="text-xs text-red-500">{errors.personaId}</span>
              )}
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
              {errors.calle && (
                <span className="text-xs text-red-500">{errors.calle}</span>
              )}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  Número
                </span>
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
                {errors.numero && (
                  <span className="text-xs text-red-500">{errors.numero}</span>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  Casa (opcional)
                </span>
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
                {errors.casa && (
                  <span className="text-xs text-red-500">{errors.casa}</span>
                )}
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold text-gray-700">
                  Zona
                </span>
                <Select
                  value={
                    formInformation.zonaId
                      ? formInformation.zonaId.toString()
                      : ""
                  }
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
                {errors.zonaId && (
                  <span className="text-xs text-red-500">{errors.zonaId}</span>
                )}
              </label>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button
                variant="gray"
                size="md"
                onClick={onClose}
                className="px-6"
                type="button"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                className="px-6 min-w-30"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Creando...
                  </span>
                ) : (
                  "Crear Domicilio"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
