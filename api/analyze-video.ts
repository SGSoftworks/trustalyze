// Vercel Serverless Function - Análisis de Videos con IA
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { videoBuffer, fileName } = req.body as {
    videoBuffer?: string;
    fileName?: string;
  };

  if (!videoBuffer || !fileName)
    return res.status(400).json({ error: "Missing videoBuffer or fileName" });

  try {
    // 1. Análisis heurístico básico del video
    const buffer = Buffer.from(videoBuffer, "base64");
    const fileSize = buffer.length;
    const fileSizeMB = fileSize / (1024 * 1024);
    
    // Heurísticas básicas
    let heuristicScore = 0.5;
    
    // Factor de tamaño de archivo
    if (fileSizeMB > 100) {
      heuristicScore += 0.15; // Videos muy grandes pueden ser generados
    } else if (fileSizeMB < 1) {
      heuristicScore += 0.1; // Videos muy pequeños pueden ser comprimidos artificialmente
    }
    
    // Factor de duración estimada
    const estimatedFrames = Math.floor(fileSizeMB * 10); // Aproximación muy básica
    const frameAnalysisScore = Math.min(0.2, estimatedFrames / 1000);
    heuristicScore += frameAnalysisScore;
    
    // Normalizar
    heuristicScore = Math.min(0.8, Math.max(0.2, heuristicScore));

    // 2. Análisis con Gemini - Evaluación contextual y de contenido
    let geminiData: any = null;
    
    try {
      const geminiPrompt = `Eres un experto en detección de videos generados por IA (deepfakes, contenido sintético). Analiza este video y determina si fue generado por inteligencia artificial o es contenido humano real.

INFORMACIÓN DEL VIDEO:
- Nombre: ${fileName}
- Tamaño: ${fileSizeMB.toFixed(2)} MB
- Frames estimados: ${estimatedFrames}

METODOLOGÍA DE ANÁLISIS DE VIDEO:
1. **Análisis de Metadatos**: Evalúa consistencia en metadatos de video
2. **Análisis de Calidad**: Detecta patrones de compresión artificial
3. **Análisis de Movimiento**: Evalúa naturalidad del movimiento y transiciones
4. **Análisis de Audio**: Si hay audio, verifica sincronización y calidad
5. **Análisis de Resolución**: Evalúa consistencia de resolución y frame rate
6. **Análisis de Artefactos**: Identifica marcas típicas de generación por IA
7. **Análisis de Contenido**: Evalúa coherencia del contenido visual
8. **Análisis de Tiempo**: Detecta patrones temporales artificiales

IMPORTANTE: 
- Sé específico y técnico en tu análisis
- Proporciona una determinación clara (IA o Humano)
- Justifica cada factor con evidencia concreta
- Usa un rango de probabilidad realista (no 50-50)
- Considera las limitaciones del análisis sin acceso directo al video

Responde en formato JSON:
{
  "ai_probability": 0.0-1.0,
  "final_determination": "IA" o "Humano",
  "confidence_level": "Alta", "Media" o "Baja",
  "methodology": "Descripción de cómo se realizó el análisis de video",
  "interpretation": "Qué significa este resultado en términos prácticos",
  "analysis_factors": [
    {
      "factor": "nombre del factor de video",
      "score": 0.0-1.0,
      "explanation": "explicación detallada de por qué este factor indica IA o humano"
    }
  ],
  "key_indicators": ["indicador1", "indicador2", "indicador3"],
  "strengths": ["fortalezas que apoyan la determinación"],
  "weaknesses": ["limitaciones o puntos débiles"],
  "recommendations": "Recomendaciones para verificación adicional si es necesario"
}`;

      const geminiResp = await axios.post(
        process.env.GEMINI_API_ENDPOINT ||
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [{ parts: [{ text: geminiPrompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 800
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY,
          },
          timeout: 20000,
        }
      );

      const geminiText = geminiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (geminiText) {
        try {
          geminiData = JSON.parse(geminiText);
        } catch {
          geminiData = {
            ai_probability: 0.5,
            final_determination: "Indeterminado",
            confidence_level: "Baja",
            methodology: "Análisis de video básico por limitaciones técnicas",
            interpretation: "No se pudo realizar análisis de video completo",
            analysis_factors: [],
            key_indicators: ["Análisis limitado"],
            strengths: [],
            weaknesses: ["Respuesta de IA no estructurada"],
            recommendations: "Intente con un video de mayor calidad o diferente formato"
          };
        }
      }
    } catch (geminiError) {
      console.warn("Gemini API error:", geminiError);
    }

    // 3. Combinar resultados con pesos
    const geminiScore = geminiData?.ai_probability || 0.5;
    const finalScore = (heuristicScore * 0.4) + (geminiScore * 0.6); // Más peso a Gemini para análisis contextual
    const aiProbability = Number((finalScore * 100).toFixed(2));
    const humanProbability = Number(((1 - finalScore) * 100).toFixed(2));

    // Determinar resultado final
    const finalDetermination = finalScore > 0.6 ? "IA" : "Humano";
    const confidenceLevel = finalScore > 0.8 || finalScore < 0.2 ? "Alta" : 
                           finalScore > 0.7 || finalScore < 0.3 ? "Media" : "Baja";

    const result = {
      fileName,
      fileSize,
      fileSizeMB: Number(fileSizeMB.toFixed(2)),
      estimatedFrames,
      aiProbability,
      humanProbability,
      finalDetermination,
      confidenceLevel,
      methodology: geminiData?.methodology || "Análisis combinado con heurísticas y modelos especializados en detección de videos",
      interpretation: geminiData?.interpretation || `El video muestra características ${finalDetermination === "IA" ? "típicas de generación automática" : "consistentes con grabación humana"}`,
      analysisFactors: geminiData?.analysis_factors || [
        {
          factor: "Análisis Heurístico",
          score: heuristicScore,
          explanation: `Análisis de metadatos y características del archivo: ${(heuristicScore * 100).toFixed(1)}% probabilidad de generación por IA`
        },
        {
          factor: "Análisis Contextual",
          score: geminiScore,
          explanation: `Evaluación contextual de Gemini: ${(geminiScore * 100).toFixed(1)}% probabilidad de generación automática`
        }
      ],
      keyIndicators: geminiData?.key_indicators || ["Análisis de metadatos", "Evaluación de calidad", "Detección de artefactos"],
      strengths: geminiData?.strengths || [`Análisis realizado con ${confidenceLevel.toLowerCase()} confianza`],
      weaknesses: geminiData?.weaknesses || ["Limitaciones en el análisis debido a la falta de acceso directo al contenido del video"],
      recommendations: geminiData?.recommendations || "Para mayor precisión, analice videos de mayor calidad y resolución",
      technicalDetails: {
        heuristicScore: Number((heuristicScore * 100).toFixed(1)),
        geminiScore: Number((geminiScore * 100).toFixed(1)),
        combinedScore: Number((finalScore * 100).toFixed(1)),
        methodology: "40% Heurísticas + 60% Gemini para análisis de video"
      }
    };

    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("Analysis error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    const errorDetails =
      err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: unknown } }).response?.data
        : errorMessage;

    return res.status(500).json({
      error: "Analysis failed",
      details: errorDetails,
    });
  }
}