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

// Umbral mínimo de confianza (escala DECIMAL 0–1, no porcentaje).
// MobileNet devuelve probabilidades entre 0.0 y 1.0.
// Solo se aceptan predicciones con probabilidad ESTRICTAMENTE MAYOR a este valor (> 0.50).
const CONFIDENCE_THRESHOLD = 0.50;

/**
 * Dado las predicciones de MobileNet, busca el residuo correspondiente.
 * Solo considera predicciones con probabilidad >= CONFIDENCE_THRESHOLD.
 * Itera por todas las predicciones en orden de confianza (de mayor a menor).
 */
function findResiduo(predictions) {
  for (const pred of predictions) {
    // Descartar predicciones con probabilidad <= umbral (escala decimal 0–1, no porcentaje)
    if (pred.probability <= CONFIDENCE_THRESHOLD) continue;

    // MobileNet devuelve classNames separados por comas (ej. "water bottle, pop bottle").
    // Dividimos por coma y buscamos match contra cada término individualmente.
    const terms = pred.className.toLowerCase().split(',').map(t => t.trim()).filter(Boolean);

    for (const term of terms) {
      // 1. Match directo contra llave exacta del JSON
      if (mappingIA[term]) {
        const residuo = residuos.find(r => r.id === mappingIA[term]);
        if (residuo) return { residuo, confidence: pred.probability, label: pred.className };
      }

      // 2. Búsqueda flexible: el término de MobileNet contiene una llave del JSON, o viceversa.
      //    Cubre casos como "water bottle, pop bottle" → coincide con "water bottle"
      for (const [key, residuoId] of Object.entries(mappingIA)) {
        if (term.includes(key) || key.includes(term)) {
          const residuo = residuos.find(r => r.id === residuoId);
          if (residuo) return { residuo, confidence: pred.probability, label: pred.className };
        }
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
  const [rawPrediction, setRawPrediction] = useState(null);

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

    // GUARDIA MÓVIL: si el stream aún no tiene dimensiones reales, el frame está vacío/negro.
    // TF.js procesaría un tensor corrupto → predicciones basura. Salimos y esperamos el próximo tick.
    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    // Asignar dimensiones intrínsecas reales del stream al elemento <video>
    // para que TensorFlow.js lea el frame en su resolución real (no un cuadro en blanco).
    video.width = video.videoWidth;
    video.height = video.videoHeight;

    try {
      const predictions = await model.classify(video);
      if (!predictions || predictions.length === 0) return null;

      // Exponer la predicción #1 en crudo para el overlay de debug en pantalla.
      // Esto permite ver exactamente qué string devuelve MobileNet antes de cualquier filtro.
      if (predictions[0]) setRawPrediction(predictions[0]);

      // findResiduo ya filtra por CONFIDENCE_THRESHOLD y split-por-coma internamente.
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

  return { model, isLoading, loadError, classify, startInference, stopInference, rawPrediction };
}
