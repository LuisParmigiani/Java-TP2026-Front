import { useEffect, useState } from "react";
import { Helmet } from "../../components/Helmet";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { Card, CardContent } from "../../components/Card";
import { Button } from "../../components/Button";
import Input from "../../components/Input";
import { Label } from "../../components/Label";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/Dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/Table";
import { Badge } from "../../components/Badge";
import { Textarea } from "../../components/TextArea";
import { Plus, Edit, Trash2, Bell } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { fetchPersonas } from "../../services/PersonaService.ts";
import type { PersonaResponse } from "../../services/Interfaces.ts";

// Esquema Zod para validar FormData
const customerSchema = z.object({
  tipoDoc: z.string().min(1, "El tipo de documento es requerido"),
  nroDocumento: z
    .string()
    .min(1, "El número de documento es requerido")
    .regex(
      /^\d{5,10}$/,
      "El número de documento debe tener entre 5 y 10 dígitos",
    ),
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().optional().default(""),
  email: z.string().email("El correo electrónico no es válido"),
  telefono: z.string().optional().default(""),
  saldo: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "El saldo debe ser un número mayor o igual a 0",
    ),
  estado: z.enum(["activo", "inactivo"], {
    message: "El estado debe ser activo o inactivo",
  }),
});

const CustomersManagementPage = () => {
  const [customers, setCustomers] = useState<PersonaResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<PersonaResponse | null>(null);
  const [notifyCustomer, setNotifyCustomer] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [formData, setFormData] = useState({
    tipoDoc: "",
    nroDocumento: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    saldo: "0",
    estado: "activo",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { currentUser, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    fetchPersonas()
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Failed to fetch products:", error));
  }, []);
  const handleOpenDialog = (customer = null) => {
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
        estado: customer.estado || "activo",
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        tipoDoc: "",
        nroDocumento: "",
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        saldo: "0",
        estado: "activo",
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    !currentUser ||
    currentUser.role !== "Administrador"
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
  const handleOpenNotify = (customer) => {
    setNotifyCustomer(customer);
    setNotificationMsg("");
    setIsNotifyOpen(true);
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notificationMsg.trim()) {
      toast.error("El mensaje no puede estar vacío.");
      return;
    }
    toast.success(
      `Notificación enviada a ${notifyCustomer.nombre} ${notifyCustomer.apellido}`,
    );
    setIsNotifyOpen(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Validar con Zod
    const result = customerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const newCustomer = {
      id: editingCustomer
        ? editingCustomer.id
        : Math.floor(Math.random() * 10000),
      tipoDoc: formData.tipoDoc,
      nroDocumento: formData.nroDocumento,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      saldo: Number(formData.saldo),
      estado: formData.estado,
    };

    if (editingCustomer) {
      setCustomers(
        customers.map((c) => (c.id === editingCustomer.id ? newCustomer : c)),
      );
      toast.success("Cliente actualizado correctamente.");
    } else {
      setCustomers([...customers, newCustomer]);
      toast.success("Cliente agregado correctamente.");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      setCustomers(customers.filter((c) => c.id !== id));
      toast.success("Cliente eliminado.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Gestión de Clientes - Sodas Rojas</title>
      </Helmet>
      <NavBar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Clientes
            </h1>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Cliente
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>id</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer.tipoDoc} {customer.nroDocumento}
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer.nombre} {customer.apellido}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.telefono}</TableCell>
                      <TableCell
                        className={
                          customer.saldo > 0
                            ? "text-destructive font-medium"
                            : "text-green-600"
                        }
                      >
                        ${customer.saldo.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            customer.estado === "activo"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {customer.estado === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenNotify(customer)}
                          title="Notificar"
                        >
                          <Bell className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(customer)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? "Editar Cliente" : "Agregar Cliente"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoDoc">Tipo Doc</Label>
                <Select
                  value={formData.tipoDoc}
                  onValueChange={(val) =>
                    setFormData({ ...formData, tipoDoc: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                    <SelectItem value="LC">Libreta Cívica</SelectItem>
                    <SelectItem value="LE">Libreta de enrolamiento</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoDoc && (
                  <span className="text-xs text-red-500">{errors.tipoDoc}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nroDocumento">Nro Documento</Label>
                <Input
                  name="nroDocumento"
                  type="text"
                  value={formData.nroDocumento}
                  onChange={(value) =>
                    setFormData({ ...formData, nroDocumento: value as string })
                  }
                />
                {errors.nroDocumento && (
                  <span className="text-xs text-red-500">
                    {errors.nroDocumento}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(value) =>
                    setFormData({ ...formData, nombre: value as string })
                  }
                />
                {errors.nombre && (
                  <span className="text-xs text-red-500">{errors.nombre}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  name="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={(value) =>
                    setFormData({ ...formData, apellido: value as string })
                  }
                />
                {errors.apellido && (
                  <span className="text-xs text-red-500">
                    {errors.apellido}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={(value) =>
                  setFormData({ ...formData, email: value as string })
                }
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  name="telefono"
                  type="text"
                  value={formData.telefono}
                  onChange={(value) =>
                    setFormData({ ...formData, telefono: value as string })
                  }
                />
                {errors.telefono && (
                  <span className="text-xs text-red-500">
                    {errors.telefono}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="saldo">Saldo ($)</Label>
                <Input
                  name="saldo"
                  type="number"
                  value={formData.saldo}
                  onChange={(value) =>
                    setFormData({ ...formData, saldo: value as string })
                  }
                />
                {errors.saldo && (
                  <span className="text-xs text-red-500">{errors.saldo}</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(val) =>
                  setFormData({ ...formData, estado: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && (
                <span className="text-xs text-red-500">{errors.estado}</span>
              )}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Notify Dialog */}
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

      <Footer />
    </div>
  );
};

export default CustomersManagementPage;
