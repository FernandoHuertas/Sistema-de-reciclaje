import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGamification } from '../hooks/useGamification';

// Montado una vez en App: evalúa las insignias tras cada cambio, las persiste
// y muestra un toast con confeti cuando se desbloquea una, desde cualquier pantalla.
export default function BadgeUnlockToast() {
  const { userData, desbloquearInsignias } = useLocalStorage();
  const { insignias, nuevas, limpiarNuevas } = useGamification(userData, desbloquearInsignias);

  // La insignia a mostrar es la primera de las recién desbloqueadas.
  const insigniaNueva = nuevas.length > 0 ? insignias.find((i) => i.id === nuevas[0]) : null;

  useEffect(() => {
    if (!insigniaNueva) return;

    // Confeti de celebración.
    (async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.4 },
          colors: ['#4ADE80', '#1F5C3E', '#F1C40F', '#FFFFFF'],
        });
      } catch {
        // canvas-confetti no disponible
      }
    })();

    const t = setTimeout(() => limpiarNuevas(), 5000);
    return () => clearTimeout(t);
  }, [insigniaNueva, limpiarNuevas]);

  if (!insigniaNueva) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-sm px-2">
      <div
        className="badge-pop flex items-center gap-3 bg-white rounded-2xl shadow-2xl p-4 border-2"
        style={{ borderColor: '#4ADE80' }}
        role="status"
        aria-live="polite"
      >
        <div className="text-4xl" aria-hidden="true">
          {insigniaNueva.icono}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-wide text-green-600">
            ¡Insignia desbloqueada!
          </div>
          <div className="font-bold text-sm" style={{ color: '#1A2E1A' }}>
            {insigniaNueva.nombre}
          </div>
          <div className="text-xs text-gray-500 leading-tight mt-0.5">
            {insigniaNueva.mensaje || insigniaNueva.descripcion}
          </div>
        </div>
        <button
          onClick={limpiarNuevas}
          aria-label="Cerrar notificación"
          className="text-gray-300 hover:text-gray-500 text-lg flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
