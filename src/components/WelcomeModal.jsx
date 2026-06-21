import { useState } from 'react';

const PASOS = [
  {
    icono: '📷',
    titulo: 'Apuntá la cámara',
    desc: 'Abrí el escáner y apuntá tu celular al residuo. La IA corre en tu navegador, sin internet ni servidores.',
  },
  {
    icono: '♻️',
    titulo: 'Recibí instrucciones',
    desc: 'EcoScan te dice en qué contenedor va y cómo prepararlo. ¿No lo reconoce? Buscalo por texto.',
  },
  {
    icono: '🏆',
    titulo: 'Sumá impacto',
    desc: 'Ganá puntos, subí de nivel, desbloqueá insignias y mirá tu CO₂ ahorrado. Encontrá puntos de acopio en el mapa.',
  },
];

// Modal de bienvenida de 3 pasos, solo en el primer uso.
export default function WelcomeModal({ onClose }) {
  const [paso, setPaso] = useState(0);
  const actual = PASOS[paso];
  const esUltimo = paso === PASOS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenida a EcoScan"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center badge-pop">
        <div className="text-6xl mb-4" aria-hidden="true">{actual.icono}</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#1F5C3E' }}>
          {actual.titulo}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed min-h-[72px]">
          {actual.desc}
        </p>

        {/* Indicadores de paso */}
        <div className="flex justify-center gap-2 my-4" aria-hidden="true">
          {PASOS.map((_, i) => (
            <span
              key={i}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === paso ? '20px' : '8px',
                backgroundColor: i === paso ? '#1F5C3E' : '#D1FAE5',
              }}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {paso > 0 && (
            <button
              onClick={() => setPaso((p) => p - 1)}
              className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-600 font-medium active:scale-95 transition-transform"
            >
              Atrás
            </button>
          )}
          <button
            onClick={() => (esUltimo ? onClose() : setPaso((p) => p + 1))}
            className="flex-1 py-3 rounded-2xl text-white font-bold active:scale-95 transition-transform"
            style={{ backgroundColor: '#1F5C3E' }}
          >
            {esUltimo ? '¡Empezar! 🌱' : 'Siguiente'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-3 text-xs text-gray-400 hover:text-gray-600"
        >
          Saltar introducción
        </button>
      </div>
    </div>
  );
}
