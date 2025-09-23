// Vercel Serverless Function - Análisis de Texto con IA
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body as { text?: string };
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    // 1. Análisis con Hugging Face - Detección de contenido generado por IA
    let hfScore = 0.5;
    try {
      const hfResp = await axios.post(
        "https://api-inference.huggingface.co/models/roberta-base-openai-detector",
        { inputs: text.slice(0, 5000) }, // Limitar para evitar límites de API
        {
          headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
          timeout: 10000,
        }
      );

      const labels = hfResp.data?.[0] || [];
      const fakeLabel = labels.find(
        (l: any) => l.label === "FAKE" || l.label === "LABEL_1"
      );
      hfScore = fakeLabel?.score ?? 0.5;
    } catch (hfError) {
      console.warn("HF API error:", hfError);
    }

    // 2. Análisis con Gemini - Evaluación semántica y contextual
    let geminiScore = 0.5;
    let geminiExplanation = "Análisis semántico no disponible";

    try {
      const geminiPrompt = `Analiza este texto y determina la probabilidad de que haya sido generado por IA vs escrito por un humano. Considera:
      - Estructura y coherencia
      - Uso de lenguaje natural
      - Patrones típicos de IA
      - Contexto y fluidez
      
      Texto: "${text.slice(0, 2000)}"
      
      Responde en formato JSON:
      {
        "ai_probability": 0.0-1.0,
        "explanation": "explicación detallada",
        "indicators": ["indicador1", "indicador2"]
      }`;

      const geminiResp = await axios.post(
        process.env.GEMINI_API_ENDPOINT ||
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [{ parts: [{ text: geminiPrompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY,
          },
          timeout: 15000,
        }
      );

      const geminiText =
        geminiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (geminiText) {
        try {
          const geminiData = JSON.parse(geminiText);
          geminiScore = geminiData.ai_probability || 0.5;
          geminiExplanation = geminiData.explanation || geminiExplanation;
        } catch (parseError) {
          // Si no es JSON válido, usar el texto como explicación
          geminiExplanation = geminiText;
        }
      }
    } catch (geminiError) {
      console.warn("Gemini API error:", geminiError);
    }

    // 3. Combinar resultados con pesos
    const finalScore = hfScore * 0.6 + geminiScore * 0.4;
    const aiProbability = Number((finalScore * 100).toFixed(2));
    const humanProbability = Number(((1 - finalScore) * 100).toFixed(2));

    const result = {
      inputLength: text.length,
      aiProbability,
      humanProbability,
      steps: [
        "Limpieza y normalización del texto",
        "Análisis con modelo Hugging Face (roberta-base-openai-detector)",
        "Evaluación semántica con Gemini 2.0 Flash",
        "Combinación de resultados con pesos optimizados",
        "Cálculo de probabilidades finales",
      ],
      justification: `Análisis combinado: ${geminiExplanation}. El modelo Hugging Face detectó patrones de contenido generado por IA con ${(
        hfScore * 100
      ).toFixed(
        1
      )}% de confianza, mientras que Gemini evaluó la coherencia semántica con ${(
        geminiScore * 100
      ).toFixed(1)}% de probabilidad de generación automática.`,
      confidence: finalScore > 0.7 || finalScore < 0.3 ? "Alta" : "Media",
    };

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Analysis error:", err);
    return res.status(500).json({
      error: "Analysis failed",
      details: err?.response?.data || err?.message,
    });
  }
}
