import { useState } from "react";
import { saveResult } from "../lib/store";
import { AnalysisResult } from "../types";

export function TextPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    const resp = await fetch("/api/analyze-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await resp.json();
    setResult(data);
    const payload: AnalysisResult = {
      kind: "texto",
      aiProbability: data.aiProbability,
      humanProbability: data.humanProbability,
      justification: data.justification,
      steps: data.steps || [],
      inputLength: data.inputLength,
      createdAt: Date.now(),
    };
    try {
      await saveResult(payload);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Análisis de Texto</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full min-h-40 p-3 border rounded-md"
        placeholder="Pega o escribe el texto"
      />
      <button
        onClick={analyze}
        className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50"
        disabled={loading || text.trim().length === 0}
      >
        {loading ? "Analizando..." : "Analizar"}
      </button>
      {result && (
        <div className="rounded-lg border p-4 bg-white">
          <div className="font-medium mb-2">Resultado</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="mt-4">
            <div className="text-sm text-slate-500">Justificación</div>
            <p>{result.justification}</p>
          </div>
          <div className="mt-4">
            <div className="text-sm text-slate-500">Pipeline</div>
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
