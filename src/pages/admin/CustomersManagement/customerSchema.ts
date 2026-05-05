import { z } from 'zod';

export const customerSchema = z.object({
  tipoDoc: z.string().min(1, 'El tipo de documento es requerido'),
  nroDocumento: z
    .string()
    .min(1, 'El número de documento es requerido')
    .regex(
      /^\d{5,10}$/,
      'El número de documento debe tener entre 5 y 10 dígitos',
    ),
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().optional().default(''),
  email: z.string().email('El correo electrónico no es válido'),
  telefono: z
    .string()
    .regex(/^\d{10}$/, 'El teléfono debe tener exactamente 10 dígitos'),
  saldo: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      'El saldo debe ser un número mayor o igual a 0',
    ),
  estado: z.enum(['Habilitado', 'Deshabilitado', 'Pendiente'], {
    message: 'El estado debe ser Habilitado, Deshabilitado o Pendiente',
  }),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
