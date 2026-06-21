import { useState, useEffect, useRef, useCallback } from 'react';
import mappingIA from '../data/mappingIA.json';
import residuos from '../data/residuos.json';

// Carga diferida de TF.js para no inflar el bundle inicial.
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

// Confianza mínima (escala 0–1). Con la cámara en vivo MobileNet rara vez pasa
// de 0.50, así que usamos un umbral bajo y dejamos que el matching por palabra
// completa filtre la calidad.
const CONFIDENCE_THRESHOLD = 0.12;

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Devuelve el id de residuo para un término de MobileNet, o null.
// Coincidencia exacta o por palabra completa: evita falsos positivos como
// "radiator" matcheando la llave "radio".
function matchTermToResiduoId(term) {
  if (mappingIA[term]) return mappingIA[term];

  for (const [key, residuoId] of Object.entries(mappingIA)) {
    const re = new RegExp(`(^|\\W)${escapeRegExp(key)}(\\W|$)`);
    if (re.test(term)) return residuoId;
  }
  return null;
}

// Busca el primer residuo que corresponda a alguna predicción sobre el umbral.
function findResiduo(predictions) {
  for (const pred of predictions) {
    if (pred.probability < CONFIDENCE_THRESHOLD) continue;

    // Las etiquetas vienen separadas por comas (ej. "pop bottle, soda bottle").
    const terms = pred.className.toLowerCase().split(',').map(t => t.trim()).filter(Boolean);

    for (const term of terms) {
      const id = matchTermToResiduoId(term);
      if (id) {
        const residuo = residuos.find(r => r.id === id);
        if (residuo) return { residuo, confidence: pred.probability, label: pred.className };
      }
    }
  }
  return null;
}

// Gestiona la carga del modelo MobileNet y la inferencia sobre un <video>.
export function useTensorflow(videoRef) {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);
  const [rawPrediction, setRawPrediction] = useState(null);

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
          setLoadError(err.message || 'Error cargando el modelo de clasificación');
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Clasifica el frame actual; devuelve el residuo encontrado o null.
  const classify = useCallback(async () => {
    const video = videoRef.current;
    if (!model || !video) return null;
    if (video.readyState < 2) return null;
    // Sin dimensiones todavía: el frame está vacío, esperamos al siguiente.
    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    // Recortamos el cuadrado central del frame y lo escalamos a 224x224 (entrada
    // de MobileNet). Así el objeto apuntado llena la imagen y mejora la precisión.
    const side = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - side) / 2;
    const sy = (video.videoHeight - side) / 2;
    if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
    const canvas = canvasRef.current;
    canvas.width = 224;
    canvas.height = 224;
    canvas.getContext('2d').drawImage(video, sx, sy, side, side, 0, 0, 224, 224);

    try {
      const predictions = await model.classify(canvas, 3);
      if (!predictions || predictions.length === 0) return null;
      setRawPrediction(predictions[0]);
      return findResiduo(predictions);
    } catch {
      return null;
    }
  }, [model, videoRef]);

  const stopInference = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Inferencia continua a ~2.5 FPS; llama onResult cuando encuentra un residuo.
  const startInference = useCallback((onResult) => {
    stopInference();
    intervalRef.current = setInterval(async () => {
      const result = await classify();
      if (result) onResult(result);
    }, 400);
  }, [classify, stopInference]);

  // Cortar el intervalo al desmontar.
  useEffect(() => () => stopInference(), [stopInference]);

  return { model, isLoading, loadError, classify, startInference, stopInference, rawPrediction };
}
