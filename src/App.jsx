import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
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
