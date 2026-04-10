import "./App.css";
import HomePage from "./pages/HomePage.tsx";
import Dashboard from "./pages/customer/Dashboard.tsx";
import Directions from "./pages/customer/Directions.tsx";
import NewOrder from "./pages/customer/NewOrder.tsx";
import Orders from "./pages/customer/Orders.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LoginPage from "./pages/Login.tsx";

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
        </Routes>
      </Router>
    </>
  );
}

export default App;
