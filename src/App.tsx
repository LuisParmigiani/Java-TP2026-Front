import './App.css';
import HomePage from './pages/HomePage.tsx';
import Dashboard from './pages/customer/Dashboard.tsx';
import Directions from './pages/customer/Directions.tsx';
import NewOrder from './pages/customer/NewOrder.tsx';
import Orders from './pages/customer/Orders.tsx';
import Pay from './pages/customer/pay.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
