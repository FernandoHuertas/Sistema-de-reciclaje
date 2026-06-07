# EcoScan CR — Etapa 2: Demo PoC

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el prototipo demo funcional para la prueba de concepto del 8 de junio — escáner con cámara + IA, búsqueda por texto, detalle de residuo y dashboard básico.

**Architecture:** SPA React 18 + Vite sin backend. La IA corre en el navegador con TensorFlow.js + MobileNet. El estado del usuario se persiste en localStorage. Tailwind v4 maneja los estilos con una paleta de colores personalizada definida via `@theme` en CSS.

**Tech Stack:** React 18, Vite, Tailwind CSS v4 (@tailwindcss/postcss), TensorFlow.js, @tensorflow-models/mobilenet, react-router-dom v6, canvas-confetti

---

## Paleta de colores

| Token | Hex | Clase Tailwind |
|---|---|---|
| eco-dark | #1F5C3E | bg-eco-dark / text-eco-dark |
| eco-accent | #4ADE80 | bg-eco-accent / text-eco-accent |
| eco-bg | #F0FDF4 | bg-eco-bg |
| eco-text | #1A2E1A | text-eco-text |

---

## File Map

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `src/index.css` | Modify | Agregar @theme con colores personalizados Tailwind v4 |
| `src/hooks/useLocalStorage.js` | Reemplazar | Persistencia de estado del usuario en localStorage |
| `src/hooks/useTensorflow.js` | Reemplazar | Carga de modelo MobileNet + inferencia + gestión de stream |
| `src/components/NavBar.jsx` | Reemplazar | Barra sticky con logo, links y badge de puntos |
| `src/pages/HomePage.jsx` | Reemplazar | Hero, CTAs, estadísticas rápidas, sección "Cómo funciona" |
| `src/pages/ScannerPage.jsx` | Reemplazar | Página del escáner: estados loading/active/classifying |
| `src/pages/SearchPage.jsx` | Reemplazar | Búsqueda por texto con autocompletado en residuos.json |
| `src/pages/ResidueDetailPage.jsx` | Reemplazar | Detalle completo del residuo + confetti al reciclar |
| `src/pages/DashboardPage.jsx` | Reemplazar | Dashboard básico: puntos, kg, CO2, barra de nivel |

---

## Task 1: Configurar paleta de colores (Tailwind v4 @theme)

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Reemplazar src/index.css con directivas v4 + custom theme**

Reemplazar TODO el contenido de `src/index.css` con:

```css
@import "tailwindcss";

@theme {
  --color-eco-dark: #1F5C3E;
  --color-eco-accent: #4ADE80;
  --color-eco-bg: #F0FDF4;
  --color-eco-text: #1A2E1A;
}

* {
  box-sizing: border-box;
}

body {
  background-color: #F0FDF4;
  color: #1A2E1A;
  font-family: system-ui, -apple-system, sans-serif;
}
```

> **Nota Tailwind v4:** En v4, los estilos se importan con `@import "tailwindcss"` (no con `@tailwind` directives). Los colores personalizados se definen en `@theme` y generan clases como `bg-eco-dark`, `text-eco-accent`, `border-eco-dark`, etc.

- [ ] **Step 2: Instalar canvas-confetti para la animación de confeti**

```bash
npm install canvas-confetti
```

- [ ] **Step 3: Verificar que el build sigue pasando**

```bash
npm run build
```

Expected: termina sin errores.

---

## Task 2: Hook useLocalStorage (implementación completa)

**Files:**
- Reemplazar: `src/hooks/useLocalStorage.js`

- [ ] **Step 1: Implementar el hook con toda la lógica de usuario**

Reemplazar TODO el contenido de `src/hooks/useLocalStorage.js` con:

```js
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
      // Merge con defaults para campos nuevos
      return { ...DEFAULT_STATE, ...parsed };
    } catch {
      return DEFAULT_STATE;
    }
  });

  // Persistir cada vez que cambia el estado
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
        nuevaRacha = prev.rachaActual; // ya reciclaron hoy, no sumar
      } else if (ultima === ayer) {
        nuevaRacha = prev.rachaActual + 1; // día consecutivo
      } else {
        nuevaRacha = 1; // racha reiniciada
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

  /** Borra todos los datos del usuario (útil para testing) */
  function resetUserData() {
    setUserData(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }

  return { userData, registrarResiduo, resetUserData };
}
```

- [ ] **Step 2: Verificar que el build pasa**

```bash
npm run build
```

Expected: sin errores.

---

## Task 3: NavBar

**Files:**
- Reemplazar: `src/components/NavBar.jsx`

- [ ] **Step 1: Implementar NavBar sticky con logo, links y badge de puntos**

Reemplazar TODO el contenido de `src/components/NavBar.jsx` con:

```jsx
import { Link, useLocation } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const LINKS = [
  { to: '/',          label: '🏠 Inicio'    },
  { to: '/scanner',   label: '📷 Escáner'   },
  { to: '/search',    label: '🔍 Buscar'    },
  { to: '/map',       label: '🗺️ Mapa'      },
  { to: '/dashboard', label: '🏆 Mi impacto' },
];

export default function NavBar() {
  const { pathname } = useLocation();
  const { userData } = useLocalStorage();

  return (
    <nav
      style={{ backgroundColor: '#1F5C3E' }}
      className="sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-white font-bold text-xl tracking-tight flex items-center gap-2"
        >
          ♻️ <span>EcoScan</span>
          <span className="text-green-300 text-sm font-normal hidden sm:inline">CR</span>
        </Link>

        {/* Links — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${pathname === to
                  ? 'bg-white/20 text-white'
                  : 'text-green-100 hover:bg-white/10 hover:text-white'}
              `}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Badge de puntos — siempre visible */}
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 bg-green-400 text-green-900 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm hover:bg-green-300 transition-colors"
        >
          ⭐ {userData.puntos} pts
        </Link>
      </div>

      {/* Links — mobile bottom bar */}
      <div className="md:hidden flex justify-around border-t border-green-700 px-2 py-2">
        {LINKS.map(({ to, label }) => {
          const emoji = label.split(' ')[0];
          const text  = label.split(' ').slice(1).join(' ');
          return (
            <Link
              key={to}
              to={to}
              className={`
                flex flex-col items-center text-xs gap-0.5 px-2 py-1 rounded-lg transition-colors
                ${pathname === to ? 'text-green-300' : 'text-green-100 hover:text-white'}
              `}
            >
              <span className="text-lg leading-none">{emoji}</span>
              <span>{text}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Expected: sin errores.

---

## Task 4: HomePage

**Files:**
- Reemplazar: `src/pages/HomePage.jsx`

- [ ] **Step 1: Implementar HomePage con hero, CTAs, stats y "Cómo funciona"**

Reemplazar TODO el contenido de `src/pages/HomePage.jsx` con:

```jsx
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PASOS = [
  {
    icono: '📷',
    titulo: 'Apuntá la cámara',
    desc: 'Abrí el escáner y apuntá tu celular al residuo que querés clasificar.',
  },
  {
    icono: '🤖',
    titulo: 'La IA lo identifica',
    desc: 'Nuestro modelo de IA analiza la imagen en tiempo real, sin internet ni servidores.',
  },
  {
    icono: '♻️',
    titulo: 'Reciclá correctamente',
    desc: 'Recibís instrucciones claras: qué contenedor usar y cómo preparar el residuo.',
  },
];

export default function HomePage() {
  const { userData } = useLocalStorage();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0FDF4' }}>

      {/* Hero section */}
      <section
        className="relative overflow-hidden py-16 px-4 text-center"
        style={{ backgroundColor: '#1F5C3E' }}
      >
        {/* Decorativo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none text-[200px] flex items-center justify-center">
          ♻️
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Convertí tu cámara en un
            <span className="text-green-300"> clasificador de residuos inteligente</span>
          </h1>
          <p className="text-green-100 text-lg mb-8">
            IA local, sin internet, sin costo. Ayudá a Costa Rica a reciclar mejor. 🇨🇷
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/scanner"
              className="flex items-center justify-center gap-2 bg-green-400 text-green-900 font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-green-300 active:scale-95 transition-all"
            >
              📷 Usar Cámara
            </Link>
            <Link
              to="/search"
              className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold text-lg px-8 py-4 rounded-2xl border border-white/30 hover:bg-white/20 active:scale-95 transition-all"
            >
              🔍 Buscar por Texto
            </Link>
          </div>
        </div>
      </section>

      {/* Estadísticas rápidas del usuario */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#1A2E1A' }}>
          📊 Mi impacto hasta hoy
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Puntos',          value: userData.puntos,                   icon: '⭐', unit: 'pts' },
            { label: 'Kg reciclados',   value: userData.kgTotal.toFixed(2),       icon: '⚖️', unit: 'kg'  },
            { label: 'CO₂ ahorrado',    value: userData.co2Total.toFixed(2),      icon: '🌬️', unit: 'kg'  },
            { label: 'Racha actual',    value: userData.rachaActual,              icon: '🔥', unit: 'días'},
          ].map(({ label, value, icon, unit }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-4 shadow-sm text-center border border-green-100"
            >
              <div className="text-3xl mb-1">{icon}</div>
              <div className="text-2xl font-bold" style={{ color: '#1F5C3E' }}>
                {value}
                <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {userData.historial.length === 0 && (
          <p className="text-center text-gray-400 mt-4 text-sm">
            Aún no has reciclado nada. ¡Comenzá escaneando tu primer residuo! 🌱
          </p>
        )}
      </section>

      {/* Cómo funciona */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold mb-6 text-center" style={{ color: '#1A2E1A' }}>
          🤔 ¿Cómo funciona?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PASOS.map(({ icono, titulo, desc }, i) => (
            <div
              key={titulo}
              className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 text-center"
            >
              <div className="text-4xl mb-3">{icono}</div>
              <div
                className="w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#1F5C3E' }}
              >
                {i + 1}
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#1A2E1A' }}>{titulo}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Expected: sin errores.

---

## Task 5: Hook useTensorflow (implementación completa)

**Files:**
- Reemplazar: `src/hooks/useTensorflow.js`

- [ ] **Step 1: Implementar el hook con carga de modelo e inferencia**

Reemplazar TODO el contenido de `src/hooks/useTensorflow.js` con:

```js
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

/**
 * Dado las predicciones de MobileNet, busca el residuo correspondiente.
 * Itera por todas las predicciones en orden de confianza.
 */
function findResiduo(predictions) {
  for (const pred of predictions) {
    const label = pred.className.toLowerCase();

    // Intentar match directo
    if (mappingIA[label]) {
      const residuo = residuos.find(r => r.id === mappingIA[label]);
      if (residuo) return { residuo, confidence: pred.probability, label: pred.className };
    }

    // Intentar match parcial (el label puede ser "water bottle, pop bottle")
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
   * @returns {{ residuo, confidence, label } | null}
   */
  const classify = useCallback(async () => {
    if (!model || !videoRef.current) return null;
    const video = videoRef.current;
    if (video.readyState < 2) return null; // video no listo aún

    try {
      const predictions = await model.classify(video);
      if (!predictions || predictions.length === 0) return null;

      const found = findResiduo(predictions);
      if (found) return found;

      // No match — devolver la predicción con mayor confianza igualmente
      return {
        residuo: null,
        confidence: predictions[0].probability,
        label: predictions[0].className,
      };
    } catch {
      return null;
    }
  }, [model, videoRef]);

  /**
   * Inicia inferencia continua (2.5 FPS).
   * Llama onResult con el resultado cada vez que hay clasificación.
   */
  function startInference(onResult) {
    stopInference();
    intervalRef.current = setInterval(async () => {
      const result = await classify();
      if (result) onResult(result);
    }, 400); // 400ms ≈ 2.5 FPS
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
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Expected: sin errores.

---

## Task 6: ScannerPage ⭐ (componente principal del demo)

**Files:**
- Reemplazar: `src/pages/ScannerPage.jsx`

- [ ] **Step 1: Implementar ScannerPage con 3 estados: loading / active / classifying**

Reemplazar TODO el contenido de `src/pages/ScannerPage.jsx` con:

```jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTensorflow } from '../hooks/useTensorflow';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Barra de confianza con color según nivel
function ConfidenceBar({ confidence }) {
  const pct = Math.round(confidence * 100);
  const color =
    pct >= 70 ? '#22c55e' :   // verde
    pct >= 40 ? '#f59e0b' :   // amarillo
                '#ef4444';    // rojo
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">Confianza</span>
        <span className="font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function ScannerPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Estado de la página
  const [phase, setPhase] = useState('loading'); // loading | active | classifying | error
  const [result, setResult] = useState(null);    // { residuo, confidence, label }
  const [cameraReady, setCameraReady] = useState(false);

  const { isLoading, loadError, classify } = useTensorflow(videoRef);
  const { registrarResiduo } = useLocalStorage();

  // Iniciar cámara al montar
  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // cámara trasera en móvil
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        streamRef.current = stream;
        if (videoRef.current && mounted) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch (err) {
        if (mounted) setPhase('error');
      }
    }

    startCamera();

    return () => {
      mounted = false;
      stopStream();
    };
  }, []);

  // Cuando ambos (modelo + cámara) estén listos → pasar a "active"
  useEffect(() => {
    if (!isLoading && cameraReady && phase === 'loading') {
      setPhase('active');
    }
    if (loadError) setPhase('error');
  }, [isLoading, cameraReady, loadError, phase]);

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }

  // Tomar una clasificación al presionar el botón
  const handleClasificar = useCallback(async () => {
    if (phase !== 'active') return;
    const res = await classify();
    if (res) {
      setResult(res);
      setPhase('classifying');
      // Si confianza < 40% y no hay residuo mapeado → sugerir búsqueda
      if (!res.residuo || res.confidence < 0.4) {
        setResult({ ...res, lowConfidence: true });
      }
    }
  }, [phase, classify]);

  function handleReciclé() {
    if (result?.residuo) {
      registrarResiduo(result.residuo);
      navigate(`/residuo/${result.residuo.id}`, { state: { fromScanner: true, showConfetti: true } });
    }
  }

  function handleReintentar() {
    setResult(null);
    setPhase('active');
  }

  // ── UI ──────────────────────────────────────────────────────────────────

  // Estado: ERROR
  if (phase === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center" style={{ backgroundColor: '#F0FDF4' }}>
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#1A2E1A' }}>
          No se pudo acceder a la cámara
        </h2>
        <p className="text-gray-600 mb-6 max-w-sm">
          Asegurate de permitir el acceso a la cámara en tu navegador. Esta función requiere HTTPS.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 text-white rounded-xl font-medium"
          style={{ backgroundColor: '#1F5C3E' }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">

      {/* Video stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-screen object-cover"
      />

      {/* ── Estado LOADING ── */}
      {phase === 'loading' && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-center p-8">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-6" />
          <h2 className="text-xl font-bold mb-2">Cargando IA...</h2>
          <p className="text-green-300 text-sm max-w-xs">
            Puede tardar unos segundos la primera vez mientras se carga el modelo de clasificación.
          </p>
        </div>
      )}

      {/* ── Estado ACTIVE — overlay con esquinas y botón ── */}
      {phase === 'active' && (
        <>
          {/* Esquinas del visor */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Oscurecimiento lateral suave */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

            {/* Indicador central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-green-400 rounded-2xl w-64 h-64 opacity-70">
                {/* Esquinas decorativas */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
              </div>
            </div>

            {/* Texto overlay */}
            <div className="absolute top-8 left-0 right-0 text-center">
              <span className="bg-black/50 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                Apuntá al residuo
              </span>
            </div>
          </div>

          {/* Botón clasificar */}
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3 px-4">
            <button
              onClick={handleClasificar}
              className="w-20 h-20 rounded-full text-3xl shadow-2xl border-4 border-white active:scale-90 transition-transform"
              style={{ backgroundColor: '#4ADE80' }}
            >
              📷
            </button>
            <span className="text-white text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              Presioná para clasificar
            </span>
          </div>
        </>
      )}

      {/* ── Estado CLASSIFYING — tarjeta animada desde abajo ── */}
      {phase === 'classifying' && result && (
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div
            className="w-full bg-white rounded-t-3xl p-6 shadow-2xl"
            style={{ animation: 'slideUp 0.35s ease-out' }}
          >
            {result.residuo ? (
              <>
                {/* Contenedor */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow"
                    style={{ backgroundColor: result.residuo.colorHex }}
                  >
                    ♻️
                  </div>
                  <div>
                    <div className="font-bold text-lg leading-tight" style={{ color: '#1A2E1A' }}>
                      {result.residuo.nombre}
                    </div>
                    <div className="text-sm text-gray-500">{result.residuo.categoria}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xs text-gray-400">Contenedor</div>
                    <div
                      className="font-bold text-sm"
                      style={{ color: result.residuo.colorHex }}
                    >
                      {result.residuo.contenedor}
                    </div>
                  </div>
                </div>

                {/* Barra de confianza */}
                <div className="mb-5">
                  <ConfidenceBar confidence={result.confidence} />
                </div>

                {/* Aviso de baja confianza */}
                {result.lowConfidence && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-sm text-yellow-800">
                    ⚠️ Confianza baja. Si el resultado no es correcto,{' '}
                    <button
                      onClick={() => navigate('/search')}
                      className="underline font-medium"
                    >
                      buscá por texto
                    </button>.
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReciclé}
                    className="flex-1 py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
                    style={{ backgroundColor: '#1F5C3E' }}
                  >
                    ✔ Lo reciclé (+{result.residuo.puntos} pts)
                  </button>
                  <button
                    onClick={handleReintentar}
                    className="px-4 py-4 rounded-2xl bg-gray-100 text-gray-600 font-medium active:scale-95 transition-transform"
                  >
                    ✗
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* No se encontró residuo mapeado */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🤷</div>
                  <h3 className="font-bold text-lg" style={{ color: '#1A2E1A' }}>
                    No reconocimos este residuo
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Label detectado: <em>{result.label}</em>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/search')}
                    className="flex-1 py-4 rounded-2xl text-white font-bold active:scale-95 transition-transform"
                    style={{ backgroundColor: '#1F5C3E' }}
                  >
                    🔍 Buscar por texto
                  </button>
                  <button
                    onClick={handleReintentar}
                    className="px-4 py-4 rounded-2xl bg-gray-100 text-gray-600 font-medium active:scale-95 transition-transform"
                  >
                    ↩
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Animación CSS para el slide-up */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Expected: sin errores.

---

## Task 7: SearchPage

**Files:**
- Reemplazar: `src/pages/SearchPage.jsx`

- [ ] **Step 1: Implementar SearchPage con búsqueda en tiempo real**

Reemplazar TODO el contenido de `src/pages/SearchPage.jsx` con:

```jsx
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

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return residuos.slice(0, 6);

    return residuos
      .filter(r =>
        r.nombre.toLowerCase().includes(q) ||
        r.categoria.toLowerCase().includes(q) ||
        r.contenedor.toLowerCase().includes(q) ||
        r.descripcion.toLowerCase().includes(q) ||
        r.aceptados.some(a => a.toLowerCase().includes(q))
      )
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
                {/* Ícono del contenedor */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: COLORES_CONTENEDOR[residuo.contenedor] || '#888' }}
                >
                  ♻️
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: '#1A2E1A' }}>
                    {residuo.nombre}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{residuo.categoria}</div>
                </div>

                {/* Contenedor + puntos */}
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
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Expected: sin errores.

---

## Task 8: ResidueDetailPage

**Files:**
- Reemplazar: `src/pages/ResidueDetailPage.jsx`

- [ ] **Step 1: Implementar la vista de detalle completa con confeti**

Reemplazar TODO el contenido de `src/pages/ResidueDetailPage.jsx` con:

```jsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import residuos from '../data/residuos.json';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ResidueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { registrarResiduo } = useLocalStorage();
  const [reciclado, setReciclado] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const residuo = residuos.find(r => r.id === id);

  // Si llegamos desde el escáner con showConfetti, mostrar confeti automáticamente
  useEffect(() => {
    if (location.state?.showConfetti && residuo) {
      setReciclado(true);
      lanzarConfeti();
    }
  }, []);

  if (!residuo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#F0FDF4' }}>
        <div className="text-4xl mb-4">🤷</div>
        <p className="text-gray-600 mb-4">Residuo no encontrado</p>
        <button
          onClick={() => navigate('/search')}
          className="px-6 py-3 text-white rounded-xl font-medium"
          style={{ backgroundColor: '#1F5C3E' }}
        >
          Volver a la búsqueda
        </button>
      </div>
    );
  }

  async function lanzarConfeti() {
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4ADE80', '#1F5C3E', '#F1C40F', '#2980B9', '#FFFFFF'],
      });
    } catch {
      // canvas-confetti no disponible — ignorar
    }
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 3000);
  }

  function handleReciclé() {
    if (!reciclado) {
      registrarResiduo(residuo);
      setReciclado(true);
      lanzarConfeti();
    }
  }

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: '#F0FDF4' }}>

      {/* Header con color del contenedor */}
      <div
        className="px-4 pt-6 pb-8 text-white"
        style={{ backgroundColor: residuo.colorHex }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-white/80 hover:text-white text-sm mb-4 flex items-center gap-1"
        >
          ← Volver
        </button>
        <div className="flex items-start gap-4">
          <div className="text-5xl">♻️</div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">{residuo.nombre}</h1>
            <p className="text-white/80 text-sm mt-1">{residuo.categoria}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                Contenedor {residuo.contenedor}
              </span>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                +{residuo.puntos} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4">

        {/* Descripción */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <p className="text-gray-700 leading-relaxed text-sm">{residuo.descripcion}</p>
        </div>

        {/* CO2 e impacto */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h2 className="font-bold mb-3" style={{ color: '#1A2E1A' }}>🌬️ Impacto ambiental</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold" style={{ color: '#1F5C3E' }}>
                {residuo.co2Ahorro} kg
              </div>
              <div className="text-xs text-gray-500 mt-0.5">CO₂ ahorrado</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold" style={{ color: '#1F5C3E' }}>
                {residuo.kgEquivalente} kg
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Peso estimado</div>
            </div>
          </div>
        </div>

        {/* Preparación */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h2 className="font-bold mb-3" style={{ color: '#1A2E1A' }}>📋 Cómo prepararlo</h2>
          <ol className="space-y-2">
            {residuo.preparacion.map((paso, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: '#1F5C3E' }}
                >
                  {i + 1}
                </span>
                {paso}
              </li>
            ))}
          </ol>
        </div>

        {/* Aceptados / No aceptados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold mb-3 text-green-700">✓ Aceptados</h2>
            <ul className="space-y-1.5">
              {residuo.aceptados.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold mb-3 text-red-600">✗ No aceptados</h2>
            <ul className="space-y-1.5">
              {residuo.noAceptados.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-400 mt-0.5">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Botón flotante "Lo reciclé" */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
        <div className="max-w-2xl mx-auto">
          {reciclado ? (
            <div className="flex items-center justify-center gap-2 py-4 text-green-700 font-bold text-lg">
              <span className="text-2xl">🎉</span>
              ¡Gracias por reciclar! +{residuo.puntos} pts
            </div>
          ) : (
            <button
              onClick={handleReciclé}
              className="w-full py-4 text-white font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-all"
              style={{ backgroundColor: '#1F5C3E' }}
            >
              ✔ Lo reciclé (+{residuo.puntos} pts)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Expected: sin errores.

---

## Task 9: DashboardPage básico

**Files:**
- Reemplazar: `src/pages/DashboardPage.jsx`

- [ ] **Step 1: Implementar dashboard básico con stats y barra de progreso**

Reemplazar TODO el contenido de `src/pages/DashboardPage.jsx` con:

```jsx
import { useLocalStorage } from '../hooks/useLocalStorage';

// Niveles del sistema de gamificación
const NIVELES = [
  { nivel: 1, nombre: 'Semilla',    puntosMin: 0    },
  { nivel: 2, nombre: 'Brote',      puntosMin: 50   },
  { nivel: 3, nombre: 'Árbol',      puntosMin: 150  },
  { nivel: 4, nombre: 'Bosque',     puntosMin: 350  },
  { nivel: 5, nombre: 'Guardián',   puntosMin: 700  },
];

function getNivel(puntos) {
  let actual = NIVELES[0];
  let siguiente = NIVELES[1];
  for (let i = NIVELES.length - 1; i >= 0; i--) {
    if (puntos >= NIVELES[i].puntosMin) {
      actual = NIVELES[i];
      siguiente = NIVELES[i + 1] || null;
      break;
    }
  }
  return { actual, siguiente };
}

function NivelBar({ puntos }) {
  const { actual, siguiente } = getNivel(puntos);
  const progreso = siguiente
    ? ((puntos - actual.puntosMin) / (siguiente.puntosMin - actual.puntosMin)) * 100
    : 100;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Nivel actual</div>
          <div className="text-xl font-bold" style={{ color: '#1F5C3E' }}>
            🌳 {actual.nombre}
          </div>
        </div>
        {siguiente && (
          <div className="text-right">
            <div className="text-xs text-gray-400">Próximo nivel</div>
            <div className="text-sm font-medium text-gray-600">{siguiente.nombre}</div>
            <div className="text-xs text-gray-400">{siguiente.puntosMin - puntos} pts más</div>
          </div>
        )}
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(100, progreso)}%`,
            backgroundColor: '#4ADE80',
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{actual.puntosMin} pts</span>
        {siguiente && <span>{siguiente.puntosMin} pts</span>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { userData, resetUserData } = useLocalStorage();

  const stats = [
    { label: 'Puntos totales',    value: userData.puntos,                    icon: '⭐', unit: 'pts',  color: '#F1C40F' },
    { label: 'Kg reciclados',     value: userData.kgTotal.toFixed(2),        icon: '⚖️', unit: 'kg',   color: '#27AE60' },
    { label: 'CO₂ ahorrado',      value: userData.co2Total.toFixed(2),       icon: '🌬️', unit: 'kg',   color: '#2980B9' },
    { label: 'Racha actual',      value: userData.rachaActual,               icon: '🔥', unit: 'días', color: '#E74C3C' },
    { label: 'Residuos clasificados', value: userData.historial.length,      icon: '♻️', unit: '',     color: '#1F5C3E' },
  ];

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: '#F0FDF4' }}>

      {/* Header */}
      <div className="px-4 pt-8 pb-6" style={{ backgroundColor: '#1F5C3E' }}>
        <h1 className="text-2xl font-bold text-white mb-1">🏆 Mi impacto</h1>
        <p className="text-green-300 text-sm">Tu contribución al reciclaje en San Carlos</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4">

        {/* Nivel y progreso */}
        <NivelBar puntos={userData.puntos} />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {stats.map(({ label, value, icon, unit, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-bold" style={{ color }}>
                {value}
                {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Historial reciente */}
        {userData.historial.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <h2 className="font-bold mb-3" style={{ color: '#1A2E1A' }}>
              🕒 Últimos reciclados
            </h2>
            <div className="space-y-2">
              {userData.historial.slice(0, 10).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                    style={{ backgroundColor: item.colorHex || '#888' }}
                  >
                    ♻️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: '#1A2E1A' }}>
                      {item.nombre}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.fecha).toLocaleDateString('es-CR', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="text-xs font-bold" style={{ color: '#1F5C3E' }}>
                    +{item.puntos} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {userData.historial.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="text-5xl mb-3">🌱</div>
            <h3 className="font-bold text-gray-700 mb-1">Aún no has reciclado nada</h3>
            <p className="text-sm text-gray-400">
              Usá el escáner o buscá un residuo para empezar
            </p>
          </div>
        )}

        {/* Botón reset — solo para testing */}
        {userData.historial.length > 0 && (
          <button
            onClick={() => {
              if (confirm('¿Borrar todos los datos? (solo para testing)')) {
                resetUserData();
              }
            }}
            className="w-full text-center text-xs text-gray-300 hover:text-gray-400 mt-4 py-2"
          >
            Resetear datos (testing)
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Expected: sin errores.

---

## Task 10: Checklist final + commit v0.2

**Files:**
- Ningún archivo nuevo

- [ ] **Step 1: Verificar npm run build limpio**

```bash
npm run build
```

Expected: termina sin errores, genera `dist/`.

- [ ] **Step 2: Verificar que CLAUDE.md no aparece en git status**

```bash
git status
```

Expected: CLAUDE.md no aparece en la lista.

- [ ] **Step 3: Hacer commit + tag v0.2**

```bash
git add .
git commit -m "[ETAPA-2] demo PoC completo: escáner + búsqueda + instrucciones + dashboard básico"
git tag v0.2
git push origin main --tags
```

Expected: push exitoso con tag `v0.2`.

---

## Self-Review

### Spec Coverage

| Requisito CLAUDE.md Etapa 2 | Task |
|---|---|
| Paleta de colores correcta (#1F5C3E, #4ADE80, #F0FDF4, #1A2E1A) | Task 1 |
| useLocalStorage con clave ecoscan_user_data + registrarResiduo | Task 2 |
| NavBar sticky con logo, links y badge de puntos | Task 3 |
| HomePage: hero + tagline + 2 CTAs + stats rápidas + "Cómo funciona" | Task 4 |
| useTensorflow: carga modelo + inferencia 2-4 FPS + limpieza al salir | Task 5 |
| ScannerPage estado "Cargando modelo" con spinner | Task 6 |
| ScannerPage estado "Activo" con stream + overlay + texto "Apuntá al residuo" | Task 6 |
| ScannerPage estado "Clasificando": nombre, contenedor, barra de confianza con color | Task 6 |
| Botón "Lo reciclé (+X pts)" y "Intentar de nuevo" | Task 6 |
| Si confianza <40%: mostrar modal búsqueda por texto | Task 6 |
| SearchPage: input + autocompletado en tiempo real + 6 resultados máx | Task 7 |
| Click en resultado → ResidueDetailPage | Task 7 |
| ResidueDetailPage: nombre, categoría, contenedor | Task 8 |
| ResidueDetailPage: instrucciones preparación numeradas | Task 8 |
| ResidueDetailPage: aceptados (✓ verde) + no aceptados (✗ rojo) | Task 8 |
| ResidueDetailPage: CO2 ahorrado | Task 8 |
| ResidueDetailPage: botón "Lo reciclé" con confeti | Task 8 |
| Dashboard básico: puntos, kg, residuos clasificados, barra de progreso | Task 9 |
| npm run build sin errores | Task 10 |
| git commit [ETAPA-2] + tag v0.2 + push | Task 10 |

### Placeholder Scan

Revisado — no hay TBDs, todos los steps tienen código completo.

### Type Consistency

- `useLocalStorage` exporta `{ userData, registrarResiduo, resetUserData }` — usados correctamente en NavBar, ScannerPage, ResidueDetailPage, DashboardPage
- `useTensorflow` exporta `{ model, isLoading, loadError, classify, startInference, stopInference }` — ScannerPage usa `isLoading`, `loadError`, `classify`
- `residuo` objeto tiene: `id`, `nombre`, `categoria`, `contenedor`, `colorHex`, `puntos`, `kgEquivalente`, `co2Ahorro`, `preparacion[]`, `aceptados[]`, `noAceptados[]`, `descripcion` — todos usados correctamente en ResidueDetailPage
- `classify()` devuelve `{ residuo, confidence, label } | null` — ScannerPage maneja ambos casos (residuo encontrado y no encontrado)
- `registrarResiduo(residuo)` recibe objeto residuo completo — llamado correctamente desde ScannerPage y ResidueDetailPage

### Nota sobre MapPage

MapPage no se implementa en esta etapa (Etapa 3). El placeholder existente es suficiente.
