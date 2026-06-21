import { useEffect, useMemo, useState } from 'react';
import insignias from '../data/insignias.json';

// Evalúa cada insignia contra el estado del usuario y la devuelve con su
// progreso. Tipos: count, firstTime, streak, weight, co2 y categories
// (algunos filtrados por categoría, según el campo "categoria" del JSON).
export function evaluarInsignias(userData) {
  const historial = userData.historial || [];
  const total = historial.length;
  const categoriasDistintas = new Set(historial.map((h) => h.categoria)).size;

  return insignias.map((ins) => {
    const objetivo = ins.valor;
    let actual = 0;

    switch (ins.tipo) {
      case 'count':
        actual = ins.categoria
          ? historial.filter((h) => h.categoria === ins.categoria).length
          : total;
        break;
      case 'firstTime':
        actual = ins.categoria
          ? historial.some((h) => h.categoria === ins.categoria) ? 1 : 0
          : total >= 1 ? 1 : 0;
        break;
      case 'streak':
        actual = userData.rachaActual || 0;
        break;
      case 'weight':
        actual = userData.kgTotal || 0;
        break;
      case 'co2':
        actual = userData.co2Total || 0;
        break;
      case 'categories':
        actual = categoriasDistintas;
        break;
      default:
        actual = 0;
    }

    const desbloqueada = actual >= objetivo;
    const progreso = objetivo > 0 ? Math.min(100, Math.round((actual / objetivo) * 100)) : 0;
    return { ...ins, actual, objetivo, desbloqueada, progreso };
  });
}

// Recalcula las insignias cuando cambia userData y detecta las recién
// desbloqueadas. onUnlock (opcional) persiste las nuevas.
export function useGamification(userData, onUnlock) {
  const evaluadas = useMemo(() => evaluarInsignias(userData), [userData]);
  const [nuevas, setNuevas] = useState([]);

  const idsDesbloqueadas = useMemo(
    () => evaluadas.filter((e) => e.desbloqueada).map((e) => e.id),
    [evaluadas],
  );

  useEffect(() => {
    const yaGuardadas = new Set(userData.insigniasDesbloqueadas || []);
    const recien = idsDesbloqueadas.filter((id) => !yaGuardadas.has(id));
    if (recien.length > 0) {
      // Al persistir, userData cambia pero las ids ya quedan guardadas, así que
      // el efecto no vuelve a dispararse para las mismas insignias.
      if (onUnlock) onUnlock(recien);
      setNuevas(recien);
    }
  }, [idsDesbloqueadas, userData.insigniasDesbloqueadas, onUnlock]);

  return {
    insignias: evaluadas,
    total: evaluadas.length,
    totalDesbloqueadas: idsDesbloqueadas.length,
    nuevas, // ids recién desbloqueadas (para animación/toast)
    limpiarNuevas: () => setNuevas([]),
  };
}
