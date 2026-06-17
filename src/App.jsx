import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import BadgeUnlockToast from './components/BadgeUnlockToast';
import WelcomeModal from './components/WelcomeModal';
import HomePage from './pages/HomePage';
import ScannerPage from './pages/ScannerPage';
import SearchPage from './pages/SearchPage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import ResidueDetailPage from './pages/ResidueDetailPage';

const ONBOARDING_KEY = 'ecoscan_onboarded';

export default function App() {
  // Mostrar el modal de bienvenida solo en el primer uso.
  const [onboarded, setOnboarded] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) === '1';
    } catch {
      return true;
    }
  });

  function completarOnboarding() {
    try {
      localStorage.setItem(ONBOARDING_KEY, '1');
    } catch {
      // ignorar
    }
    setOnboarded(true);
  }

  return (
    <BrowserRouter>
      <NavBar />
      {/* Vigilante global de insignias: muestra el toast de desbloqueo en cualquier pantalla. */}
      <BadgeUnlockToast />
      {!onboarded && <WelcomeModal onClose={completarOnboarding} />}
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
