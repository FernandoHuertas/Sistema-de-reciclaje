import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import residuos from '../data/residuos.json';

const COLORES_CONTENEDOR = {
  'Amarillo': '#F1C40F',
  'Verde':    '#27AE60',
  'Azul':     '#2980B9',
  'Gris':     '#7F8C8D',
  'Marrón':   '#795548',
  'Rojo':     '#E74C3C',
  'Especial': '#8E44AD',
};

// Sinónimos / palabras comunes → término que SÍ aparece en el catálogo.
// El catálogo no tiene un ítem llamado "banano", pero sí "Residuos de frutas y
// verduras" en la categoría "Orgánico". Este mapa hace que esas búsquedas
// naturales encuentren la categoría correcta.
const SINONIMOS = {
  banano: 'orgánico', banana: 'orgánico', platano: 'orgánico', plátano: 'orgánico',
  manzana: 'orgánico', naranja: 'orgánico', limon: 'orgánico', limón: 'orgánico',
  pina: 'orgánico', piña: 'orgánico', mango: 'orgánico', fruta: 'orgánico',
  frutas: 'orgánico', verdura: 'orgánico', verduras: 'orgánico', cascara: 'orgánico',
  cáscara: 'orgánico', comida: 'orgánico', organico: 'orgánico', orgánico: 'orgánico',
  hojas: 'orgánico', jardin: 'orgánico', jardín: 'orgánico',
  lata: 'metal', latas: 'metal', aluminio: 'metal', acero: 'metal', metal: 'metal',
  botella: 'botella', refresco: 'plástico', gaseosa: 'plástico', soda: 'plástico',
  plastico: 'plástico', plástico: 'plástico', pet: 'plástico', envase: 'plástico',
  bolsa: 'plástico', vidrio: 'vidrio', frasco: 'vidrio', taza: 'vidrio', vaso: 'vidrio',
  celular: 'electrónico', telefono: 'electrónico', teléfono: 'electrónico',
  laptop: 'electrónico', computadora: 'electrónico', control: 'electrónico',
  electronico: 'electrónico', electrónico: 'electrónico', cable: 'electrónico',
  pila: 'peligroso', pilas: 'peligroso', bateria: 'peligroso', batería: 'peligroso',
  medicamento: 'peligroso', aceite: 'peligroso', aerosol: 'peligroso',
  papel: 'papel', periodico: 'papel', periódico: 'papel', revista: 'papel',
  cuaderno: 'papel', hoja: 'papel', carton: 'cartón', cartón: 'cartón',
  caja: 'cartón', tetra: 'cartón', huevos: 'cartón',
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return residuos.slice(0, 6);

    // Si la palabra es un sinónimo conocido, también buscamos por su categoría.
    const alias = SINONIMOS[q];

    return residuos
      .filter(r => {
        const haystack = [
          r.nombre, r.categoria, r.contenedor, r.descripcion, ...r.aceptados,
        ].join(' ').toLowerCase();

        if (haystack.includes(q)) return true;
        if (alias && haystack.includes(alias)) return true;
        return false;
      })
      .slice(0, 6);
  }, [query]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0FDF4' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-4">
        <h1 className="font-bold text-lg mb-3" style={{ color: '#1A2E1A' }}>
          🔍 Buscar residuo
        </h1>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ej: botella de plástico, cartón..."
            autoFocus
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
            style={{ color: '#1A2E1A' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {query && (
          <p className="text-xs text-gray-400 mb-3">
            {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} para "{query}"
          </p>
        )}

        {resultados.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🤷</div>
            <p className="text-gray-500">No encontramos "{query}"</p>
            <p className="text-sm text-gray-400 mt-1">Intentá con otra palabra</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resultados.map(residuo => (
              <button
                key={residuo.id}
                onClick={() => navigate(`/residuo/${residuo.id}`)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: COLORES_CONTENEDOR[residuo.contenedor] || '#888' }}
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
                  <div
                    className="text-xs font-bold"
                    style={{ color: COLORES_CONTENEDOR[residuo.contenedor] || '#888' }}
                  >
                    {residuo.contenedor}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">+{residuo.puntos} pts</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {!query && (
          <p className="text-center text-gray-400 text-sm mt-6">
            Escribí el nombre del residuo que querés clasificar
          </p>
        )}
      </div>
    </div>
  );
}
