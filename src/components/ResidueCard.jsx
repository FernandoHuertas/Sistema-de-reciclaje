const COLORES_CONTENEDOR = {
  Amarillo: '#F1C40F',
  Verde: '#27AE60',
  Azul: '#2980B9',
  Gris: '#7F8C8D',
  Marrón: '#795548',
  Rojo: '#E74C3C',
  Especial: '#8E44AD',
};

// Tarjeta de resultado de un residuo, usada en la búsqueda.
export default function ResidueCard({ residuo, onClick }) {
  const color = COLORES_CONTENEDOR[residuo.contenedor] || '#888';

  return (
    <button
      onClick={onClick}
      aria-label={`Ver instrucciones para ${residuo.nombre}`}
      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        ♻️
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate" style={{ color: '#1A2E1A' }}>
          {residuo.nombre}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{residuo.categoria}</div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="text-xs font-bold" style={{ color }}>
          {residuo.contenedor}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">+{residuo.puntos} pts</div>
      </div>
    </button>
  );
}
