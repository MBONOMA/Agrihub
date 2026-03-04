export interface ClassificationResult {
  classId: number;
  className: string;
  confidence: number;
}

export interface CropPrediction extends ClassificationResult {
  scientificName?: string;
  category?: string;
}

export interface DiseasePrediction extends ClassificationResult {
  isHealthy: boolean;
  severity?: string;
  cropId?: string;
}

export interface AnalysisResult {
  cropPrediction: CropPrediction;
  diseasePrediction: DiseasePrediction;
  topCropPredictions: CropPrediction[];
  topDiseasePredictions: DiseasePrediction[];
  inferenceTimeMs: number;
  timestamp: Date;
  imageUri: string;
}

export interface ModelInfo {
  name: string;
  version: string;
  inputSize: number;
  numClasses: number;
  loaded: boolean;
}
