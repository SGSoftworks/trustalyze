// Vercel Serverless Function - Búsqueda de Contenido Relacionado
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { query } = req.body as { query?: string };
  if (!query || query.trim().length === 0)
    return res.status(400).json({ error: "Missing or empty query" });

  try {
    // Por ahora, simulamos resultados de búsqueda
    // En una implementación completa, se usaría Google Search API
    const mockResults = [
      {
        title: `Resultado relacionado con "${query}"`,
        url: "https://example.com/related-content",
        snippet: `Este es un resultado de ejemplo relacionado con la búsqueda "${query}". En una implementación completa, se conectaría con Google Search API.`,
        relevance: 0.85,
      },
      {
        title: `Información adicional sobre "${query}"`,
        url: "https://example.com/additional-info",
        snippet: `Información adicional que podría ser relevante para verificar el contenido relacionado con "${query}".`,
        relevance: 0.72,
      },
      {
        title: `Verificación de "${query}"`,
        url: "https://example.com/verification",
        snippet: `Recursos de verificación para el tema "${query}" que podrían ayudar a validar la información.`,
        relevance: 0.68,
      },
    ];

    // En una implementación real, se usaría Google Search API:
    /*
    const searchResponse = await axios.get(
      `https://www.googleapis.com/customsearch/v1`,
      {
        params: {
          key: process.env.GOOGLE_SEARCH_API_KEY,
          cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
          q: query,
          num: 5
        }
      }
    );

    const results = searchResponse.data.items?.map((item: any) => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      relevance: 0.8 // Se calcularía basado en similitud
    })) || [];
    */

    return res.status(200).json(mockResults);
  } catch (err: unknown) {
    console.error("Search error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return res.status(500).json({
      error: "Search failed",
      details: errorMessage,
    });
  }
}
