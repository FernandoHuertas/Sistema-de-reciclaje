# EcoScan CR ♻️

**Convertí tu cámara en un clasificador de residuos inteligente.**

EcoScan CR es una aplicación web de reciclaje para Costa Rica. Apuntás la cámara del celular a un residuo y recibís, **en tiempo real y dentro del navegador**, instrucciones claras de cómo clasificarlo y dónde depositarlo. La inteligencia artificial corre 100 % en el dispositivo con **TensorFlow.js + MobileNet** — sin API keys, sin backend y sin costo.

> Proyecto del curso de Requerimientos de Software — Grupo 51.

---

## ✨ Funcionalidades

- **📷 Escáner con IA en vivo.** Detección continua (~2.5 FPS) con MobileNet. Recorta el centro del cuadro y lo clasifica para mayor precisión. Muestra la categoría, el contenedor correcto y el nivel de confianza.
- **🔍 Búsqueda por texto.** Buscador con sinónimos en español (“banano”, “lata”, “celular”…) sobre un catálogo de 30+ residuos.
- **📄 Ficha de cada residuo.** Pasos de preparación, materiales aceptados y no aceptados, CO₂ ahorrado, con animación de confeti al reciclar.
- **🗺️ Mapa de puntos de acopio.** Mapa interactivo (Leaflet) de San Carlos con 10 centros, marcadores por material, filtros y botón “Cómo llegar” (Google Maps).
- **🏆 Dashboard de impacto.** Puntos, kg reciclados, CO₂ ahorrado, racha de días, niveles (Semilla → Guardián) e historial.
- **🎖️ Gamificación.** 10 insignias desbloqueables con barra de progreso y toast de celebración.
- **👋 Onboarding.** Modal de bienvenida de 3 pasos en el primer uso.

Todos los datos del usuario se guardan en **localStorage** (clave `ecoscan_user_data`). No se almacenan ni se envían imágenes: la inferencia es local, frame a frame, y el resultado es solo texto.

---

## 🧱 Stack tecnológico

| Tecnología | Uso |
|---|---|
| React 18 + Vite | Framework y bundler |
| Tailwind CSS v4 | Estilos |
| TensorFlow.js + MobileNet | Motor de IA (clasificación de imágenes) |
| React Router DOM | Navegación SPA |
| Leaflet | Mapa interactivo de puntos de acopio |
| canvas-confetti | Animaciones de celebración |
| localStorage | Persistencia de datos del usuario |
| Vercel | Despliegue (HTTPS gratuito, requerido por la cámara) |

---

## 🚀 Instalación y ejecución local

Requisitos: **Node.js 18+** y npm.

```bash
# 1. Clonar el repositorio
git clone https://github.com/FernandoHuertas/Sistema-de-reciclaje.git
cd Sistema-de-reciclaje

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

Abrí `http://localhost:5173` en el navegador.

> **Nota sobre la cámara:** `getUserMedia` (acceso a cámara) solo funciona sobre **HTTPS** o en `localhost`. En el celular hay que usar la URL HTTPS de Vercel.

### Build de producción

```bash
npm run build      # genera /dist
npm run preview    # sirve el build localmente para verificarlo
```

---

## ☁️ Despliegue

El proyecto está conectado a **Vercel**: cada push a la rama `main` dispara un despliegue automático con HTTPS. Para desplegar tu propia copia:

1. Importá el repositorio en [Vercel](https://vercel.com).
2. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
3. Deploy. La URL HTTPS resultante ya sirve la cámara.

---

## 📁 Estructura del proyecto

```
src/
  components/   NavBar, ScoreCard, BadgeCard, BadgeUnlockToast, WelcomeModal, ResidueCard
  pages/        HomePage, ScannerPage, SearchPage, MapPage, DashboardPage, ResidueDetailPage
  hooks/        useTensorflow, useLocalStorage (store compartido), useGamification
  data/         residuos.json, puntosAcopio.json, insignias.json, mappingIA.json
  utils/        co2Calculator, pointsCalculator
  App.jsx       rutas + onboarding + toast global
  main.jsx
```

---

## 🧠 Cómo funciona la IA

1. El `<video>` recibe el stream de la cámara trasera (`facingMode: environment`).
2. Cada ~400 ms se recorta el **cuadrado central** del frame y se escala a 224×224 (entrada nativa de MobileNet) en un `<canvas>`.
3. MobileNet clasifica el recorte y devuelve sus predicciones.
4. Las etiquetas se mapean a residuos del catálogo (`mappingIA.json`) con coincidencia **exacta o de palabra completa**, evitando falsos positivos.
5. Si la confianza supera el umbral, se muestra la ficha; si no, se sugiere la búsqueda por texto.

---

## 🔒 Restricciones y privacidad

- **Sin backend propio:** toda la lógica vive en el frontend (JSON estáticos + localStorage).
- **Sin autenticación ni pagos.**
- **Sin imágenes almacenadas:** la cámara se procesa localmente; nada se sube a ningún servidor.
- **Sin API keys de pago:** TensorFlow.js y Leaflet son gratuitos.

---

## 👥 Equipo

- Fernando Huertas
- Juan Pablo González
- Francisco Rodríguez

Curso: **Requerimientos de Software — Grupo 51 — I Semestre 2026**.

---

## 📸 Capturas

> _(Agregar capturas de pantalla en una carpeta `/screenshots` y enlazarlas aquí: Home, Escáner, Detalle de residuo, Mapa y Dashboard.)_
