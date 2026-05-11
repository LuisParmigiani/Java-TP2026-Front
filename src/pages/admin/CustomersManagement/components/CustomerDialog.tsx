import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/Select.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/Dialog.tsx";
import type { PersonaResponse } from "../../../../services/Interfaces.ts";
import type { Dispatch, SetStateAction } from "react";
import { Label } from "../../../../components/Label";
import { Button } from "../../../../components/Button.tsx";
import Input from "../../../../components/Input";
interface CustomerFormData {
  tipoDoc: string;
  nroDocumento: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  saldo: string;
  estado: string;
}
interface CustomerDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (boolean) => void;
  editingCustomer: PersonaResponse | null;

  handleSave: (e) => Promise<void>;
  formData: CustomerFormData;
  setFormData: Dispatch<SetStateAction<CustomerFormData>>;
  errors: Record<string, string>;
  isSubmitting?: boolean;
}
export function CustomerDialog({
  isDialogOpen,
  setIsDialogOpen,
  editingCustomer,
  handleSave,
  formData,
  setFormData,
  errors,
  isSubmitting = false,
}: CustomerDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCustomer ? "Editar Cliente" : "Agregar Cliente"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoDoc">Tipo Doc</Label>
              <Select
                value={formData.tipoDoc}
                onValueChange={(val) =>
                  setFormData({ ...formData, tipoDoc: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                  <SelectItem value="Cédula">Cédula</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoDoc && (
                <span className="text-xs text-red-500">{errors.tipoDoc}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nroDocumento">Nro Documento</Label>
              <Input
                name="nroDocumento"
                type="text"
                value={formData.nroDocumento}
                onChange={(value) =>
                  setFormData({ ...formData, nroDocumento: value as string })
                }
              />
              {errors.nroDocumento && (
                <span className="text-xs text-red-500">
                  {errors.nroDocumento}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={(value) =>
                  setFormData({ ...formData, nombre: value as string })
                }
              />
              {errors.nombre && (
                <span className="text-xs text-red-500">{errors.nombre}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                name="apellido"
                type="text"
                value={formData.apellido}
                onChange={(value) =>
                  setFormData({ ...formData, apellido: value as string })
                }
              />
              {errors.apellido && (
                <span className="text-xs text-red-500">{errors.apellido}</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={(value) =>
                setFormData({ ...formData, email: value as string })
              }
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                name="telefono"
                type="text"
                value={formData.telefono}
                onChange={(value) =>
                  setFormData({ ...formData, telefono: value as string })
                }
              />
              {errors.telefono && (
                <span className="text-xs text-red-500">{errors.telefono}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="saldo">Saldo ($)</Label>
              <Input
                name="saldo"
                type="number"
                value={formData.saldo}
                onChange={(value) =>
                  setFormData({ ...formData, saldo: value as string })
                }
              />
              {errors.saldo && (
                <span className="text-xs text-red-500">{errors.saldo}</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formData.estado}
              onValueChange={(val) => setFormData({ ...formData, estado: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Habilitado">Habilitado</SelectItem>
                <SelectItem value="Deshabilitado">Deshabilitado</SelectItem>
              </SelectContent>
            </Select>
            {errors.estado && (
              <span className="text-xs text-red-500">{errors.estado}</span>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
