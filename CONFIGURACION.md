# Configuración de Trustalyze

## Variables de Entorno Requeridas

### Para Vercel (Producción)

1. **GEMINI_API_KEY**: Tu clave de API de Google Gemini
2. **GEMINI_API_ENDPOINT**: Endpoint de la API (opcional, por defecto usa Gemini 2.0 Flash)

### Para Firebase

1. **VITE_FIREBASE_API_KEY**: Clave de API de Firebase
2. **VITE_FIREBASE_AUTH_DOMAIN**: Dominio de autenticación
3. **VITE_FIREBASE_PROJECT_ID**: ID del proyecto
4. **VITE_FIREBASE_STORAGE_BUCKET**: Bucket de almacenamiento
5. **VITE_FIREBASE_MESSAGING_SENDER_ID**: ID del remitente
6. **VITE_FIREBASE_APP_ID**: ID de la aplicación

## Configuración de Firebase

### 1. Crear Proyecto en Firebase Console
- Ve a [Firebase Console](https://console.firebase.google.com/)
- Crea un nuevo proyecto
- Habilita Firestore Database

### 2. Configurar Reglas de Firestore
Las reglas ya están configuradas en `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /analyses/{document} {
      allow read, write: if true;
    }
    match /results/{document} {
      allow read, write: if true;
    }
  }
}
```

### 3. Desplegar Reglas
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Inicializar proyecto
firebase init firestore

# Desplegar reglas
firebase deploy --only firestore:rules
```

## Configuración de Vercel

### 1. Variables de Entorno
En el dashboard de Vercel, ve a Settings > Environment Variables y agrega:

- `GEMINI_API_KEY`: Tu clave de API de Gemini
- `GEMINI_API_ENDPOINT`: (Opcional) Endpoint personalizado

### 2. Despliegue
```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel --prod
```

## Configuración Local

### 1. Archivo .env.local
Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

GEMINI_API_KEY=tu_gemini_api_key
GEMINI_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

### 2. Ejecutar Localmente
```bash
npm install
npm run dev
```

## Funcionamiento sin Configuración

La aplicación está diseñada para funcionar incluso sin configuración completa:

- **Sin Gemini**: Usa análisis heurístico básico
- **Sin Firebase**: Los análisis se procesan pero no se guardan
- **Dashboard**: Muestra mensaje de "Sin datos" si no hay conexión a Firebase

## Solución de Problemas

### Error 500 en APIs
- Verifica que las variables de entorno estén configuradas
- Revisa los logs de Vercel en el dashboard

### Error de permisos de Firebase
- Verifica que las reglas de Firestore estén desplegadas
- Confirma que el proyecto ID sea correcto

### Dashboard vacío
- Verifica la conexión a Firebase
- Revisa la consola del navegador para errores

## Estructura de la Aplicación

```
trustalyze/
├── api/                    # APIs de Vercel
│   ├── analyze-text.ts     # Análisis con Gemini
│   ├── analyze-text-fallback.ts  # Análisis básico
│   ├── analyze-file.ts     # Análisis de documentos
│   ├── analyze-file-fallback.ts  # Fallback documentos
│   ├── analyze-image.ts    # Análisis de imágenes
│   ├── analyze-image-fallback.ts # Fallback imágenes
│   └── analyze-video.ts    # Análisis de videos
├── src/
│   ├── lib/
│   │   ├── firebase.ts     # Servicio de Firebase
│   │   ├── api.ts          # Servicio de APIs
│   │   ├── privacy.ts      # Gestión de privacidad
│   │   └── export.ts       # Exportación de datos
│   ├── components/         # Componentes React
│   └── sections/           # Páginas principales
├── firestore.rules         # Reglas de Firestore
├── firebase.json           # Configuración Firebase
└── vercel.json             # Configuración Vercel
```
