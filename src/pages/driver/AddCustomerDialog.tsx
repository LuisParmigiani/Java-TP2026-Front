import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '../../components/Button';
import Input from '../../components/Input';
import { Label } from '../../components/Label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/Select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../components/Dialog';
import type { PersonaResponse } from '../../services/Interfaces';

const customerSchema = z.object({
    tipoDoc: z.string().min(1, 'El tipo de documento es requerido'),
    nroDocumento: z.string()
        .min(1, 'El número de documento es requerido')
        .regex(/^\d{5,10}$/, 'El número de documento debe tener entre 5 y 10 dígitos'),
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    apellido: z.string().optional().default(''),
    email: z.string().email('El correo electrónico no es válido'),
    telefono: z.string().optional().default(''),
    saldo: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'El saldo debe ser un número mayor o igual a 0'),
    estado: z.enum(['activo', 'inactivo'], { message: 'El estado debe ser activo o inactivo' }),
});

type FormData = {
    tipoDoc: string;
    nroDocumento: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    saldo: string;
    estado: string;
};

const emptyForm: FormData = {
    tipoDoc: '', nroDocumento: '', nombre: '', apellido: '',
    email: '', telefono: '', saldo: '0', estado: 'activo',
};

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingCustomer: PersonaResponse | null;
    onSave: (customer: PersonaResponse, isEditing: boolean) => void;
}

export default function AddCustomerDialog({ open, onOpenChange, editingCustomer, onSave }: Props) {
    const [formData, setFormData] = useState<FormData>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editingCustomer) {
            setFormData({
                tipoDoc: editingCustomer.tipoDoc,
                nroDocumento: editingCustomer.nroDocumento,
                nombre: editingCustomer.nombre,
                apellido: editingCustomer.apellido,
                email: editingCustomer.email,
                telefono: editingCustomer.telefono,
                saldo: editingCustomer.saldo.toString(),
                estado: editingCustomer.estado || 'activo',
            });
        } else {
            setFormData(emptyForm);
        }
        setErrors({});
    }, [editingCustomer, open]);

    const set = (field: keyof FormData) => (value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = customerSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach(err => {
                if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});
        onSave(
            {
                id: editingCustomer?.id ?? Math.floor(Math.random() * 10000),
                tipoDoc: formData.tipoDoc,
                nroDocumento: formData.nroDocumento,
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                telefono: formData.telefono,
                saldo: Number(formData.saldo),
                estado: formData.estado,
            },
            !!editingCustomer,
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingCustomer ? 'Editar Cliente' : 'Agregar Cliente'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tipoDoc">Tipo Doc</Label>
                            <Select value={formData.tipoDoc} onValueChange={set('tipoDoc')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo de documento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DNI">DNI</SelectItem>
                                    <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                    <SelectItem value="LC">Libreta Cívica</SelectItem>
                                    <SelectItem value="LE">Libreta de enrolamiento</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.tipoDoc && <span className="text-xs text-red-500">{errors.tipoDoc}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nroDocumento">Nro Documento</Label>
                            <Input name="nroDocumento" type="text" value={formData.nroDocumento}
                                onChange={(v) => set('nroDocumento')(v as string)} />
                            {errors.nroDocumento && <span className="text-xs text-red-500">{errors.nroDocumento}</span>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input name="nombre" type="text" value={formData.nombre}
                                onChange={(v) => set('nombre')(v as string)} />
                            {errors.nombre && <span className="text-xs text-red-500">{errors.nombre}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apellido">Apellido</Label>
                            <Input name="apellido" type="text" value={formData.apellido}
                                onChange={(v) => set('apellido')(v as string)} />
                            {errors.apellido && <span className="text-xs text-red-500">{errors.apellido}</span>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" type="email" value={formData.email}
                            onChange={(v) => set('email')(v as string)} />
                        {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input name="telefono" type="text" value={formData.telefono}
                                onChange={(v) => set('telefono')(v as string)} />
                            {errors.telefono && <span className="text-xs text-red-500">{errors.telefono}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="saldo">Saldo ($)</Label>
                            <Input name="saldo" type="number" value={formData.saldo}
                                onChange={(v) => set('saldo')(v as string)} />
                            {errors.saldo && <span className="text-xs text-red-500">{errors.saldo}</span>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select value={formData.estado} onValueChange={set('estado')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="inactivo">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.estado && <span className="text-xs text-red-500">{errors.estado}</span>}
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
