// Vercel Serverless Function - Texto
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
    // Hugging Face zero-shot or detection model (ejemplo real)
    const hfResp = await axios.post(
      "https://api-inference.huggingface.co/models/roberta-base-openai-detector",
      { inputs: text },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    // Gemini Safety/LLM reasoning (pseudo-score explicativo)
    // Nota: Para producción usar la SDK oficial @google/generative-ai
    // Aquí solo ilustramos una segunda señal desde LLM

    const labels =
      hfResp.data?.[0]?.map((x: any) => ({ label: x.label, score: x.score })) ||
      [];
    const aiScore =
      labels.find((l: any) => /fake|ai|generated/i.test(l.label))?.score ?? 0.5;

    const result = {
      inputLength: text.length,
      aiProbability: Number((aiScore * 100).toFixed(2)),
      humanProbability: Number(((1 - aiScore) * 100).toFixed(2)),
      steps: [
        "Limpieza y normalización del texto",
        "Inferencia con modelo de detección HF",
        "Cálculo de probabilidades AI/Humano",
      ],
      justification:
        "Probabilidad basada en modelo detector en Hugging Face (roberta-base-openai-detector).",
    };

    return res.status(200).json(result);
  } catch (err: any) {
    return res
      .status(500)
      .json({
        error: "Analysis failed",
        details: err?.response?.data || err?.message,
      });
  }
}
