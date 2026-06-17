import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import BadgeUnlockToast from './components/BadgeUnlockToast';
import HomePage from './pages/HomePage';
import ScannerPage from './pages/ScannerPage';
import SearchPage from './pages/SearchPage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import ResidueDetailPage from './pages/ResidueDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      {/* Vigilante global de insignias: muestra el toast de desbloqueo en cualquier pantalla. */}
      <BadgeUnlockToast />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/residuo/:id" element={<ResidueDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
