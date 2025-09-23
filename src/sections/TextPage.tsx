import { useState } from "react";
import { saveResult } from "../lib/store";
import type { AnalysisResult } from "../types";

export function TextPage() {
  const [text, setText] = useState("");
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
    inputLength?: number;
    textAnalysis?: {
      length: number;
      wordCount: number;
      sentenceCount: number;
      avgWordsPerSentence: number;
      hasEmotionalLanguage: boolean;
      hasPersonalPronouns: boolean;
      hasComplexSentences: boolean;
      hasRepetitivePatterns: boolean;
    };
    technicalDetails?: {
      hfScore: number;
      geminiScore: number;
      combinedScore: number;
      methodology: string;
    };
  } | null>(null);
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
        finalDetermination: data.finalDetermination,
        confidenceLevel: data.confidenceLevel,
        methodology: data.methodology,
        interpretation: data.interpretation,
        analysisFactors: data.analysisFactors,
        keyIndicators: data.keyIndicators,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        recommendations: data.recommendations,
        inputLength: data.inputLength,
        createdAt: Date.now(),
        textAnalysis: data.textAnalysis,
        technicalDetails: data.technicalDetails,
      };
      try {
        await saveResult(payload);
      } catch (error) {
        console.warn("Failed to save result:", error);
      }
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

                {/* Final Determination */}
                {result.finalDetermination && (
                  <div className="mb-8">
                    <div className="text-center">
                      <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg ${
                        result.finalDetermination === "IA" 
                          ? "bg-red-100 text-red-800 border-2 border-red-200" 
                          : "bg-green-100 text-green-800 border-2 border-green-200"
                      }`}>
                        <div className={`w-4 h-4 rounded-full ${
                          result.finalDetermination === "IA" ? "bg-red-500" : "bg-green-500"
                        }`}></div>
                        <span>Determinación Final: {result.finalDetermination}</span>
                      </div>
                      {result.confidenceLevel && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-slate-700">
                            Nivel de confianza: 
                          </span>
                          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                            result.confidenceLevel === "Alta"
                              ? "bg-green-100 text-green-800"
                              : result.confidenceLevel === "Media"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
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

                {/* Methodology */}
                {result.methodology && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Metodología de Análisis
                    </h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700 leading-relaxed">
                        {result.methodology}
                      </p>
                    </div>
                  </div>
                )}

                {/* Analysis Factors */}
                {result.analysisFactors && result.analysisFactors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Factores de Análisis
                    </h3>
                    <div className="space-y-4">
                      {result.analysisFactors.map((factor, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900">{factor.factor}</h4>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    factor.score > 0.6 ? 'bg-red-500' : 
                                    factor.score < 0.4 ? 'bg-green-500' : 'bg-yellow-500'
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

                {/* Key Indicators */}
                {result.keyIndicators && result.keyIndicators.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Indicadores Clave
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {result.keyIndicators.map((indicator: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-blue-50 rounded-lg p-3"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-slate-700 text-sm">
                            {indicator}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Text Analysis Details */}
                {result.textAnalysis && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Análisis Lingüístico Detallado
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-slate-900">
                          {result.textAnalysis.wordCount}
                        </div>
                        <div className="text-sm text-slate-600">Palabras</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-slate-900">
                          {result.textAnalysis.sentenceCount}
                        </div>
                        <div className="text-sm text-slate-600">Oraciones</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-slate-900">
                          {result.textAnalysis.avgWordsPerSentence.toFixed(1)}
                        </div>
                        <div className="text-sm text-slate-600">
                          Palabras/Oración
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-slate-900">
                          {result.textAnalysis.length}
                        </div>
                        <div className="text-sm text-slate-600">Caracteres</div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-900">
                          Características Detectadas:
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                result.textAnalysis.hasEmotionalLanguage
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <span className="text-sm text-slate-700">
                              Lenguaje emocional
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                result.textAnalysis.hasPersonalPronouns
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <span className="text-sm text-slate-700">
                              Pronombres personales
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                result.textAnalysis.hasComplexSentences
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <span className="text-sm text-slate-700">
                              Oraciones complejas
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                result.textAnalysis.hasRepetitivePatterns
                                  ? "bg-red-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <span className="text-sm text-slate-700">
                              Patrones repetitivos
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {result.strengths && result.strengths.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        Fortalezas del Análisis
                      </h3>
                      <div className="space-y-2">
                        {result.strengths.map((strength: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 bg-green-50 rounded-lg p-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-700 text-sm">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.weaknesses && result.weaknesses.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        Limitaciones Identificadas
                      </h3>
                      <div className="space-y-2">
                        {result.weaknesses.map((weakness: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 bg-yellow-50 rounded-lg p-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-700 text-sm">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

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

                {/* Technical Details */}
                {result.technicalDetails && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Detalles Técnicos
                    </h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-slate-900">Hugging Face:</span>
                          <span className="text-slate-700 ml-2">{result.technicalDetails.hfScore}%</span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-900">Gemini:</span>
                          <span className="text-slate-700 ml-2">{result.technicalDetails.geminiScore}%</span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-900">Puntuación Combinada:</span>
                          <span className="text-slate-700 ml-2">{result.technicalDetails.combinedScore}%</span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-900">Metodología:</span>
                          <span className="text-slate-700 ml-2">{result.technicalDetails.methodology}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
