import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import RestaurantsPage from './pages/RestaurantsPage.jsx';
import ReservationsPage from './pages/ReservationsPage.jsx';
import './App.css';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/restaurants" />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
      </Routes>
    </Router>
  );
}