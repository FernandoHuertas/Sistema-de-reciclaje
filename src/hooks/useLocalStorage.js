import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ecoscan_user_data';

const DEFAULT_STATE = {
  puntos: 0,
  kgTotal: 0,
  co2Total: 0,
  rachaActual: 0,
  ultimaActividad: null,
  historial: [],
  insigniasDesbloqueadas: [],
};

// Store compartido a nivel de módulo: un único estado con suscripciones, para
// que todos los componentes vean los mismos datos y se actualicen al instante.
function cargarInicial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_STATE;
  }
}

let estado = cargarInicial();
const listeners = new Set();

function persistir() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch {
    // localStorage lleno o bloqueado — ignorar silenciosamente
  }
}

function setEstado(updater) {
  estado = typeof updater === 'function' ? updater(estado) : updater;
  persistir();
  listeners.forEach((l) => l(estado));
}

export function useLocalStorage() {
  const [userData, setUserData] = useState(estado);

  useEffect(() => {
    const listener = (s) => setUserData(s);
    listeners.add(listener);
    setUserData(estado);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Registra un residuo reciclado: suma puntos, kg, CO2 y actualiza la racha.
  const registrarResiduo = useCallback((residuo) => {
    setEstado((prev) => {
      const hoy = new Date().toDateString();
      const ultima = prev.ultimaActividad
        ? new Date(prev.ultimaActividad).toDateString()
        : null;
      const ayer = new Date(Date.now() - 86_400_000).toDateString();

      let nuevaRacha;
      if (ultima === hoy) {
        nuevaRacha = prev.rachaActual;
      } else if (ultima === ayer) {
        nuevaRacha = prev.rachaActual + 1;
      } else {
        nuevaRacha = 1;
      }

      const entrada = {
        id: residuo.id,
        nombre: residuo.nombre,
        categoria: residuo.categoria,
        contenedor: residuo.contenedor,
        colorHex: residuo.colorHex,
        puntos: residuo.puntos || 0,
        fecha: new Date().toISOString(),
      };

      return {
        ...prev,
        puntos: prev.puntos + (residuo.puntos || 0),
        kgTotal: +(prev.kgTotal + (residuo.kgEquivalente || 0)).toFixed(3),
        co2Total: +(prev.co2Total + (residuo.co2Ahorro || 0)).toFixed(3),
        rachaActual: nuevaRacha,
        ultimaActividad: new Date().toISOString(),
        historial: [entrada, ...prev.historial].slice(0, 50),
      };
    });
  }, []);

  // Marca insignias como desbloqueadas, sin duplicar las ya registradas.
  const desbloquearInsignias = useCallback((ids) => {
    setEstado((prev) => {
      const set = new Set(prev.insigniasDesbloqueadas || []);
      let cambio = false;
      ids.forEach((id) => {
        if (!set.has(id)) {
          set.add(id);
          cambio = true;
        }
      });
      if (!cambio) return prev;
      return { ...prev, insigniasDesbloqueadas: [...set] };
    });
  }, []);

  const resetUserData = useCallback(() => {
    setEstado(DEFAULT_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorar
    }
  }, []);

  return { userData, registrarResiduo, desbloquearInsignias, resetUserData };
}
