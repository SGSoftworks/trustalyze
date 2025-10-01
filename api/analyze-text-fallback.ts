// Vercel Serverless Function - Análisis de Texto FALLBACK (sin Gemini)
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body as { text?: string };
  if (!text || text.trim().length === 0)
    return res.status(400).json({ error: "Missing or empty text" });

  try {
    // Análisis básico sin Gemini (para testing)
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

    // Análisis heurístico básico
    let aiScore = 0;
    const factors = [];

    // Factor 1: Longitud de oraciones
    if (avgWordsPerSentence > 20) {
      aiScore += 0.2;
      factors.push({
        factor: "Oraciones muy largas",
        score: 0.8,
        explanation: `Promedio de ${avgWordsPerSentence} palabras por oración, típico de IA`
      });
    }

    // Factor 2: Patrones repetitivos
    if (hasRepetitivePatterns) {
      aiScore += 0.3;
      factors.push({
        factor: "Patrones repetitivos",
        score: 0.9,
        explanation: "Se detectaron patrones de repetición característicos de IA"
      });
    }

    // Factor 3: Falta de emociones
    if (!hasEmotionalLanguage) {
      aiScore += 0.1;
      factors.push({
        factor: "Ausencia de lenguaje emocional",
        score: 0.6,
        explanation: "El texto carece de expresiones emocionales típicas humanas"
      });
    }

    // Factor 4: Uso de pronombres personales
    if (hasPersonalPronouns) {
      aiScore -= 0.2;
      factors.push({
        factor: "Uso de pronombres personales",
        score: 0.3,
        explanation: "El uso de pronombres personales sugiere escritura humana"
      });
    }

    // Factor 5: Complejidad de oraciones
    if (hasComplexSentences) {
      aiScore += 0.1;
      factors.push({
        factor: "Oraciones complejas",
        score: 0.7,
        explanation: "Estructura de oraciones muy compleja, posiblemente generada por IA"
      });
    }

    // Normalizar score
    const aiProbability = Math.max(0, Math.min(100, Math.round(aiScore * 100)));
    const humanProbability = 100 - aiProbability;

    const result = {
      inputLength: text.length,
      aiProbability,
      humanProbability,
      finalDetermination: aiProbability > 50 ? "IA" : "Humano",
      confidenceLevel: aiProbability > 70 || aiProbability < 30 ? "Alta" : "Media",
      methodology: "Análisis heurístico básico (modo fallback - sin Gemini)",
      interpretation: `El texto muestra características ${
        aiProbability > 50
          ? "típicas de generación automática"
          : "consistentes con escritura humana"
      }`,
      analysisFactors: factors,
      keyIndicators: [
        hasRepetitivePatterns ? "Patrones repetitivos detectados" : "Sin patrones repetitivos",
        hasEmotionalLanguage ? "Lenguaje emocional presente" : "Ausencia de lenguaje emocional",
        hasPersonalPronouns ? "Pronombres personales utilizados" : "Sin pronombres personales"
      ],
      strengths: aiProbability > 50 ? [
        "Estructura consistente",
        "Vocabulario técnico preciso"
      ] : [
        "Expresiones emocionales auténticas",
        "Variedad en estructura de oraciones"
      ],
      weaknesses: aiProbability > 50 ? [
        "Falta de personalidad única",
        "Patrones predecibles"
      ] : [
        "Posibles inconsistencias menores",
        "Estructura menos formal"
      ],
      recommendations: "Para análisis más preciso, configure la API de Gemini",
      textAnalysis: {
        length: text.length,
        wordCount,
        sentenceCount,
        avgWordsPerSentence,
        hasEmotionalLanguage,
        hasPersonalPronouns,
        hasComplexSentences,
        hasRepetitivePatterns,
      },
      technicalDetails: {
        geminiScore: aiProbability,
        methodology: "Análisis heurístico básico (fallback)",
        modelVersion: "fallback-v1.0",
        analysisDepth: "Básico",
      },
    };

    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("Fallback analysis error:", err);
    
    return res.status(500).json({
      error: "Fallback analysis failed",
      details: err instanceof Error ? err.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}
