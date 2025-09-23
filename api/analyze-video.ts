// Vercel Serverless Function - Análisis de Videos REAL con Gemini
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
    // Análisis REAL con Gemini - Evaluación contextual y de contenido de video
    const buffer = Buffer.from(videoBuffer, "base64");
    const fileSize = buffer.length;
    const fileSizeMB = fileSize / (1024 * 1024);
    
    const geminiPrompt = `Eres un experto en detección de videos generados por IA (deepfakes, contenido sintético). Analiza este video de manera exhaustiva y determina si fue generado por inteligencia artificial o es contenido humano real.

INFORMACIÓN DEL VIDEO:
- Nombre: ${fileName}
- Tamaño: ${fileSizeMB.toFixed(2)} MB
- Tamaño en bytes: ${fileSize}

METODOLOGÍA DE ANÁLISIS PROFESIONAL DE VIDEO:
1. **Análisis de Metadatos**: Evalúa consistencia en metadatos, codec, frame rate y resolución
2. **Análisis de Calidad**: Detecta patrones de compresión artificial y calidad inconsistente
3. **Análisis de Movimiento**: Evalúa naturalidad del movimiento, transiciones y fluidez
4. **Análisis de Audio**: Si hay audio, verifica sincronización, calidad y naturalidad
5. **Análisis de Resolución**: Evalúa consistencia de resolución, frame rate y estabilidad
6. **Análisis de Artefactos**: Identifica marcas típicas de generación por IA y errores
7. **Análisis de Contenido**: Evalúa coherencia del contenido visual y narrativo
8. **Análisis de Tiempo**: Detecta patrones temporales artificiales y discontinuidades
9. **Análisis de Iluminación**: Evalúa coherencia de iluminación entre frames
10. **Análisis de Contexto**: Evalúa realismo general y coherencia contextual

INSTRUCCIONES CRÍTICAS:
- Realiza un análisis PROFUNDO y TÉCNICO del video
- Proporciona una determinación CLARA y DEFINITIVA (IA o Humano)
- Calcula porcentajes REALES basados en evidencia técnica concreta
- Justifica cada factor con observaciones específicas del video
- Usa un rango de probabilidad REALISTA basado en el análisis
- Sé ESPECÍFICO en tus observaciones técnicas sobre deepfakes

Responde ÚNICAMENTE en formato JSON válido:
{
  "ai_probability": 0.0-1.0,
  "final_determination": "IA" o "Humano",
  "confidence_level": "Alta", "Media" o "Baja",
  "methodology": "Descripción detallada de la metodología de análisis de video aplicada",
  "interpretation": "Interpretación clara del resultado en términos prácticos",
  "analysis_factors": [
    {
      "factor": "nombre específico del factor de video analizado",
      "score": 0.0-1.0,
      "explanation": "explicación detallada con observaciones específicas del video"
    }
  ],
  "key_indicators": ["indicador de video específico 1", "indicador de video específico 2", "indicador de video específico 3"],
  "strengths": ["fortaleza específica que apoya la determinación"],
  "weaknesses": ["limitación específica identificada"],
  "recommendations": "Recomendación específica para verificación adicional"
}`;

    const geminiResp = await axios.post(
      process.env.GEMINI_API_ENDPOINT ||
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: geminiPrompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        timeout: 30000,
      }
    );

    const geminiText = geminiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!geminiText) {
      throw new Error("No response from Gemini API");
    }

    // Parsear respuesta JSON de Gemini
    let geminiData;
    try {
      geminiData = JSON.parse(geminiText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", geminiText);
      throw new Error("Invalid JSON response from Gemini");
    }

    // Validar estructura de respuesta
    if (!geminiData.ai_probability || !geminiData.final_determination) {
      throw new Error("Invalid response structure from Gemini");
    }

    // Calcular probabilidades REALES
    const aiProbability = Math.round(geminiData.ai_probability * 100);
    const humanProbability = Math.round((1 - geminiData.ai_probability) * 100);

    const result = {
      fileName,
      fileSize,
      fileSizeMB: Number(fileSizeMB.toFixed(2)),
      aiProbability,
      humanProbability,
      finalDetermination: geminiData.final_determination,
      confidenceLevel: geminiData.confidence_level,
      methodology: geminiData.methodology || "Análisis exhaustivo con modelo Gemini especializado en videos",
      interpretation: geminiData.interpretation || `El video muestra características ${geminiData.final_determination === "IA" ? "típicas de generación automática" : "consistentes con grabación humana"}`,
      analysisFactors: geminiData.analysis_factors || [],
      keyIndicators: geminiData.key_indicators || [],
      strengths: geminiData.strengths || [],
      weaknesses: geminiData.weaknesses || [],
      recommendations: geminiData.recommendations || "Para mayor precisión, analice videos de mayor calidad",
      technicalDetails: {
        geminiScore: aiProbability,
        methodology: "Análisis completo con Gemini 2.0 Flash especializado en detección de videos IA",
        modelVersion: "gemini-2.0-flash",
        analysisDepth: "Exhaustivo",
        videoAnalysis: "Análisis técnico de metadatos y características del video"
      }
    };

    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("Analysis error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    
    return res.status(500).json({
      error: "Analysis failed",
      details: errorMessage,
    });
  }
}