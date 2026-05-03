import { useState } from 'react';
import type { PersonaResponse } from '../../../../services/Interfaces';

export interface CustomerFormState {
  tipoDoc: string;
  nroDocumento: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  saldo: string;
  estado: string;
}

const INITIAL_FORM_STATE: CustomerFormState = {
  tipoDoc: '',
  nroDocumento: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  saldo: '0',
  estado: '',
};

export const useCustomerDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<PersonaResponse | null>(null);
  const [formData, setFormData] =
    useState<CustomerFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenDialog = (customer: PersonaResponse | null = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        tipoDoc: customer.tipoDoc,
        nroDocumento: customer.nroDocumento,
        nombre: customer.nombre,
        apellido: customer.apellido,
        email: customer.email,
        telefono: customer.telefono,
        saldo: customer.saldo.toString(),
        estado: customer.estado,
      });
    } else {
      setEditingCustomer(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setErrors({});
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setEditingCustomer(null);
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  };

  return {
    isOpen,
    editingCustomer,
    formData,
    errors,
    setFormData,
    setErrors,
    handleOpenDialog,
    handleCloseDialog,
  };
};
