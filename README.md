# EcoScan CR

Aplicación web de reciclaje para Costa Rica. El usuario apunta la cámara del celular a un residuo y recibe, en tiempo real y dentro del navegador, instrucciones claras de cómo clasificarlo y dónde depositarlo. La clasificación de imágenes corre 100 % en el dispositivo con TensorFlow.js y el modelo MobileNet, sin servidores, sin claves de API y sin costo.

Proyecto del curso de Requerimientos de Software — Grupo 51.

## Funcionalidades

- **Escáner con cámara.** Clasificación continua del residuo apuntado (aprox. 2.5 cuadros por segundo). Recorta el centro de la imagen y la procesa para mayor precisión. Muestra la categoría, el contenedor correspondiente y el nivel de confianza.
- **Búsqueda por texto.** Buscador con sinónimos en español ("banano", "lata", "celular", etc.) sobre un catálogo de más de 30 residuos.
- **Ficha de cada residuo.** Pasos de preparación, materiales aceptados y no aceptados, y CO₂ ahorrado.
- **Mapa de puntos de acopio.** Mapa interactivo de San Carlos con 10 centros, marcadores por material, filtros y enlace directo a indicaciones en Google Maps.
- **Panel de impacto.** Puntos, kilogramos reciclados, CO₂ ahorrado, racha de días, niveles (Semilla a Guardián) e historial reciente.
- **Insignias.** 10 logros desbloqueables con barra de progreso.
- **Introducción inicial.** Guía de bienvenida de 3 pasos en el primer uso.

Todos los datos del usuario se guardan en `localStorage` (clave `ecoscan_user_data`). No se almacenan ni se envían imágenes: el procesamiento es local, cuadro a cuadro, y el resultado es solo texto.

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| React 18 + Vite | Framework y empaquetador |
| Tailwind CSS v4 | Estilos |
| TensorFlow.js + MobileNet | Clasificación de imágenes en el navegador |
| React Router DOM | Navegación SPA |
| Leaflet | Mapa de puntos de acopio |
| canvas-confetti | Animaciones |
| localStorage | Persistencia de datos del usuario |
| Vercel | Despliegue con HTTPS |

## Instalación y ejecución local

Requisitos: Node.js 18 o superior y npm.

```bash
git clone https://github.com/FernandoHuertas/Sistema-de-reciclaje.git
cd Sistema-de-reciclaje
npm install
npm run dev
```

Abrir `http://localhost:5173` en el navegador.

> El acceso a la cámara (`getUserMedia`) solo funciona sobre HTTPS o en `localhost`. En el celular hay que usar la URL HTTPS del despliegue.

### Build de producción

```bash
npm run build      # genera /dist
npm run preview    # sirve el build localmente para verificarlo
```

## Despliegue

El proyecto se despliega en Vercel: cada push a la rama `main` genera un despliegue automático con HTTPS. Para desplegar una copia propia:

1. Importar el repositorio en Vercel.
2. Preset de framework: Vite. Comando de build `npm run build`, carpeta de salida `dist`.
3. Desplegar. La URL HTTPS resultante ya habilita la cámara.

## Estructura del proyecto

```
src/
  components/   NavBar, ScoreCard, BadgeCard, BadgeUnlockToast, WelcomeModal, ResidueCard
  pages/        HomePage, ScannerPage, SearchPage, MapPage, DashboardPage, ResidueDetailPage
  hooks/        useTensorflow, useLocalStorage, useGamification
  data/         residuos.json, puntosAcopio.json, insignias.json, mappingIA.json
  utils/        co2Calculator, pointsCalculator
  App.jsx
  main.jsx
```

## Cómo funciona la clasificación

1. El elemento `<video>` recibe el stream de la cámara trasera (`facingMode: environment`).
2. Cada 400 ms se recorta el cuadrado central del cuadro y se escala a 224×224, la entrada nativa de MobileNet, usando un `<canvas>`.
3. MobileNet clasifica el recorte y devuelve sus predicciones.
4. Las etiquetas se traducen a residuos del catálogo (`mappingIA.json`) con coincidencia exacta o por palabra completa, evitando falsos positivos.
5. Si la confianza supera el umbral, se muestra la ficha; si no, se sugiere la búsqueda por texto.

## Restricciones de diseño

- Sin backend propio: toda la lógica vive en el frontend, con datos en JSON estáticos y `localStorage`.
- Sin autenticación ni pagos.
- Sin almacenamiento de imágenes: la cámara se procesa localmente.
- Sin servicios de pago: TensorFlow.js y Leaflet son gratuitos.

## Equipo

- Fernando Huertas
- Juan Pablo González
- Francisco Rodríguez

Curso: Requerimientos de Software — Grupo 51 — I Semestre 2026.
