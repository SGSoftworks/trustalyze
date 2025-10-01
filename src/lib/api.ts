import type { AnalysisResult, AnalysisKind, PipelineStep } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export class APIService {
  private static instance: APIService;

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  async analyzeText(text: string): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        // Si falla la API principal, intentar con el fallback
        console.warn("Primary API failed, trying fallback...");
        return await this.analyzeTextFallback(text);
      }

      const result = await response.json();
      return {
        ...result,
        kind: "texto" as AnalysisKind,
        createdAt: Date.now(),
      };
    } catch (error) {
      console.warn("Primary API error, trying fallback:", error);
      return await this.analyzeTextFallback(text);
    }
  }

  private async analyzeTextFallback(text: string): Promise<AnalysisResult> {
    const response = await fetch(`${API_BASE_URL}/analyze-text-fallback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.details || errorData.error}`);
    }

    const result = await response.json();
    return {
      ...result,
      kind: "texto" as AnalysisKind,
      createdAt: Date.now(),
    };
  }

  async analyzeDocument(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/analyze-file`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      ...result,
      kind: "documento" as AnalysisKind,
      createdAt: Date.now(),
    };
  }

  async analyzeImage(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/analyze-image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      ...result,
      kind: "imagen" as AnalysisKind,
      createdAt: Date.now(),
    };
  }

  async analyzeVideo(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/analyze-video`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      ...result,
      kind: "video" as AnalysisKind,
      createdAt: Date.now(),
    };
  }

  async searchRelated(query: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/search-related`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  generatePipelineSteps(kind: AnalysisKind): PipelineStep[] {
    const baseSteps: PipelineStep[] = [
      {
        step: "preprocessing",
        status: "pending",
        description: "Preparando contenido para análisis",
      },
      {
        step: "ai_analysis",
        status: "pending",
        description: "Ejecutando análisis con IA",
      },
      {
        step: "pattern_detection",
        status: "pending",
        description: "Detectando patrones característicos",
      },
      {
        step: "confidence_calculation",
        status: "pending",
        description: "Calculando nivel de confianza",
      },
      {
        step: "result_generation",
        status: "pending",
        description: "Generando resultado final",
      },
    ];

    if (kind === "imagen" || kind === "video") {
      baseSteps.splice(1, 0, {
        step: "content_extraction",
        status: "pending",
        description: "Extrayendo contenido textual",
      });
    }

    if (kind === "documento") {
      baseSteps.splice(1, 0, {
        step: "document_parsing",
        status: "pending",
        description: "Procesando estructura del documento",
      });
    }

    return baseSteps;
  }
}

export const apiService = APIService.getInstance();
