import { useState, useEffect } from 'react';
import { Helmet } from '../../../components/Helmet.tsx';
import NavBar from '../../../components/NavBar.tsx';
import Footer from '../../../components/Footer.tsx';
import { Card, CardContent } from '../../../components/Card.tsx';
import { Button } from '../../../components/Button.tsx';
import EmployeeForm, { type PersonUserFormData } from './EmployeeForm.tsx';

import type {
  ErrorResponse,
  PersonaResponse,
  UserResponse
} from '../../../services/Interfaces.ts';
import { formatErrorResponse } from '../../../lib/utils.ts';
import { useAuth } from '../../../hooks/useAuth.ts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/Dialog.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/Table.tsx';
import { Plus, Edit, Trash2, Link } from 'lucide-react';
import { Badge } from '../../../components/Badge.tsx';
import { toast } from 'sonner';
import { fetchEmployees,deleteEmployee, UpdateEmployee } from '../../../services/EmployeeService.ts';
import { Alert, AlertDescription, AlertTitle } from '../../../components/Alert.tsx';

const EmployeeManagement = () => {
  
  const [employees, setEmployees] = useState<UserResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<UserResponse  | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<{
    errorTitle: string;
    errorMessage: string;
  } | null>(null);
 //! En authService esta el endpoint de register y el componente de Register tiene todo el form para registrarse 
  const {token, currentUser, isAuthenticated ,register:authRegister} = useAuth();
  useEffect(() => {
    const load = async () => {
      if (!token) return; // EVITA EL ERROR 403 SI EL TOKEN AÚN NO CARGÓ
      try {
        const data = await fetchEmployees(token, ['persona'], 'Empleado','Todos','no');
        console.log('Empleados cargados:', data);
        setEmployees(data);
      } catch (errorBack) {
        console.log('Error al cargar empleados:', errorBack);
        const err = errorBack as ErrorResponse;
        const formatted = formatErrorResponse(err);
        const errorMessage =
          formatted?.errorMessage || 'Error de permisos o conexión'; // FALLBACK
        setError({
          errorTitle: formatted?.errorTitle || 'Error',
          errorMessage,
        });
        setShowAlert(true);
        toast.error(errorMessage);
      }
    };
    load();
  }, [token]);

  const loadEmployees = async () => {
    try {
      const data = await fetchEmployees(token, ['persona'], 'Empleado','Todos','si');
      setEmployees(data);
      setError(null);
      setShowAlert(false);
    } catch (err) {
      const e = err as ErrorResponse;
      const formatted = formatErrorResponse(e);
      setError(formatted);
      setShowAlert(true);
      console.log('Error al cargar empleados 2:', formatted);
      toast.error(formatted.errorMessage);
    }
  };

  const handleOpenDialog = (user: UserResponse | null = null) => {
     setError(null);
     setShowAlert(false);
     setEditingEmployee(user);
     setIsDialogOpen(true);
  };
  const mapUserToForm = (user: UserResponse): PersonUserFormData => ({
    persona_tipoDoc: user.persona?.tipoDoc || '',
    persona_nroDoc: user.persona?.nroDocumento || '',
    persona_nombre: user.persona?.nombre || '',
    persona_apellido: user.persona?.apellido || '',
    persona_telefono: user.persona?.telefono || '',
    email: user.email || '',
    password: '',
    confirmPassword: '',
    usuario_nombre: user.nombreUsuario || '',
    usuario_nivelAcceso: user.nivelAcceso || 'Empleado',
  });
  const mapFormToRegisterArgs = (f: PersonUserFormData) => [
    f.email!,
    f.password!,
    f.persona_tipoDoc,
    f.persona_nroDoc,
    f.persona_nombre,
    f.persona_apellido,
    f.persona_telefono,
    f.usuario_nombre,
    f.usuario_nivelAcceso || 'Empleado',
  ];

  
  const handleDelete = (id: number) => {
    console.log('Eliminar empleado con ID:', id);
    if (
      window.confirm(
        '¿Estás seguro de eliminar este empleado? Esta acción no se puede deshacer',
      )
    ) {
      // AGREGADO: Pasamos el token
      deleteEmployee(id, token)
        .then(() => {
          setEmployees((prev) =>
            prev.map((e) =>
              e.id ===  id
                 ? { ...e, persona: { ...e.persona, estado: 'Deshabilitado' } }
                : e,
            ),
          );
          toast.success('Empleado deshabilitado correctamente');
        })
        .catch((error) => {
          const err = error as ErrorResponse;
          const formatted = formatErrorResponse(err);
          const errorMessage =
            formatted?.errorMessage ||
            'Error al eliminar. Verifica tus permisos.'; // FALLBACK
          setError({
            errorTitle: formatted?.errorTitle || 'Error',
            errorMessage,
          });
          setShowAlert(true);
          toast.error(errorMessage);
        });
    }
  };
  if (
    !isAuthenticated ||
    !currentUser ||
    currentUser.role !== 'Administrador'
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Helmet>
          <title>Acceso Denegado - Sodas Rojas</title>
          <meta
            name="description"
            content="Acceso denegado al panel de administración"
          />
        </Helmet>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-lg mb-6">
            No tienes permiso para acceder a esta página.
          </p>
          <Link
            to="/"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Gestión de Empleados - Sodas Rojas</title>
      </Helmet>
      <NavBar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Empleados
            </h1>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Empleado
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table >
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right pr-5">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.id}</TableCell>
                      <TableCell>
                        {emp.persona.nombre + ' ' + emp.persona.apellido}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            emp.persona.estado === 'Habilitado'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {emp.persona.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          className="mr-1"
                          variant="accent"
                          size="icon"
                          onClick={() => handleOpenDialog(emp)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(emp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {employees.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No hay empleados registrados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div>
                {showAlert && (
                  <Alert
                    variant="danger"
                    autoClose={true}
                    onClose={() => {setShowAlert(false);
                      setError(null);
                    }}
                  >
                    <AlertTitle>{error?.errorTitle}</AlertTitle>
                    <AlertDescription>{error?.errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-3 border-primary">
          <DialogHeader>
            <DialogTitle className="border-secondary border-b-3 w-fit rounded-xs">
              {editingEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
            </DialogTitle>
          </DialogHeader>
          <EmployeeForm
            initial={
              editingEmployee ? mapUserToForm(editingEmployee) : undefined
            }
            requirePassword={!editingEmployee}
            submitLabel={editingEmployee ? 'Guardar cambios' : 'Crear empleado'}
            onCancel={() => setIsDialogOpen(false)}
            onSubmit={async (formData) => {
            if (editingEmployee) {
              const personaData: PersonaResponse = {
                id: editingEmployee.persona?.id,
                tipoDoc: formData.persona_tipoDoc,
                nroDocumento: formData.persona_nroDoc,
                nombre: formData.persona_nombre,
                apellido: formData.persona_apellido,
                email: formData.email!,
                telefono: formData.persona_telefono,
                saldo: 0,
                estado:"Habilitado",
              };
              const updatedEmployee: UserResponse = {
                id: editingEmployee.id,
                email: formData.email!,
                nombreUsuario: formData.usuario_nombre,
                nivelAcceso: 'Empleado',
                personaId: editingEmployee.personaId,
                persona: personaData,
              };
            console.log('Actualizando empleado con datos:', updatedEmployee);
              try {
                // AGREGADO: Pasamos el token al final
                await UpdateEmployee(
                  editingEmployee.id,
                  editingEmployee.persona.id,
                  updatedEmployee,
                  token
                );
                toast.success('Empleado actualizado correctamente');
                await loadEmployees();
                setIsDialogOpen(false);
                setEditingEmployee(null);
              } catch (err) {
                const errorResponse = err as ErrorResponse;
                const formattedError = formatErrorResponse(errorResponse);
                const errorMessage =
                  formattedError?.errorMessage || 'Error al actualizar empleado.'; // FALLBACK
                setError({ errorTitle: formattedError?.errorTitle || 'Error', errorMessage });
                setShowAlert(true);
                toast.error(errorMessage);
              }
              } else {
                const [
                  email,
                  password,
                  persona_tipoDoc,
                  persona_nroDoc,
                  persona_nombre,
                  persona_apellido,
                  persona_telefono,
                  usuario_nombre,
                  usuario_nivelAcceso,
                ] = mapFormToRegisterArgs(formData);
                console.log('Registrando empleado con datos:', {
                  email,
                  password,
                  persona_tipoDoc,
                  persona_nroDoc,
                  persona_nombre,
                  persona_apellido,
                  persona_telefono,
                  usuario_nombre,
                  usuario_nivelAcceso,
                });
                try{
                  await authRegister(
                    email,
                    password,
                    persona_tipoDoc,
                    persona_nroDoc,
                    persona_nombre,
                    persona_apellido,
                    persona_telefono,
                    usuario_nombre,
                    usuario_nivelAcceso,
                  );
                  toast.success('Empleado creado correctamente');
                  await loadEmployees();
                  setIsDialogOpen(false);
                  setEditingEmployee(null);
                  console.log('Empleado creado correctamente');
                }catch(err){
                  const errorResponse = err as ErrorResponse;
                  const formattedError = formatErrorResponse(errorResponse);
                  setError(formattedError);
                  setShowAlert(true);
                  toast.error(formattedError.errorMessage);
                }
              }
            }}
          />
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default EmployeeManagement;
