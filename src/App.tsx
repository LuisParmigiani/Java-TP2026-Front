import "./App.css";
import HomePage from "./pages/HomePage.tsx";
import Dashboard from "./pages/customer/Dashboard.tsx";
import Directions from "./pages/customer/Directions.tsx";
import NewOrder from "./pages/customer/NewOrder.tsx";
import Orders from "./pages/customer/Orders.tsx";
import { Toaster } from "sonner";
import LoginPage from "./pages/Login.tsx";
import Pay from './pages/customer/Pay.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/customer/dashboard" element={<Dashboard />} />
          <Route path="/customer/orders" element={<Orders />} />
          <Route path="/customer/newOrder" element={<NewOrder />} />
          <Route path="/customer/directions" element={<Directions />} />
          <Route path='/customer/pay' element={<Pay />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
