import { useState } from "react";
import { saveResult } from "../lib/store";
import type { AnalysisResult } from "../types";

export function TextPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    try {
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
    } catch (error) {
      console.error("Error analyzing text:", error);
      setResult({
        error: "Error al analizar el texto. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Análisis de Texto
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Detecta si un texto fue generado por inteligencia artificial o
            escrito por un humano
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="mb-6">
            <label
              htmlFor="text-input"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Texto a analizar
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Pega o escribe el texto que deseas analizar aquí..."
            />
            <div className="mt-2 text-sm text-slate-500">
              {text.length} caracteres
            </div>
          </div>

          <button
            onClick={analyze}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            disabled={loading || text.trim().length === 0}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analizando...
              </div>
            ) : (
              "Analizar Texto"
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-xl shadow-sm border p-8">
            {result.error ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Error en el análisis
                </h3>
                <p className="text-red-700">{result.error}</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Resultado del Análisis
                  </h2>
                  <p className="text-slate-600">
                    Análisis completado con éxito
                  </p>
                </div>

                {/* Probability Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-red-900">
                        Probabilidad IA
                      </h3>
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {result.aiProbability}%
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${result.aiProbability}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-green-900">
                        Probabilidad Humano
                      </h3>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {result.humanProbability}%
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${result.humanProbability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Confidence Level */}
                {result.confidence && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        Nivel de confianza:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.confidence === "Alta"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {result.confidence}
                      </span>
                    </div>
                  </div>
                )}

                {/* Justification */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Justificación del Análisis
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-700 leading-relaxed">
                      {result.justification}
                    </p>
                  </div>
                </div>

                {/* Analysis Steps */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Proceso de Análisis
                  </h3>
                  <div className="space-y-3">
                    {result.steps?.map((step: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-slate-700 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                    <div>
                      <span className="font-medium">
                        Caracteres analizados:
                      </span>{" "}
                      {result.inputLength}
                    </div>
                    <div>
                      <span className="font-medium">Fecha de análisis:</span>{" "}
                      {new Date().toLocaleString()}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
