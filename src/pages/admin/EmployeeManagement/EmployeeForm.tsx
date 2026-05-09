import { useState } from 'react';
import { Button } from '../../../components/Button';
import { FormField } from '../../../components/FormField';

export type PersonUserFormData = {
  persona_tipoDoc: string;
  persona_nroDoc: string;
  persona_nombre: string;
  persona_apellido: string;
  persona_telefono: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  usuario_nombre: string;
  usuario_nivelAcceso?: string;
};

type Props = {
  initial?: Partial<PersonUserFormData>;
  requirePassword?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (data: PersonUserFormData) => Promise<void> | void;
};

export default function EmployeeForm({
  initial = {},
  requirePassword = true,
  submitLabel = 'Enviar',
  onCancel,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<PersonUserFormData>({
    persona_tipoDoc: initial.persona_tipoDoc || '',
    persona_nroDoc: initial.persona_nroDoc || '',
    persona_nombre: initial.persona_nombre || '',
    persona_apellido: initial.persona_apellido || '',
    persona_telefono: initial.persona_telefono || '',
    email: initial.email || '',
    password: initial.password || '',
    confirmPassword: initial.confirmPassword || '',
    usuario_nombre: initial.usuario_nombre || '',
    usuario_nivelAcceso: initial.usuario_nivelAcceso || 'Empleado',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.persona_tipoDoc)
      newErrors.persona_tipoDoc = 'El tipo de documento es requerido';
    if (!form.persona_nroDoc)
      newErrors.persona_nroDoc = 'El número de documento es requerido';
    else if (!/^\d{5,10}$/.test(form.persona_nroDoc))
      newErrors.persona_nroDoc =
        'El número de documento debe tener entre 5 y 10 dígitos';
    if (!form.persona_nombre)
      newErrors.persona_nombre = 'El nombre es requerido';
    if (!form.persona_telefono)
      newErrors.persona_telefono = 'El teléfono es requerido';
    else if (!/^\d{10}$/.test(form.persona_telefono))
      newErrors.persona_telefono = 'El teléfono debe tener 10 dígitos';
    if (
      form.email &&
      !/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)
    )
      newErrors.email = 'Email inválido';
    if (requirePassword) {
      if (!form.password) newErrors.password = 'La contraseña es requerida';
      else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          form.password,
        )
      ) {
        console.log(form.password);
        newErrors.password =
          'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y caracter especial';
      }
      if (form.password !== form.confirmPassword)
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!form.usuario_nombre)
      newErrors.usuario_nombre = 'El nombre de usuario es requerido';
    else if (!/^[a-zA-Z0-9_]{3,}$/.test(form.usuario_nombre))
      newErrors.usuario_nombre =
        'El nombre de usuario debe tener al menos 3 caracteres y sólo letras, números o guión bajo';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <FormField
        label="Tipo de Documento"
        name="persona_tipoDoc"
        type="select"
        value={form.persona_tipoDoc}
        onChange={handleChange}
        error={errors.persona_tipoDoc}
        options={[
          { value: 'DNI', label: 'DNI' },
          { value: 'Cédula', label: 'Cédula' },
        ]}
        required
      />
      <FormField
        label="Número de Documento"
        name="persona_nroDoc"
        type="text"
        value={form.persona_nroDoc}
        onChange={handleChange}
        error={errors.persona_nroDoc}
        required
      />
      <FormField
        label="Nombre"
        name="persona_nombre"
        type="text"
        value={form.persona_nombre}
        onChange={handleChange}
        error={errors.persona_nombre}
        required
      />
      <FormField
        label="Apellido"
        name="persona_apellido"
        type="text"
        value={form.persona_apellido}
        onChange={handleChange}
        error={errors.persona_apellido}
      />
      <FormField
        label="Teléfono"
        name="persona_telefono"
        type="text"
        value={form.persona_telefono}
        onChange={handleChange}
        error={errors.persona_telefono}
        required
      />
      <FormField
        label="Correo"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />
      {requirePassword && (
        <>
          <FormField
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <FormField
            label="Repetir Contraseña"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
        </>
      )}
      <FormField
        label="Nombre de Usuario"
        name="usuario_nombre"
        type="text"
        value={form.usuario_nombre}
        onChange={handleChange}
        error={errors.usuario_nombre}
        required
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="grayTransparent" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Procesando...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
