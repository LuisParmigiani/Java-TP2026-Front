import  { useEffect, useState } from 'react';
import { Helmet } from '../../../components/Helmet';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import { Card, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import  Input  from '../../../components/Input';
import { CustomersTable } from './components/CustomersTable';
import { DomiciliosTable } from './components/DomiciliosTable';
import { CustomerDialog } from './components/CustomerDialog';
import { NotifyDialog } from './components/NotifyDialog';
import { Plus,  Search } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { addPersona, deletePersona, fetchPersonas, updatePersona, fetchPersonasByName } from '../../../services/PersonaService.ts';
import type { PersonaResponse ,DomicilioResponse} from '../../../services/Interfaces.ts';
import { fetchDomiciliosByCalleAndNumero } from '../../../services/DirectionService.ts';

// Esquema Zod para validar FormData
const customerSchema = z.object({
  tipoDoc: z.string().min(1, 'El tipo de documento es requerido'),
  nroDocumento: z.string()
    .min(1, 'El número de documento es requerido')
    .regex(/^\d{5,10}$/, 'El número de documento debe tener entre 5 y 10 dígitos'),
  nombre: z.string().min(1, 'El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().optional().default(''),
  email: z.string().email('El correo electrónico no es válido'),
  telefono: z.string().optional().default(''),
  saldo: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'El saldo debe ser un número mayor o igual a 0'),
  estado: z.enum(['activo', 'inactivo'], { message: 'El estado debe ser activo o inactivo' }),
});


const CustomersManagementPage = () => {
  //! Hooks para buscar Personas 
  const [customers, setCustomers] = useState<PersonaResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<PersonaResponse | null>(null);
  const [notifyCustomer, setNotifyCustomer] = useState<PersonaResponse|null>(null);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [formData, setFormData] = useState({
    tipoDoc: '',
    nroDocumento: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    saldo: '0',
    estado: 'Habilitado',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  //! Hooks para bucar Domicilios
  const [domicilios, setDomicilios] = useState<DomicilioResponse[] | null>(null);
  const [searchDomicilio, setSearchDomicilio] = useState('');

  useEffect(() => {
    fetchPersonas()
      .then((data) => setCustomers(data))
      .catch((error) => console.error('Failed to fetch products:', error));
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
        estado: customer.estado,
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        tipoDoc: '',
        nroDocumento: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        saldo: '0',
        estado: '',
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleOpenNotify = (customer) => {
    setNotifyCustomer(customer);
    setNotificationMsg('');
    setIsNotifyOpen(true);
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notificationMsg.trim()) {
      toast.error('El mensaje no puede estar vacío.');
      return;
    }
    toast.success(
      `Notificación enviada a ${notifyCustomer.nombre} ${notifyCustomer.apellido}`,
    );
    setIsNotifyOpen(false);
  };

  const handleSave = async (e) => {
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
      console.log('Updating customer:', editingCustomer);
      await updatePersona(editingCustomer.id, newCustomer);
      toast.success('Cliente actualizado correctamente.');
    } else {
      console.log('Agregando cliente:', newCustomer);
      await addPersona(newCustomer);
      toast.success('Cliente agregado correctamente.');
    }
    const updatedCustomers = await fetchPersonas();
    setCustomers(updatedCustomers);
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: number) => {
    deletePersona(id)
      .then(() => {
        toast.success('Cliente dado de baja');
      })
      .catch((error) => {
        console.error('Error deleting customer:', error);
        toast.error('Error al dar de baja el cliente.');
      });
  };


  
useEffect(() => {
  const timer = setTimeout(() => {
    const loadData = async () => {
      try {
        if (search.trim() === '') {
          const data = await fetchPersonas();
          setCustomers(data);
        } else {
          const results = await fetchPersonasByName(search);
          setCustomers(results);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al buscar clientes.');
      }
    };

    loadData();
  }, 500); // Espera 500ms después de que el usuario deje de escribir para no estar haciendo peticiones al back en cada tecla

  return () => clearTimeout(timer);
}, [search]);
useEffect(() => {
  const timer = setTimeout(() => {
    const loadData = async () => {
      try {
        if (searchDomicilio.trim() === '') {
          setDomicilios(null);
        } else {
          const results = await fetchDomiciliosByCalleAndNumero( ['persona'],searchDomicilio);
          setDomicilios(results);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al buscar domicilios.');
      }
    };

    loadData();
  }, 500); // Espera 500ms después de que el usuario deje de escribir para no estar haciendo peticiones al back en cada tecla

  return () => clearTimeout(timer);
}, [searchDomicilio]);
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
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  name='search'
                  type="text"
                  className="pl-10 w-64"
                  placeholder="Buscar cliente"
                  value={search}
                  onChange={(val) => {
                    setSearch(val as string);
                    //hace de trigger al useEffect que busca las personas
                  }}
                />
              </div>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" /> Agregar Cliente
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
                <CustomersTable
                customers={customers}
                onEdit={handleOpenDialog}
                onDelete={handleDelete}
                onNotify={handleOpenNotify}
                 ></CustomersTable>
            </CardContent>
          </Card>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Domicilios
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  name='search'
                  type="text"
                  className="pl-10 w-64"
                  placeholder="Buscar por dirección o persona"
                  value={searchDomicilio}
                  onChange={(val) => {
                    setSearchDomicilio(val as string);
                    //hace de trigger al useEffect que busca los domicilios
                  }}
                />
              </div>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" /> Agregar Domicilio
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <DomiciliosTable domicilios={domicilios}></DomiciliosTable>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Form Dialog */}
      <CustomerDialog 
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingCustomer={editingCustomer}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      >
      </CustomerDialog>

      {/* Notify Dialog */}
      <NotifyDialog
      
        isNotifyOpen={isNotifyOpen}
        setIsNotifyOpen={setIsNotifyOpen}
        notifyCustomer={notifyCustomer}
        handleSendNotification={handleSendNotification}
        notificationMsg={notificationMsg}
        setNotificationMsg={setNotificationMsg}
      >
      </NotifyDialog>

      <Footer />
    </div>
  );
};

export default CustomersManagementPage;