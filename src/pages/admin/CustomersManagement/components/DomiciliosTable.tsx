import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../../components/Table";
import type { DomicilioResponse } from "../../../../services/Interfaces.ts";
import { Badge } from "../../../../components/Badge.tsx";
import { Button } from "../../../../components/Button.tsx";

import { Edit, Trash2 } from "lucide-react";

interface TableDomicilioProps {
  domicilios: DomicilioResponse[] | null;
}
export function DomiciliosTable({ domicilios }: TableDomicilioProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Direccion</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Persona</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {domicilios && domicilios.length > 0 ? (
          domicilios.map((dom) => (
            <TableRow key={dom.id}>
              <TableCell>{dom.calle + " " + dom.numero}</TableCell>
              <TableCell>
                <Badge className="w-25">
                  {dom.activo ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell>
                {dom.persona?.nombre} {dom.persona?.apellido}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="icon" title="Editar">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="danger" size="icon" title="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-gray-500 py-4">
              No hay domicilios para mostrar
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
