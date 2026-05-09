import { Link } from "react-router-dom";
import NavBar from "./../../components/NavBar";
import Footer from "./../../components/Footer";
import { Helmet } from "./../../components/Helmet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../../components/Card";
import { Package, Users, Truck, DollarSign } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const AdminDashboard = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();
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

  console.log("Rendering AdminDashboard");
  const opciones = [
    { name: 'Gestión de Productos', path: '/admin/products', description: 'Administra los productos y sus datos' },
    { name: 'Gestión de Clientes', path: '/admin/customers', description: 'Administra clientes, direcciones de entrega y deudas.' },
    { name: 'Gestión de Empleados', path: '/admin/employees', description: 'Administra el personal y sus asignaciones a camiones' },
    { name: 'Gestión de Camiones', path: '/admin/trucks', description: 'Administra la flota de camiones ' },
    { name: 'Gestión de Gastos', path: '/admin/expenses', description: 'Controla y registra los gastos operativos.' },
    { name: 'Gestión de Zonas', path: '/admin/zones', description: 'Gestiona las zonas de reparto y sus camiones' },
    { name: 'Gestión de Cargas', path: '/admin/loads', description: 'Gestiona las cargas para repartir'}
  ];
  //! Estos datos son estáticos por ahora pero en realidad van a ser dinámicos
  const detalles = [
    { name: "Total de Productos", value: "10", icon: Package },
    { name: "Clientes Activos", value: "145", icon: Users },
    { name: "Camiones Activos", value: "5", icon: Truck },
    { name: "Ingresos Este Mes", value: "$115.6k", icon: DollarSign },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Helmet>
        <title>Panel de Administración - Sodas Rojas</title>
        <meta name="description" content="Panel de control administrativo" />
      </Helmet>
      <NavBar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8 tracking-tight">
            Panel de Administración
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {detalles.map((detalle) => (
              <Card
                key={detalle.name}
                className="border-2  border-accent shadow-sm bg-card"
              >
                <CardHeader className="flex items-center space-x-3 flex-row-reverse justify-center gap-2">
                  <detalle.icon className="w-6 h-6 text-primary" />
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {detalle.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mr-1 text-center">
                    {detalle.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-6">
            Gestión del Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opciones.map((opcion) => (
              <Link key={opcion.path} to={opcion.path} className="block group">
                <Card className=" mx-1 bg-card text-card-foreground border-2 border-primary/70 shadow-sm group-hover:shadow-md  group-hover:border-primary transition-all h-full">
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary group-hover:font-bold transition-all">
                      {opcion.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground group-hover:font-bold transition-all">
                      {opcion.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
