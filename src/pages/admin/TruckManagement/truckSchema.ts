import { z } from 'zod';

export const truckSchema = z.object({
  marca: z
    .string()
    .min(1, 'La marca no puede estar vacía')
    .max(250, 'La marca no puede tener más de 250 caracteres'),
  modelo: z
    .string()
    .min(1, 'El modelo no puede estar vacío')
    .max(250, 'El modelo no puede tener más de 250 caracteres'),
  patente: z
    .string()
    .min(1, 'La patente no puede estar vacía')
    .max(7, 'La patente no puede tener más de 7 caracteres')
    .regex(
      /^([A-Z]{3}\s?\d{3}|[A-Z]{2}\s?\d{3}\s?[A-Z]{2})$/,
      'La patente debe tener formato argentino: AAA 000 o AA 000 AA',
    ),
  kilometraje: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return NaN;
      return Number(val);
    },
    z
      .number()
      .int('El kilometraje debe ser un número entero')
      .min(0, 'El kilometraje no puede ser negativo'),
  ),
  estado: z.string().min(1, 'El estado es requerido'),
});

export type TruckFormData = z.infer<typeof truckSchema>;
