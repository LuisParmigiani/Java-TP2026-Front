import "./App.css";
import HomePage from "./pages/HomePage.tsx";
import Dashboard from "./pages/customer/Dashboard.tsx";
import Directions from "./pages/customer/Directions.tsx";
import NewOrder from "./pages/customer/NewOrder.tsx";
import Orders from "./pages/customer/Orders.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LoginPage from "./pages/Login.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import DailyRoutePage from "./pages/driver/DailyRoute";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import ProductsManagement from "./pages/admin/ProductsManagement.tsx";
import Components from "./pages/Components.tsx";
import Products from "./pages/Products.tsx";
import RegisterPage from "./pages/Register.tsx";
import { ProtectedRoute } from "./contexts/ProtectedRoute.tsx";

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
          {/*Rutas para el cliente*/}

          <Route element={<ProtectedRoute allowedRoles={["Usuario"]} />}>
            <Route path="/customer/dashboard" element={<Dashboard />} />
            <Route path="/customer/orders" element={<Orders />} />
            <Route path="/customer/newOrder" element={<NewOrder />} />
            <Route path="/customer/directions" element={<Directions />} />
          </Route>

          {/*Rutas para el driver*/}
          <Route path="/driver/route" element={<DailyRoutePage />} />
          {/*Rutas para el Admin*/}

          <Route element={<ProtectedRoute allowedRoles={["Administrador"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductsManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
