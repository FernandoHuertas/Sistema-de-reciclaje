// Formatea el progreso "actual / objetivo" según el tipo de insignia.
function formatoMeta(insignia) {
  const { tipo, actual, objetivo } = insignia;
  if (tipo === 'weight') return `${(+actual).toFixed(1)} / ${objetivo} kg`;
  if (tipo === 'co2') return `${(+actual).toFixed(1)} / ${objetivo} kg CO₂`;
  if (tipo === 'streak') return `${actual} / ${objetivo} días`;
  if (tipo === 'firstTime') return actual >= objetivo ? 'Completado' : 'Pendiente';
  return `${actual} / ${objetivo}`;
}

// Tarjeta de insignia: a color si está desbloqueada, en gris con barra de
// progreso si todavía no. "destacar" anima las recién obtenidas.
export default function BadgeCard({ insignia, destacar = false }) {
  const { nombre, descripcion, icono, desbloqueada, progreso } = insignia;

  return (
    <div
      className={`relative rounded-2xl p-3 border text-center transition-all ${
        desbloqueada ? 'bg-white shadow-sm' : 'bg-gray-50'
      } ${destacar ? 'badge-pop' : ''}`}
      style={{
        borderColor: desbloqueada ? '#4ADE80' : '#e5e7eb',
      }}
      title={descripcion}
    >
      {desbloqueada && (
        <span className="absolute top-2 right-2 text-green-500 text-sm" aria-hidden="true">
          ✓
        </span>
      )}

      <div
        className={`text-3xl mb-1 ${desbloqueada ? '' : 'grayscale opacity-40'}`}
        aria-hidden="true"
      >
        {icono}
      </div>

      <div
        className={`text-xs font-bold leading-tight mb-0.5 ${
          desbloqueada ? 'text-green-800' : 'text-gray-500'
        }`}
      >
        {nombre}
      </div>

      <div className="text-[10px] text-gray-400 leading-tight mb-2 line-clamp-2">
        {descripcion}
      </div>

      {desbloqueada ? (
        <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">
          Desbloqueada
        </div>
      ) : (
        <>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progreso}%`, backgroundColor: '#4ADE80' }}
            />
          </div>
          <div className="text-[10px] text-gray-400 mt-1">{formatoMeta(insignia)}</div>
        </>
      )}
    </div>
  );
}
