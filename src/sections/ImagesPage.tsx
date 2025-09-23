import { useState } from "react";
import { saveResult } from "../lib/store";
import type { AnalysisResult } from "../types";

export function ImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    error?: string;
    aiProbability?: number;
    humanProbability?: number;
    justification?: string;
    steps?: string[];
  } | null>(null);

  const toBase64 = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const analyze = async () => {
    if (!file) return;
    const imageBase64 = await toBase64(file);
    const resp = await fetch("/api/analyze-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64 }),
    });
    const data = await resp.json();
    setResult(data);
    const payload: AnalysisResult = {
      kind: "imagen",
      aiProbability: data.aiProbability,
      humanProbability: data.humanProbability,
      justification: data.justification,
      steps: data.steps || [],
      createdAt: Date.now(),
    };
          try {
            await saveResult(payload);
          } catch (error) {
            console.warn("Failed to save result:", error);
          }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Análisis de Imágenes</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={analyze}
        disabled={!file}
        className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50"
      >
        Analizar
      </button>
      {result && (
        <pre className="bg-white border rounded p-3 overflow-auto text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
