import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const q = (req.query.q as string) || "";
  if (!q) return res.status(400).json({ error: "Missing q" });

  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY as string;
    const cx = process.env.GOOGLE_SEARCH_CX as string;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(
      q
    )}`;
    const { data } = await axios.get(url);
        const items = (data.items || []).map((it: { title: string; link: string; snippet: string }) => ({
          title: it.title,
          link: it.link,
          snippet: it.snippet,
        }));
    return res.status(200).json({ items });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    const errorDetails = err && typeof err === "object" && "response" in err 
      ? (err as { response?: { data?: unknown } }).response?.data 
      : errorMessage;
    
    return res.status(500).json({
      error: "Search failed",
      details: errorDetails,
    });
  }
}
