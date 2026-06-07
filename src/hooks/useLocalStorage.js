import { useState, useEffect } from 'react';

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

export function useLocalStorage() {
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_STATE;
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_STATE, ...parsed };
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {
      // localStorage lleno o bloqueado — ignorar silenciosamente
    }
  }, [userData]);

  /**
   * Registra que el usuario recicló un residuo.
   * Actualiza puntos, kg, co2 y racha de días consecutivos.
   * @param {Object} residuo — ítem de residuos.json
   */
  function registrarResiduo(residuo) {
    setUserData(prev => {
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
  }

  function resetUserData() {
    setUserData(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }

  return { userData, registrarResiduo, resetUserData };
}
