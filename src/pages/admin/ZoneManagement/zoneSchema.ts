import { z } from 'zod';

export const zoneSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'Nombre muy corto'),
  detalle: z
    .string()
    .min(1, 'El detalle es requerido')
    .max(255, 'Detalle demasiado largo')
    .refine(
      (v) => !/[,\n]/.test(v),
      'El detalle no puede contener comas ni saltos de línea',
    ),

  // Normalizamos la entrada a número y luego validamos con mensaje personalizado
  camionId: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return NaN;
      return Number(val);
    },
    z
      .number()
      .int()
      .refine((n) => !Number.isNaN(n) && n >= 1, {
        message: 'Debes seleccionar un camión',
      }),
  ),

  // Dias: aceptamos la colección de objetos/ids, la normalizamos a array de números y validamos
  dias: z.preprocess(
    (val) => {
      // Si vienen como [{ diaId: 1 }, ...] los convertimos a [1,...]
      if (Array.isArray(val)) {
        return val.map((d) => {
          if (typeof d === 'number') return d;
          if (d && typeof d.diaId === 'number') return d.diaId;
          return NaN;
        });
      }
      return undefined;
    },
    z
      .array(z.number().int().min(1).max(7))
      .min(1, 'Selecciona al menos un día'),
  ),
});

export type ZoneFormData = z.infer<typeof zoneSchema>;
