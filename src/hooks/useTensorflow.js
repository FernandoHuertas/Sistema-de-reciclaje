import { useState, useEffect, useRef, useCallback } from 'react';
import mappingIA from '../data/mappingIA.json';
import residuos from '../data/residuos.json';

// Lazy import de TF.js para no bloquear el bundle inicial
let tfLoaded = false;
let mobilenetModule = null;

async function loadTFModules() {
  if (!tfLoaded) {
    await import('@tensorflow/tfjs');
    mobilenetModule = await import('@tensorflow-models/mobilenet');
    tfLoaded = true;
  }
  return mobilenetModule;
}

// Umbral mínimo de confianza para aceptar una predicción como válida.
// Por debajo de este valor el resultado se descarta y se activa el fallback de búsqueda.
const CONFIDENCE_THRESHOLD = 0.50;

/**
 * Dado las predicciones de MobileNet, busca el residuo correspondiente.
 * Solo considera predicciones con probabilidad >= CONFIDENCE_THRESHOLD.
 * Itera por todas las predicciones en orden de confianza (de mayor a menor).
 */
function findResiduo(predictions) {
  for (const pred of predictions) {
    // Descartar predicciones por debajo del umbral de confianza
    if (pred.probability < CONFIDENCE_THRESHOLD) continue;

    const label = pred.className.toLowerCase();

    // Intentar match directo
    if (mappingIA[label]) {
      const residuo = residuos.find(r => r.id === mappingIA[label]);
      if (residuo) return { residuo, confidence: pred.probability, label: pred.className };
    }

    // Intentar match parcial
    for (const [key, residuoId] of Object.entries(mappingIA)) {
      if (label.includes(key) || key.includes(label)) {
        const residuo = residuos.find(r => r.id === residuoId);
        if (residuo) return { residuo, confidence: pred.probability, label: pred.className };
      }
    }
  }
  return null;
}

/**
 * Hook que gestiona la carga del modelo MobileNet y la inferencia sobre un elemento <video>.
 * @param {React.RefObject} videoRef — ref al elemento <video> con el stream activo
 */
export function useTensorflow(videoRef) {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const intervalRef = useRef(null);

  // Cargar modelo al montar
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const mn = await loadTFModules();
        const loadedModel = await mn.load({ version: 2, alpha: 1.0 });
        if (!cancelled) {
          setModel(loadedModel);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Error cargando el modelo de IA');
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  /**
   * Clasifica el frame actual del video.
   * Solo retorna un resultado si la confianza supera CONFIDENCE_THRESHOLD (50%).
   * Si ninguna predicción mapeada supera el umbral, retorna null (activa el fallback).
   * @returns {{ residuo, confidence, label } | null}
   */
  const classify = useCallback(async () => {
    if (!model || !videoRef.current) return null;
    const video = videoRef.current;
    if (video.readyState < 2) return null;

    // Asignar dimensiones intrínsecas reales del stream al elemento <video>
    // para que TensorFlow.js lea el frame en su resolución real y no un cuadro en blanco.
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      video.width = video.videoWidth;
      video.height = video.videoHeight;
    }

    try {
      const predictions = await model.classify(video);
      if (!predictions || predictions.length === 0) return null;

      // findResiduo ya filtra por CONFIDENCE_THRESHOLD internamente.
      // Si ninguna predicción supera el umbral, retorna null → fallback al buscador.
      return findResiduo(predictions);
    } catch {
      return null;
    }
  }, [model, videoRef]);

  /**
   * Inicia inferencia continua (2.5 FPS).
   */
  function startInference(onResult) {
    stopInference();
    intervalRef.current = setInterval(async () => {
      const result = await classify();
      if (result) onResult(result);
    }, 400);
  }

  /** Detiene la inferencia continua */
  function stopInference() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  return { model, isLoading, loadError, classify, startInference, stopInference };
}
