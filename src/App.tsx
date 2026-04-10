import { Toaster } from "sonner";
import "./App.css";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/Login.tsx";
import Dashboard from "./pages/customer/Dashboard.tsx";
import Orders from "./pages/customer/Orders.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
