// Vercel Serverless Function - Análisis de Texto REAL con Gemini
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

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

  const { text } = req.body as { text?: string };
  if (!text || text.trim().length === 0)
    return res.status(400).json({ error: "Missing or empty text" });

  // Verificar variables de entorno
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not found in environment variables");
    // En lugar de fallar, usar el fallback
    console.warn("Gemini API key not configured, redirecting to fallback");
    return res.status(503).json({
      error: "Service temporarily unavailable",
      details: "API key not configured, please try again",
      fallback: true,
    });
  }

  try {
    // Análisis REAL con Gemini - Detección de contenido generado por IA
    const geminiPrompt = `Eres un experto en detección de contenido generado por IA. Analiza este texto de manera exhaustiva y determina si fue generado por inteligencia artificial o escrito por un humano.

TEXTO A ANALIZAR:
"${text}"

METODOLOGÍA DE ANÁLISIS PROFESIONAL:
1. **Análisis Estructural**: Evalúa organización lógica, coherencia, fluidez y estructura del texto
2. **Análisis Lingüístico**: Examina vocabulario, sintaxis, patrones de lenguaje y complejidad
3. **Análisis Semántico**: Verifica coherencia contextual, conocimiento específico y profundidad
4. **Análisis de Patrones**: Identifica repeticiones, estructuras artificiales y patrones típicos de IA
5. **Análisis de Personalidad**: Detecta características humanas vs artificiales en el estilo
6. **Análisis de Originalidad**: Evalúa creatividad, pensamiento crítico y perspectivas únicas
7. **Análisis de Emociones**: Detecta expresiones emocionales auténticas vs simuladas
8. **Análisis de Contexto**: Verifica relevancia temporal, cultural y situacional

INSTRUCCIONES CRÍTICAS:
- Realiza un análisis PROFUNDO y TÉCNICO
- Proporciona una determinación CLARA y DEFINITIVA (IA o Humano)
- Calcula porcentajes REALES basados en evidencia concreta
- Justifica cada factor con ejemplos específicos del texto
- Usa un rango de probabilidad REALISTA basado en el análisis
- Sé ESPECÍFICO en tus observaciones

Responde ÚNICAMENTE en formato JSON válido:
{
  "ai_probability": 0.0-1.0,
  "final_determination": "IA" o "Humano",
  "confidence_level": "Alta", "Media" o "Baja",
  "methodology": "Descripción detallada de la metodología aplicada",
  "interpretation": "Interpretación clara del resultado en términos prácticos",
  "analysis_factors": [
    {
      "factor": "nombre específico del factor analizado",
      "score": 0.0-1.0,
      "explanation": "explicación detallada con ejemplos específicos del texto"
    }
  ],
  "key_indicators": ["indicador específico 1", "indicador específico 2", "indicador específico 3"],
  "strengths": ["fortaleza específica que apoya la determinación"],
  "weaknesses": ["limitación específica identificada"],
  "recommendations": "Recomendación específica para verificación adicional"
}`;

    const geminiEndpoint =
      process.env.GEMINI_API_ENDPOINT ||
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    console.log("Calling Gemini API at:", geminiEndpoint);

    const geminiResp = await axios.post(
      geminiEndpoint,
      {
        contents: [{ parts: [{ text: geminiPrompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        timeout: 30000,
      }
    );

    const geminiText =
      geminiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
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

    // Análisis de texto básico para contexto adicional
    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const avgWordsPerSentence =
      sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

    const hasEmotionalLanguage =
      /(siento|me siento|emocion|frustr|alegr|triste|feliz|angustia|ansiedad|miedo|esperanza)/i.test(
        text
      );
    const hasPersonalPronouns =
      /(yo|me|mi|mí|nosotros|nos|nuestro|nuestra)/i.test(text);
    const hasComplexSentences = avgWordsPerSentence > 15;
    const hasRepetitivePatterns = /(\b\w+\b).*\1.*\1/i.test(text);

    const textAnalysis = {
      length: text.length,
      wordCount,
      sentenceCount,
      avgWordsPerSentence,
      hasEmotionalLanguage,
      hasPersonalPronouns,
      hasComplexSentences,
      hasRepetitivePatterns,
    };

    const result = {
      inputLength: text.length,
      aiProbability,
      humanProbability,
      finalDetermination: geminiData.final_determination,
      confidenceLevel: geminiData.confidence_level,
      methodology:
        geminiData.methodology ||
        "Análisis exhaustivo con modelo Gemini 2.0 Flash especializado en detección de contenido generado por IA",
      interpretation:
        geminiData.interpretation ||
        `El texto muestra características ${
          geminiData.final_determination === "IA"
            ? "típicas de generación automática"
            : "consistentes con escritura humana"
        }`,
      analysisFactors: geminiData.analysis_factors || [],
      keyIndicators: geminiData.key_indicators || [],
      strengths: geminiData.strengths || [],
      weaknesses: geminiData.weaknesses || [],
      recommendations:
        geminiData.recommendations ||
        "Para mayor precisión, analice textos más extensos",
      textAnalysis,
      technicalDetails: {
        geminiScore: aiProbability,
        methodology:
          "Análisis completo con Gemini 2.0 Flash especializado en detección de IA",
        modelVersion: "gemini-2.0-flash",
        analysisDepth: "Exhaustivo",
      },
    };

    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("Analysis error:", err);

    let errorMessage = "Unknown error";
    let statusCode = 500;

    if (err instanceof Error) {
      errorMessage = err.message;

      // Manejar errores específicos de la API
      if (err.message.includes("API key")) {
        statusCode = 401;
        errorMessage = "Invalid API key";
      } else if (err.message.includes("timeout")) {
        statusCode = 408;
        errorMessage = "Request timeout";
      } else if (err.message.includes("network")) {
        statusCode = 503;
        errorMessage = "Service unavailable";
      }
    }

    return res.status(statusCode).json({
      error: "Analysis failed",
      details: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
