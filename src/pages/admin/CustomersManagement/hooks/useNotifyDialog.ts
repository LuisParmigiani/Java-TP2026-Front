import { useState } from 'react';
import { toast } from 'sonner';
import { sendMail } from '../../../../services/MailService';
import type {
  PersonaResponse,
  ErrorResponse,
} from '../../../../services/Interfaces';
import { formatErrorResponse } from '../../../../lib/utils';

export const useNotifyDialog = (
  onError?: (error: { errorTitle: string; errorMessage: string }) => void,
) => {
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

  const handleSendNotification = async (
    e: React.FormEvent,
    token: string,
  ): Promise<boolean> => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('El mensaje no puede estar vacío.');
      return false;
    }

    try {
      const mailData = {
        destino: customer!.email,
        asunto: 'Notificación de Sodas Rojas',
        cuerpo: message,
      };

      await sendMail(token, mailData);

      toast.success(
        `Notificación enviada a ${customer!.nombre} ${customer!.apellido}`,
      );
      handleCloseDialog();
      return true;
    } catch (err) {
      const errorResponse = err as ErrorResponse;
      const formattedError = formatErrorResponse(errorResponse);
      onError?.(formattedError);
      toast.error(errorResponse.mensaje);
      return false;
    }
  };

  return {
    isOpen,
    setIsOpen,
    customer,
    message,
    setMessage,
    handleOpenDialog,
    handleCloseDialog,
    handleSendNotification,
  };
};
