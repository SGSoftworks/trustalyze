// Vercel Serverless Function - Análisis de Documentos con IA
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

    if (mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) {
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
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

    // 2. Análisis con Hugging Face
    let hfScore = 0.5;
    try {
      const hfResp = await axios.post(
        "https://api-inference.huggingface.co/models/roberta-base-openai-detector",
        { inputs: extractedText.slice(0, 5000) },
        { 
          headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
          timeout: 15000
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

    // 3. Análisis con Gemini - Evaluación contextual del documento
    let geminiData: any = null;
    
    try {
      const geminiPrompt = `Eres un experto en detección de documentos generados por IA. Analiza este documento y determina si fue generado por inteligencia artificial o escrito por un humano.

INFORMACIÓN DEL DOCUMENTO:
- Nombre: ${fileName}
- Longitud: ${extractedText.length} caracteres
- Tipo: ${mimeType || "Desconocido"}

CONTENIDO A ANALIZAR:
"${extractedText.slice(0, 2000)}"

METODOLOGÍA DE ANÁLISIS DE DOCUMENTOS:
1. **Análisis Estructural**: Evalúa organización, coherencia y flujo del documento
2. **Análisis Lingüístico**: Examina vocabulario, sintaxis y patrones de escritura
3. **Análisis de Contenido**: Verifica profundidad, originalidad y conocimiento específico
4. **Análisis de Estilo**: Evalúa consistencia estilística y tono
5. **Análisis de Referencias**: Detecta citas, fuentes y metodología académica
6. **Análisis de Complejidad**: Mide sofisticación conceptual y argumentativa
7. **Análisis de Patrones**: Identifica repeticiones y estructuras artificiales
8. **Análisis de Contexto**: Evalúa relevancia y actualidad del contenido

IMPORTANTE: 
- Sé específico y técnico en tu análisis
- Proporciona una determinación clara (IA o Humano)
- Justifica cada factor con evidencia concreta del documento
- Usa un rango de probabilidad realista (no 50-50)
- Considera el tipo de documento (académico, profesional, etc.)

Responde en formato JSON:
{
  "ai_probability": 0.0-1.0,
  "final_determination": "IA" o "Humano",
  "confidence_level": "Alta", "Media" o "Baja",
  "methodology": "Descripción de cómo se realizó el análisis del documento",
  "interpretation": "Qué significa este resultado en términos prácticos",
  "analysis_factors": [
    {
      "factor": "nombre del factor del documento",
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
            maxOutputTokens: 800
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY,
          },
          timeout: 20000,
        }
      );

      const geminiText = geminiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (geminiText) {
        try {
          geminiData = JSON.parse(geminiText);
        } catch {
          geminiData = {
            ai_probability: 0.5,
            final_determination: "Indeterminado",
            confidence_level: "Baja",
            methodology: "Análisis de documento básico por limitaciones técnicas",
            interpretation: "No se pudo realizar análisis de documento completo",
            analysis_factors: [],
            key_indicators: ["Análisis limitado"],
            strengths: [],
            weaknesses: ["Respuesta de IA no estructurada"],
            recommendations: "Intente con un documento de mayor longitud o diferente formato"
          };
        }
      }
    } catch (geminiError) {
      console.warn("Gemini API error:", geminiError);
    }

    // 4. Combinar resultados con pesos
    const geminiScore = geminiData?.ai_probability || 0.5;
    const finalScore = (hfScore * 0.6) + (geminiScore * 0.4); // Más peso a HF para documentos
    const aiProbability = Number((finalScore * 100).toFixed(2));
    const humanProbability = Number(((1 - finalScore) * 100).toFixed(2));

    // Determinar resultado final
    const finalDetermination = finalScore > 0.6 ? "IA" : "Humano";
    const confidenceLevel = finalScore > 0.8 || finalScore < 0.2 ? "Alta" : 
                           finalScore > 0.7 || finalScore < 0.3 ? "Media" : "Baja";

    const result = {
      fileName,
      extractedLength: extractedText.length,
      aiProbability,
      humanProbability,
      finalDetermination,
      confidenceLevel,
      methodology: geminiData?.methodology || "Análisis combinado con modelos especializados en detección de documentos",
      interpretation: geminiData?.interpretation || `El documento muestra características ${finalDetermination === "IA" ? "típicas de generación automática" : "consistentes con escritura humana"}`,
      analysisFactors: geminiData?.analysis_factors || [
        {
          factor: "Análisis Estructural",
          score: hfScore,
          explanation: `Modelo Hugging Face detectó patrones ${hfScore > 0.5 ? "de generación por IA" : "de escritura humana"} con ${(hfScore * 100).toFixed(1)}% de confianza`
        },
        {
          factor: "Análisis Contextual",
          score: geminiScore,
          explanation: `Evaluación contextual de Gemini: ${(geminiScore * 100).toFixed(1)}% probabilidad de generación automática`
        }
      ],
      keyIndicators: geminiData?.key_indicators || ["Análisis de estructura", "Evaluación de contenido", "Detección de patrones"],
      strengths: geminiData?.strengths || [`Análisis realizado con ${confidenceLevel.toLowerCase()} confianza`],
      weaknesses: geminiData?.weaknesses || ["Limitaciones en el análisis debido a la longitud del documento"],
      recommendations: geminiData?.recommendations || "Para mayor precisión, analice documentos más extensos y detallados",
      technicalDetails: {
        hfScore: Number((hfScore * 100).toFixed(1)),
        geminiScore: Number((geminiScore * 100).toFixed(1)),
        combinedScore: Number((finalScore * 100).toFixed(1)),
        methodology: "60% Hugging Face + 40% Gemini para análisis de documentos"
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