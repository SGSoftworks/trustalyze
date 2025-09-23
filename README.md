# Trustalyze

Aplicación para detección y análisis de contenido generado por IA vs humano. Frontend en React + Vite + TypeScript con TailwindCSS 3.4.x. Backend mediante funciones serverless de Vercel.

## Variables de entorno

1. Copia `.env.local.sample` a `.env.local` y coloca tus valores reales.

Ejemplo de contenido y dónde obtener cada clave:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

HF_API_KEY=
GEMINI_API_KEY=
# Opcional: fuerza el endpoint de Gemini si lo necesitas
GEMINI_API_ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
GOOGLE_SEARCH_API_KEY=
GOOGLE_SEARCH_CX=
```

Fuentes de las claves:

- Firebase: en `Project settings > General > Your apps > SDK setup & config`.
- Hugging Face: en `https://huggingface.co/settings/tokens` (token de acceso).
- Gemini: crear en `https://aistudio.google.com/app/apikey`. El endpoint de ejemplo proviene de la API `v1beta` y puedes dejarlo como variable `GEMINI_API_ENDPOINT`.
- Google Custom Search: API Key en `Google Cloud Console > APIs & Services > Credentials`; `CX` en `Programmable Search Engine Control Panel`.

En Vercel: configura `HF_API_KEY`, `GEMINI_API_KEY`, `GEMINI_API_ENDPOINT`, `GOOGLE_SEARCH_API_KEY` y `GOOGLE_SEARCH_CX` como variables privadas (Production/Preview/Development).

## Desarrollo local

```bash
npm install
npm run dev
```

## Configuración de Firebase

1. **Crear proyecto en Firebase Console:**
   - Ve a https://console.firebase.google.com/
   - Crea un nuevo proyecto
   - Habilita Firestore Database

2. **Configurar Firestore:**
   - En Firebase Console > Firestore Database > Rules
   - Copia y pega el contenido de `firestore.rules`
   - Publica las reglas

3. **Obtener configuración:**
   - En Project Settings > General > Your apps
   - Agrega una app web
   - Copia la configuración a tu `.env.local`

## Despliegue en Vercel

1. Conecta el repo con Vercel.
2. En Project Settings > Environment Variables agrega:
   - HF_API_KEY, GEMINI_API_KEY, GEMINI_API_ENDPOINT, GOOGLE_SEARCH_API_KEY, GOOGLE_SEARCH_CX
   - VITE_FIREBASE_* (todas las variables de Firebase)
3. Build & Output:
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
4. Framework Preset: Vite.

Las funciones en `api/` se implementan automáticamente como Serverless Functions (`@vercel/node`).

## Arquitectura

- **Frontend**: React + Vite + TailwindCSS 3.4.x
- **Backend**: Rutas serverless en `api/` para análisis (texto, documento, imagen, video) y `search-related`
- **Persistencia**: Firebase Firestore con colección `results` para almacenar análisis
- **Rutas UI**: `src/routes.tsx` con secciones: Texto, Documentos, Imágenes, Videos, Casos, Dashboard y Privacidad

### Estructura de datos en Firestore

```javascript
// Colección: results
{
  kind: "texto" | "documento" | "imagen" | "video" | "caso",
  aiProbability: number, // 0-100
  humanProbability: number, // 0-100
  justification: string,
  steps: string[],
  inputLength?: number,
  createdAt: number, // timestamp
  ts: serverTimestamp // para ordenamiento
}
```

## Seguridad y privacidad

- API keys privadas solo en variables de entorno del servidor (Vercel).
- Banner de consentimiento (`src/ui/ConsentBanner.tsx`).
- Política en `src/sections/PrivacyPage.tsx`. Cumplimiento Ley 1581/2012 (Colombia).

## Casos de prueba rápidos

- Texto: pega un párrafo y presiona Analizar en `/texto`.
- Documento: sube un `.txt` (para PDF/DOCX agregar OCR/parseo luego) en `/documentos`.
- Imágenes: sube una imagen en `/imagenes`.
- Videos: demo heurística en `/videos`.
- Dashboard: revisa últimos resultados en `/`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
