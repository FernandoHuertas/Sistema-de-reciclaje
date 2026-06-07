import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PASOS = [
  {
    icono: '📷',
    titulo: 'Apuntá la cámara',
    desc: 'Abrí el escáner y apuntá tu celular al residuo que querés clasificar.',
  },
  {
    icono: '🤖',
    titulo: 'La IA lo identifica',
    desc: 'Nuestro modelo de IA analiza la imagen en tiempo real, sin internet ni servidores.',
  },
  {
    icono: '♻️',
    titulo: 'Reciclá correctamente',
    desc: 'Recibís instrucciones claras: qué contenedor usar y cómo preparar el residuo.',
  },
];

export default function HomePage() {
  const { userData } = useLocalStorage();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0FDF4' }}>

      {/* Hero section */}
      <section
        className="relative overflow-hidden py-16 px-4 text-center"
        style={{ backgroundColor: '#1F5C3E' }}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none text-[200px] flex items-center justify-center">
          ♻️
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Convertí tu cámara en un
            <span className="text-green-300"> clasificador de residuos inteligente</span>
          </h1>
          <p className="text-green-100 text-lg mb-8">
            IA local, sin internet, sin costo. Ayudá a Costa Rica a reciclar mejor. 🇨🇷
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/scanner"
              className="flex items-center justify-center gap-2 bg-green-400 text-green-900 font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-green-300 active:scale-95 transition-all"
            >
              📷 Usar Cámara
            </Link>
            <Link
              to="/search"
              className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold text-lg px-8 py-4 rounded-2xl border border-white/30 hover:bg-white/20 active:scale-95 transition-all"
            >
              🔍 Buscar por Texto
            </Link>
          </div>
        </div>
      </section>

      {/* Estadísticas rápidas del usuario */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#1A2E1A' }}>
          📊 Mi impacto hasta hoy
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Puntos',        value: userData.puntos,              icon: '⭐', unit: 'pts'  },
            { label: 'Kg reciclados', value: userData.kgTotal.toFixed(2),  icon: '⚖️', unit: 'kg'   },
            { label: 'CO₂ ahorrado',  value: userData.co2Total.toFixed(2), icon: '🌬️', unit: 'kg'   },
            { label: 'Racha actual',  value: userData.rachaActual,         icon: '🔥', unit: 'días' },
          ].map(({ label, value, icon, unit }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-4 shadow-sm text-center border border-green-100"
            >
              <div className="text-3xl mb-1">{icon}</div>
              <div className="text-2xl font-bold" style={{ color: '#1F5C3E' }}>
                {value}
                <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {userData.historial.length === 0 && (
          <p className="text-center text-gray-400 mt-4 text-sm">
            Aún no has reciclado nada. ¡Comenzá escaneando tu primer residuo! 🌱
          </p>
        )}
      </section>

      {/* Cómo funciona */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold mb-6 text-center" style={{ color: '#1A2E1A' }}>
          🤔 ¿Cómo funciona?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PASOS.map(({ icono, titulo, desc }, i) => (
            <div
              key={titulo}
              className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 text-center"
            >
              <div className="text-4xl mb-3">{icono}</div>
              <div
                className="w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#1F5C3E' }}
              >
                {i + 1}
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#1A2E1A' }}>{titulo}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
