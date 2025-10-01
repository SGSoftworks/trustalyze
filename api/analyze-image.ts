// Vercel Serverless Function - Análisis de Imágenes con Gemini
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import * as Tesseract from "tesseract.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    // Obtener archivo del FormData
    const formData = req.body;
    if (!formData || !formData.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = formData.file;
    const fileName = file.name || "imagen";
    const fileType = file.type || "image/jpeg";

    // Verificar que es una imagen
    if (!fileType.startsWith("image/")) {
      return res.status(400).json({ error: "File is not an image" });
    }

    // Convertir imagen a base64 para análisis
    const imageBase64 = file.data;
    const imageDataUrl = `data:${fileType};base64,${imageBase64}`;

    // Extraer texto de la imagen usando OCR
    let extractedText = "";
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageDataUrl, "spa+eng", {
        logger: (m) => console.log(m),
      });
      extractedText = text.trim();
    } catch (ocrError) {
      console.warn("OCR failed:", ocrError);
      extractedText = "";
    }

    // Análisis con Gemini Vision
    const geminiPrompt = `Eres un experto en detección de contenido generado por IA. Analiza esta imagen de manera exhaustiva y determina si fue generada por inteligencia artificial o creada por un humano.

INFORMACIÓN DE LA IMAGEN:
- Nombre: ${fileName}
- Tipo: ${fileType}
- Texto extraído (OCR): ${extractedText || "No se pudo extraer texto"}

METODOLOGÍA DE ANÁLISIS PROFESIONAL:
1. **Análisis Visual**: Evalúa composición, iluminación, perspectiva y elementos visuales
2. **Análisis de Texto**: Examina el texto visible en la imagen (si existe)
3. **Análisis de Patrones**: Identifica patrones típicos de generación por IA
4. **Análisis de Coherencia**: Verifica coherencia entre elementos visuales y textuales
5. **Análisis de Calidad**: Evalúa la calidad y naturalidad de la imagen
6. **Análisis de Artefactos**: Detecta artefactos típicos de generación por IA
7. **Análisis de Contexto**: Verifica relevancia y coherencia contextual
8. **Análisis de Estilo**: Evalúa el estilo artístico y su consistencia

INSTRUCCIONES CRÍTICAS:
- Realiza un análisis PROFUNDO y TÉCNICO de la imagen
- Proporciona una determinación CLARA y DEFINITIVA (IA o Humano)
- Calcula porcentajes REALES basados en evidencia visual concreta
- Justifica cada factor con observaciones específicas de la imagen
- Usa un rango de probabilidad REALISTA basado en el análisis
- Sé ESPECÍFICO en tus observaciones visuales
- Considera tanto elementos visuales como textuales

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
      "explanation": "explicación detallada con observaciones específicas de la imagen"
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
        contents: [
          {
            parts: [
              { text: geminiPrompt },
              {
                inline_data: {
                  mime_type: fileType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
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

    // Análisis básico del texto extraído
    const wordCount = extractedText
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const hasText = extractedText.length > 0;

    const result = {
      inputLength: extractedText.length,
      aiProbability,
      humanProbability,
      finalDetermination: geminiData.final_determination,
      confidenceLevel: geminiData.confidence_level,
      methodology:
        geminiData.methodology ||
        "Análisis exhaustivo de imagen con modelo Gemini 2.0 Flash especializado en detección de contenido generado por IA",
      interpretation:
        geminiData.interpretation ||
        `La imagen muestra características ${
          geminiData.final_determination === "IA"
            ? "típicas de generación automática"
            : "consistentes con creación humana"
        }`,
      analysisFactors: geminiData.analysis_factors || [],
      keyIndicators: geminiData.key_indicators || [],
      strengths: geminiData.strengths || [],
      weaknesses: geminiData.weaknesses || [],
      recommendations:
        geminiData.recommendations ||
        "Para mayor precisión, analice imágenes de mayor resolución",
      imageAnalysis: {
        hasText,
        extractedTextLength: extractedText.length,
        wordCount,
        textContent: extractedText.substring(0, 500), // Primeros 500 caracteres
      },
      technicalDetails: {
        geminiScore: aiProbability,
        methodology:
          "Análisis completo de imagen con Gemini 2.0 Flash especializado en detección de IA",
        modelVersion: "gemini-2.0-flash",
        analysisDepth: "Exhaustivo",
      },
      imageInfo: {
        fileName,
        fileType,
        hasText,
        extractedLength: extractedText.length,
      },
    };

    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("Image analysis error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return res.status(500).json({
      error: "Image analysis failed",
      details: errorMessage,
    });
  }
}
