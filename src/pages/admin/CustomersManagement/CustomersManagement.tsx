import  { useEffect, useState, useMemo } from 'react';
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
import type { PersonaResponse } from '../../../services/Interfaces.ts';
import { useAuth } from '../../../hooks/useAuth.ts';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '../../../components/Alert.tsx';
// Esquema Zod para validar FormData
import { useCustomers } from './hooks/useCustomers';
import { useDomicilios } from './hooks/useDomicilios';
import { useNotifyDialog } from './hooks/useNotifyDialog';
import { customerSchema } from './customerSchema';
import { useCustomerDialog } from './hooks/useCustomerDialog';
import { ClientesFilter } from './components/ClientesFilter';
import Pagination from '../../../components/Pagination.tsx';
import { useClientesFilters } from './hooks/useClientesFilters'; 
import { useCustomersFilterOptions } from './hooks/useCustomerFilterOptions';


const CustomersManagementPage = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const clientesFilters = useClientesFilters();
  const filterOptions = useCustomersFilterOptions();

  // Memoriza los filtros activos para evitar re-renders y refetch innecesarios
  const activeFilters = useMemo(
    () => clientesFilters.getActiveFilters(),
    [clientesFilters],
  );

  // Error state
  const [error, setError] = useState<{
    errorTitle: string;
    errorMessage: string;
  } | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  // Proteger ruta
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  

  // Hooks
  const customers = useCustomers(
    (err) => {
      setError(err);
      setShowAlert(true);
    },
    activeFilters,
    page,
    pageSize,
  );

  const domicilios = useDomicilios((err) => {
    setError(err);
    setShowAlert(true);
  });

  const customerDialog = useCustomerDialog();
  const notifyDialog = useNotifyDialog((err) => {
    setError(err);
    setShowAlert(true);
  });
  // Manejar guardar cliente
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar con Zod
    const result = customerSchema.safeParse(customerDialog.formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      customerDialog.setErrors(fieldErrors);
      return;
    }

    // Crear objeto de cliente
    const newCustomer: PersonaResponse = {
      id: customerDialog.editingCustomer
        ? customerDialog.editingCustomer.id
        : Math.floor(Math.random() * 10000),
      tipoDoc: customerDialog.formData.tipoDoc,
      nroDocumento: customerDialog.formData.nroDocumento,
      nombre: customerDialog.formData.nombre,
      apellido: customerDialog.formData.apellido,
      email: customerDialog.formData.email,
      telefono: customerDialog.formData.telefono,
      saldo: Number(customerDialog.formData.saldo),
      estado: customerDialog.formData.estado as 'Habilitado' | 'Deshabilitado' | 'Pendiente',
    };

    const success = await customers.handleSaveCustomer(
      newCustomer,
      !!customerDialog.editingCustomer,
    );

    if (success) {
      customerDialog.handleCloseDialog();
    }
  };

  // Manejar notificación
  const handleSendNotification = async (e: React.FormEvent) => {
    const success = await notifyDialog.handleSendNotification(e, token);
    if (success) {
      // Dialog se cierra automáticamente en el hook
    }
  };

  // Estado para los filtros

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Gestión de Clientes - Sodas Rojas</title>
      </Helmet>
      <NavBar />
      <main className="flex-1 py-12">
        {showAlert && (
          <Alert
            variant="danger"
            autoClose={true}
            onClose={() => setShowAlert(false)}
          >
            <AlertTitle>{error?.errorTitle}</AlertTitle>
            <AlertDescription>{error?.errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* SECCIÓN CLIENTES CON FILTROS */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Clientes
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  name="search"
                  type="text"
                  className="pl-10 w-64"
                  placeholder="Buscar cliente"
                  value={customers.search}
                  onChange={(val) => customers.setSearch(val as string)}
                />
              </div>
              <Button onClick={() => customerDialog.handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" /> Agregar Cliente
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-64">
              {/* Filtro Sidebar */}
              <ClientesFilter
                zones={filterOptions.zones}
                trucks={filterOptions.trucks}
                days={filterOptions.days}
                saldoRanges={['Ascendente', 'Descendente']}
                selectedZone={clientesFilters.filters.zone}
                selectedTruck={clientesFilters.filters.truck}
                selectedDay={clientesFilters.filters.day}
                selectedSaldo={clientesFilters.filters.saldo}
                onApplyFilters={(filters) => {
                  if (filters.zone !== clientesFilters.filters.zone)
                    clientesFilters.handleZoneChange(filters.zone || '');
                  if (filters.truck !== clientesFilters.filters.truck)
                    clientesFilters.handleTruckChange(filters.truck || '');
                  if (filters.day !== clientesFilters.filters.day)
                    clientesFilters.handleDayChange(filters.day || '');
                  if (filters.saldo !== clientesFilters.filters.saldo)
                    clientesFilters.handleSaldoChange(filters.saldo || '');
                  setPage(1);
                }}
                onReset={() => {
                  clientesFilters.resetFilters();
                  setPage(1);
                }}
              />
            </div>
            {/* Tabla de Clientes */}
            <div className="w-full lg:flex-1">
              <Card>
                <CardContent className="p-0">
                  <CustomersTable
                    customers={customers.customers}
                    onEdit={customerDialog.handleOpenDialog}
                    onDetails={customers.handleDetails}
                    onDelete={customers.handleDelete}
                    onNotify={notifyDialog.handleOpenDialog}
                  />
                  <Pagination
                    className="border-t border-black mt-2"
                    page={page}
                    totalPerPage={pageSize}
                    totalItems={customers.totalItems}
                    onPageChange={setPage}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* SECCIÓN DOMICILIOS */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Domicilios
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  name="search"
                  type="text"
                  className="pl-10 w-64"
                  placeholder="Buscar por dirección o persona"
                  value={domicilios.searchDomicilio}
                  onChange={(val) =>
                    domicilios.setSearchDomicilio(val as string)
                  }
                />
              </div>
              <Button onClick={() => customerDialog.handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" /> Agregar Domicilio
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <DomiciliosTable domicilios={domicilios.domicilios} />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* DIALOGS */}
      <CustomerDialog
        isDialogOpen={customerDialog.isOpen}
        setIsDialogOpen={customerDialog.setIsOpen}
        editingCustomer={customerDialog.editingCustomer}
        handleSave={handleSave}
        formData={customerDialog.formData}
        setFormData={customerDialog.setFormData}
        errors={customerDialog.errors}
      />

      <NotifyDialog
        isNotifyOpen={notifyDialog.isOpen}
        setIsNotifyOpen={notifyDialog.setIsOpen}
        notifyCustomer={notifyDialog.customer}
        handleSendNotification={handleSendNotification}
        notificationMsg={notifyDialog.message}
        setNotificationMsg={notifyDialog.setMessage}
      />

      <Footer />
    </div>
  );
};

export default CustomersManagementPage;