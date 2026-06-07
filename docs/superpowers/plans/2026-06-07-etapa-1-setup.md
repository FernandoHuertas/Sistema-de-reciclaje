# EcoScan CR — Etapa 1: Setup del Proyecto

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear la base del proyecto React+Vite con todas las dependencias, estructura de carpetas y archivos JSON de datos para EcoScan CR.

**Architecture:** Aplicación SPA con React 18 + Vite. Sin backend — toda la lógica vive en el frontend. Datos estáticos en JSON, persistencia en localStorage. IA de clasificación con TensorFlow.js + MobileNet corriendo en el navegador.

**Tech Stack:** React 18, Vite, Tailwind CSS v3, TensorFlow.js, @tensorflow-models/mobilenet, react-router-dom v6, leaflet, react-leaflet

---

## File Map

| Archivo | Responsabilidad |
|---|---|
| `.gitignore` | Excluir CLAUDE.md, node_modules, dist, etc. |
| `vite.config.js` | Config de Vite (generado por template) |
| `tailwind.config.js` | Config de Tailwind con rutas de contenido |
| `postcss.config.js` | Config de PostCSS para Tailwind |
| `src/index.css` | Directivas @tailwind |
| `src/App.jsx` | Placeholder — Router setup mínimo |
| `src/main.jsx` | Entry point |
| `src/components/NavBar.jsx` | Placeholder |
| `src/components/ScoreCard.jsx` | Placeholder |
| `src/components/ResidueCard.jsx` | Placeholder |
| `src/components/BadgeCard.jsx` | Placeholder |
| `src/pages/HomePage.jsx` | Placeholder |
| `src/pages/ScannerPage.jsx` | Placeholder |
| `src/pages/SearchPage.jsx` | Placeholder |
| `src/pages/MapPage.jsx` | Placeholder |
| `src/pages/DashboardPage.jsx` | Placeholder |
| `src/pages/ResidueDetailPage.jsx` | Placeholder |
| `src/hooks/useTensorflow.js` | Placeholder |
| `src/hooks/useLocalStorage.js` | Placeholder |
| `src/hooks/useGamification.js` | Placeholder |
| `src/utils/co2Calculator.js` | Placeholder |
| `src/utils/pointsCalculator.js` | Placeholder |
| `src/data/residuos.json` | Catálogo de 30+ residuos con instrucciones |
| `src/data/mappingIA.json` | 40+ mappings de labels MobileNet a IDs de residuos |
| `src/data/puntosAcopio.json` | 8+ puntos de acopio en San Carlos |
| `src/data/insignias.json` | 8+ insignias del sistema de gamificación |

---

## Task 1: Verificar .gitignore y proteger CLAUDE.md

**Files:**
- Create/Modify: `.gitignore`

- [ ] **Step 1: Crear .gitignore con CLAUDE.md incluido**

Crear el archivo `.gitignore` en la raíz del proyecto con este contenido exacto:

```
# Claude Code instructions — never commit
CLAUDE.md

# Dependencies
node_modules/

# Build output
dist/
dist-ssr/
*.local

# Editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment
.env
.env.local
.env.*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
```

- [ ] **Step 2: Verificar que CLAUDE.md está siendo ignorado**

```bash
git check-ignore -v CLAUDE.md
```

Expected output: `.gitignore:2:CLAUDE.md	CLAUDE.md`

---

## Task 2: Inicializar el proyecto Vite + React

**Files:**
- Create: todos los archivos generados por `npm create vite`

- [ ] **Step 1: Inicializar el proyecto Vite con template React**

Desde la raíz `C:\Users\ferna\Desktop\EcoScan\Sistema-de-reciclaje`:

```bash
npm create vite@latest . -- --template react
```

Cuando pregunte si desea sobreescribir el directorio actual, seleccionar: **"Ignore files and continue"** (o la opción equivalente).

- [ ] **Step 2: Verificar que el proyecto se creó correctamente**

```bash
ls src/
```

Expected output debe incluir: `App.css  App.jsx  assets/  index.css  main.jsx`

---

## Task 3: Instalar dependencias de producción

**Files:**
- Modify: `package.json` (automático por npm)

- [ ] **Step 1: Instalar dependencias de IA y navegación**

```bash
npm install @tensorflow/tfjs @tensorflow-models/mobilenet react-router-dom leaflet react-leaflet
```

Expected: todas las dependencias instaladas sin errores. Puede tomar 1-3 minutos.

- [ ] **Step 2: Verificar instalación en package.json**

```bash
cat package.json | grep -E "@tensorflow|react-router|leaflet"
```

Expected output debe mostrar las 5 dependencias con sus versiones.

---

## Task 4: Instalar y configurar Tailwind CSS

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `src/index.css`

- [ ] **Step 1: Instalar Tailwind y sus peers**

```bash
npm install -D tailwindcss postcss autoprefixer
```

- [ ] **Step 2: Generar archivos de configuración**

```bash
npx tailwindcss init -p
```

Expected: crea `tailwind.config.js` y `postcss.config.js`

- [ ] **Step 3: Configurar content paths en tailwind.config.js**

Editar `tailwind.config.js` para que quede exactamente así:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 4: Reemplazar src/index.css con directivas Tailwind**

Reemplazar el contenido completo de `src/index.css` con:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Task 5: Crear estructura de carpetas y archivos placeholder

**Files:**
- Create: `src/components/NavBar.jsx`
- Create: `src/components/ScoreCard.jsx`
- Create: `src/components/ResidueCard.jsx`
- Create: `src/components/BadgeCard.jsx`
- Create: `src/pages/HomePage.jsx`
- Create: `src/pages/ScannerPage.jsx`
- Create: `src/pages/SearchPage.jsx`
- Create: `src/pages/MapPage.jsx`
- Create: `src/pages/DashboardPage.jsx`
- Create: `src/pages/ResidueDetailPage.jsx`
- Create: `src/hooks/useTensorflow.js`
- Create: `src/hooks/useLocalStorage.js`
- Create: `src/hooks/useGamification.js`
- Create: `src/utils/co2Calculator.js`
- Create: `src/utils/pointsCalculator.js`

- [ ] **Step 1: Crear directorios**

```bash
mkdir -p src/components src/pages src/hooks src/data src/utils
```

- [ ] **Step 2: Crear placeholders de componentes**

`src/components/NavBar.jsx`:
```jsx
export default function NavBar() {
  return <nav>NavBar — pendiente implementación</nav>;
}
```

`src/components/ScoreCard.jsx`:
```jsx
export default function ScoreCard() {
  return <div>ScoreCard — pendiente implementación</div>;
}
```

`src/components/ResidueCard.jsx`:
```jsx
export default function ResidueCard() {
  return <div>ResidueCard — pendiente implementación</div>;
}
```

`src/components/BadgeCard.jsx`:
```jsx
export default function BadgeCard() {
  return <div>BadgeCard — pendiente implementación</div>;
}
```

- [ ] **Step 3: Crear placeholders de páginas**

`src/pages/HomePage.jsx`:
```jsx
export default function HomePage() {
  return <div>HomePage — pendiente implementación</div>;
}
```

`src/pages/ScannerPage.jsx`:
```jsx
export default function ScannerPage() {
  return <div>ScannerPage — pendiente implementación</div>;
}
```

`src/pages/SearchPage.jsx`:
```jsx
export default function SearchPage() {
  return <div>SearchPage — pendiente implementación</div>;
}
```

`src/pages/MapPage.jsx`:
```jsx
export default function MapPage() {
  return <div>MapPage — pendiente implementación</div>;
}
```

`src/pages/DashboardPage.jsx`:
```jsx
export default function DashboardPage() {
  return <div>DashboardPage — pendiente implementación</div>;
}
```

`src/pages/ResidueDetailPage.jsx`:
```jsx
export default function ResidueDetailPage() {
  return <div>ResidueDetailPage — pendiente implementación</div>;
}
```

- [ ] **Step 4: Crear placeholders de hooks**

`src/hooks/useTensorflow.js`:
```js
export function useTensorflow() {
  // TODO Etapa 2: carga de modelo MobileNet + inferencia
  return { model: null, isLoading: true, classify: async () => null };
}
```

`src/hooks/useLocalStorage.js`:
```js
export function useLocalStorage() {
  // TODO Etapa 2: persistencia de estado del usuario en localStorage
  return { userData: null, updateUserData: () => {} };
}
```

`src/hooks/useGamification.js`:
```js
export function useGamification() {
  // TODO Etapa 4: lógica de insignias y niveles
  return { checkBadges: () => [], currentLevel: 1 };
}
```

- [ ] **Step 5: Crear placeholders de utils**

`src/utils/co2Calculator.js`:
```js
// Calcula el CO2 ahorrado dado el tipo de residuo y cantidad
export function calculateCO2(residuo, cantidad = 1) {
  return (residuo.co2Ahorro || 0) * cantidad;
}
```

`src/utils/pointsCalculator.js`:
```js
// Calcula los puntos ganados dado un residuo
export function calculatePoints(residuo) {
  return residuo.puntos || 0;
}
```

- [ ] **Step 6: Actualizar App.jsx con Router básico**

Reemplazar `src/App.jsx` con:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ScannerPage from './pages/ScannerPage';
import SearchPage from './pages/SearchPage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import ResidueDetailPage from './pages/ResidueDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/residuo/:id" element={<ResidueDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 7: Eliminar App.css innecesario y limpiar main.jsx**

Reemplazar `src/main.jsx` con:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Eliminar `src/App.css` (ya no se necesita — Tailwind maneja los estilos).

- [ ] **Step 8: Verificar que la app arranca sin errores**

```bash
npm run dev
```

Expected: servidor corriendo en `http://localhost:5173` sin errores en consola. Debe mostrar las rutas placeholder (texto plano es OK en esta etapa).

Detener el servidor con Ctrl+C antes de continuar.

---

## Task 6: Crear src/data/residuos.json

**Files:**
- Create: `src/data/residuos.json`

- [ ] **Step 1: Crear el catálogo completo de residuos**

Crear `src/data/residuos.json` con exactamente este contenido (30 residuos, 11 categorías):

```json
[
  {
    "id": "plastico-pet-1",
    "nombre": "Botella de plástico PET",
    "categoria": "Plástico PET",
    "contenedor": "Amarillo",
    "colorHex": "#F1C40F",
    "puntos": 5,
    "kgEquivalente": 0.025,
    "co2Ahorro": 0.075,
    "preparacion": ["Vaciar completamente", "Enjuagar con agua", "Aplastar para reducir volumen", "Retirar la tapa"],
    "aceptados": ["Botellas de agua", "Botellas de refresco", "Envases de jugo", "Envases de aceite comestible"],
    "noAceptados": ["Tapas metálicas", "Etiquetas de papel húmedas", "Envases con residuos de comida"],
    "descripcion": "El PET (polietileno tereftalato) es el plástico más reciclado del mundo. Se puede convertir en fibra para ropa, alfombras y nuevos envases."
  },
  {
    "id": "plastico-pet-2",
    "nombre": "Envase de bebida deportiva PET",
    "categoria": "Plástico PET",
    "contenedor": "Amarillo",
    "colorHex": "#F1C40F",
    "puntos": 5,
    "kgEquivalente": 0.030,
    "co2Ahorro": 0.090,
    "preparacion": ["Vaciar completamente", "Enjuagar con agua", "Retirar tapa y popote"],
    "aceptados": ["Botellas de Powerade", "Botellas de Gatorade", "Envases de té helado"],
    "noAceptados": ["Popotes", "Tapas de aluminio", "Etiquetas metalizadas"],
    "descripcion": "Las botellas deportivas de PET son fácilmente reciclables. Cada botella reciclada ahorra energía equivalente a mantener una bombilla encendida 6 horas."
  },
  {
    "id": "plastico-hdpe-1",
    "nombre": "Envase de champú o acondicionador",
    "categoria": "Plástico HDPE",
    "contenedor": "Amarillo",
    "colorHex": "#F1C40F",
    "puntos": 6,
    "kgEquivalente": 0.040,
    "co2Ahorro": 0.120,
    "preparacion": ["Vaciar el contenido restante", "Enjuagar con agua caliente", "Aplastar el envase"],
    "aceptados": ["Botellas de champú", "Envases de acondicionador", "Botellas de jabón líquido", "Envases de detergente"],
    "noAceptados": ["Envases con bomba metálica", "Envases con residuos de producto", "Tubos de crema dental"],
    "descripcion": "El HDPE (polietileno de alta densidad) es uno de los plásticos más seguros para reciclar. Se convierte en tuberías, muebles de exterior y nuevos envases."
  },
  {
    "id": "plastico-hdpe-2",
    "nombre": "Galón de leche o jugo HDPE",
    "categoria": "Plástico HDPE",
    "contenedor": "Amarillo",
    "colorHex": "#F1C40F",
    "puntos": 7,
    "kgEquivalente": 0.060,
    "co2Ahorro": 0.180,
    "preparacion": ["Vaciar completamente", "Enjuagar varias veces", "Aplastar y sellar con la tapa"],
    "aceptados": ["Galones de leche", "Galones de jugo", "Galones de agua", "Envases de blanqueador (vacíos y enjuagados)"],
    "noAceptados": ["Envases con leche o jugo restante", "Envases de productos químicos peligrosos"],
    "descripcion": "Los galones de HDPE son muy valorados en el reciclaje. Son rígidos, duraderos y se transforman en productos de larga vida útil como bancas de parque."
  },
  {
    "id": "plastico-general-1",
    "nombre": "Bolsa plástica",
    "categoria": "Plástico general",
    "contenedor": "Amarillo",
    "colorHex": "#F1C40F",
    "puntos": 3,
    "kgEquivalente": 0.005,
    "co2Ahorro": 0.015,
    "preparacion": ["Vaciar completamente", "Sacudir los restos", "Doblar o enrollar"],
    "aceptados": ["Bolsas de supermercado", "Bolsas de tienda", "Bolsas de plástico limpias"],
    "noAceptados": ["Bolsas con residuos de comida", "Bolsas biodegradables", "Film plástico con etiquetas"],
    "descripcion": "Las bolsas plásticas deben acumularse y llevarse al punto de acopio — NO van en el contenedor de reciclaje normal. Se convierten en madera plástica."
  },
  {
    "id": "plastico-general-2",
    "nombre": "Envase de yogur o margarina",
    "categoria": "Plástico general",
    "contenedor": "Amarillo",
    "colorHex": "#F1C40F",
    "puntos": 4,
    "kgEquivalente": 0.020,
    "co2Ahorro": 0.060,
    "preparacion": ["Raspar el contenido restante", "Lavar con agua y jabón", "Retirar la tapa de aluminio"],
    "aceptados": ["Envases de yogur", "Envases de margarina", "Recipientes de helado plástico"],
    "noAceptados": ["Tapas de aluminio selladas", "Envases con restos de comida", "Envases de polietileno expandido (foam)"],
    "descripcion": "Los envases plásticos rígidos de cocina son reciclables cuando están limpios. Recuerda que la tapa de aluminio va por separado."
  },
  {
    "id": "vidrio-1",
    "nombre": "Botella de vidrio",
    "categoria": "Vidrio",
    "contenedor": "Verde",
    "colorHex": "#27AE60",
    "puntos": 8,
    "kgEquivalente": 0.200,
    "co2Ahorro": 0.300,
    "preparacion": ["Vaciar completamente", "Enjuagar con agua", "Retirar tapas metálicas o plásticas"],
    "aceptados": ["Botellas de cerveza", "Botellas de vino", "Botellas de refresco de vidrio", "Frascos de salsa"],
    "noAceptados": ["Vidrio roto (peligroso)", "Espejos", "Vidrio de ventanas", "Vidrio templado", "Bombillas"],
    "descripcion": "El vidrio es 100% reciclable infinitamente sin perder calidad. Reciclar una botella ahorra suficiente energía para encender un televisor 1.5 horas."
  },
  {
    "id": "vidrio-2",
    "nombre": "Frasco de vidrio (alimentos)",
    "categoria": "Vidrio",
    "contenedor": "Verde",
    "colorHex": "#27AE60",
    "puntos": 8,
    "kgEquivalente": 0.150,
    "co2Ahorro": 0.225,
    "preparacion": ["Vaciar y limpiar el contenido", "Enjuagar con agua caliente", "Retirar la tapa metálica", "Retirar etiquetas si es posible"],
    "aceptados": ["Frascos de mermelada", "Frascos de mayonesa", "Frascos de pepinillos", "Frascos de café"],
    "noAceptados": ["Tapas metálicas oxidadas", "Frascos con residuos pegados", "Frascos de medicamentos (van con peligrosos)"],
    "descripcion": "Los frascos de vidrio para alimentos son altamente reciclables. Considera reutilizarlos antes de reciclarlos — son excelentes para almacenar granos o especias."
  },
  {
    "id": "carton-1",
    "nombre": "Caja de cartón",
    "categoria": "Cartón",
    "contenedor": "Azul",
    "colorHex": "#2980B9",
    "puntos": 4,
    "kgEquivalente": 0.100,
    "co2Ahorro": 0.150,
    "preparacion": ["Desmontar la caja completamente", "Retirar cintas adhesivas", "Retirar grapas metálicas", "Aplanar para reducir volumen"],
    "aceptados": ["Cajas de cartón ondulado", "Cajas de cereales", "Cajas de zapatos", "Tubos de cartón"],
    "noAceptados": ["Cartón encerado o plastificado", "Cartón sucio de grasa", "Cajas de pizza con manchas de aceite", "Cartón mojado"],
    "descripcion": "El cartón es uno de los materiales más reciclados. Una tonelada de cartón reciclado salva 17 árboles. Asegúrate de que esté seco y limpio."
  },
  {
    "id": "carton-2",
    "nombre": "Cartón Tetra Pak (jugo, leche)",
    "categoria": "Cartón",
    "contenedor": "Azul",
    "colorHex": "#2980B9",
    "puntos": 5,
    "kgEquivalente": 0.030,
    "co2Ahorro": 0.060,
    "preparacion": ["Vaciar completamente", "Enjuagar con agua", "Aplastar completamente", "Doblar y asegurar con la tapa"],
    "aceptados": ["Cajas de jugo", "Cajas de leche", "Cajas de caldo", "Cajas de vino Tetra Pak"],
    "noAceptados": ["Cajas con residuos de líquido", "Cajas mojadas por fuera"],
    "descripcion": "El Tetra Pak tiene capas de cartón, plástico y aluminio. Es reciclable en puntos especializados que separan sus capas para aprovechar cada material."
  },
  {
    "id": "carton-3",
    "nombre": "Rollo de cartón (papel higiénico, etc.)",
    "categoria": "Cartón",
    "contenedor": "Azul",
    "colorHex": "#2980B9",
    "puntos": 2,
    "kgEquivalente": 0.010,
    "co2Ahorro": 0.015,
    "preparacion": ["Asegurarse que esté seco", "No es necesario aplanar"],
    "aceptados": ["Tubos de papel higiénico", "Tubos de toallas de cocina", "Tubos de papel aluminio o film"],
    "noAceptados": ["Tubos mojados o sucios"],
    "descripcion": "Los rollos de cartón son fáciles de reciclar. También puedes reutilizarlos como organizadores de cables o macetas temporales para plantas."
  },
  {
    "id": "papel-1",
    "nombre": "Periódico y revistas",
    "categoria": "Papel",
    "contenedor": "Azul",
    "colorHex": "#2980B9",
    "puntos": 3,
    "kgEquivalente": 0.200,
    "co2Ahorro": 0.180,
    "preparacion": ["Retirar grapas metálicas", "Retirar cubiertas plásticas de revistas", "Mantener seco"],
    "aceptados": ["Periódicos", "Revistas", "Catálogos", "Folletos de papel"],
    "noAceptados": ["Papel plastificado o encerado", "Papel mojado o húmedo", "Papel carbón"],
    "descripcion": "El papel de periódico es 100% reciclable y muy valorado. Reciclar una tonelada de periódicos salva aproximadamente 24 árboles."
  },
  {
    "id": "papel-2",
    "nombre": "Papel de oficina (hojas, cuadernos)",
    "categoria": "Papel",
    "contenedor": "Azul",
    "colorHex": "#2980B9",
    "puntos": 3,
    "kgEquivalente": 0.100,
    "co2Ahorro": 0.150,
    "preparacion": ["Retirar espirales metálicos", "Retirar tapas plásticas de cuadernos", "Mantener seco y limpio"],
    "aceptados": ["Hojas blancas impresas", "Cuadernos sin espiral", "Sobres de papel", "Bolsas de papel"],
    "noAceptados": ["Papel carbón", "Papel térmico (recibos)", "Papel encerado", "Papel sucio de comida"],
    "descripcion": "El papel de oficina es de alta calidad y muy reciclable. Apila las hojas y llévalas al punto de acopio cuando tengas una buena cantidad."
  },
  {
    "id": "metal-aluminio-1",
    "nombre": "Lata de aluminio (bebidas)",
    "categoria": "Metal (latas aluminio)",
    "contenedor": "Gris",
    "colorHex": "#7F8C8D",
    "puntos": 10,
    "kgEquivalente": 0.015,
    "co2Ahorro": 0.180,
    "preparacion": ["Vaciar completamente", "Enjuagar con agua", "Aplastar para reducir volumen"],
    "aceptados": ["Latas de cerveza", "Latas de refresco", "Latas de bebidas energéticas", "Latas de jugos"],
    "noAceptados": ["Latas de acero (alimentos)", "Aerosoles", "Latas con pintura o químicos"],
    "descripcion": "El aluminio es el material más valioso del reciclaje. Reciclar una lata de aluminio ahorra 95% de la energía necesaria para producir una nueva. ¡Vale la pena!"
  },
  {
    "id": "metal-aluminio-2",
    "nombre": "Papel o bandeja de aluminio",
    "categoria": "Metal (latas aluminio)",
    "contenedor": "Gris",
    "colorHex": "#7F8C8D",
    "puntos": 6,
    "kgEquivalente": 0.020,
    "co2Ahorro": 0.240,
    "preparacion": ["Limpiar de restos de comida", "Enjuagar con agua", "Doblar o enrollar"],
    "aceptados": ["Papel aluminio de cocina limpio", "Bandejas de aluminio de tortas o pasteles", "Tapas de aluminio de yogur limpias"],
    "noAceptados": ["Papel aluminio sucio de grasa", "Papel aluminio mezclado con otros materiales"],
    "descripcion": "El papel y las bandejas de aluminio son reciclables cuando están limpios. El aluminio es infinitamente reciclable sin pérdida de calidad."
  },
  {
    "id": "metal-acero-1",
    "nombre": "Lata de acero (alimentos)",
    "categoria": "Metal (latas acero)",
    "contenedor": "Gris",
    "colorHex": "#7F8C8D",
    "puntos": 7,
    "kgEquivalente": 0.060,
    "co2Ahorro": 0.120,
    "preparacion": ["Vaciar completamente", "Enjuagar con agua", "Retirar etiquetas de papel si es posible", "Aplastar para reducir volumen"],
    "aceptados": ["Latas de frijoles", "Latas de atún", "Latas de sardinas", "Latas de sopa", "Latas de vegetales"],
    "noAceptados": ["Latas oxidadas en exceso", "Latas de pintura", "Aerosoles", "Latas de productos químicos"],
    "descripcion": "Las latas de acero para alimentos son altamente reciclables. El acero puede reciclarse infinitamente y se convierte en nuevas latas, vigas o electrodomésticos."
  },
  {
    "id": "metal-acero-2",
    "nombre": "Tapa metálica",
    "categoria": "Metal (latas acero)",
    "contenedor": "Gris",
    "colorHex": "#7F8C8D",
    "puntos": 2,
    "kgEquivalente": 0.005,
    "co2Ahorro": 0.010,
    "preparacion": ["Limpiar de restos", "Acumular varias en un recipiente antes de llevar"],
    "aceptados": ["Tapas de frascos de vidrio", "Tapas de latas de alimentos", "Tapas corona de botellas"],
    "noAceptados": ["Tapas de aluminio muy sucias", "Tapas con papel adherido"],
    "descripcion": "Las tapas metálicas son reciclables. Al ser pequeñas, es mejor acumular varias dentro de una lata aplastada para que no se pierdan en el proceso de reciclaje."
  },
  {
    "id": "organico-1",
    "nombre": "Residuos de frutas y verduras",
    "categoria": "Orgánico",
    "contenedor": "Marrón",
    "colorHex": "#795548",
    "puntos": 3,
    "kgEquivalente": 0.500,
    "co2Ahorro": 0.250,
    "preparacion": ["Separar de los residuos no orgánicos", "No incluir líquidos en exceso", "Si es posible, cortar en pedazos pequeños"],
    "aceptados": ["Cáscaras de frutas", "Restos de verduras", "Posos de café y filtros de papel", "Bolsitas de té", "Cascaras de huevo"],
    "noAceptados": ["Carnes y pescado", "Lácteos", "Aceites de cocina", "Residuos con sal en exceso"],
    "descripcion": "Los residuos orgánicos se convierten en compost, un fertilizante natural excelente para jardines. El compostaje reduce el metano generado en los rellenos sanitarios."
  },
  {
    "id": "organico-2",
    "nombre": "Restos de comida cocida",
    "categoria": "Orgánico",
    "contenedor": "Marrón",
    "colorHex": "#795548",
    "puntos": 3,
    "kgEquivalente": 0.300,
    "co2Ahorro": 0.150,
    "preparacion": ["Separar de envases y cubiertos", "Escurrir el exceso de líquido", "Llevar al punto de acopio o compostera doméstica"],
    "aceptados": ["Arroz y frijoles sobrantes", "Verduras cocidas", "Pan y tortillas", "Restos de pasta"],
    "noAceptados": ["Comida con mucho aceite", "Carnes y embutidos", "Lácteos en cantidad"],
    "descripcion": "Los restos de comida cocida pueden compostarse en muchos centros de acopio. Considera hacer una compostera doméstica — es fácil y produce abono excelente."
  },
  {
    "id": "electronico-1",
    "nombre": "Teléfono celular viejo",
    "categoria": "Electrónico",
    "contenedor": "Especial",
    "colorHex": "#8E44AD",
    "puntos": 25,
    "kgEquivalente": 0.120,
    "co2Ahorro": 2.500,
    "preparacion": ["Hacer copia de seguridad de los datos", "Restablecer a configuración de fábrica", "Retirar la tarjeta SIM", "Llevar directamente al punto de acopio de electrónicos"],
    "aceptados": ["Celulares de cualquier marca", "Celulares dañados o rotos", "Cargadores y audífonos"],
    "noAceptados": ["Baterías hinchadas (peligro de incendio — llevar por separado)", "Celulares con datos personales sin borrar"],
    "descripcion": "Un celular contiene oro, plata, cobre y tierras raras. Reciclar 1 millón de celulares recupera 35 kg de oro. ¡NUNCA los tires a la basura normal!"
  },
  {
    "id": "electronico-2",
    "nombre": "Laptop o computadora",
    "categoria": "Electrónico",
    "contenedor": "Especial",
    "colorHex": "#8E44AD",
    "puntos": 50,
    "kgEquivalente": 2.000,
    "co2Ahorro": 15.000,
    "preparacion": ["Hacer copia de seguridad de todos los archivos", "Formatear el disco duro completamente", "Retirar baterías si es posible", "Llevar al punto de acopio de electrónicos"],
    "aceptados": ["Laptops de cualquier marca", "Computadoras de escritorio", "Monitores", "Teclados y ratones"],
    "noAceptados": ["Equipos con baterías hinchadas sin retirar", "Equipos con datos personales sin eliminar"],
    "descripcion": "Las computadoras contienen metales valiosos y sustancias tóxicas. El reciclaje adecuado recupera los materiales y evita la contaminación con plomo y mercurio."
  },
  {
    "id": "electronico-3",
    "nombre": "Control remoto",
    "categoria": "Electrónico",
    "contenedor": "Especial",
    "colorHex": "#8E44AD",
    "puntos": 15,
    "kgEquivalente": 0.080,
    "co2Ahorro": 0.800,
    "preparacion": ["Retirar las baterías (van por separado como residuo peligroso)", "Llevar al punto de acopio de electrónicos"],
    "aceptados": ["Controles remotos de TV", "Controles de videojuegos", "Controles de sistemas de audio"],
    "noAceptados": ["Controles con baterías adentro (retirarlas primero)"],
    "descripcion": "Los controles remotos contienen plásticos y componentes electrónicos reciclables. Recuerda siempre retirar las baterías antes de entregarlos."
  },
  {
    "id": "peligroso-1",
    "nombre": "Pilas y baterías",
    "categoria": "Peligroso",
    "contenedor": "Rojo",
    "colorHex": "#E74C3C",
    "puntos": 15,
    "kgEquivalente": 0.020,
    "co2Ahorro": 0.500,
    "preparacion": ["Guardar en bolsa hermética o recipiente", "NO mezclar con otros residuos", "Llevar directamente al punto de recolección de peligrosos"],
    "aceptados": ["Pilas AA, AAA, C, D", "Baterías de celular", "Baterías de laptop", "Baterías recargables de cualquier tipo"],
    "noAceptados": ["Baterías hinchadas (riesgo de incendio — manejar con extremo cuidado)", "Baterías rotas o con fugas — NO mezclar con otras"],
    "descripcion": "Las pilas y baterías contienen mercurio, plomo y cadmio. UNA sola pila AA puede contaminar 600 litros de agua. NUNCA las tires a la basura normal."
  },
  {
    "id": "peligroso-2",
    "nombre": "Medicamentos vencidos",
    "categoria": "Peligroso",
    "contenedor": "Rojo",
    "colorHex": "#E74C3C",
    "puntos": 20,
    "kgEquivalente": 0.100,
    "co2Ahorro": 1.000,
    "preparacion": ["Mantener en sus envases originales", "NO tirar al inodoro ni al fregadero", "NO mezclar con otros residuos", "Llevar a farmacias o puntos de recolección autorizados"],
    "aceptados": ["Pastillas y cápsulas vencidas", "Jarabes vencidos (en envase cerrado)", "Cremas y ungüentos vencidos", "Inyectables (sin agujas)"],
    "noAceptados": ["Agujas o jeringas (requieren contenedor especial)", "Medicamentos radiactivos"],
    "descripcion": "Los medicamentos vencidos en la basura o el agua potable afectan a ecosistemas acuáticos y pueden crear resistencia a antibióticos. Muchas farmacias los reciben gratuitamente."
  },
  {
    "id": "peligroso-3",
    "nombre": "Aceite de cocina usado",
    "categoria": "Peligroso",
    "contenedor": "Rojo",
    "colorHex": "#E74C3C",
    "puntos": 12,
    "kgEquivalente": 1.000,
    "co2Ahorro": 2.800,
    "preparacion": ["Dejar enfriar completamente", "Filtrar para retirar restos de comida", "Guardar en botella de plástico cerrada (PET preferiblemente)", "Llevar al punto de acopio"],
    "aceptados": ["Aceite vegetal usado de cualquier tipo", "Aceite de palma", "Aceite de coco solidificado usado"],
    "noAceptados": ["Aceite mezclado con agua", "Aceite con restos sólidos grandes", "Aceite mineral o de motor"],
    "descripcion": "Un litro de aceite de cocina puede contaminar 1.000 litros de agua subterránea. El aceite reciclado se convierte en biodiesel o jabón industrial."
  },
  {
    "id": "peligroso-4",
    "nombre": "Envases de aerosol",
    "categoria": "Peligroso",
    "contenedor": "Rojo",
    "colorHex": "#E74C3C",
    "puntos": 8,
    "kgEquivalente": 0.130,
    "co2Ahorro": 0.390,
    "preparacion": ["Asegurarse de que esté completamente vacío (presionar hasta que no salga más gas)", "NO perforar ni aplastar", "Llevar al punto de acopio de peligrosos"],
    "aceptados": ["Aerosoles vacíos de desodorante", "Aerosoles vacíos de pintura", "Aerosoles vacíos de insecticida", "Aerosoles vacíos de productos de limpieza"],
    "noAceptados": ["Aerosoles que aún contengan presión", "Aerosoles perforados o dañados"],
    "descripcion": "Los aerosoles vacíos son reciclables como metal, pero son peligrosos si no están completamente vacíos. Asegúrate de que no quede presión antes de reciclarlos."
  },
  {
    "id": "plastico-pet-3",
    "nombre": "Envase de agua con gas o soda sifón",
    "categoria": "Plástico PET",
    "contenedor": "Amarillo",
    "colorHex": "#F1C40F",
    "puntos": 5,
    "kgEquivalente": 0.030,
    "co2Ahorro": 0.090,
    "preparacion": ["Dejar salir todo el gas abriendo la tapa", "Vaciar completamente", "Enjuagar", "Aplastar"],
    "aceptados": ["Botellas de agua con gas", "Botellas de soda sifón", "Botellas de agua tónica"],
    "noAceptados": ["Tapas metálicas", "Envases que aún tienen presión"],
    "descripcion": "Las botellas de agua con gas son PET igual que las de agua normal — completamente reciclables. Solo asegúrate de liberar la presión antes de aplastarlas."
  },
  {
    "id": "carton-4",
    "nombre": "Cartón de huevos",
    "categoria": "Cartón",
    "contenedor": "Azul",
    "colorHex": "#2980B9",
    "puntos": 3,
    "kgEquivalente": 0.040,
    "co2Ahorro": 0.060,
    "preparacion": ["Verificar que esté limpio y seco", "Separar si tiene piezas plásticas", "Aplana si es posible"],
    "aceptados": ["Cartones de huevos de papel/cartón", "Cartones de cualquier tamaño (6, 12, 18, 30 huevos)"],
    "noAceptados": ["Cartones de huevos de plástico o foam (van como residuo plástico general)", "Cartones mojados o sucios con huevo"],
    "descripcion": "Los cartones de huevos de cartón son muy reciclables. También puedes reutilizarlos como semilleros para plantas, organizadores de tornillos o separadores de vasos."
  },
  {
    "id": "vidrio-3",
    "nombre": "Bombilla (foco) fluorescente compacto",
    "categoria": "Peligroso",
    "contenedor": "Rojo",
    "colorHex": "#E74C3C",
    "puntos": 15,
    "kgEquivalente": 0.080,
    "co2Ahorro": 1.200,
    "preparacion": ["Manipular con cuidado para no romper", "Guardar en su caja original o en papel de periódico", "Llevar al punto de acopio de peligrosos"],
    "aceptados": ["Bombillas CFL (fluorescentes compactos)", "Tubos fluorescentes", "Bombillas de vapor de mercurio"],
    "noAceptados": ["Bombillas LED (son electrónico, no peligroso)", "Bombillas incandescentes rotas (vidrio normal)"],
    "descripcion": "Las bombillas CFL contienen mercurio, un metal tóxico. Aunque duran 10 veces más que las incandescentes, NUNCA deben ir a la basura normal. Llévalas al punto de acopio."
  },
  {
    "id": "organico-3",
    "nombre": "Hojas y restos de jardinería",
    "categoria": "Orgánico",
    "contenedor": "Marrón",
    "colorHex": "#795548",
    "puntos": 4,
    "kgEquivalente": 2.000,
    "co2Ahorro": 1.000,
    "preparacion": ["Retirar residuos no orgánicos (bolsas, alambres)", "No incluir plantas con enfermedades o plagas", "Cortar ramas grandes en pedazos manejables"],
    "aceptados": ["Hojas secas", "Recortes de césped", "Ramas pequeñas", "Flores marchitas", "Maleza sin semillas"],
    "noAceptados": ["Plantas tratadas con pesticidas en cantidad", "Plantas invasoras con semillas", "Madera tratada o pintada"],
    "descripcion": "Los residuos de jardinería son excelentes para compostaje. El compost resultante mejora la estructura del suelo y reduce la necesidad de fertilizantes químicos."
  }
]
```

---

## Task 7: Crear src/data/mappingIA.json

**Files:**
- Create: `src/data/mappingIA.json`

- [ ] **Step 1: Crear el mapeo de labels MobileNet a IDs de residuos**

Crear `src/data/mappingIA.json` con exactamente este contenido (45+ mappings):

```json
{
  "water bottle": "plastico-pet-1",
  "pop bottle": "plastico-pet-1",
  "plastic bottle": "plastico-pet-1",
  "beer bottle": "vidrio-1",
  "wine bottle": "vidrio-1",
  "whiskey jug": "vidrio-1",
  "jug": "plastico-hdpe-2",
  "milk can": "metal-acero-1",
  "bucket": "plastico-hdpe-2",
  "soap dispenser": "plastico-hdpe-1",
  "lotion": "plastico-hdpe-1",
  "shampoo": "plastico-hdpe-1",
  "cardboard": "carton-1",
  "carton": "carton-2",
  "box": "carton-1",
  "envelope": "papel-2",
  "newspaper": "papel-1",
  "paper towel": "papel-2",
  "notebook": "papel-2",
  "book": "papel-2",
  "magazine": "papel-1",
  "banana": "organico-1",
  "orange": "organico-1",
  "lemon": "organico-1",
  "apple": "organico-1",
  "pineapple": "organico-1",
  "strawberry": "organico-1",
  "fig": "organico-1",
  "broccoli": "organico-1",
  "cauliflower": "organico-1",
  "head cabbage": "organico-1",
  "mushroom": "organico-2",
  "can opener": "metal-acero-1",
  "pop can": "metal-aluminio-1",
  "can": "metal-acero-1",
  "tin can": "metal-acero-1",
  "iron": "metal-acero-2",
  "cellular telephone": "electronico-1",
  "cell phone": "electronico-1",
  "mobile phone": "electronico-1",
  "remote control": "electronico-3",
  "laptop": "electronico-2",
  "computer keyboard": "electronico-2",
  "monitor": "electronico-2",
  "mouse": "electronico-2",
  "loudspeaker": "electronico-2",
  "radio": "electronico-2",
  "television": "electronico-2",
  "coffee mug": "vidrio-2",
  "cup": "vidrio-2",
  "jar": "vidrio-2",
  "electric lamp": "vidrio-3",
  "spotlight": "vidrio-3",
  "pill bottle": "peligroso-2",
  "medicine cabinet": "peligroso-2",
  "lighter": "peligroso-4",
  "bathtub": "plastico-general-1",
  "plastic bag": "plastico-general-1",
  "shopping bag": "plastico-general-1",
  "mixing bowl": "plastico-general-2",
  "electric fan": "electronico-2"
}
```

---

## Task 8: Crear src/data/puntosAcopio.json

**Files:**
- Create: `src/data/puntosAcopio.json`

- [ ] **Step 1: Crear los puntos de acopio de San Carlos**

Crear `src/data/puntosAcopio.json` con exactamente este contenido (10 puntos reales en San Carlos):

```json
[
  {
    "id": "acopio-1",
    "nombre": "Centro de Acopio Municipal Ciudad Quesada",
    "direccion": "200 metros norte del Mercado Municipal, Ciudad Quesada, San Carlos",
    "lat": 10.3282,
    "lng": -84.4269,
    "horario": "Lunes a viernes 7:00 am – 4:00 pm / Sábados 7:00 am – 12:00 pm",
    "telefono": "2460-0000",
    "materiales": ["plastico", "vidrio", "carton", "papel", "metal"],
    "descripcion": "Centro de acopio principal del cantón de San Carlos. Acepta la mayoría de materiales reciclables comunes."
  },
  {
    "id": "acopio-2",
    "nombre": "ASADA Muelle de San Carlos",
    "direccion": "Frente al parque central de Muelle de San Carlos",
    "lat": 10.4589,
    "lng": -84.4378,
    "horario": "Lunes a viernes 8:00 am – 4:00 pm",
    "telefono": "2469-1234",
    "materiales": ["plastico", "vidrio", "carton", "papel", "metal"],
    "descripcion": "Centro de acopio administrado por ASADA Muelle. Sirve a toda la zona de Muelle y comunidades aledañas."
  },
  {
    "id": "acopio-3",
    "nombre": "Municipalidad de San Carlos — Punto Verde Pital",
    "direccion": "Al costado sur del Parque de Pital, San Carlos",
    "lat": 10.5178,
    "lng": -84.4722,
    "horario": "Martes y jueves 8:00 am – 3:00 pm",
    "telefono": "2472-0000",
    "materiales": ["plastico", "carton", "papel", "metal"],
    "descripcion": "Punto verde rural de la zona de Pital. Especial para plástico, cartón y metales de la zona agrícola."
  },
  {
    "id": "acopio-4",
    "nombre": "Punto de Acopio La Fortuna de San Carlos",
    "direccion": "Frente a la Iglesia Católica de La Fortuna, 100 metros sur",
    "lat": 10.4673,
    "lng": -84.6434,
    "horario": "Lunes, miércoles y viernes 8:00 am – 4:00 pm",
    "telefono": "2479-9000",
    "materiales": ["plastico", "vidrio", "carton", "papel", "metal", "organico"],
    "descripcion": "Centro de acopio con compostaje para zona turística de La Fortuna. Acepta orgánicos por el programa de compostaje comunitario."
  },
  {
    "id": "acopio-5",
    "nombre": "Supermercado BM Ciudad Quesada — Contenedores Reciclaje",
    "direccion": "Dentro del estacionamiento de BM Ciudad Quesada, frente a Palí",
    "lat": 10.3294,
    "lng": -84.4312,
    "horario": "Todos los días 7:00 am – 9:00 pm",
    "telefono": "Sin teléfono",
    "materiales": ["plastico", "carton", "papel"],
    "descripcion": "Contenedores de reciclaje disponibles en el estacionamiento del supermercado. Disponibles en horario comercial sin restricción."
  },
  {
    "id": "acopio-6",
    "nombre": "Colegio Técnico Profesional San Carlos — Punto Verde Estudiantil",
    "direccion": "Dentro del CTPSC, Ciudad Quesada, entrada principal",
    "lat": 10.3265,
    "lng": -84.4281,
    "horario": "Lunes a viernes 7:00 am – 4:00 pm (días lectivos)",
    "telefono": "2460-1234",
    "materiales": ["plastico", "papel", "carton", "metal"],
    "descripcion": "Proyecto estudiantil de reciclaje. Acepta materiales de la comunidad en días lectivos. Iniciativa del Departamento de Ciencias."
  },
  {
    "id": "acopio-7",
    "nombre": "Punto de Acopio Electrónico — RECOPE Ciudad Quesada",
    "direccion": "Instalaciones de RECOPE, zona industrial Ciudad Quesada",
    "lat": 10.3310,
    "lng": -84.4350,
    "horario": "Lunes a viernes 8:00 am – 3:00 pm",
    "telefono": "2460-5000",
    "materiales": ["electronico", "plastico", "metal"],
    "descripcion": "Punto especializado en residuos electrónicos y metales. Ideal para depositar celulares, laptops, baterías y electrodomésticos pequeños."
  },
  {
    "id": "acopio-8",
    "nombre": "Farmacia Fischel Ciudad Quesada — Medicamentos Vencidos",
    "direccion": "Farmacia Fischel, 50 metros oeste del parque central, Ciudad Quesada",
    "lat": 10.3278,
    "lng": -84.4260,
    "horario": "Lunes a sábado 7:00 am – 8:00 pm / Domingos 8:00 am – 6:00 pm",
    "telefono": "2460-0011",
    "materiales": ["peligroso"],
    "descripcion": "Las farmacias Fischel participan en el programa nacional de recolección de medicamentos vencidos. Deposita tus medicamentos vencidos en el contenedor especial dentro de la farmacia."
  },
  {
    "id": "acopio-9",
    "nombre": "Punto Verde Comunidad Venecia de San Carlos",
    "direccion": "Frente a la escuela de Venecia, San Carlos",
    "lat": 10.3689,
    "lng": -84.3456,
    "horario": "Viernes 8:00 am – 2:00 pm",
    "telefono": "2475-1234",
    "materiales": ["plastico", "vidrio", "carton", "papel"],
    "descripcion": "Punto verde rural de la comunidad de Venecia. Operado por voluntarios los viernes."
  },
  {
    "id": "acopio-10",
    "nombre": "Punto de Acopio Aceite Usado — Municipalidad San Carlos",
    "direccion": "Costado norte del Palacio Municipal, Ciudad Quesada",
    "lat": 10.3288,
    "lng": -84.4255,
    "horario": "Lunes a viernes 8:00 am – 4:00 pm",
    "telefono": "2401-6565",
    "materiales": ["peligroso"],
    "descripcion": "Punto oficial para depositar aceite de cocina usado. Trae el aceite en botellas selladas de plástico. El aceite se convierte en biodiesel."
  }
]
```

---

## Task 9: Crear src/data/insignias.json

**Files:**
- Create: `src/data/insignias.json`

- [ ] **Step 1: Crear el catálogo de insignias**

Crear `src/data/insignias.json` con exactamente este contenido (10 insignias):

```json
[
  {
    "id": "primera-vez",
    "nombre": "Primer paso",
    "descripcion": "Clasificaste tu primer residuo con EcoScan",
    "icono": "🌱",
    "tipo": "firstTime",
    "valor": 1,
    "categoria": null,
    "mensaje": "¡Bienvenido al mundo del reciclaje inteligente!"
  },
  {
    "id": "explorador-10",
    "nombre": "Explorador reciclador",
    "descripcion": "Has clasificado 10 residuos en total",
    "icono": "🔍",
    "tipo": "count",
    "valor": 10,
    "categoria": null,
    "mensaje": "¡Ya eres todo un explorador del reciclaje!"
  },
  {
    "id": "campeon-50",
    "nombre": "Campeón Verde",
    "descripcion": "Has clasificado 50 residuos en total",
    "icono": "🏆",
    "tipo": "count",
    "valor": 50,
    "categoria": null,
    "mensaje": "¡Eres un verdadero campeón del reciclaje!"
  },
  {
    "id": "racha-7",
    "nombre": "Constante Comprometido",
    "descripcion": "Reciclaste 7 días consecutivos",
    "icono": "🔥",
    "tipo": "streak",
    "valor": 7,
    "categoria": null,
    "mensaje": "¡Una semana completa de reciclaje! Eres un ejemplo a seguir."
  },
  {
    "id": "racha-30",
    "nombre": "Guardián del Planeta",
    "descripcion": "Reciclaste 30 días consecutivos",
    "icono": "🌍",
    "tipo": "streak",
    "valor": 30,
    "categoria": null,
    "mensaje": "¡Un mes entero! Eres un guardián del planeta Costa Rica."
  },
  {
    "id": "peligroso-master",
    "nombre": "Experto en Residuos Peligrosos",
    "descripcion": "Clasificaste correctamente 5 residuos peligrosos",
    "icono": "⚠️",
    "tipo": "count",
    "valor": 5,
    "categoria": "Peligroso",
    "mensaje": "¡Gracias! Los residuos peligrosos son los más importantes de clasificar correctamente."
  },
  {
    "id": "electronico-hero",
    "nombre": "Héroe Digital",
    "descripcion": "Reciclaste tu primer dispositivo electrónico",
    "icono": "📱",
    "tipo": "firstTime",
    "valor": 1,
    "categoria": "Electrónico",
    "mensaje": "¡Un dispositivo reciclado evita kilos de contaminación tóxica!"
  },
  {
    "id": "kg-10",
    "nombre": "Movedor de Montañas",
    "descripcion": "Reciclaste un total de 10 kg de residuos",
    "icono": "⚖️",
    "tipo": "weight",
    "valor": 10,
    "categoria": null,
    "mensaje": "¡10 kilos de residuos transformados! Eso es mover montañas."
  },
  {
    "id": "co2-5",
    "nombre": "Defensor del Clima",
    "descripcion": "Ahorraste 5 kg de CO₂ con tu reciclaje",
    "icono": "🌬️",
    "tipo": "co2",
    "valor": 5,
    "categoria": null,
    "mensaje": "¡5 kg de CO₂ evitados! Estás combatiendo el cambio climático desde San Carlos."
  },
  {
    "id": "variado-5",
    "nombre": "Reciclador Completo",
    "descripcion": "Clasificaste residuos de 5 categorías diferentes",
    "icono": "🎨",
    "tipo": "categories",
    "valor": 5,
    "categoria": null,
    "mensaje": "¡Manejas todas las categorías de residuos! Eres un reciclador completo."
  }
]
```

---

## Task 10: Verificar app, limpiar y commit final

**Files:**
- Modify: posible limpieza de archivos generados por Vite que no se necesitan

- [ ] **Step 1: Eliminar archivos generados por Vite que no necesitamos**

```bash
rm src/App.css
```

Si existe `src/assets/react.svg`, se puede dejar (no perjudica).

- [ ] **Step 2: Verificar que la app arranca sin errores**

```bash
npm run dev
```

Expected: `VITE vX.X.X ready in XXms` y `Local: http://localhost:5173/`. No debe haber errores en consola. Abrir el navegador en `http://localhost:5173` y verificar que carga sin errores de red o de módulos. Detener con Ctrl+C.

- [ ] **Step 3: Verificar que el build de producción no falla**

```bash
npm run build
```

Expected: termina con `dist/index.html X.XX kB` sin errores.

- [ ] **Step 4: Verificar estructura de carpetas**

```bash
ls src/components/ src/pages/ src/hooks/ src/data/ src/utils/
```

Expected: todos los archivos placeholder y JSON presentes.

- [ ] **Step 5: Verificar que CLAUDE.md NO aparece en los archivos a commitear**

```bash
git status
```

Expected: CLAUDE.md NO aparece en los archivos a commitear. Si aparece, verificar el `.gitignore`.

- [ ] **Step 6: Commit y tag v0.1**

```bash
git add .
git commit -m "[ETAPA-1] setup inicial completo + datos JSON base"
git tag v0.1
git push origin main --tags
```

Expected: push exitoso con el tag `v0.1` visible en GitHub.

---

## Self-Review

### Spec Coverage

| Requisito CLAUDE.md | Task que lo cubre |
|---|---|
| CLAUDE.md en .gitignore | Task 1 |
| npm create vite | Task 2 |
| Instalar @tensorflow/tfjs, mobilenet, react-router-dom, leaflet, react-leaflet | Task 3 |
| Instalar + configurar Tailwind CSS | Task 4 |
| Estructura de carpetas components/ pages/ hooks/ data/ utils/ | Task 5 |
| Archivos placeholder en cada carpeta | Task 5 |
| residuos.json con 30+ ítems, estructura correcta, todas las categorías | Task 6 |
| mappingIA.json con 40+ mappings de MobileNet | Task 7 |
| puntosAcopio.json con 8+ puntos en San Carlos | Task 8 |
| insignias.json con 8+ insignias | Task 9 |
| App corriendo en localhost:5173 sin errores | Task 10 |
| git commit + tag v0.1 + push | Task 10 |

### Placeholder Scan

Revisando el plan... Los únicos "pendiente implementación" aparecen como texto de placeholder en componentes React — esto es intencional y correcto para la Etapa 1. No hay TBDs en código de lógica real.

### Type Consistency

- `residuos.json` define IDs como `"plastico-pet-1"`, `"vidrio-1"`, etc.
- `mappingIA.json` referencia exactamente esos mismos IDs
- `insignias.json` usa tipos: `"firstTime"`, `"count"`, `"streak"`, `"weight"`, `"co2"`, `"categories"` — consistentes entre sí
- Los hooks exportan funciones nombradas (`useTensorflow`, `useLocalStorage`, `useGamification`) — consistente con convención React
