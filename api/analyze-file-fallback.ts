// Vercel Serverless Function - Análisis de Archivos FALLBACK (sin parsing)
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    // Obtener archivo del FormData
    const formData = req.body;
    if (!formData || !formData.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const file = formData.file;
    const fileName = file.name || "documento";
    const fileType = file.type || "application/octet-stream";

    // Análisis básico de metadatos de archivo
    const fileSize = file.size || 0;
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

    // Análisis heurístico básico para documentos
    let aiScore = 0;
    const factors = [];

    // Factor 1: Tamaño de archivo
    if (fileSize > 2 * 1024 * 1024) {
      // > 2MB
      aiScore += 0.2;
      factors.push({
        factor: "Archivo grande",
        score: 0.7,
        explanation: `Archivo de ${(fileSize / 1024 / 1024).toFixed(
          2
        )}MB, posiblemente generado por IA`,
      });
    }

    // Factor 2: Tipo de archivo
    if (fileType.includes("pdf")) {
      aiScore += 0.1;
      factors.push({
        factor: "Formato PDF",
        score: 0.6,
        explanation: "PDF es común en documentos generados por IA",
      });
    } else if (fileType.includes("word") || fileType.includes("document")) {
      aiScore += 0.15;
      factors.push({
        factor: "Documento Word",
        score: 0.7,
        explanation:
          "Word es frecuentemente usado para documentos generados por IA",
      });
    }

    // Factor 3: Nombre del archivo
    const suspiciousNames = ["generated", "ai", "auto", "draft", "temp"];
    if (suspiciousNames.some((name) => fileName.toLowerCase().includes(name))) {
      aiScore += 0.3;
      factors.push({
        factor: "Nombre sospechoso",
        score: 0.9,
        explanation: `El nombre "${fileName}" sugiere generación automática`,
      });
    }

    // Factor 4: Extensión de archivo
    if (["docx", "pdf", "txt"].includes(fileExtension)) {
      aiScore += 0.1;
      factors.push({
        factor: "Formato estándar",
        score: 0.6,
        explanation: "Formato común para documentos generados por IA",
      });
    }

    // Factor 5: Tamaño muy pequeño
    if (fileSize < 1024) {
      // < 1KB
      aiScore -= 0.2;
      factors.push({
        factor: "Archivo muy pequeño",
        score: 0.3,
        explanation: "Archivo muy pequeño, probablemente creado manualmente",
      });
    }

    // Normalizar score
    const aiProbability = Math.max(0, Math.min(100, Math.round(aiScore * 100)));
    const humanProbability = 100 - aiProbability;

    const result = {
      inputLength: fileSize,
      aiProbability,
      humanProbability,
      finalDetermination: aiProbability > 50 ? "IA" : "Humano",
      confidenceLevel:
        aiProbability > 70 || aiProbability < 30 ? "Alta" : "Media",
      methodology:
        "Análisis de metadatos de archivo (modo fallback - sin parsing)",
      interpretation: `El documento muestra características ${
        aiProbability > 50
          ? "típicas de generación automática"
          : "consistentes con creación humana"
      }`,
      analysisFactors: factors,
      keyIndicators: [
        fileSize > 2 * 1024 * 1024 ? "Archivo grande" : "Archivo normal",
        fileType.includes("pdf") ? "Formato PDF" : "Otro formato",
        suspiciousNames.some((name) => fileName.toLowerCase().includes(name))
          ? "Nombre sospechoso"
          : "Nombre normal",
      ],
      strengths:
        aiProbability > 50
          ? ["Estructura consistente", "Formato estándar"]
          : ["Variedad en contenido", "Elementos únicos"],
      weaknesses:
        aiProbability > 50
          ? ["Falta de personalización", "Patrones predecibles"]
          : ["Posibles inconsistencias menores", "Estructura variable"],
      recommendations:
        "Para análisis más preciso, configure parsing de documentos y análisis de contenido",
      documentAnalysis: {
        fileSize,
        fileName,
        fileType,
        extension: fileExtension,
        isLarge: fileSize > 2 * 1024 * 1024,
        isSmall: fileSize < 1024,
      },
      technicalDetails: {
        geminiScore: aiProbability,
        methodology: "Análisis de metadatos básico (fallback)",
        modelVersion: "fallback-v1.0",
        analysisDepth: "Básico",
      },
    };

    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("Fallback file analysis error:", err);

    return res.status(500).json({
      error: "Fallback file analysis failed",
      details: err instanceof Error ? err.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}
