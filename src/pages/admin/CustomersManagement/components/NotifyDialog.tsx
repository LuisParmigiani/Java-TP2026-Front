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

  return (
    <Dialog open={isNotifyOpen} onOpenChange={setIsNotifyOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Notificar a {notifyCustomer?.nombre} {notifyCustomer?.apellido}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSendNotification} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
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
            <Button type="submit">Enviar Notificación</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}