import "./App.css";
import HomePage from "./pages/HomePage.tsx";
import Dashboard from "./pages/customer/Dashboard.tsx";
import Directions from "./pages/customer/Directions.tsx";
import NewOrder from "./pages/customer/NewOrder.tsx";
import Orders from "./pages/customer/Orders.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ProtectedRoute } from "./contexts/ProtectedRoute.tsx";
import LoginPage from "./pages/Login.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import DailyRoutePage from "./pages/driver/DailyRoute";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import ProductsManagement from "./pages/admin/ProductsManagement.tsx";
import { LoadManagement } from "./pages/admin/LoadManagement/LoadManagement.tsx";
import Components from "./pages/Components.tsx";
import Products from "./pages/Products.tsx";
import RegisterPage from "./pages/Register.tsx";
import TrucksManagement from "./pages/admin/TruckManagement/TruckManagement.tsx";
import ZoneManagement from "./pages/admin/ZoneManagement/ZoneManagement.tsx";
import EditWeeklyOrder from "./pages/customer/EditWeeklyOrder.tsx";
import Pay from "./pages/customer/Pay.tsx";
import CustomerDirections from "./pages/admin/CustomersManagement/CustomerDirections.tsx";
import TruckRouting from "./pages/admin/TruckManagement/TruckRouting.tsx";
import DriverDashboard from "./pages/driver/DriverDashboard.tsx"
import Client from "./pages/driver/Client.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import Expenses from "./pages/admin/expenses.tsx";
{
  /*import { ProtectedRoute } from "./contexts/ProtectedRoute.tsx";*/
}
import Profile from "./pages/customer/Profile.tsx";
import WeeklyOrder from "./pages/customer/WeeklyOrder.tsx";
import ForgotPasswordPage from "./pages/ForgotPassword.tsx";
import ResetPasswordPage from "./pages/ResetPassword";
import CustomersManagement from "./pages/admin/CustomersManagement/CustomersManagement.tsx";
import EmployeeManagement from "./pages/admin/EmployeeManagement/EmployeeManagement.tsx";

function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <Router>
        <Routes>
          {/*Rutas públicas*/}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/components" element={<Components />} />
          <Route path="/products" element={<Products />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          {/*Rutas para el cliente*/}

          <Route element={<ProtectedRoute allowedRoles={["Usuario"]} />}>
            <Route path="/customer/dashboard" element={<Dashboard />} />
            <Route path="/customer/orders" element={<Orders />} />
            <Route path="/customer/newOrder" element={<NewOrder />} />
            <Route path="/customer/directions" element={<Directions />} />
            <Route
              path="/customer/editWeeklyOrder"
              element={<EditWeeklyOrder />}
            />
            <Route path="/customer/weeklyOrder" element={<WeeklyOrder />} />
            <Route path="/customer/profile" element={<Profile />} />
            <Route path="/customer/pay" element={<Pay />} />

          </Route>

          <Route path="/components" element={<Components />} />
          <Route path="/products" element={<Products />} />
          {/*Rutas para el driver*/}
          <Route element={<ProtectedRoute allowedRoles={["Empleado"]} />}>
            <Route path="/driver/route" element={<DailyRoutePage />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/driver/client" element={<Client />} />
          </Route>

          {/*Rutas para el Admin*/}

          <Route element={<ProtectedRoute allowedRoles={["Administrador"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductsManagement />} />
            <Route path="/admin/customers" element={<CustomersManagement />} />
            <Route path="/admin/trucks" element={<TrucksManagement />} />
            <Route path="/admin/zones" element={<ZoneManagement />} />
            <Route path="/admin/expenses" element={<Expenses />} />
            <Route path="/admin/employees" element={<EmployeeManagement />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route
              path="/admin/trucks/routes/:truckId"
              element={<TruckRouting />}
            />
            <Route
              path="/admin/customers/:customerId/directions"
              element={<CustomerDirections />}
            />
            <Route path="/admin/loads" element={<LoadManagement />} />

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
