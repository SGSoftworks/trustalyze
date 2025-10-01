import { useEffect, useState } from "react";
import { firebaseService } from "../lib/firebase";
import { exportService } from "../lib/export";
import type { AnalysisResult } from "../types";
import { Logo } from "../components/Logo";

interface DashboardStats {
  totalAnalyses: number;
  aiDetected: number;
  humanDetected: number;
  averageConfidence: number;
  byType: Record<string, { total: number; ai: number; human: number }>;
  recentTrends: Array<{ date: string; ai: number; human: number }>;
}

export function DashboardPage() {
  const [items, setItems] = useState<AnalysisResult[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await firebaseService.getAnalyses(50);
        setItems(data);

        // Calcular estadísticas
        const totalAnalyses = data.length;
        const aiDetected = data.filter(
          (item) => item.aiProbability > 50
        ).length;
        const humanDetected = data.filter(
          (item) => item.humanProbability > 50
        ).length;

        const averageConfidence =
          data.reduce((acc, item) => {
            const confidence =
              item.confidenceLevel === "Alta"
                ? 100
                : item.confidenceLevel === "Media"
                ? 70
                : 40;
            return acc + confidence;
          }, 0) / Math.max(totalAnalyses, 1);

        const byType: Record<
          string,
          { total: number; ai: number; human: number }
        > = {};
        data.forEach((item) => {
          if (!byType[item.kind]) {
            byType[item.kind] = { total: 0, ai: 0, human: 0 };
          }
          byType[item.kind].total++;
          if (item.aiProbability > 50) {
            byType[item.kind].ai++;
          } else {
            byType[item.kind].human++;
          }
        });

        // Agrupar por fecha para tendencias
        const recentTrends: Array<{ date: string; ai: number; human: number }> =
          [];
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split("T")[0];
        }).reverse();

        last7Days.forEach((date) => {
          const dayItems = data.filter(
            (item) =>
              new Date(item.createdAt).toISOString().split("T")[0] === date
          );
          const ai = dayItems.filter((item) => item.aiProbability > 50).length;
          const human = dayItems.filter(
            (item) => item.humanProbability > 50
          ).length;
          recentTrends.push({ date, ai, human });
        });

        setStats({
          totalAnalyses,
          aiDetected,
          humanDetected,
          averageConfidence: Math.round(averageConfidence),
          byType,
          recentTrends,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleExport = async (format: "json" | "csv" | "pdf") => {
    if (items.length === 0) return;
    
    setExporting(format);
    try {
      switch (format) {
        case "json":
          exportService.downloadJSON(items);
          break;
        case "csv":
          exportService.downloadCSV(items);
          break;
        case "pdf":
          await exportService.downloadPDF(items);
          break;
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setExporting(null);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      texto: "📝",
      documento: "📄",
      imagen: "🖼️",
      video: "🎥",
      caso: "🔍",
    };
    return icons[type as keyof typeof icons] || "📄";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      texto: "bg-blue-100 text-blue-800",
      documento: "bg-green-100 text-green-800",
      imagen: "bg-yellow-100 text-yellow-800",
      video: "bg-red-100 text-red-800",
      caso: "bg-purple-100 text-purple-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Logo size="lg" showText={true} className="justify-center mb-6" />
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Panel de Control
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-6">
            Estadísticas y análisis de detección de contenido IA
          </p>
          
          {/* Export Buttons */}
          {items.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleExport("json")}
                disabled={exporting === "json"}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {exporting === "json" ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                Exportar JSON
              </button>
              
              <button
                onClick={() => handleExport("csv")}
                disabled={exporting === "csv"}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {exporting === "csv" ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                Exportar CSV
              </button>
              
              <button
                onClick={() => handleExport("pdf")}
                disabled={exporting === "pdf"}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {exporting === "pdf" ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
                Exportar PDF
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg text-slate-600">
              Cargando estadísticas...
            </span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m3 0V5a2 2 0 012-2h2a2 2 0 012 2v14m-4 0h6m-6 0H6m6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
              No hay análisis aún
            </h3>
            <p className="text-lg text-slate-600 mb-8">
              Realiza tu primer análisis en las secciones de arriba
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="text-2xl mb-2">📝</div>
                <div className="font-medium text-slate-900">Texto</div>
                <div className="text-sm text-slate-600">Análisis de textos</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="text-2xl mb-2">📄</div>
                <div className="font-medium text-slate-900">Documentos</div>
                <div className="text-sm text-slate-600">PDF, DOCX, TXT</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="text-2xl mb-2">🖼️</div>
                <div className="font-medium text-slate-900">Imágenes</div>
                <div className="text-sm text-slate-600">JPG, PNG, GIF</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="text-2xl mb-2">🎥</div>
                <div className="font-medium text-slate-900">Videos</div>
                <div className="text-sm text-slate-600">MP4, AVI, MOV</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Estadísticas Generales */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Total Análisis
                      </p>
                      <p className="text-3xl font-bold text-slate-900">
                        {stats.totalAnalyses}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m3 0V5a2 2 0 012-2h2a2 2 0 012 2v14m-4 0h6m-6 0H6m6 0h6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Contenido IA
                      </p>
                      <p className="text-3xl font-bold text-red-600">
                        {stats.aiDetected}
                      </p>
                      <p className="text-sm text-slate-500">
                        {Math.round(
                          (stats.aiDetected / stats.totalAnalyses) * 100
                        )}
                        % del total
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
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
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Contenido Humano
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {stats.humanDetected}
                      </p>
                      <p className="text-sm text-slate-500">
                        {Math.round(
                          (stats.humanDetected / stats.totalAnalyses) * 100
                        )}
                        % del total
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
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
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Confianza Promedio
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {stats.averageConfidence}%
                      </p>
                      <p className="text-sm text-slate-500">
                        Nivel de confianza
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
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
                  </div>
                </div>
              </div>
            )}

            {/* Análisis por Tipo */}
            {stats && (
              <div className="bg-white rounded-xl shadow-sm border p-8 mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Análisis por Tipo de Contenido
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(stats.byType).map(([type, data]) => (
                    <div key={type} className="border rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{getTypeIcon(type)}</span>
                        <div>
                          <h3 className="font-semibold text-slate-900 capitalize">
                            {type}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {data.total} análisis
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">
                            IA Detectada
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{
                                  width: `${(data.ai / data.total) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {Math.round((data.ai / data.total) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">
                            Humano Detectado
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                  width: `${(data.human / data.total) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {Math.round((data.human / data.total) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Análisis Recientes */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Análisis Recientes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.slice(0, 12).map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`text-sm font-medium px-3 py-1 rounded-full ${getTypeColor(
                          item.kind
                        )}`}
                      >
                        {getTypeIcon(item.kind)} {item.kind.toUpperCase()}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">IA</div>
                        <div className="text-2xl font-bold text-red-600">
                          {item.aiProbability}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">
                          Humano
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {item.humanProbability}%
                        </div>
                      </div>
                    </div>

                    {item.finalDetermination && (
                      <div className="mb-3">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            item.finalDetermination === "IA"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.finalDetermination === "IA"
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          {item.finalDetermination}
                        </div>
                      </div>
                    )}

                    {item.confidenceLevel && (
                      <div className="mb-3">
                        <span className="text-xs text-slate-500">
                          Confianza:{" "}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            item.confidenceLevel === "Alta"
                              ? "text-green-600"
                              : item.confidenceLevel === "Media"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.confidenceLevel}
                        </span>
                      </div>
                    )}

                    {item.interpretation && (
                      <div className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                        {item.interpretation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
