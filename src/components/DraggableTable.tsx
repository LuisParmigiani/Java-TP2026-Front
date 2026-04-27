import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from './Table';
import { cn } from '../lib/utils';
import { GripVertical } from 'lucide-react';

// Interfaz para la estructura de un domicilio
export interface Domicilio {
  id: string | number;
  orden: number;
  calle: string;
  altura: string | number;
  casa_dpto: string;
  piso: string;
  zona: string;
  diaZonaOrdenId?: number; // ID del registro de orden para actualizaciones
}

interface DraggableTableProps {
  data: Domicilio[];
  onReorder: (reorderedData: Domicilio[]) => void;
  className?: string;
}

export const DraggableTable = React.forwardRef<HTMLTableElement, DraggableTableProps>(
  ({ data, onReorder, className }, ref) => {
    // Estado interno para seguimiento durante drag-and-drop
    const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
    const [tableData, setTableData] = React.useState<Domicilio[]>(data);
    // Estado para mostrar intento de drop inválido (drag entre zonas)
    const [invalidDropIndex, setInvalidDropIndex] = React.useState<number | null>(null);

    // Sincronizar datos cuando cambian desde props
    React.useEffect(() => {
      setTableData(data);
    }, [data]);

    /**
     * Se ejecuta cuando inicia el drag de una fila
     * Guardamos el índice de la fila que se está arrastrando
     */
    const handleDragStart = (index: number, e: React.DragEvent<HTMLTableRowElement>) => {
      setDraggedIndex(index);
      // Establecer el efecto visual del cursor
      e.dataTransfer.effectAllowed = 'move';
    };

    /**
     * Se ejecuta cuando el elemento arrastrado está sobre otra fila
     * Prevenimos el comportamiento por defecto para permitir drop
     * IMPORTANTE: Solo permite drop si la zona es la misma
     */
    const handleDragOver = (index: number, e: React.DragEvent<HTMLTableRowElement>) => {
      e.preventDefault();
      
      // Validar que la zona del elemento arrastrado sea la misma que la zona destino
      if (draggedIndex !== null && tableData[draggedIndex].zona !== tableData[index].zona) {
        // No permitir drop entre zonas diferentes
        setInvalidDropIndex(index);
        e.dataTransfer.dropEffect = 'none';
        return;
      }

      // Si las zonas son iguales, permitir drop
      e.dataTransfer.dropEffect = 'move';
      setDragOverIndex(index);
      setInvalidDropIndex(null);
    };

    /**
     * Se ejecuta cuando el elemento deja de estar sobre una fila
     * Limpiamos el estado visual
     */
    const handleDragLeave = () => {
      setDragOverIndex(null);
      setInvalidDropIndex(null);
    };

    /**
     * Se ejecuta cuando se suelta el elemento en una nueva posición
     * Aquí es donde reordenamos los elementos del array
     * VALIDACIÓN: Solo permite reordenar dentro de la misma zona
     */
    const handleDrop = (dropIndex: number, e: React.DragEvent<HTMLTableRowElement>) => {
      e.preventDefault();
      
      // Validar que hay un índice válido para arrastrar
      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        setInvalidDropIndex(null);
        return;
      }

      // VALIDACIÓN CRUCIAL: No permitir mover entre zonas diferentes
      if (tableData[draggedIndex].zona !== tableData[dropIndex].zona) {
        console.warn(
          `No se puede mover de zona "${tableData[draggedIndex].zona}" a "${tableData[dropIndex].zona}"`
        );
        setDraggedIndex(null);
        setDragOverIndex(null);
        setInvalidDropIndex(null);
        return;
      }

      // Crear una copia del array para modificar
      const newData = [...tableData];
      
      // Extraer el elemento arrastrado
      const [draggedItem] = newData.splice(draggedIndex, 1);
      
      // Insertarlo en la nueva posición
      newData.splice(dropIndex, 0, draggedItem);

      // Actualizar los números de orden después del reordenamiento
      // Esto asegura que la columna "orden" siempre esté secuencial (1, 2, 3...)
      const reorderedData = newData.map((item, index) => ({
        ...item,
        orden: index + 1,
      }));

      // Actualizar estado local
      setTableData(reorderedData);
      
      // Notificar al componente padre del nuevo orden
      onReorder(reorderedData);

      // Limpiar estados de drag
      setDraggedIndex(null);
      setDragOverIndex(null);
      setInvalidDropIndex(null);
    };

    /**
     * Se ejecuta al final del drag (éxito o cancelación)
     * Limpiamos los estados visuales
     */
    const handleDragEnd = () => {
      setDraggedIndex(null);
      setDragOverIndex(null);
      setInvalidDropIndex(null);
    };
    const spacing = 'py-4';

    return (
      <div className="relative w-full overflow-auto">
        <Table ref={ref} className={className}>
          <TableHeader>
            <TableRow>
              {/* Columna para el icono de arrastre */}
              <TableHead className="w-10"></TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Zona</TableHead>
              <TableHead>Calle</TableHead>
              <TableHead>Altura</TableHead>
              <TableHead>Casa/Dpto</TableHead>
              <TableHead>Piso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((domicilio, index) => (
                <TableRow
                  key={domicilio.id}
                  // Hacemos la fila draggable
                  draggable
                  onDragStart={(e) => handleDragStart(index, e)}
                  onDragOver={(e) => handleDragOver(index, e)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(index, e)}
                  onDragEnd={handleDragEnd}
                  // Estilos condicionales para feedback visual
                  className={cn(
                    'cursor-move transition-colors',
                    // Cuando es la fila siendo arrastrada, mostramos opacidad reducida
                    draggedIndex === index && 'opacity-50 bg-primary/10',
                    // Cuando es la fila destino VÁLIDA, mostramos un fondo más oscuro
                    dragOverIndex === index && draggedIndex !== index && 'bg-primary-100 border-t-2 border-primary-500',
                    // FEEDBACK VISUAL DE INTENTO INVÁLIDO: Fila en rojo cuando intenta drop entre zonas
                    invalidDropIndex === index && draggedIndex !== index && 'bg-danger-200 border-t-2 border-danger-500'
                  )}
                >
                  {/* Icono de arrastre */}
                  <TableCell className={cn("w-10 text-center cursor-grab active:cursor-grabbing", spacing)}>
                    <GripVertical className="w-4 h-4 mx-auto text-muted-foreground" />
                  </TableCell>
                  {/* Columnas de datos */}
                  <TableCell className={cn("font-medium", spacing)}>{domicilio.orden}</TableCell>
                  <TableCell className={cn("font-semibold text-primary",spacing)}>{domicilio.zona}</TableCell>
                  <TableCell className={cn(spacing)}>{domicilio.calle}</TableCell>
                  <TableCell>{domicilio.altura}</TableCell>
                  <TableCell>{domicilio.casa_dpto}</TableCell>
                  <TableCell>{domicilio.piso}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay domicilios registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
);

DraggableTable.displayName = 'DraggableTable';

export default DraggableTable;
