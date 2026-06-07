import { Link, useLocation } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const LINKS = [
  { to: '/',          label: '🏠 Inicio'    },
  { to: '/scanner',   label: '📷 Escáner'   },
  { to: '/search',    label: '🔍 Buscar'    },
  { to: '/map',       label: '🗺️ Mapa'      },
  { to: '/dashboard', label: '🏆 Mi impacto' },
];

export default function NavBar() {
  const { pathname } = useLocation();
  const { userData } = useLocalStorage();

  return (
    <nav
      style={{ backgroundColor: '#1F5C3E' }}
      className="sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-white font-bold text-xl tracking-tight flex items-center gap-2"
        >
          ♻️ <span>EcoScan</span>
          <span className="text-green-300 text-sm font-normal hidden sm:inline">CR</span>
        </Link>

        {/* Links — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${pathname === to
                  ? 'bg-white/20 text-white'
                  : 'text-green-100 hover:bg-white/10 hover:text-white'}
              `}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Badge de puntos — siempre visible */}
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 bg-green-400 text-green-900 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm hover:bg-green-300 transition-colors"
        >
          ⭐ {userData.puntos} pts
        </Link>
      </div>

      {/* Links — mobile bottom bar */}
      <div className="md:hidden flex justify-around border-t border-green-700 px-2 py-2">
        {LINKS.map(({ to, label }) => {
          const emoji = label.split(' ')[0];
          const text  = label.split(' ').slice(1).join(' ');
          return (
            <Link
              key={to}
              to={to}
              className={`
                flex flex-col items-center text-xs gap-0.5 px-2 py-1 rounded-lg transition-colors
                ${pathname === to ? 'text-green-300' : 'text-green-100 hover:text-white'}
              `}
            >
              <span className="text-lg leading-none">{emoji}</span>
              <span>{text}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
