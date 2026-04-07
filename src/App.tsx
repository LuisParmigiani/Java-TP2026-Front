import './App.css';
import componente from './components/componente';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<componente />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;