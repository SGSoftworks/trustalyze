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

export interface DetailedExplanation {
  hfAnalysis: string;
  geminiAnalysis: string;
  combinedScore: string;
  methodology: string;
}

export interface AnalysisResult {
  id?: string;
  kind: AnalysisKind;
  createdAt: number; // epoch ms
  inputLength?: number;
  aiProbability: number; // 0-100
  humanProbability: number; // 0-100
  justification: string;
  steps: string[];
  confidence?: string;
  analysisAspects?: string[];
  textAnalysis?: TextAnalysis;
  detailedExplanation?: DetailedExplanation;
}
