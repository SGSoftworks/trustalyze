// Vercel Serverless Function - Análisis de Documentos REAL con Gemini
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import pdf from "pdf-parse";
import mammoth from "mammoth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { fileBuffer, fileName, mimeType } = req.body as {
    fileBuffer?: string;
    fileName?: string;
    mimeType?: string;
  };

  if (!fileBuffer || !fileName) {
    return res.status(400).json({ error: "Missing fileBuffer or fileName" });
  }

  try {
    // 1. Extraer texto del documento
    let extractedText = "";
    const buffer = Buffer.from(fileBuffer, "base64");

    if (
      mimeType === "application/pdf" ||
      fileName.toLowerCase().endsWith(".pdf")
    ) {
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
    } else if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.toLowerCase().endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (fileName.toLowerCase().endsWith(".txt")) {
      extractedText = buffer.toString("utf-8");
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: "No text extracted from file" });
    }

    // 2. Análisis REAL con Gemini - Evaluación contextual del documento
    const geminiPrompt = `Eres un experto en detección de documentos generados por IA. Analiza este documento de manera exhaustiva y determina si fue generado por inteligencia artificial o escrito por un humano.

INFORMACIÓN DEL DOCUMENTO:
- Nombre: ${fileName}
- Longitud: ${extractedText.length} caracteres
- Tipo: ${mimeType || "Desconocido"}
- Palabras: ${extractedText.split(/\s+/).length}

CONTENIDO A ANALIZAR:
"${extractedText.slice(0, 3000)}"

METODOLOGÍA DE ANÁLISIS PROFESIONAL DE DOCUMENTOS:
1. **Análisis Estructural**: Evalúa organización, coherencia, flujo y estructura del documento
2. **Análisis Lingüístico**: Examina vocabulario, sintaxis, patrones de escritura y complejidad
3. **Análisis de Contenido**: Verifica profundidad, originalidad, conocimiento específico y argumentación
4. **Análisis de Estilo**: Evalúa consistencia estilística, tono y personalidad del autor
5. **Análisis de Referencias**: Detecta citas, fuentes, metodología académica y referencias
6. **Análisis de Complejidad**: Mide sofisticación conceptual, argumentativa y técnica
7. **Análisis de Patrones**: Identifica repeticiones, estructuras artificiales y clichés
8. **Análisis de Contexto**: Evalúa relevancia, actualidad y conocimiento del tema

INSTRUCCIONES CRÍTICAS:
- Realiza un análisis PROFUNDO y TÉCNICO del documento
- Proporciona una determinación CLARA y DEFINITIVA (IA o Humano)
- Calcula porcentajes REALES basados en evidencia concreta del contenido
- Justifica cada factor con ejemplos específicos del documento
- Usa un rango de probabilidad REALISTA basado en el análisis
- Sé ESPECÍFICO en tus observaciones sobre el tipo de documento

Responde ÚNICAMENTE en formato JSON válido:
{
  "ai_probability": 0.0-1.0,
  "final_determination": "IA" o "Humano",
  "confidence_level": "Alta", "Media" o "Baja",
  "methodology": "Descripción detallada de la metodología aplicada al documento",
  "interpretation": "Interpretación clara del resultado en términos prácticos",
  "analysis_factors": [
    {
      "factor": "nombre específico del factor analizado",
      "score": 0.0-1.0,
      "explanation": "explicación detallada con ejemplos específicos del documento"
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

    const result = {
      fileName,
      extractedLength: extractedText.length,
      aiProbability,
      humanProbability,
      finalDetermination: geminiData.final_determination,
      confidenceLevel: geminiData.confidence_level,
      methodology:
        geminiData.methodology ||
        "Análisis exhaustivo con modelo Gemini especializado en documentos",
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
      technicalDetails: {
        geminiScore: aiProbability,
        methodology:
          "Análisis completo con Gemini 2.0 Flash especializado en detección de documentos IA",
        modelVersion: "gemini-2.0-flash",
        analysisDepth: "Exhaustivo",
        documentType: mimeType || "Desconocido",
      },
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
