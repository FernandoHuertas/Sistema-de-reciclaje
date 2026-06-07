import { useLocalStorage } from '../hooks/useLocalStorage';

const NIVELES = [
  { nivel: 1, nombre: 'Semilla',  puntosMin: 0   },
  { nivel: 2, nombre: 'Brote',    puntosMin: 50  },
  { nivel: 3, nombre: 'Árbol',    puntosMin: 150 },
  { nivel: 4, nombre: 'Bosque',   puntosMin: 350 },
  { nivel: 5, nombre: 'Guardián', puntosMin: 700 },
];

function getNivel(puntos) {
  let actual = NIVELES[0];
  let siguiente = NIVELES[1];
  for (let i = NIVELES.length - 1; i >= 0; i--) {
    if (puntos >= NIVELES[i].puntosMin) {
      actual = NIVELES[i];
      siguiente = NIVELES[i + 1] || null;
      break;
    }
  }
  return { actual, siguiente };
}

function NivelBar({ puntos }) {
  const { actual, siguiente } = getNivel(puntos);
  const progreso = siguiente
    ? ((puntos - actual.puntosMin) / (siguiente.puntosMin - actual.puntosMin)) * 100
    : 100;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Nivel actual</div>
          <div className="text-xl font-bold" style={{ color: '#1F5C3E' }}>
            🌳 {actual.nombre}
          </div>
        </div>
        {siguiente && (
          <div className="text-right">
            <div className="text-xs text-gray-400">Próximo nivel</div>
            <div className="text-sm font-medium text-gray-600">{siguiente.nombre}</div>
            <div className="text-xs text-gray-400">{siguiente.puntosMin - puntos} pts más</div>
          </div>
        )}
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, progreso)}%`, backgroundColor: '#4ADE80' }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{actual.puntosMin} pts</span>
        {siguiente && <span>{siguiente.puntosMin} pts</span>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { userData, resetUserData } = useLocalStorage();

  const stats = [
    { label: 'Puntos totales',        value: userData.puntos,             icon: '⭐', unit: 'pts',  color: '#F1C40F' },
    { label: 'Kg reciclados',         value: userData.kgTotal.toFixed(2), icon: '⚖️', unit: 'kg',   color: '#27AE60' },
    { label: 'CO₂ ahorrado',          value: userData.co2Total.toFixed(2),icon: '🌬️', unit: 'kg',   color: '#2980B9' },
    { label: 'Racha actual',          value: userData.rachaActual,        icon: '🔥', unit: 'días', color: '#E74C3C' },
    { label: 'Residuos clasificados', value: userData.historial.length,   icon: '♻️', unit: '',     color: '#1F5C3E' },
  ];

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: '#F0FDF4' }}>

      <div className="px-4 pt-8 pb-6" style={{ backgroundColor: '#1F5C3E' }}>
        <h1 className="text-2xl font-bold text-white mb-1">🏆 Mi impacto</h1>
        <p className="text-green-300 text-sm">Tu contribución al reciclaje en San Carlos</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4">

        <NivelBar puntos={userData.puntos} />

        <div className="grid grid-cols-2 gap-3 mb-4">
          {stats.map(({ label, value, icon, unit, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-bold" style={{ color }}>
                {value}
                {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {userData.historial.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <h2 className="font-bold mb-3" style={{ color: '#1A2E1A' }}>
              🕒 Últimos reciclados
            </h2>
            <div className="space-y-2">
              {userData.historial.slice(0, 10).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                    style={{ backgroundColor: item.colorHex || '#888' }}
                  >
                    ♻️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: '#1A2E1A' }}>
                      {item.nombre}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.fecha).toLocaleDateString('es-CR', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="text-xs font-bold" style={{ color: '#1F5C3E' }}>
                    +{item.puntos} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {userData.historial.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="text-5xl mb-3">🌱</div>
            <h3 className="font-bold text-gray-700 mb-1">Aún no has reciclado nada</h3>
            <p className="text-sm text-gray-400">
              Usá el escáner o buscá un residuo para empezar
            </p>
          </div>
        )}

        {userData.historial.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('¿Borrar todos los datos? (solo para testing)')) {
                resetUserData();
              }
            }}
            className="w-full text-center text-xs text-gray-300 hover:text-gray-400 mt-4 py-2"
          >
            Resetear datos (testing)
          </button>
        )}
      </div>
    </div>
  );
}
