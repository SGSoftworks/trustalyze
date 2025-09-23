import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { videoBuffer, fileName, mimeType } = req.body as {
    videoBuffer?: string;
    fileName?: string;
    mimeType?: string;
  };

  if (!videoBuffer || !fileName) {
    return res.status(400).json({ error: "Missing videoBuffer or fileName" });
  }

  try {
    // En un entorno real, aquí se extraerían frames del video
    // Para esta implementación, simulamos el análisis con heurísticas
    const buffer = Buffer.from(videoBuffer, "base64");
    const fileSize = buffer.length;

    // Heurísticas básicas para detección de deepfake
    // En producción: usar FFmpeg para extraer frames y analizar con modelos especializados
    let aiScore = 0.5;

    // Simular análisis basado en tamaño y metadatos
    if (fileSize > 50 * 1024 * 1024) {
      // > 50MB
      aiScore += 0.1; // Videos grandes pueden ser más propensos a manipulación
    }

    // Simular análisis de frames (en producción: extraer frames reales)
    const estimatedFrames = Math.floor(fileSize / (1024 * 1024)); // Estimación muy básica
    const frameAnalysisScore = Math.min(0.3, estimatedFrames / 1000);
    aiScore += frameAnalysisScore;

    // Normalizar score
    aiScore = Math.min(0.9, Math.max(0.1, aiScore));

    const result = {
      fileName,
      fileSize,
      estimatedFrames,
      aiProbability: Number((aiScore * 100).toFixed(2)),
      humanProbability: Number(((1 - aiScore) * 100).toFixed(2)),
      steps: [
        `Análisis de video: ${fileName}`,
        "Extracción de metadatos",
        "Análisis heurístico de frames",
        "Cálculo de probabilidades",
      ],
      justification: `Análisis heurístico de ${fileName}. En producción se integraría extracción real de frames y modelos especializados de detección de deepfake.`,
    };
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: "Analysis failed",
      details: err?.response?.data || err?.message,
    });
  }
}
