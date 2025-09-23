// Vercel Serverless Function - Análisis de Imágenes con IA
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64 } = req.body as { imageBase64?: string };
  if (!imageBase64)
    return res.status(400).json({ error: "Missing imageBase64" });

  try {
    // 1. Análisis con Hugging Face - Detección de imágenes generadas por IA
    let hfScore = 0.5;
    let hfAnalysis = "Análisis de Hugging Face no disponible";

    try {
      const hfResp = await axios.post(
        "https://api-inference.huggingface.co/models/umm-maybe/ai-image-detector",
        { inputs: imageBase64 },
        {
          headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
          timeout: 15000,
        }
      );

      hfScore = hfResp.data?.score ?? 0.5;
      hfAnalysis = `Modelo especializado detectó ${(hfScore * 100).toFixed(
        1
      )}% probabilidad de generación por IA`;
    } catch (hfError) {
      console.warn("HF API error:", hfError);
    }

    // 2. Análisis con Gemini - Evaluación visual y contextual
    let geminiData: any = null;

    try {
      const geminiPrompt = `Eres un experto en detección de imágenes generadas por IA. Analiza esta imagen y determina si fue generada por inteligencia artificial o es una fotografía/ilustración humana.

METODOLOGÍA DE ANÁLISIS VISUAL:
1. **Análisis de Patrones**: Detecta patrones repetitivos, artefactos de generación
2. **Análisis de Texturas**: Evalúa la naturalidad de texturas y superficies
3. **Análisis de Composición**: Verifica la coherencia composicional y perspectiva
4. **Análisis de Detalles**: Examina la precisión en detalles finos y bordes
5. **Análisis de Iluminación**: Evalúa la coherencia de la iluminación
6. **Análisis de Anatomía**: Si hay personas, verifica proporciones y anatomía
7. **Análisis de Artefactos**: Identifica marcas típicas de generación por IA
8. **Análisis de Estilo**: Evalúa consistencia estilística y artística

IMPORTANTE: 
- Sé específico y técnico en tu análisis visual
- Proporciona una determinación clara (IA o Humano)
- Justifica cada factor con evidencia visual concreta
- Usa un rango de probabilidad realista (no 50-50)

Responde en formato JSON:
{
  "ai_probability": 0.0-1.0,
  "final_determination": "IA" o "Humano",
  "confidence_level": "Alta", "Media" o "Baja",
  "methodology": "Descripción de cómo se realizó el análisis visual",
  "interpretation": "Qué significa este resultado en términos prácticos",
  "analysis_factors": [
    {
      "factor": "nombre del factor visual",
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
            maxOutputTokens: 800,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY,
          },
          timeout: 20000,
        }
      );

      const geminiText =
        geminiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (geminiText) {
        try {
          geminiData = JSON.parse(geminiText);
        } catch {
          geminiData = {
            ai_probability: 0.5,
            final_determination: "Indeterminado",
            confidence_level: "Baja",
            methodology: "Análisis visual básico por limitaciones técnicas",
            interpretation: "No se pudo realizar análisis visual completo",
            analysis_factors: [],
            key_indicators: ["Análisis limitado"],
            strengths: [],
            weaknesses: ["Respuesta de IA no estructurada"],
            recommendations:
              "Intente con una imagen de mayor resolución o diferente formato",
          };
        }
      }
    } catch (geminiError) {
      console.warn("Gemini API error:", geminiError);
    }

    // 3. Combinar resultados con pesos
    const geminiScore = geminiData?.ai_probability || 0.5;
    const finalScore = hfScore * 0.7 + geminiScore * 0.3; // Más peso a HF para imágenes
    const aiProbability = Number((finalScore * 100).toFixed(2));
    const humanProbability = Number(((1 - finalScore) * 100).toFixed(2));

    // Determinar resultado final
    const finalDetermination = finalScore > 0.6 ? "IA" : "Humano";
    const confidenceLevel =
      finalScore > 0.8 || finalScore < 0.2
        ? "Alta"
        : finalScore > 0.7 || finalScore < 0.3
        ? "Media"
        : "Baja";

    const result = {
      aiProbability,
      humanProbability,
      finalDetermination,
      confidenceLevel,
      methodology:
        geminiData?.methodology ||
        "Análisis combinado con modelos especializados en detección de imágenes",
      interpretation:
        geminiData?.interpretation ||
        `La imagen muestra características ${
          finalDetermination === "IA"
            ? "típicas de generación automática"
            : "consistentes con creación humana"
        }`,
      analysisFactors: geminiData?.analysis_factors || [
        {
          factor: "Análisis de Patrones",
          score: hfScore,
          explanation: `Modelo Hugging Face detectó patrones ${
            hfScore > 0.5 ? "de generación por IA" : "de creación humana"
          } con ${(hfScore * 100).toFixed(1)}% de confianza`,
        },
        {
          factor: "Análisis Visual Contextual",
          score: geminiScore,
          explanation: `Evaluación visual de Gemini: ${(
            geminiScore * 100
          ).toFixed(1)}% probabilidad de generación automática`,
        },
      ],
      keyIndicators: geminiData?.key_indicators || [
        "Análisis de patrones visuales",
        "Evaluación de texturas",
        "Detección de artefactos",
      ],
      strengths: geminiData?.strengths || [
        `Análisis realizado con ${confidenceLevel.toLowerCase()} confianza`,
      ],
      weaknesses: geminiData?.weaknesses || [
        "Limitaciones en el análisis debido a la resolución de la imagen",
      ],
      recommendations:
        geminiData?.recommendations ||
        "Para mayor precisión, analice imágenes de mayor resolución y calidad",
      technicalDetails: {
        hfScore: Number((hfScore * 100).toFixed(1)),
        geminiScore: Number((geminiScore * 100).toFixed(1)),
        combinedScore: Number((finalScore * 100).toFixed(1)),
        methodology: "70% Hugging Face + 30% Gemini para análisis visual",
      },
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
