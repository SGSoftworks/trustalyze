# Trustalyze - Sistema de Detección de Contenido IA

Sistema profesional de análisis de contenido que determina si textos, documentos, imágenes y videos fueron generados por inteligencia artificial o creados por humanos. Desarrollado por estudiantes de UNINPAHU como proyecto de grado.

## 🚀 Características Principales

- **Análisis Multimodal**: Texto, documentos (PDF/DOCX), imágenes y videos
- **Tecnología Avanzada**: Integración con Gemini 2.0 Flash de Google
- **Interfaz Profesional**: Diseño moderno con TailwindCSS y React
- **Privacidad y Seguridad**: Cumplimiento con leyes colombianas de protección de datos
- **Pipeline Visible**: Proceso de análisis paso a paso para transparencia
- **Dashboard Completo**: Estadísticas y historial de análisis
- **Análisis de Audio**: Extracción y análisis de contenido de audio en videos
- **Detección de Deepfakes**: Análisis especializado para detectar contenido manipulado
- **Exportación de Resultados**: Exporta análisis en formato JSON, CSV y PDF

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 19** con Vite
- **TypeScript** para tipado estático
- **TailwindCSS 3.4.x** para estilos
- **React Router** para navegación

### Backend

- **Vercel Serverless Functions** con Node.js
- **Google Gemini 2.0 Flash** para análisis de IA
- **Firebase Firestore** para almacenamiento
- **Tesseract.js** para OCR en imágenes
- **Mammoth** para procesamiento de documentos Word
- **FFmpeg** para procesamiento de video y audio
- **Análisis de Deepfakes** con detección de artefactos

### APIs Integradas

- **Gemini 2.0 Flash**: Análisis principal de contenido
- **Google Search API**: Búsqueda de contenido relacionado (opcional)
- **Firebase**: Almacenamiento y gestión de datos

## 📋 Requisitos del Sistema

- Node.js 18.0.0 o superior
- npm o yarn
- Cuenta de Google AI Studio (para Gemini API)
- Proyecto de Firebase (para almacenamiento)

## ⚙️ Configuración e Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd trustalyze
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo `env.example` a `.env.local` y configura las siguientes variables:

```bash
cp env.example .env.local
```

Edita `.env.local` con tus claves:

```env
# API de Gemini (Requerido)
VITE_GEMINI_API_KEY=tu_clave_de_gemini_aqui
GEMINI_API_KEY=tu_clave_de_gemini_aqui
GEMINI_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

# Firebase (Requerido)
VITE_FIREBASE_API_KEY=tu_clave_de_firebase
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Google Search API (Opcional)
GOOGLE_SEARCH_API_KEY=tu_clave_de_google_search
GOOGLE_SEARCH_ENGINE_ID=tu_search_engine_id

# API Base URL
VITE_API_BASE_URL=/api
```

### 4. Configurar Firebase

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

### 5. Obtener Claves de API

#### Gemini API

1. Ve a https://aistudio.google.com/app/apikey
2. Crea una nueva API key
3. Copia la clave a las variables `GEMINI_API_KEY` y `VITE_GEMINI_API_KEY`

#### Google Search API (Opcional)

1. Ve a Google Cloud Console
2. Habilita la Custom Search API
3. Crea credenciales de API
4. Crea un motor de búsqueda personalizado
5. Copia la API key y el Search Engine ID

## 🚀 Desarrollo Local

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Construcción para Producción

```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/`

## 🌐 Despliegue en Vercel

### 1. Conectar con Vercel

1. Conecta tu repositorio con Vercel
2. Selecciona el framework: Vite

### 2. Configurar Variables de Entorno

En Vercel Dashboard > Project Settings > Environment Variables, agrega:

- `GEMINI_API_KEY`
- `GEMINI_API_ENDPOINT`
- `GOOGLE_SEARCH_API_KEY` (opcional)
- `GOOGLE_SEARCH_ENGINE_ID` (opcional)
- Todas las variables `VITE_FIREBASE_*`

### 3. Configurar Build

- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Framework Preset**: Vite

### 4. Desplegar

Las funciones en `api/` se implementan automáticamente como Serverless Functions.

## 🏗️ Arquitectura del Sistema

```
trustalyze/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── sections/           # Páginas principales
│   ├── lib/               # Servicios y utilidades
│   ├── types.ts           # Definiciones de tipos
│   └── ui/                # Componentes de UI
├── api/                   # Funciones serverless de Vercel
│   ├── analyze-text.ts    # Análisis de texto
│   ├── analyze-file.ts    # Análisis de documentos
│   ├── analyze-image.ts   # Análisis de imágenes
│   ├── analyze-video.ts   # Análisis de videos
│   └── search-related.ts  # Búsqueda relacionada
├── public/                # Archivos estáticos
└── dist/                  # Build de producción
```

## 📊 Estructura de Datos

### Análisis en Firestore

```typescript
interface AnalysisResult {
  id?: string;
  kind: "texto" | "documento" | "imagen" | "video" | "caso";
  createdAt: number;
  inputLength?: number;
  aiProbability: number; // 0-100
  humanProbability: number; // 0-100
  finalDetermination?: string; // "IA" | "Humano"
  confidenceLevel?: string; // "Alta" | "Media" | "Baja"
  methodology?: string;
  interpretation?: string;
  analysisFactors?: AnalysisFactor[];
  keyIndicators?: string[];
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string;
  textAnalysis?: TextAnalysis;
  technicalDetails?: TechnicalDetails;
  pipelineSteps?: PipelineStep[];
}
```

## 🔒 Seguridad y Privacidad

- **Cumplimiento Legal**: Ley 1581 de 2012 (Colombia)
- **Protección de Datos**: Solo se almacenan resultados, no contenido original
- **Consentimiento**: Banner de consentimiento obligatorio
- **Cifrado**: Transmisión segura de datos
- **Retención**: Eliminación automática después de 30 días

## 🧪 Casos de Prueba

### Texto

1. Ve a `/texto`
2. Pega un párrafo de texto
3. Haz clic en "Analizar Texto"
4. Revisa el resultado y el pipeline de análisis

### Documentos

1. Ve a `/documentos`
2. Sube un archivo PDF o DOCX
3. Espera el procesamiento
4. Revisa el análisis detallado

### Imágenes

1. Ve a `/imagenes`
2. Sube una imagen
3. El sistema extraerá texto con OCR
4. Analizará tanto contenido visual como textual

### Dashboard

1. Ve a `/dashboard`
2. Revisa estadísticas generales
3. Explora análisis recientes
4. Filtra por tipo de contenido

## 📈 Funcionalidades por Implementar

- [ ] Análisis de audio en videos
- [ ] Integración con Google Search API
- [ ] Análisis de deepfakes
- [ ] API de exportación de resultados
- [ ] Análisis en tiempo real
- [ ] Integración con más modelos de IA

## 🤝 Contribución

Este es un proyecto académico desarrollado por:

- **Iván Jair Mendoza Solano**
- **Juan David Gómez Ruidiaz**

**Docente**: Martha Cecilia Vidal Arizabaleta  
**Institución**: UNINPAHU - Ingeniería de Software

## 📄 Licencia

Este proyecto es parte de un trabajo académico de la Universidad UNINPAHU.

## 📞 Soporte

Para soporte técnico o consultas:

- **Email**: privacidad@trustalyze.com
- **Proyecto**: UNINPAHU - Ingeniería de Software

---

**Trustalyze** - Sistema de Detección de Contenido IA  
Desarrollado con ❤️ por estudiantes de UNINPAHU
