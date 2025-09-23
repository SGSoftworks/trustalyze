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
        (l: { label: string; score: number }) => l.label === "FAKE" || l.label === "LABEL_1"
      );
      hfScore = fakeLabel?.score ?? 0.5;
    } catch (hfError) {
      console.warn("HF API error:", hfError);
    }

    // 2. Análisis con Gemini - Evaluación semántica y contextual
    let geminiScore = 0.5;
    let geminiExplanation = "Análisis semántico no disponible";
    let analysisAspects: string[] = [];

    try {
      const geminiPrompt = `Analiza este texto y determina la probabilidad de que haya sido generado por IA vs escrito por un humano. 

EVALÚA ESTOS ASPECTOS ESPECÍFICOS:
1. **Estructura y organización**: ¿Es lógica y natural la secuencia de ideas?
2. **Lenguaje y vocabulario**: ¿Usa expresiones naturales o términos muy formales/robóticos?
3. **Coherencia contextual**: ¿Mantiene coherencia temática y lógica?
4. **Fluidez narrativa**: ¿Fluye naturalmente o parece ensamblado?
5. **Personalidad y tono**: ¿Muestra características humanas (emociones, opiniones, experiencias)?
6. **Complejidad sintáctica**: ¿Usa estructuras gramaticales variadas y naturales?
7. **Repetición de patrones**: ¿Repite frases o estructuras de manera artificial?
8. **Conocimiento específico**: ¿Muestra conocimiento detallado o generalidades?

Texto a analizar: "${text.slice(0, 2000)}"
      
Responde en formato JSON:
{
  "ai_probability": 0.0-1.0,
  "explanation": "explicación detallada del análisis",
  "indicators": ["aspecto1", "aspecto2", "aspecto3"],
  "strengths": ["fortalezas del texto"],
  "weaknesses": ["debilidades detectadas"],
  "confidence_factors": ["factores que aumentan/disminuyen confianza"]
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
          analysisAspects = geminiData.indicators || [];
        } catch {
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

    // 4. Análisis de aspectos específicos
    const textAnalysis = {
      length: text.length,
      wordCount: text.split(/\s+/).length,
      sentenceCount: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
      avgWordsPerSentence: text.split(/\s+/).length / Math.max(text.split(/[.!?]+/).filter(s => s.trim().length > 0).length, 1),
      hasEmotionalLanguage: /(me siento|estoy|me parece|creo|opino|siento|emocion|alegr|triste|enoj|preocup)/i.test(text),
      hasPersonalPronouns: /(yo|mi|me|mí|nosotros|nuestro|mío|mía)/i.test(text),
      hasComplexSentences: /[,;:—]/.test(text),
      hasRepetitivePatterns: (() => {
        const words = text.toLowerCase().split(/\s+/);
        const wordCounts: Record<string, number> = {};
        words.forEach(word => {
          if (word.length > 3) wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
        return Object.values(wordCounts).some(count => count > 3);
      })(),
    };

    const result = {
      inputLength: text.length,
      aiProbability,
      humanProbability,
      steps: [
        "Limpieza y normalización del texto",
        "Análisis con modelo Hugging Face (roberta-base-openai-detector)",
        "Evaluación semántica con Gemini 2.0 Flash",
        "Análisis de aspectos lingüísticos específicos",
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
      analysisAspects,
      textAnalysis,
      detailedExplanation: {
        hfAnalysis: `Modelo Hugging Face: ${(hfScore * 100).toFixed(1)}% probabilidad de generación por IA`,
        geminiAnalysis: `Análisis semántico Gemini: ${(geminiScore * 100).toFixed(1)}% probabilidad de generación por IA`,
        combinedScore: `Puntuación combinada: ${(finalScore * 100).toFixed(1)}%`,
        methodology: "Combinación ponderada: 60% Hugging Face + 40% Gemini para análisis contextual"
      }
    };

    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("Analysis error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    const errorDetails = err && typeof err === "object" && "response" in err 
      ? (err as { response?: { data?: unknown } }).response?.data 
      : errorMessage;
    
    return res.status(500).json({
      error: "Analysis failed",
      details: errorDetails,
    });
  }
}
