/**
 * Tarjeta de estadística reutilizable (dashboard / home).
 * @param {string} icon   — emoji del indicador
 * @param {string|number} value
 * @param {string} [unit]
 * @param {string} label
 * @param {string} color  — color del valor
 * @param {boolean} [animate] — anima el ícono (ecoBounce, definido en index.css)
 */
export default function ScoreCard({ icon, value, unit, label, color, animate = false }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className={`text-2xl mb-1 ${animate ? 'icon-anim' : ''}`} aria-hidden="true">
        {icon}
      </div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
        {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
      </div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
