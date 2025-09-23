export type AnalysisKind = "texto" | "documento" | "imagen" | "video" | "caso";

export interface AnalysisResult {
  id?: string;
  kind: AnalysisKind;
  createdAt: number; // epoch ms
  inputLength?: number;
  aiProbability: number; // 0-100
  humanProbability: number; // 0-100
  justification: string;
  steps: string[];
}
