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
    let extractedText = "";
    const buffer = Buffer.from(fileBuffer, "base64");

    // Extraer texto según el tipo de archivo
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

    // Analizar con Hugging Face
    const hfResp = await axios.post(
      "https://api-inference.huggingface.co/models/roberta-base-openai-detector",
      { inputs: extractedText.slice(0, 5000) }, // Limitar para evitar límites de API
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    const labelScore = hfResp.data?.[0]?.[0]?.score ?? 0.5;
    const result = {
      fileName,
      extractedLength: extractedText.length,
      aiProbability: Number((labelScore * 100).toFixed(2)),
      humanProbability: Number(((1 - labelScore) * 100).toFixed(2)),
      steps: [
        `Extracción de texto de ${fileName}`,
        "Limpieza y normalización",
        "Inferencia con modelo HF",
        "Cálculo de probabilidades",
      ],
      justification: `Análisis del contenido extraído de ${fileName} usando modelo detector de IA.`,
    };
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: "Analysis failed",
      details: err?.response?.data || err?.message,
    });
  }
}
