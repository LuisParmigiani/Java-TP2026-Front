import type { PersonaResponse } from "../services/Interfaces";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";
import InfoRow from "./InfoRow";
import { User, Mail, Phone, Wallet, Package } from "lucide-react";
import { Button } from "./Button";

interface Props {
  open: boolean;
  onClose: () => void;
  persona: PersonaResponse | null | undefined;
  cantEn: number;
}

export default function ClientInfoModal({ open, onClose, persona, cantEn }: Props) {

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        aria-describedby={undefined}
        className="inset-0 left-0 top-0 max-w-none w-screen h-dvh max-h-dvh translate-x-0 translate-y-0 rounded-none flex flex-col p-0 [&>button.absolute]:hidden sm:right-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm sm:h-auto sm:max-h-[90vh] sm:rounded-lg sm:p-6"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b sm:hidden">
          <h2 className="text-xl font-bold">Información del Cliente</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            ✕
          </button>
        </div>

        <DialogTitle className="text-xl font-bold hidden sm:block">
          Información del Cliente
        </DialogTitle>

        <div className="flex-1 px-6 py-4 sm:px-0 sm:py-0">
          {!persona ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Sin información disponible.
            </p>
          ) : (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2">
              <div>
                <InfoRow icon={<User className="w-4 h-4 text-primary" />} label="Nombre" value={persona.nombre} />
                <InfoRow icon={<User className="w-4 h-4 text-primary" />} label="Apellido" value={persona.apellido} />
                <InfoRow icon={<Mail className="w-4 h-4 text-primary" />} label="Email" value={persona.email} />
                <InfoRow icon={<Phone className="w-4 h-4 text-primary" />} label="Teléfono" value={persona.telefono} />
              </div>
              <div>
                <InfoRow icon={<Wallet className="w-4 h-4 text-primary" />} label="Saldo" value={`$${persona.saldo}`} />
                <InfoRow icon={<Package className="w-4 h-4 text-primary" />} label="Envases que posee" value={String(cantEn)} />
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t px-6 py-4 flex justify-end sm:border-0 sm:px-0 sm:py-0 sm:mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
