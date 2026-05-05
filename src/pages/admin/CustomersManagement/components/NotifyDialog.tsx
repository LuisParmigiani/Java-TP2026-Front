import type { PersonaResponse } from '../../../../services/Interfaces.ts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../components/Dialog.tsx';
import { Label } from '../../../../components/Label';
import { Button } from '../../../../components/Button.tsx';
import { Textarea } from '../../../../components/TextArea';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
interface NotifyProps {
  isNotifyOpen:boolean,
  setIsNotifyOpen:(b:boolean)=>void,
  notifyCustomer: PersonaResponse | null
  handleSendNotification:(e)=>void,
  notificationMsg:string,
  setNotificationMsg:(a:string)=>void

}
export function NotifyDialog(
  {
    isNotifyOpen,
    setIsNotifyOpen,
    notifyCustomer,
    handleSendNotification,
    notificationMsg,
    setNotificationMsg
  }:NotifyProps
){
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSending(true);
    try {
      await handleSendNotification(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isNotifyOpen} onOpenChange={setIsNotifyOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='border-b-4 border-secondary w-fit '>
            Notificar a {notifyCustomer?.nombre} {notifyCustomer?.apellido}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div>
              <Label htmlFor="message" className='text-md font-semibold'>
                Mensaje
              </Label>
            </div>
            <Textarea
              id="message"
              rows={4}
              placeholder="Escribe el mensaje aquí..."
              value={notificationMsg}
              onChange={(e) => setNotificationMsg(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNotifyOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Notificación'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}