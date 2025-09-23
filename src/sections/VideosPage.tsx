import { useState } from "react";
import { saveResult } from "../lib/store";
import type { AnalysisResult } from "../types";

export function VideosPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    error?: string;
    aiProbability?: number;
    humanProbability?: number;
    justification?: string;
    steps?: string[];
    fileName?: string;
    fileSize?: number;
    estimatedFrames?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const toBase64 = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const analyze = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const videoBuffer = await toBase64(file);
      const resp = await fetch("/api/analyze-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoBuffer,
          fileName: file.name,
          mimeType: file.type,
        }),
      });
      const data = await resp.json();
      setResult(data);

      const payload: AnalysisResult = {
        kind: "video",
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Análisis de Videos</h1>
      <p className="text-slate-600">
        Análisis heurístico de videos para detección de deepfakes. Soporta
        formatos MP4, AVI, MOV y otros.
      </p>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {file && (
        <div className="p-3 bg-slate-50 rounded-md">
          <p className="text-sm">
            <strong>Video seleccionado:</strong> {file.name} (
            {(file.size / (1024 * 1024)).toFixed(1)} MB)
          </p>
        </div>
      )}

      {file && (
        <button
          onClick={analyze}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? "Analizando..." : "Analizar Video"}
        </button>
      )}

      {result && (
        <div className="rounded-lg border p-4 bg-white">
          <div className="font-medium mb-2">Resultado del Análisis</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-slate-500">Probabilidad IA</div>
              <div className="text-2xl font-semibold">
                {result.aiProbability}%
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Probabilidad Humano</div>
              <div className="text-2xl font-semibold">
                {result.humanProbability}%
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="text-sm text-slate-500">Video analizado</div>
            <p className="font-medium">{result.fileName}</p>
            <p className="text-sm text-slate-600">
              Tamaño: {(result.fileSize / (1024 * 1024)).toFixed(1)} MB
            </p>
            <p className="text-sm text-slate-600">
              Frames estimados: {result.estimatedFrames}
            </p>
          </div>
          <div className="mb-4">
            <div className="text-sm text-slate-500">Justificación</div>
            <p>{result.justification}</p>
          </div>
          <div>
            <div className="text-sm text-slate-500">Proceso de análisis</div>
            <ol className="list-decimal ml-5 space-y-1">
              {result.steps?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
