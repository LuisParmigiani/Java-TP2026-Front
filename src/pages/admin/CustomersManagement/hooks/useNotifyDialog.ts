import { useState } from 'react';
import type { PersonaResponse } from '../../../../services/Interfaces';

export const useNotifyDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState<PersonaResponse | null>(null);
  const [message, setMessage] = useState('');

  const handleOpenDialog = (selectedCustomer: PersonaResponse) => {
    setCustomer(selectedCustomer);
    setMessage('');
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setCustomer(null);
    setMessage('');
  };

  return {
    isOpen,
    customer,
    message,
    setMessage,
    handleOpenDialog,
    handleCloseDialog,
  };
};
