import { z } from 'zod';

export const productSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  detalle: z
    .string()
    .min(10, 'El detalle debe tener al menos 10 caracteres')
    .max(250, 'El detalle no puede tener más de 250 caracteres'),
  precio: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return NaN;
      return Number(val);
    },
    z
      .number()
      .refine((val) => !isNaN(val), 'El precio debe ser numérico')
      .min(1, 'El precio no puede ser menor o igual a 1'),
  ),
  stock: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return NaN;
      return Number(val);
    },
    z
      .number()
      .refine((val) => !isNaN(val), 'El stock debe ser numérico')
      .int('El stock debe ser un número entero')
      .min(0, 'El stock no puede ser negativo'),
  ),
  activo: z.string().min(1, 'El estado es requerido'),
  imagenUrl: z
    .string()
    .max(500, 'La URL de la imagen es demasiado larga')
    .optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
