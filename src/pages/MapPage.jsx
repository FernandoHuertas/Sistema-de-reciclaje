import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import puntosAcopio from '../data/puntosAcopio.json';

// Config de materiales: etiqueta, color del contenedor y emoji para el pin.
const MATERIALES = {
  plastico:    { label: 'Plástico',    color: '#F1C40F', emoji: '🧴' },
  vidrio:      { label: 'Vidrio',      color: '#27AE60', emoji: '🍾' },
  carton:      { label: 'Cartón',      color: '#2980B9', emoji: '📦' },
  papel:       { label: 'Papel',       color: '#3498DB', emoji: '📄' },
  metal:       { label: 'Metal',       color: '#7F8C8D', emoji: '🥫' },
  organico:    { label: 'Orgánico',    color: '#795548', emoji: '🍌' },
  electronico: { label: 'Electrónico', color: '#8E44AD', emoji: '🔌' },
  peligroso:   { label: 'Peligroso',   color: '#E74C3C', emoji: '⚠️' },
};

// 'todos' + cada material como chip filtrable.
const FILTROS = ['todos', ...Object.keys(MATERIALES)];

// Centro y zoom inicial del cantón de San Carlos.
const VISTA_INICIAL = { lat: 10.462, lng: -84.431, zoom: 10 };

// Pin coloreado según el material principal del punto.
function crearIcono(material) {
  const cfg = MATERIALES[material] || { color: '#1F5C3E', emoji: '♻️' };
  return L.divIcon({
    className: 'eco-pin',
    html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${cfg.color};display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4);">
             <span style="transform:rotate(45deg);font-size:15px;line-height:1;">${cfg.emoji}</span>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 30],
    popupAnchor: [0, -28],
  });
}

// HTML de la ficha que se muestra al hacer click en un marcador.
function fichaHtml(p) {
  const chips = p.materiales
    .map((m) => {
      const cfg = MATERIALES[m];
      if (!cfg) return '';
      return `<span style="display:inline-flex;align-items:center;gap:4px;background:#f3f4f6;border-radius:999px;padding:2px 8px;margin:2px 2px 0 0;font-size:11px;color:#374151;">
                <span style="width:9px;height:9px;border-radius:50%;background:${cfg.color};display:inline-block;"></span>${cfg.label}
              </span>`;
    })
    .join('');

  const telLine =
    p.telefono && p.telefono !== 'Sin teléfono'
      ? `<div style="font-size:12px;color:#555;margin-bottom:4px;">📞 ${p.telefono}</div>`
      : '';

  const maps = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

  return `
    <div style="min-width:215px;max-width:260px;font-family:system-ui,sans-serif;">
      <div style="font-weight:700;color:#1A2E1A;font-size:14px;margin-bottom:6px;line-height:1.25;">${p.nombre}</div>
      <div style="font-size:12px;color:#555;margin-bottom:4px;">📍 ${p.direccion}</div>
      <div style="font-size:12px;color:#555;margin-bottom:4px;">🕒 ${p.horario}</div>
      ${telLine}
      <div style="font-size:12px;color:#777;margin:6px 0 2px;">Materiales aceptados:</div>
      <div style="margin-bottom:8px;">${chips}</div>
      <a href="${maps}" target="_blank" rel="noopener noreferrer"
         style="display:block;text-align:center;background:#1F5C3E;color:#fff;text-decoration:none;padding:9px;border-radius:10px;font-weight:600;font-size:13px;">
         🧭 Cómo llegar
      </a>
    </div>`;
}

export default function MapPage() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const capaMarcadoresRef = useRef(null);
  const [filtro, setFiltro] = useState('todos');

  // Inicializar el mapa una sola vez.
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [VISTA_INICIAL.lat, VISTA_INICIAL.lng],
      zoom: VISTA_INICIAL.zoom,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    capaMarcadoresRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Leaflet a veces renderiza gris si el contenedor cambió de tamaño tras montar.
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
      capaMarcadoresRef.current = null;
    };
  }, []);

  // Repintar marcadores cada vez que cambia el filtro.
  useEffect(() => {
    const capa = capaMarcadoresRef.current;
    const map = mapRef.current;
    if (!capa || !map) return;

    capa.clearLayers();

    const visibles =
      filtro === 'todos'
        ? puntosAcopio
        : puntosAcopio.filter((p) => p.materiales.includes(filtro));

    const latlngs = [];
    visibles.forEach((p) => {
      // El pin se colorea por el material principal, salvo cuando hay un filtro
      // activo: ahí se colorea por el material filtrado (más claro visualmente).
      const principal = filtro !== 'todos' ? filtro : p.materiales[0];
      L.marker([p.lat, p.lng], { icon: crearIcono(principal) })
        .bindPopup(fichaHtml(p))
        .addTo(capa);
      latlngs.push([p.lat, p.lng]);
    });

    // Ajustar la vista para que se vean todos los puntos filtrados.
    if (latlngs.length > 0) {
      map.fitBounds(latlngs, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filtro]);

  return (
    <div className="flex flex-col page-fade" style={{ backgroundColor: '#F0FDF4' }}>
      {/* Encabezado + filtros */}
      <div className="px-4 pt-5 pb-3 bg-white shadow-sm">
        <h1 className="font-bold text-lg mb-1" style={{ color: '#1A2E1A' }}>
          🗺️ Puntos de acopio
        </h1>
        <p className="text-xs text-gray-500 mb-3">
          Centros de reciclaje en San Carlos. Tocá un pin para ver detalles y cómo llegar.
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {FILTROS.map((f) => {
            const activo = filtro === f;
            const cfg = MATERIALES[f];
            const label = f === 'todos' ? '♻️ Todos' : `${cfg.emoji} ${cfg.label}`;
            return (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                aria-pressed={activo}
                aria-label={`Filtrar por ${f === 'todos' ? 'todos los materiales' : cfg.label}`}
                className="whitespace-nowrap text-sm font-medium px-3 py-1.5 rounded-full border transition-colors active:scale-95"
                style={
                  activo
                    ? { backgroundColor: '#1F5C3E', color: '#fff', borderColor: '#1F5C3E' }
                    : { backgroundColor: '#fff', color: '#374151', borderColor: '#e5e7eb' }
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenedor del mapa */}
      <div
        ref={containerRef}
        className="w-full z-0"
        style={{ height: 'calc(100vh - 230px)', minHeight: '380px' }}
      />
    </div>
  );
}
