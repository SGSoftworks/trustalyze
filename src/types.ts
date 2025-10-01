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
  geminiScore: number;
  methodology: string;
  modelVersion: string;
  analysisDepth: string;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

export interface VideoAnalysis {
  fileSize: number;
  duration: number;
  hasAudio: boolean;
  frameRate: number;
  resolution: string;
  audioTranscription?: string;
  deepfakeIndicators?: string[];
  frameAnalysis?: string;
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
  videoAnalysis?: VideoAnalysis;
  technicalDetails?: TechnicalDetails;
  searchResults?: SearchResult[];
  pipelineSteps?: PipelineStep[];
}

export interface PipelineStep {
  step: string;
  status: "pending" | "processing" | "completed" | "error";
  description: string;
  result?: string;
}

export interface UserConsent {
  dataCollection: boolean;
  dataStorage: boolean;
  dataAnalysis: boolean;
  dataSharing: boolean;
  timestamp: number;
}

export interface PrivacySettings {
  consent: UserConsent;
  dataRetention: number; // days
  allowAnalytics: boolean;
  allowCookies: boolean;
}
