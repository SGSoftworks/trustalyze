import type { AnalysisResult } from "../types";

export class ExportService {
  private static instance: ExportService;

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  exportToJSON(results: AnalysisResult[]): string {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalResults: results.length,
      results: results.map((result) => ({
        id: result.id,
        kind: result.kind,
        createdAt: new Date(result.createdAt).toISOString(),
        aiProbability: result.aiProbability,
        humanProbability: result.humanProbability,
        finalDetermination: result.finalDetermination,
        confidenceLevel: result.confidenceLevel,
        methodology: result.methodology,
        interpretation: result.interpretation,
        analysisFactors: result.analysisFactors,
        keyIndicators: result.keyIndicators,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        recommendations: result.recommendations,
        technicalDetails: result.technicalDetails,
      })),
    };

    return JSON.stringify(exportData, null, 2);
  }

  exportToCSV(results: AnalysisResult[]): string {
    const headers = [
      "ID",
      "Tipo",
      "Fecha",
      "Probabilidad IA (%)",
      "Probabilidad Humano (%)",
      "Determinación Final",
      "Nivel de Confianza",
      "Metodología",
      "Interpretación",
      "Factores de Análisis",
      "Indicadores Clave",
      "Fortalezas",
      "Debilidades",
      "Recomendaciones",
    ];

    const rows = results.map((result) => [
      result.id || "",
      result.kind,
      new Date(result.createdAt).toLocaleString(),
      result.aiProbability,
      result.humanProbability,
      result.finalDetermination || "",
      result.confidenceLevel || "",
      result.methodology || "",
      result.interpretation || "",
      result.analysisFactors?.map((f) => f.factor).join("; ") || "",
      result.keyIndicators?.join("; ") || "",
      result.strengths?.join("; ") || "",
      result.weaknesses?.join("; ") || "",
      result.recommendations || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((field) => `"${field.toString().replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    return csvContent;
  }

  exportToPDF(results: AnalysisResult[]): Promise<Blob> {
    // En una implementación real, usaríamos una librería como jsPDF
    // Por ahora, generamos un HTML que se puede imprimir como PDF
    const htmlContent = this.generatePDFHTML(results);
    const blob = new Blob([htmlContent], { type: "text/html" });
    return Promise.resolve(blob);
  }

  private generatePDFHTML(results: AnalysisResult[]): string {
    const currentDate = new Date().toLocaleString();

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Análisis - Trustalyze</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
        .result { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; }
        .result-header { font-weight: bold; color: #333; }
        .probabilities { display: flex; gap: 20px; margin: 10px 0; }
        .prob-item { flex: 1; text-align: center; }
        .prob-bar { height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden; }
        .prob-fill-ai { background: #ef4444; height: 100%; }
        .prob-fill-human { background: #10b981; height: 100%; }
        .factors { margin-top: 10px; }
        .factor { margin: 5px 0; padding: 5px; background: #f9f9f9; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Trustalyze - Reporte de Análisis</h1>
        <p>Generado el: ${currentDate}</p>
    </div>
    
    <div class="summary">
        <h2>Resumen</h2>
        <p><strong>Total de análisis:</strong> ${results.length}</p>
        <p><strong>Contenido IA detectado:</strong> ${
          results.filter((r) => r.aiProbability > 50).length
        }</p>
        <p><strong>Contenido Humano detectado:</strong> ${
          results.filter((r) => r.humanProbability > 50).length
        }</p>
    </div>
    
    ${results
      .map(
        (result) => `
        <div class="result">
            <div class="result-header">
                Análisis #${result.id || "N/A"} - ${result.kind.toUpperCase()}
                <span style="float: right;">${new Date(
                  result.createdAt
                ).toLocaleString()}</span>
            </div>
            
            <div class="probabilities">
                <div class="prob-item">
                    <div>IA: ${result.aiProbability}%</div>
                    <div class="prob-bar">
                        <div class="prob-fill-ai" style="width: ${
                          result.aiProbability
                        }%"></div>
                    </div>
                </div>
                <div class="prob-item">
                    <div>Humano: ${result.humanProbability}%</div>
                    <div class="prob-bar">
                        <div class="prob-fill-human" style="width: ${
                          result.humanProbability
                        }%"></div>
                    </div>
                </div>
            </div>
            
            <p><strong>Determinación:</strong> ${
              result.finalDetermination || "N/A"
            }</p>
            <p><strong>Confianza:</strong> ${
              result.confidenceLevel || "N/A"
            }</p>
            
            ${
              result.interpretation
                ? `<p><strong>Interpretación:</strong> ${result.interpretation}</p>`
                : ""
            }
            
            ${
              result.analysisFactors && result.analysisFactors.length > 0
                ? `
                <div class="factors">
                    <strong>Factores de Análisis:</strong>
                    ${result.analysisFactors
                      .map(
                        (factor) => `
                        <div class="factor">
                            <strong>${factor.factor}:</strong> ${Math.round(
                          factor.score * 100
                        )}% - ${factor.explanation}
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `
                : ""
            }
            
            ${
              result.recommendations
                ? `<p><strong>Recomendaciones:</strong> ${result.recommendations}</p>`
                : ""
            }
        </div>
    `
      )
      .join("")}
</body>
</html>`;
  }

  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  downloadJSON(results: AnalysisResult[]): void {
    const content = this.exportToJSON(results);
    const filename = `trustalyze-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    this.downloadFile(content, filename, "application/json");
  }

  downloadCSV(results: AnalysisResult[]): void {
    const content = this.exportToCSV(results);
    const filename = `trustalyze-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    this.downloadFile(content, filename, "text/csv");
  }

  async downloadPDF(results: AnalysisResult[]): Promise<void> {
    const blob = await this.exportToPDF(results);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trustalyze-export-${
      new Date().toISOString().split("T")[0]
    }.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const exportService = ExportService.getInstance();
