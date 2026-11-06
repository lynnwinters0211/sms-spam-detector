/**
 * Type definitions for SMS Spam Detector
 */

export type AlgorithmType = 'Naive Bayes' | 'KNN' | 'Decision Tree';
export type RepresentationType = 'BoW' | 'TF-IDF' | 'Embeddings';

export interface ModelExperimentResult {
  representation: RepresentationType;
  algorithm: AlgorithmType;
  accuracy: number;
  precisionSpam: number;
  recallSpam: number;
  f1Spam: number;
  isMainModel?: boolean;
  notes?: string;
}

export interface ConfusionMatrixData {
  matrix: [[number, number], [number, number]]; // [[TN, FP], [FN, TP]]
  tn: number; // 901 Ham đúng
  fp: number; // 3 Ham bị đánh dấu nhầm thành Spam
  fn: number; // 12 Spam bị bỏ sót
  tp: number; // 116 Spam đúng
  total: number;
}

export interface PredictionRequest {
  text: string;
}

export interface PredictionResponse {
  label: 0 | 1;
  class_name: 'Ham' | 'Spam';
  model: string;
}

export interface PredictionHistoryItem {
  id: string;
  text: string;
  label: 0 | 1;
  className: 'Ham' | 'Spam';
  model: string;
  timestamp: number;
}

export type HealthStatus = 'checking' | 'ready' | 'not_ready' | 'error';
