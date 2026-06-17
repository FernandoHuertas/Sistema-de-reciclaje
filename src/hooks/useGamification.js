import { useEffect, useMemo, useState } from 'react';
import insignias from '../data/insignias.json';

/**
 * Evalúa cada insignia contra el estado del usuario.
 * Devuelve cada insignia enriquecida con: actual, objetivo, desbloqueada, progreso (%).
 *
 * Tipos soportados (campo "tipo" en insignias.json):
 *  - count:      cantidad acumulada de residuos (global o por categoría).
 *  - firstTime:  primer evento (global o de una categoría).
 *  - streak:     días consecutivos (rachaActual).
 *  - weight:     kg totales reciclados.
 *  - co2:        kg de CO₂ ahorrados.
 *  - categories: número de categorías distintas clasificadas.
 */
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

/**
 * Hook de gamificación. Recalcula las insignias cada vez que cambia userData
 * (es decir, "después de cada registro") y detecta las recién desbloqueadas
 * para animarlas y persistirlas.
 *
 * @param {Object} userData — estado del usuario de useLocalStorage
 * @param {(ids: string[]) => void} [onUnlock] — callback para persistir nuevas insignias
 */
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
      if (onUnlock) onUnlock(recien); // persiste → userData cambia → este efecto no vuelve a disparar (ya están guardadas)
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
