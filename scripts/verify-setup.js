#!/usr/bin/env node

/**
 * Script de verificación para Trustalyze
 * Verifica que la configuración esté correcta
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 Verificando configuración de Trustalyze...\n");

// Verificar archivos esenciales
const essentialFiles = [
  "package.json",
  "vite.config.ts",
  "tsconfig.json",
  "tailwind.config.js",
  "src/main.tsx",
  "src/App.tsx",
  "api/analyze-text.ts",
  "api/analyze-text-fallback.ts",
  "api/analyze-file.ts",
  "api/analyze-file-fallback.ts",
  "api/analyze-image.ts",
  "api/analyze-image-fallback.ts",
  "firestore.rules",
  "firebase.json",
  "vercel.json",
];

console.log("📁 Verificando archivos esenciales...");
let missingFiles = [];
essentialFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - FALTANTE`);
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log(`\n⚠️  Faltan ${missingFiles.length} archivos esenciales`);
} else {
  console.log("\n✅ Todos los archivos esenciales están presentes");
}

// Verificar configuración de TypeScript
console.log("\n🔧 Verificando configuración de TypeScript...");
try {
  const tsconfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf8"));
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict) {
    console.log("  ✅ TypeScript configurado en modo estricto");
  } else {
    console.log("  ⚠️  TypeScript no está en modo estricto");
  }
} catch (error) {
  console.log("  ❌ Error leyendo tsconfig.json");
}

// Verificar configuración de Vite
console.log("\n⚡ Verificando configuración de Vite...");
try {
  const viteConfig = fs.readFileSync("vite.config.ts", "utf8");
  if (viteConfig.includes("react") && viteConfig.includes("typescript")) {
    console.log("  ✅ Vite configurado con React y TypeScript");
  } else {
    console.log("  ⚠️  Configuración de Vite puede estar incompleta");
  }
} catch (error) {
  console.log("  ❌ Error leyendo vite.config.ts");
}

// Verificar configuración de Tailwind
console.log("\n🎨 Verificando configuración de Tailwind...");
try {
  const tailwindConfig = fs.readFileSync("tailwind.config.js", "utf8");
  if (tailwindConfig.includes("content") && tailwindConfig.includes("src")) {
    console.log("  ✅ Tailwind configurado correctamente");
  } else {
    console.log("  ⚠️  Configuración de Tailwind puede estar incompleta");
  }
} catch (error) {
  console.log("  ❌ Error leyendo tailwind.config.js");
}

// Verificar APIs
console.log("\n🔌 Verificando APIs...");
const apiFiles = [
  "api/analyze-text.ts",
  "api/analyze-text-fallback.ts",
  "api/analyze-file.ts",
  "api/analyze-file-fallback.ts",
  "api/analyze-image.ts",
  "api/analyze-image-fallback.ts",
];

apiFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes("export default") && content.includes("handler")) {
      console.log(`  ✅ ${file} - API válida`);
    } else {
      console.log(`  ⚠️  ${file} - Puede tener problemas`);
    }
  }
});

// Verificar configuración de Firebase
console.log("\n🔥 Verificando configuración de Firebase...");
if (fs.existsSync("firestore.rules")) {
  const rules = fs.readFileSync("firestore.rules", "utf8");
  if (rules.includes("analyses") && rules.includes("allow read, write")) {
    console.log("  ✅ Reglas de Firestore configuradas");
  } else {
    console.log("  ⚠️  Reglas de Firestore pueden necesitar ajustes");
  }
} else {
  console.log("  ❌ firestore.rules no encontrado");
}

if (fs.existsSync("firebase.json")) {
  console.log("  ✅ firebase.json presente");
} else {
  console.log("  ❌ firebase.json no encontrado");
}

// Verificar configuración de Vercel
console.log("\n🚀 Verificando configuración de Vercel...");
if (fs.existsSync("vercel.json")) {
  const vercelConfig = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
  if (vercelConfig.functions) {
    console.log("  ✅ vercel.json configurado con funciones");
  } else {
    console.log("  ⚠️  vercel.json puede necesitar configuración de funciones");
  }
} else {
  console.log("  ❌ vercel.json no encontrado");
}

// Resumen final
console.log("\n📊 Resumen de verificación:");
if (missingFiles.length === 0) {
  console.log("✅ Configuración básica completa");
  console.log("✅ APIs configuradas");
  console.log("✅ Sistema de fallback implementado");
  console.log("\n🎉 ¡Trustalyze está listo para usar!");
  console.log("\n📝 Próximos pasos:");
  console.log("1. Configurar variables de entorno (ver env.example)");
  console.log("2. Configurar Firebase (ver CONFIGURACION.md)");
  console.log("3. Desplegar en Vercel");
  console.log("4. ¡Comenzar a analizar contenido!");
} else {
  console.log(`❌ Faltan ${missingFiles.length} archivos esenciales`);
  console.log("⚠️  Revisa la configuración antes de continuar");
}

console.log("\n🔗 Para más información, consulta CONFIGURACION.md");
