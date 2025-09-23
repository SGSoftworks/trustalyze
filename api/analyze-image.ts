// Vercel Serverless Function - Análisis de Imágenes REAL con Gemini
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64 } = req.body as { imageBase64?: string };
  if (!imageBase64)
    return res.status(400).json({ error: "Missing imageBase64" });

  try {
    // Análisis REAL con Gemini - Evaluación visual y contextual
    const geminiPrompt = `Eres un experto en detección de imágenes generadas por IA. Analiza esta imagen de manera exhaustiva y determina si fue generada por inteligencia artificial o es una fotografía/ilustración humana.

IMAGEN A ANALIZAR:
[Imagen proporcionada en base64]

METODOLOGÍA DE ANÁLISIS PROFESIONAL VISUAL:
1. **Análisis de Patrones**: Detecta patrones repetitivos, artefactos de generación y anomalías
2. **Análisis de Texturas**: Evalúa la naturalidad de texturas, superficies y materiales
3. **Análisis de Composición**: Verifica coherencia composicional, perspectiva y geometría
4. **Análisis de Detalles**: Examina la precisión en detalles finos, bordes y transiciones
5. **Análisis de Iluminación**: Evalúa la coherencia de la iluminación y sombras
6. **Análisis de Anatomía**: Si hay personas, verifica proporciones, anatomía y fisiología
7. **Análisis de Artefactos**: Identifica marcas típicas de generación por IA y errores
8. **Análisis de Estilo**: Evalúa consistencia estilística y artística
9. **Análisis de Resolución**: Detecta patrones de resolución y compresión artificial
10. **Análisis de Contexto**: Evalúa coherencia contextual y realismo general

INSTRUCCIONES CRÍTICAS:
- Realiza un análisis PROFUNDO y TÉCNICO de la imagen
- Proporciona una determinación CLARA y DEFINITIVA (IA o Humano)
- Calcula porcentajes REALES basados en evidencia visual concreta
- Justifica cada factor con observaciones específicas de la imagen
- Usa un rango de probabilidad REALISTA basado en el análisis visual
- Sé ESPECÍFICO en tus observaciones técnicas

Responde ÚNICAMENTE en formato JSON válido:
{
  "ai_probability": 0.0-1.0,
  "final_determination": "IA" o "Humano",
  "confidence_level": "Alta", "Media" o "Baja",
  "methodology": "Descripción detallada de la metodología de análisis visual aplicada",
  "interpretation": "Interpretación clara del resultado en términos prácticos",
  "analysis_factors": [
    {
      "factor": "nombre específico del factor visual analizado",
      "score": 0.0-1.0,
      "explanation": "explicación detallada con observaciones específicas de la imagen"
    }
  ],
  "key_indicators": ["indicador visual específico 1", "indicador visual específico 2", "indicador visual específico 3"],
  "strengths": ["fortaleza específica que apoya la determinación"],
  "weaknesses": ["limitación específica identificada"],
  "recommendations": "Recomendación específica para verificación adicional"
}`;

    const geminiResp = await axios.post(
      process.env.GEMINI_API_ENDPOINT ||
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ 
          parts: [
            { text: geminiPrompt },
            { 
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ] 
        }],
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
      aiProbability,
      humanProbability,
      finalDetermination: geminiData.final_determination,
      confidenceLevel: geminiData.confidence_level,
      methodology: geminiData.methodology || "Análisis exhaustivo con modelo Gemini especializado en imágenes",
      interpretation: geminiData.interpretation || `La imagen muestra características ${geminiData.final_determination === "IA" ? "típicas de generación automática" : "consistentes con creación humana"}`,
      analysisFactors: geminiData.analysis_factors || [],
      keyIndicators: geminiData.key_indicators || [],
      strengths: geminiData.strengths || [],
      weaknesses: geminiData.weaknesses || [],
      recommendations: geminiData.recommendations || "Para mayor precisión, analice imágenes de mayor resolución",
      technicalDetails: {
        geminiScore: aiProbability,
        methodology: "Análisis completo con Gemini 2.0 Flash especializado en detección de imágenes IA",
        modelVersion: "gemini-2.0-flash",
        analysisDepth: "Exhaustivo",
        imageAnalysis: "Análisis visual directo de la imagen"
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