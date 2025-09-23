export type AnalysisKind = "texto" | "documento" | "imagen" | "video" | "caso";

export interface TextAnalysis {
  length: number;
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  hasEmotionalLanguage: boolean;
  hasPersonalPronouns: boolean;
  hasComplexSentences: boolean;
  hasRepetitivePatterns: boolean;
}

export interface AnalysisFactor {
  factor: string;
  score: number;
  explanation: string;
}

export interface TechnicalDetails {
  hfScore: number;
  geminiScore: number;
  combinedScore: number;
  methodology: string;
}

export interface AnalysisResult {
  id?: string;
  kind: AnalysisKind;
  createdAt: number; // epoch ms
  inputLength?: number;
  aiProbability: number; // 0-100
  humanProbability: number; // 0-100
  finalDetermination?: string;
  confidenceLevel?: string;
  methodology?: string;
  interpretation?: string;
  analysisFactors?: AnalysisFactor[];
  keyIndicators?: string[];
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string;
  textAnalysis?: TextAnalysis;
  technicalDetails?: TechnicalDetails;
}
