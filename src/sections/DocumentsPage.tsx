import { useState } from "react";
import { saveResult } from "../lib/store";
import type { AnalysisResult } from "../types";

export function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    error?: string;
    aiProbability?: number;
    humanProbability?: number;
    finalDetermination?: string;
    confidenceLevel?: string;
    methodology?: string;
    interpretation?: string;
    analysisFactors?: Array<{
      factor: string;
      score: number;
      explanation: string;
    }>;
    keyIndicators?: string[];
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string;
    fileName?: string;
    extractedLength?: number;
    technicalDetails?: {
      hfScore: number;
      geminiScore: number;
      combinedScore: number;
      methodology: string;
    };
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
      const fileBuffer = await toBase64(file);
      const resp = await fetch("/api/analyze-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileBuffer,
          fileName: file.name,
          mimeType: file.type,
        }),
      });
      const data = await resp.json();
      setResult(data);

      const payload: AnalysisResult = {
        kind: "documento",
        aiProbability: data.aiProbability,
        humanProbability: data.humanProbability,
        finalDetermination: data.finalDetermination,
        confidenceLevel: data.confidenceLevel,
        methodology: data.methodology,
        interpretation: data.interpretation,
        analysisFactors: data.analysisFactors,
        keyIndicators: data.keyIndicators,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        recommendations: data.recommendations,
        inputLength: data.extractedLength,
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Análisis de Documentos
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Analiza documentos PDF, DOCX y TXT para detectar contenido generado
            por IA
          </p>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="mb-6">
            <label
              htmlFor="file-input"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Seleccionar Documento
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-colors"
            />
            <p className="mt-2 text-sm text-slate-500">
              Formatos soportados: PDF, DOCX, TXT (máximo 10MB)
            </p>
          </div>

          {file && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-600">
                    {(file.size / 1024).toFixed(1)} KB •{" "}
                    {file.type || "Tipo desconocido"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {file && (
            <button
              onClick={analyze}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analizando documento...
                </div>
              ) : (
                "Analizar Documento"
              )}
            </button>
          )}
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

                {/* File Info */}
                <div className="mb-8 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Documento Analizado
                    </h3>
                  </div>
                  <p className="font-medium text-slate-900">
                    {result.fileName}
                  </p>
                  <p className="text-sm text-slate-600">
                    {result.extractedLength} caracteres extraídos
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

                {/* Final Determination */}
                {result.finalDetermination && (
                  <div className="mb-8">
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg ${
                          result.finalDetermination === "IA"
                            ? "bg-red-100 text-red-800 border-2 border-red-200"
                            : "bg-green-100 text-green-800 border-2 border-green-200"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full ${
                            result.finalDetermination === "IA"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        ></div>
                        <span>
                          Determinación Final: {result.finalDetermination}
                        </span>
                      </div>
                      {result.confidenceLevel && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-slate-700">
                            Nivel de confianza:
                          </span>
                          <span
                            className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                              result.confidenceLevel === "Alta"
                                ? "bg-green-100 text-green-800"
                                : result.confidenceLevel === "Media"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.confidenceLevel}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Interpretation */}
                {result.interpretation && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Interpretación del Resultado
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-slate-700 leading-relaxed">
                        {result.interpretation}
                      </p>
                    </div>
                  </div>
                )}

                {/* Analysis Factors */}
                {result.analysisFactors &&
                  result.analysisFactors.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        Factores de Análisis
                      </h3>
                      <div className="space-y-4">
                        {result.analysisFactors.map((factor, i) => (
                          <div
                            key={i}
                            className="bg-white border border-slate-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-slate-900">
                                {factor.factor}
                              </h4>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-slate-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      factor.score > 0.6
                                        ? "bg-red-500"
                                        : factor.score < 0.4
                                        ? "bg-green-500"
                                        : "bg-yellow-500"
                                    }`}
                                    style={{ width: `${factor.score * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-slate-600">
                                  {(factor.score * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed">
                              {factor.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Recommendations */}
                {result.recommendations && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Recomendaciones
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-slate-700 leading-relaxed">
                        {result.recommendations}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
