import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../../../components/Table';
import type { PersonaResponse } from '../../../../services/Interfaces';
import { stylesFromSaldo } from '../../../../lib/utils';
import { Badge } from '../../../../components/Badge';
import { Button } from '../../../../components/Button';
import { Edit, Trash2, Bell, Ellipsis } from 'lucide-react';

interface CustomersTableProps {
  customers: PersonaResponse[];
  onEdit: (customer: PersonaResponse) => void;
  onNotify: (customer: PersonaResponse) => void;
  onDelete: (id: number) => void;
}

export const CustomersTable = ({
  customers,
  onEdit,
  onNotify,
  onDelete,
}: CustomersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>id</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Saldo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right pr-14">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers && customers.length > 0 ? (
          customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.id}</TableCell>
              <TableCell className="font-medium">
                {customer.nombre} {customer.apellido}
              </TableCell>
              <TableCell>{customer.telefono}</TableCell>
              <TableCell className={stylesFromSaldo(customer.saldo)}>
                {customer.saldo.toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge personaEstado={customer.estado} className="w-25">
                  {customer.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(customer)}
                  title="Más opciones"
                >
                  <Ellipsis className="w-4 h-4" />
                </Button>
                <Button
                  variant="tertiary"
                  size="icon"
                  onClick={() => onNotify(customer)}
                  title="Notificar"
                >
                  <Bell className="w-4 h-4" />
                </Button>
                <Button
                  variant="accent"
                  size="icon"
                  onClick={() => onEdit(customer)}
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="danger"
                  size="icon"
                  className="text-destructive"
                  onClick={() => onDelete(customer.id)}
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-gray-500 py-4">
              No hay clientes para mostrar
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};