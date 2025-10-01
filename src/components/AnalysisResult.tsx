import { AnalysisResult as AnalysisResultType } from "../types";
import { AnalysisPipeline } from "./AnalysisPipeline";

interface AnalysisResultProps {
  result: AnalysisResultType;
  showPipeline?: boolean;
}

export function AnalysisResult({
  result,
  showPipeline = true,
}: AnalysisResultProps) {
  const getConfidenceColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "alta":
        return "text-green-600 bg-green-100";
      case "media":
        return "text-yellow-600 bg-yellow-100";
      case "baja":
        return "text-red-600 bg-red-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  const getDeterminationColor = (determination: string) => {
    switch (determination?.toLowerCase()) {
      case "ia":
        return "text-red-600 bg-red-100 border-red-200";
      case "humano":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-slate-600 bg-slate-100 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Resultado Principal */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900">
            Resultado del Análisis
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Confianza:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(
                result.confidenceLevel || ""
              )}`}
            >
              {result.confidenceLevel || "N/A"}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Probabilidades */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Probabilidades</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Generado por IA</span>
                  <span className="font-medium">{result.aiProbability}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${result.aiProbability}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Escrito por Humano</span>
                  <span className="font-medium">
                    {result.humanProbability}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${result.humanProbability}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Determinación Final */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Determinación Final</h4>
            <div
              className={`p-4 rounded-lg border-2 text-center ${getDeterminationColor(
                result.finalDetermination || ""
              )}`}
            >
              <div className="text-2xl font-bold mb-2">
                {result.finalDetermination || "N/A"}
              </div>
              <div className="text-sm">
                {result.finalDetermination?.toLowerCase() === "ia"
                  ? "Contenido generado por IA"
                  : "Contenido creado por humano"}
              </div>
            </div>
          </div>
        </div>

        {/* Interpretación */}
        {result.interpretation && (
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-2">Interpretación</h4>
            <p className="text-slate-700">{result.interpretation}</p>
          </div>
        )}
      </div>

      {/* Factores de Análisis */}
      {result.analysisFactors && result.analysisFactors.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Factores de Análisis
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {result.analysisFactors.map((factor, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">
                    {factor.factor}
                  </h4>
                  <span className="text-sm font-medium text-slate-600">
                    {Math.round(factor.score * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${factor.score * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-600">{factor.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indicadores Clave */}
      {result.keyIndicators && result.keyIndicators.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Indicadores Clave
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.keyIndicators.map((indicator, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {indicator}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fortalezas y Debilidades */}
      {(result.strengths && result.strengths.length > 0) ||
        (result.weaknesses && result.weaknesses.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {result.strengths && result.strengths.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">
                  Fortalezas
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-slate-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.weaknesses && result.weaknesses.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">
                  Áreas de Mejora
                </h3>
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="text-slate-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

      {/* Recomendaciones */}
      {result.recommendations && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Recomendaciones
          </h3>
          <p className="text-blue-800">{result.recommendations}</p>
        </div>
      )}

      {/* Pipeline de Análisis */}
      {showPipeline && result.pipelineSteps && (
        <AnalysisPipeline steps={result.pipelineSteps} />
      )}

      {/* Análisis de Video */}
      {result.videoAnalysis && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Análisis de Video
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-600">Duración:</span>
              <span className="ml-2 text-slate-900">
                {result.videoAnalysis.duration.toFixed(1)} segundos
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Tamaño:</span>
              <span className="ml-2 text-slate-900">
                {(result.videoAnalysis.fileSize / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Audio:</span>
              <span className="ml-2 text-slate-900">
                {result.videoAnalysis.hasAudio ? "Sí" : "No"}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Resolución:</span>
              <span className="ml-2 text-slate-900">
                {result.videoAnalysis.resolution}
              </span>
            </div>
          </div>

          {result.videoAnalysis.audioTranscription && (
            <div className="mt-4">
              <h4 className="font-medium text-slate-900 mb-2">
                Transcripción de Audio:
              </h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
                {result.videoAnalysis.audioTranscription}
              </p>
            </div>
          )}

          {result.videoAnalysis.deepfakeIndicators &&
            result.videoAnalysis.deepfakeIndicators.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-slate-900 mb-2">
                  Indicadores de Deepfake:
                </h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  {result.videoAnalysis.deepfakeIndicators.map(
                    (indicator, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {indicator}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
        </div>
      )}

      {/* Detalles Técnicos */}
      {result.technicalDetails && (
        <div className="bg-slate-50 rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Detalles Técnicos
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-600">Modelo:</span>
              <span className="ml-2 text-slate-900">
                {result.technicalDetails.modelVersion}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Profundidad:</span>
              <span className="ml-2 text-slate-900">
                {result.technicalDetails.analysisDepth}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Metodología:</span>
              <span className="ml-2 text-slate-900">
                {result.technicalDetails.methodology}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">
                Puntuación Gemini:
              </span>
              <span className="ml-2 text-slate-900">
                {result.technicalDetails.geminiScore}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
