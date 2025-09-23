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
        (l: { label: string; score: number }) =>
          l.label === "FAKE" || l.label === "LABEL_1"
      );
      hfScore = fakeLabel?.score ?? 0.5;
    } catch (hfError) {
      console.warn("HF API error:", hfError);
    }

    // 2. Análisis con Gemini - Evaluación semántica y contextual
    let geminiScore = 0.5;
    let geminiData: any = null;
    let analysisAspects: string[] = [];

    try {
      const geminiPrompt = `Eres un experto en detección de contenido generado por IA. Analiza este texto con precisión científica y determina si fue generado por inteligencia artificial o escrito por un humano.

METODOLOGÍA DE ANÁLISIS:
1. **Análisis Estructural**: Evalúa la organización lógica, coherencia y fluidez
2. **Análisis Lingüístico**: Examina vocabulario, sintaxis, patrones de lenguaje
3. **Análisis Semántico**: Verifica coherencia contextual y conocimiento específico
4. **Análisis de Patrones**: Identifica repeticiones, estructuras artificiales
5. **Análisis de Personalidad**: Detecta características humanas vs artificiales

Texto a analizar: "${text.slice(0, 2000)}"

IMPORTANTE: 
- Sé específico y técnico en tu análisis
- Proporciona una determinación clara (IA o Humano)
- Justifica cada factor con evidencia concreta
- Usa un rango de probabilidad realista (no 50-50)

Responde en formato JSON:
{
  "ai_probability": 0.0-1.0,
  "final_determination": "IA" o "Humano",
  "confidence_level": "Alta", "Media" o "Baja",
  "methodology": "Descripción de cómo se realizó el análisis",
  "interpretation": "Qué significa este resultado en términos prácticos",
  "analysis_factors": [
    {
      "factor": "nombre del factor",
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
          geminiData = JSON.parse(geminiText);
          geminiScore = geminiData.ai_probability || 0.5;
          analysisAspects = geminiData.key_indicators || [];
        } catch {
          // Si no es JSON válido, crear estructura básica
          geminiData = {
            ai_probability: 0.5,
            final_determination: "Indeterminado",
            confidence_level: "Baja",
            methodology: "Análisis básico por limitaciones técnicas",
            interpretation: "No se pudo realizar análisis completo",
            analysis_factors: [],
            key_indicators: ["Análisis limitado"],
            strengths: [],
            weaknesses: ["Respuesta de IA no estructurada"],
            recommendations: "Intente con un texto más largo o diferente"
          };
        }
      }
    } catch (geminiError) {
      console.warn("Gemini API error:", geminiError);
    }

    // 3. Combinar resultados con pesos
    const finalScore = hfScore * 0.6 + geminiScore * 0.4;
    const aiProbability = Number((finalScore * 100).toFixed(2));
    const humanProbability = Number(((1 - finalScore) * 100).toFixed(2));

    // 4. Análisis de aspectos específicos
    const textAnalysis = {
      length: text.length,
      wordCount: text.split(/\s+/).length,
      sentenceCount: text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
        .length,
      avgWordsPerSentence:
        text.split(/\s+/).length /
        Math.max(
          text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length,
          1
        ),
      hasEmotionalLanguage:
        /(me siento|estoy|me parece|creo|opino|siento|emocion|alegr|triste|enoj|preocup)/i.test(
          text
        ),
      hasPersonalPronouns: /(yo|mi|me|mí|nosotros|nuestro|mío|mía)/i.test(text),
      hasComplexSentences: /[,;:—]/.test(text),
      hasRepetitivePatterns: (() => {
        const words = text.toLowerCase().split(/\s+/);
        const wordCounts: Record<string, number> = {};
        words.forEach((word) => {
          if (word.length > 3) wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
        return Object.values(wordCounts).some((count) => count > 3);
      })(),
    };

    // Determinar resultado final basado en análisis combinado
    const finalDetermination = finalScore > 0.6 ? "IA" : "Humano";
    const confidenceLevel = finalScore > 0.8 || finalScore < 0.2 ? "Alta" : 
                           finalScore > 0.7 || finalScore < 0.3 ? "Media" : "Baja";

    const result = {
      inputLength: text.length,
      aiProbability,
      humanProbability,
      finalDetermination,
      confidenceLevel,
      methodology: geminiData?.methodology || "Análisis combinado con modelos especializados",
      interpretation: geminiData?.interpretation || `El contenido muestra características ${finalDetermination === "IA" ? "típicas de generación automática" : "consistentes con escritura humana"}`,
      analysisFactors: geminiData?.analysis_factors || [
        {
          factor: "Análisis Estructural",
          score: hfScore,
          explanation: `Modelo Hugging Face detectó patrones ${hfScore > 0.5 ? "de generación por IA" : "de escritura humana"} con ${(hfScore * 100).toFixed(1)}% de confianza`
        },
        {
          factor: "Análisis Semántico",
          score: geminiScore,
          explanation: `Evaluación contextual de Gemini: ${(geminiScore * 100).toFixed(1)}% probabilidad de generación automática`
        }
      ],
      keyIndicators: analysisAspects,
      strengths: geminiData?.strengths || [`Análisis realizado con ${confidenceLevel.toLowerCase()} confianza`],
      weaknesses: geminiData?.weaknesses || ["Limitaciones en el análisis debido a la longitud del texto"],
      recommendations: geminiData?.recommendations || "Para mayor precisión, analice textos más extensos",
      textAnalysis,
      technicalDetails: {
        hfScore: Number((hfScore * 100).toFixed(1)),
        geminiScore: Number((geminiScore * 100).toFixed(1)),
        combinedScore: Number((finalScore * 100).toFixed(1)),
        methodology: "60% Hugging Face + 40% Gemini para análisis contextual"
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
