import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import residuos from '../data/residuos.json';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ResidueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { registrarResiduo } = useLocalStorage();
  const [reciclado, setReciclado] = useState(false);

  const residuo = residuos.find(r => r.id === id);

  useEffect(() => {
    if (location.state?.showConfetti && residuo && !reciclado) {
      setReciclado(true);
      lanzarConfeti();
    }
  }, []);

  if (!residuo) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: '#F0FDF4' }}
      >
        <div className="text-4xl mb-4">🤷</div>
        <p className="text-gray-600 mb-4">Residuo no encontrado</p>
        <button
          onClick={() => navigate('/search')}
          className="px-6 py-3 text-white rounded-xl font-medium"
          style={{ backgroundColor: '#1F5C3E' }}
        >
          Volver a la búsqueda
        </button>
      </div>
    );
  }

  async function lanzarConfeti() {
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4ADE80', '#1F5C3E', '#F1C40F', '#2980B9', '#FFFFFF'],
      });
    } catch {
      // canvas-confetti no disponible — ignorar
    }
  }

  function handleReciclé() {
    if (!reciclado) {
      registrarResiduo(residuo);
      setReciclado(true);
      lanzarConfeti();
    }
  }

  return (
    <div className="min-h-screen pb-32 page-fade" style={{ backgroundColor: '#F0FDF4' }}>

      {/* Header con color del contenedor */}
      <div
        className="px-4 pt-6 pb-8 text-white"
        style={{ backgroundColor: residuo.colorHex }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-white/80 hover:text-white text-sm mb-4 flex items-center gap-1"
        >
          ← Volver
        </button>
        <div className="flex items-start gap-4">
          <div className="text-5xl">♻️</div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">{residuo.nombre}</h1>
            <p className="text-white/80 text-sm mt-1">{residuo.categoria}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                Contenedor {residuo.contenedor}
              </span>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                +{residuo.puntos} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4">

        {/* Descripción */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <p className="text-gray-700 leading-relaxed text-sm">{residuo.descripcion}</p>
        </div>

        {/* CO2 e impacto */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h2 className="font-bold mb-3" style={{ color: '#1A2E1A' }}>🌬️ Impacto ambiental</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold" style={{ color: '#1F5C3E' }}>
                {residuo.co2Ahorro} kg
              </div>
              <div className="text-xs text-gray-500 mt-0.5">CO₂ ahorrado</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold" style={{ color: '#1F5C3E' }}>
                {residuo.kgEquivalente} kg
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Peso estimado</div>
            </div>
          </div>
        </div>

        {/* Preparación */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h2 className="font-bold mb-3" style={{ color: '#1A2E1A' }}>📋 Cómo prepararlo</h2>
          <ol className="space-y-2">
            {residuo.preparacion.map((paso, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: '#1F5C3E' }}
                >
                  {i + 1}
                </span>
                {paso}
              </li>
            ))}
          </ol>
        </div>

        {/* Aceptados / No aceptados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold mb-3 text-green-700">✓ Aceptados</h2>
            <ul className="space-y-1.5">
              {residuo.aceptados.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold mb-3 text-red-600">✗ No aceptados</h2>
            <ul className="space-y-1.5">
              {residuo.noAceptados.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-400 mt-0.5">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Botón flotante */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
        <div className="max-w-2xl mx-auto">
          {reciclado ? (
            <div className="flex items-center justify-center gap-2 py-4 text-green-700 font-bold text-lg">
              <span className="text-2xl">🎉</span>
              ¡Gracias por reciclar! +{residuo.puntos} pts
            </div>
          ) : (
            <button
              onClick={handleReciclé}
              className="w-full py-4 text-white font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-all"
              style={{ backgroundColor: '#1F5C3E' }}
            >
              ✔ Lo reciclé (+{residuo.puntos} pts)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
