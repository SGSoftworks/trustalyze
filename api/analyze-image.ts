import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64 } = req.body as { imageBase64?: string };
  if (!imageBase64)
    return res.status(400).json({ error: "Missing imageBase64" });

  try {
    // Ejemplo: modelo de detección de deepfakes o AI-generated images
    const hfResp = await axios.post(
      "https://api-inference.huggingface.co/models/umm-maybe/ai-image-detector",
      { inputs: imageBase64 },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    const score = hfResp.data?.score ?? 0.5;
    const result = {
      aiProbability: Number((score * 100).toFixed(2)),
      humanProbability: Number(((1 - score) * 100).toFixed(2)),
      steps: [
        "Extracción de características",
        "Inferencia con modelo HF",
        "Cálculo de probabilidades",
      ],
      justification:
        "Modelo de Hugging Face especializado en detección de imágenes generadas por IA.",
    };
    return res.status(200).json(result);
  } catch (err: unknown) {
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
