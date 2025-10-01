// Vercel Serverless Function - Análisis de Documentos con Gemini
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import * as mammoth from "mammoth";
import * as pdfParse from "pdf-parse";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    // Extraer texto según el tipo de archivo
    let extractedText = "";

    if (fileType.includes("pdf")) {
      const pdfBuffer = Buffer.from(file.data, "base64");
      const pdfData = await pdfParse(pdfBuffer);
      extractedText = pdfData.text;
    } else if (fileType.includes("word") || fileType.includes("document")) {
      const docBuffer = Buffer.from(file.data, "base64");
      const result = await mammoth.extractRawText({ buffer: docBuffer });
      extractedText = result.value;
    } else if (fileType.includes("text") || fileType.includes("plain")) {
      extractedText = Buffer.from(file.data, "base64").toString("utf-8");
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: "No text content found in file" });
    }

    // Análisis con Gemini
    const geminiPrompt = `Eres un experto en detección de contenido generado por IA. Analiza este documento de manera exhaustiva y determina si fue generado por inteligencia artificial o escrito por un humano.

INFORMACIÓN DEL DOCUMENTO:
- Nombre: ${fileName}
- Tipo: ${fileType}
- Longitud del texto: ${extractedText.length} caracteres

TEXTO A ANALIZAR:
"${extractedText}"

METODOLOGÍA DE ANÁLISIS PROFESIONAL:
1. **Análisis Estructural**: Evalúa organización lógica, coherencia, fluidez y estructura del documento
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
- Considera el contexto de documento (académico, profesional, etc.)

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

    const geminiResp = await axios.post(
      process.env.GEMINI_API_ENDPOINT ||
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
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
    const wordCount = extractedText.split(/\s+/).length;
    const sentenceCount = extractedText
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const avgWordsPerSentence =
      sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

    const hasEmotionalLanguage =
      /(siento|me siento|emocion|frustr|alegr|triste|feliz|angustia|ansiedad|miedo|esperanza)/i.test(
        extractedText
      );
    const hasPersonalPronouns =
      /(yo|me|mi|mí|nosotros|nos|nuestro|nuestra)/i.test(extractedText);
    const hasComplexSentences = avgWordsPerSentence > 15;
    const hasRepetitivePatterns = /(\b\w+\b).*\1.*\1/i.test(extractedText);

    const textAnalysis = {
      length: extractedText.length,
      wordCount,
      sentenceCount,
      avgWordsPerSentence,
      hasEmotionalLanguage,
      hasPersonalPronouns,
      hasComplexSentences,
      hasRepetitivePatterns,
    };

    const result = {
      inputLength: extractedText.length,
      aiProbability,
      humanProbability,
      finalDetermination: geminiData.final_determination,
      confidenceLevel: geminiData.confidence_level,
      methodology:
        geminiData.methodology ||
        "Análisis exhaustivo de documento con modelo Gemini 2.0 Flash especializado en detección de contenido generado por IA",
      interpretation:
        geminiData.interpretation ||
        `El documento muestra características ${
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
        "Para mayor precisión, analice documentos más extensos",
      textAnalysis,
      technicalDetails: {
        geminiScore: aiProbability,
        methodology:
          "Análisis completo de documento con Gemini 2.0 Flash especializado en detección de IA",
        modelVersion: "gemini-2.0-flash",
        analysisDepth: "Exhaustivo",
      },
      documentInfo: {
        fileName,
        fileType,
        extractedLength: extractedText.length,
      },
    };

    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("Document analysis error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return res.status(500).json({
      error: "Document analysis failed",
      details: errorMessage,
    });
  }
}
