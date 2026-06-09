import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTensorflow } from '../hooks/useTensorflow';
import { useLocalStorage } from '../hooks/useLocalStorage';

function ConfidenceBar({ confidence }) {
  const pct = Math.round(confidence * 100);
  const color =
    pct >= 70 ? '#22c55e' :
    pct >= 40 ? '#f59e0b' :
                '#ef4444';
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

  const [phase, setPhase] = useState('loading');
  const [result, setResult] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const { isLoading, loadError, classify } = useTensorflow(videoRef);
  const { registrarResiduo } = useLocalStorage();

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        streamRef.current = stream;
        if (videoRef.current && mounted) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch {
        if (mounted) setPhase('error');
      }
    }

    startCamera();

    return () => {
      mounted = false;
      stopStream();
    };
  }, []);

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

  const handleClasificar = useCallback(async () => {
    if (phase !== 'active') return;
    const res = await classify();
    if (res) {
      // Resultado válido: la IA encontró un match con confianza ≥ 50%
      setResult({ ...res, lowConfidence: false });
    } else {
      // Sin resultado confiable: ninguna predicción superó el umbral del 50%.
      // Activar inmediatamente el panel de "No reconocido" para guiar al usuario al buscador.
      setResult({ residuo: null, confidence: 0, label: 'Confianza insuficiente (< 50%)', lowConfidence: true });
    }
    setPhase('classifying');
  }, [phase, classify]);

  function handleReciclé() {
    if (result?.residuo) {
      registrarResiduo(result.residuo);
      navigate(`/residuo/${result.residuo.id}`, {
        state: { fromScanner: true, showConfetti: true },
      });
    }
  }

  function handleReintentar() {
    setResult(null);
    setPhase('active');
  }

  if (phase === 'error') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
        style={{ backgroundColor: '#F0FDF4' }}
      >
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
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-screen object-cover"
      />

      {/* Estado LOADING */}
      {phase === 'loading' && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-center p-8">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-6" />
          <h2 className="text-xl font-bold mb-2">Cargando IA...</h2>
          <p className="text-green-300 text-sm max-w-xs">
            Puede tardar unos segundos la primera vez mientras se carga el modelo de clasificación.
          </p>
        </div>
      )}

      {/* Estado ACTIVE */}
      {phase === 'active' && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative border-2 border-green-400 rounded-2xl w-64 h-64 opacity-70">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
              </div>
            </div>
            <div className="absolute top-8 left-0 right-0 text-center">
              <span className="bg-black/50 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                Apuntá al residuo
              </span>
            </div>
          </div>

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

      {/* Estado CLASSIFYING */}
      {phase === 'classifying' && result && (
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div
            className="w-full bg-white rounded-t-3xl p-6 shadow-2xl"
            style={{ animation: 'slideUp 0.35s ease-out' }}
          >
            {result.residuo ? (
              <>
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
                    <div className="font-bold text-sm" style={{ color: result.residuo.colorHex }}>
                      {result.residuo.contenedor}
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <ConfidenceBar confidence={result.confidence} />
                </div>

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

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
