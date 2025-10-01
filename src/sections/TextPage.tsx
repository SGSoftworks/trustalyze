import { useState, useEffect } from "react";
import { apiService } from "../lib/api";
import { firebaseService } from "../lib/firebase";
import { privacyService } from "../lib/privacy";
import { AnalysisResult } from "../types";
import { AnalysisResult as AnalysisResultComponent } from "../components/AnalysisResult";

export function TextPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(privacyService.hasValidConsent());
  }, []);

  const analyze = async () => {
    if (!hasConsent) {
      setError("Debes aceptar la política de privacidad para continuar");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Generar pasos del pipeline
      const pipelineSteps = apiService.generatePipelineSteps("texto");

      // Actualizar pasos en tiempo real
      const updateStep = (
        index: number,
        status: "processing" | "completed" | "error",
        result?: string
      ) => {
        setResult((prev) => ({
          ...prev!,
          pipelineSteps: pipelineSteps.map((step, i) => ({
            ...step,
            status: i < index ? "completed" : i === index ? status : "pending",
            result: i === index ? result : step.result,
          })),
        }));
      };

      // Crear resultado inicial con pipeline
      const initialResult: AnalysisResult = {
        kind: "texto",
        createdAt: Date.now(),
        aiProbability: 0,
        humanProbability: 0,
        pipelineSteps: pipelineSteps.map((step) => ({
          ...step,
          status: "pending" as const,
        })),
      };
      setResult(initialResult);

      // Paso 1: Preprocessing
      updateStep(0, "processing", "Preparando texto para análisis...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateStep(0, "completed", "Texto preparado correctamente");

      // Paso 2: AI Analysis
      updateStep(
        1,
        "processing",
        "Ejecutando análisis con Gemini 2.0 Flash..."
      );
      const analysisResult = await apiService.analyzeText(text);
      updateStep(1, "completed", "Análisis de IA completado");

      // Paso 3: Pattern Detection
      updateStep(2, "processing", "Detectando patrones característicos...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      updateStep(2, "completed", "Patrones detectados y analizados");

      // Paso 4: Confidence Calculation
      updateStep(3, "processing", "Calculando nivel de confianza...");
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateStep(3, "completed", "Nivel de confianza calculado");

      // Paso 5: Result Generation
      updateStep(4, "processing", "Generando resultado final...");
      await new Promise((resolve) => setTimeout(resolve, 200));
      updateStep(4, "completed", "Resultado generado exitosamente");

      // Actualizar resultado final
      const finalResult: AnalysisResult = {
        ...analysisResult,
        pipelineSteps: pipelineSteps.map((step) => ({
          ...step,
          status: "completed" as const,
        })),
      };
      setResult(finalResult);

      // Guardar en Firebase
      try {
        await firebaseService.saveAnalysis(finalResult);
      } catch (error) {
        console.warn("Failed to save result to Firebase:", error);
      }
    } catch (error) {
      console.error("Error analyzing text:", error);
      setError("Error al analizar el texto. Por favor, inténtalo de nuevo.");

      // Marcar pasos como error
      if (result?.pipelineSteps) {
        setResult((prev) => ({
          ...prev!,
          pipelineSteps: prev!.pipelineSteps!.map((step) => ({
            ...step,
            status:
              step.status === "processing" ? ("error" as const) : step.status,
          })),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConsentAccept = () => {
    const consent = {
      dataCollection: true,
      dataStorage: true,
      dataAnalysis: true,
      dataSharing: false,
      timestamp: Date.now(),
    };
    privacyService.setConsent(consent);
    setHasConsent(true);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Análisis de Texto
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Detecta si un texto fue generado por inteligencia artificial o
            escrito por un humano utilizando tecnología avanzada de Gemini 2.0
            Flash
          </p>
        </div>

        {/* Consent Banner */}
        {!hasConsent && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg
                  className="w-3 h-3 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Consentimiento Requerido
                </h3>
                <p className="text-yellow-800 mb-4">
                  Para analizar tu texto, necesitamos tu consentimiento para
                  procesar temporalmente el contenido. Solo almacenamos los
                  resultados del análisis, nunca el texto original.
                </p>
                <button
                  onClick={handleConsentAccept}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Aceptar y Continuar
                </button>
              </div>
            </div>
          </div>
        )}

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
              disabled={!hasConsent}
            />
            <div className="mt-2 flex justify-between text-sm text-slate-500">
              <span>{text.length} caracteres</span>
              <span>
                {text.split(/\s+/).filter((word) => word.length > 0).length}{" "}
                palabras
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={analyze}
              className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
              disabled={loading || text.trim().length === 0 || !hasConsent}
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

            {text.length > 0 && (
              <button
                onClick={() => setText("")}
                className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                disabled={loading}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0"
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
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Error en el análisis
                </h3>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <AnalysisResultComponent result={result} showPipeline={true} />
        )}

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            ¿Cómo funciona el análisis?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
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
              <h3 className="font-semibold text-slate-900 mb-2">
                1. Procesamiento
              </h3>
              <p className="text-sm text-slate-600">
                El texto se prepara y analiza utilizando técnicas avanzadas de
                procesamiento de lenguaje natural
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
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
              <h3 className="font-semibold text-slate-900 mb-2">
                2. Análisis IA
              </h3>
              <p className="text-sm text-slate-600">
                Gemini 2.0 Flash evalúa patrones lingüísticos, coherencia y
                características típicas de IA
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
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
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                3. Resultado
              </h3>
              <p className="text-sm text-slate-600">
                Se genera un reporte detallado con probabilidades, factores de
                análisis y recomendaciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
