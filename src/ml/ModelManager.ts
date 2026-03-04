import { Platform } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { Asset } from 'expo-asset';
import * as jpeg from 'jpeg-js';
import { decode } from 'base64-js';
import { ML_CONFIG } from '../constants/config';
import {
  CropPrediction,
  DiseasePrediction,
  AnalysisResult,
  ModelInfo
} from './types';
import {
  CROP_LABELS,
  DISEASE_LABELS,
  getCropLabel,
  getDiseaseLabel,
  NUM_CROP_CLASSES,
  NUM_DISEASE_CLASSES,
} from './labels';

// Polyfill WebGPU constants to prevent ReferenceError in onnxruntime-web when WebGPU is not available
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  if (!(window as any).GPUBufferUsage) {
    (window as any).GPUBufferUsage = {
      MAP_READ: 0x0001,
      MAP_WRITE: 0x0002,
      COPY_SRC: 0x0004,
      COPY_DST: 0x0008,
      INDEX: 0x0010,
      VERTEX: 0x0020,
      UNIFORM: 0x0040,
      STORAGE: 0x0080,
      INDIRECT: 0x0100,
      QUERY_RESOLVE: 0x0200,
    };
  }
  if (!(window as any).GPUTextureUsage) {
    (window as any).GPUTextureUsage = {
      COPY_SRC: 0x01,
      COPY_DST: 0x02,
      TEXTURE_BINDING: 0x04,
      STORAGE_BINDING: 0x08,
      RENDER_ATTACHMENT: 0x10,
    };
  }
}

// Lazy import ONNX Runtime to avoid loading issues in Expo Go and support Web
let InferenceSession: any;
let Tensor: any;

const loadONNXRuntime = async () => {
  if (!InferenceSession) {
    try {
      if (Platform.OS === 'web') {
        try {
          const onnxRuntime = require('onnxruntime-web');
          // Set WASM paths for web to use CDN as a fallback
          if (onnxRuntime.env) {
            if (onnxRuntime.env.wasm) {
              onnxRuntime.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.2/dist/';
            }
            // Disable WebGPU backend if not explicitly requested to avoid shader bugs/crashes
            if (onnxRuntime.env.webgpu) {
              onnxRuntime.env.webgpu.disabled = true;
            }
          }
          InferenceSession = onnxRuntime.InferenceSession;
          Tensor = onnxRuntime.Tensor;
        } catch (e) {
          console.error('onnxruntime-web not found. Web support is disabled.', e);
          throw new Error('onnxruntime-web is required for web support. Please install it.');
        }
      } else {
        try {
          const onnxRuntime = require('onnxruntime-react-native');
          InferenceSession = onnxRuntime.InferenceSession;
          Tensor = onnxRuntime.Tensor;
        } catch (e) {
          console.error('onnxruntime-react-native not found. Mobile support is disabled.', e);
          throw new Error('onnxruntime-react-native is required for mobile support. Please install it.');
        }
      }
    } catch (error) {
      console.error('Failed to load onnxruntime:', error);
      throw error;
    }
  }
  return { InferenceSession, Tensor };
};

class ModelManager {
  private static instance: ModelManager;
  private isInitialized: boolean = false;
  private isLoading: boolean = false;
  
  // ONNX Runtime session for disease detection
  private diseaseSession: any | null = null;

  private cropModelInfo: ModelInfo = {
    name: 'crop_classifier',
    version: '1.0.0',
    inputSize: ML_CONFIG.INPUT_SIZE,
    numClasses: NUM_CROP_CLASSES,
    loaded: false,
  };

  private diseaseModelInfo: ModelInfo = {
    name: 'plant_disease_mobilenetv2',
    version: '1.0.0',
    inputSize: ML_CONFIG.INPUT_SIZE,
    numClasses: NUM_DISEASE_CLASSES,
    loaded: false,
  };

  private constructor() {}

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized || this.isLoading) return;

    this.isLoading = true;
    console.log('🔄 Initializing ONNX Runtime and ML models...');

    try {
      await this.loadONNXModel();

      this.isInitialized = true;
      console.log('✅ ML models initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize ML models:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private async loadONNXModel(): Promise<void> {
    console.log('🔄 Loading MobileNetV2 plant disease model...');
    
    try {
      // Load ONNX Runtime module
      const { InferenceSession: ONNXInferenceSession } = await loadONNXRuntime();
      
      // Load the ONNX model from assets
      const modelAsset = Asset.fromModule(require('../../assets/models/plant_disease.onnx'));
      await modelAsset.downloadAsync();
      
      if (!modelAsset.localUri && Platform.OS !== 'web') {
        throw new Error('Failed to download model asset');
      }

      // On web, use the uri directly from the asset
      const modelUri = Platform.OS === 'web' ? modelAsset.uri : modelAsset.localUri!;
      console.log(`📦 Model path: ${modelUri}`);
      
      // Create ONNX Runtime inference session
      this.diseaseSession = await ONNXInferenceSession.create(modelUri, {
        executionProviders: Platform.OS === 'web' ? ['wasm'] : ['cpu'],
      });
      
      this.diseaseModelInfo.loaded = true;
      this.cropModelInfo.loaded = true;
      
      console.log('✅ ONNX model loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load ONNX model:', error);
      throw new Error(`Failed to load ONNX model: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  get isReady(): boolean {
    return this.isInitialized;
  }

  getModelInfo(): { crop: ModelInfo; disease: ModelInfo } {
    return {
      crop: { ...this.cropModelInfo },
      disease: { ...this.diseaseModelInfo },
    };
  }

  async detectDisease(imageUri: string, cropClassId?: number): Promise<DiseasePrediction[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.diseaseSession) {
      throw new Error('Disease model not loaded');
    }

    try {
      const { Tensor: ONNXTensor } = await loadONNXRuntime();
      const preprocessedImage = await this.preprocessImageForONNX(imageUri);
      
      // Create input tensor: [1, 3, 224, 224] in NCHW format
      const inputTensor = new ONNXTensor('float32', preprocessedImage, [1, 3, 224, 224]);
      
      // Run inference
      const feeds = { pixel_values: inputTensor };
      const results = await this.diseaseSession.run(feeds);
      
      // Get logits output (key name might vary depending on model version, but results.logits is common)
      const output = results.logits || results[Object.keys(results)[0]];
      const logits = output.data as Float32Array;
      
      const probabilities = this.softmax(Array.from(logits));
      const results_list: DiseasePrediction[] = [];
      
      for (let i = 0; i < Math.min(NUM_DISEASE_CLASSES, probabilities.length); i++) {
        const confidence = probabilities[i];
        
        if (cropClassId !== undefined) {
          const diseaseLabel = getDiseaseLabel(i);
          if (diseaseLabel && diseaseLabel.cropIndex !== cropClassId) {
            continue;
          }
        }
        
        if (confidence > 0.01) {
          const diseaseLabel = getDiseaseLabel(i);
          if (diseaseLabel) {
            results_list.push({
              classId: i,
              className: diseaseLabel.name,
              confidence,
              isHealthy: diseaseLabel.isHealthy,
              severity: diseaseLabel.severity,
              cropId: CROP_LABELS[diseaseLabel.cropIndex]?.name,
            });
          }
        }
      }

      return results_list
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, ML_CONFIG.TOP_K_RESULTS);
    } catch (error) {
      console.error('❌ Error detecting disease:', error);
      throw error;
    }
  }

  private async preprocessImageForONNX(uri: string): Promise<Float32Array> {
    try {
      const processed = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: ML_CONFIG.INPUT_SIZE, height: ML_CONFIG.INPUT_SIZE } }],
        { format: ImageManipulator.SaveFormat.JPEG, compress: 1.0, base64: true }
      );
      
      if (!processed.base64) {
        throw new Error('Failed to get base64 from image');
      }

      const base64Data = processed.base64.replace(/^data:image\/\w+;base64,/, '');
      const bytes = decode(base64Data);
      const decoded = jpeg.decode(bytes, { useTArray: true });
      
      const { width, height, data } = decoded;
      const inputSize = ML_CONFIG.INPUT_SIZE;
      const inputArray = new Float32Array(3 * inputSize * inputSize);
      
      for (let h = 0; h < inputSize; h++) {
        for (let w = 0; w < inputSize; w++) {
          const idx = (h * inputSize + w) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          
          // NCHW format
          inputArray[0 * inputSize * inputSize + h * inputSize + w] = (r - 127.5) / 127.5;
          inputArray[1 * inputSize * inputSize + h * inputSize + w] = (g - 127.5) / 127.5;
          inputArray[2 * inputSize * inputSize + h * inputSize + w] = (b - 127.5) / 127.5;
        }
      }
      
      return inputArray;
    } catch (error) {
      console.error('❌ Error preprocessing image:', error);
      throw error;
    }
  }

  async classifyCrop(imageUri: string): Promise<CropPrediction[]> {
    const diseasePredictions = await this.detectDisease(imageUri);
    const cropMap = new Map<number, number>();
    
    diseasePredictions.forEach(disease => {
      const diseaseLabel = getDiseaseLabel(disease.classId);
      if (diseaseLabel) {
        const cropId = diseaseLabel.cropIndex;
        const currentConf = cropMap.get(cropId) || 0;
        cropMap.set(cropId, Math.max(currentConf, disease.confidence));
      }
    });

    return Array.from(cropMap.entries())
      .map(([cropId, confidence]) => {
        const cropLabel = getCropLabel(cropId);
        return {
          classId: cropId,
          className: cropLabel?.name || `Crop ${cropId}`,
          confidence,
          scientificName: cropLabel?.scientificName,
          category: cropLabel?.category,
        };
      })
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, ML_CONFIG.TOP_K_RESULTS);
  }

  async analyze(imageUri: string): Promise<AnalysisResult> {
    const startTime = Date.now();
    const diseasePredictions = await this.detectDisease(imageUri);
    const topDisease = diseasePredictions[0] || null;
    const cropPredictions = await this.classifyCrop(imageUri);
    const topCrop = cropPredictions[0] || null;

    return {
      cropPrediction: topCrop!,
      diseasePrediction: topDisease!,
      topCropPredictions: cropPredictions,
      topDiseasePredictions: diseasePredictions,
      inferenceTimeMs: Date.now() - startTime,
      timestamp: new Date(),
      imageUri,
    };
  }

  private softmax(logits: number[]): number[] {
    const maxLogit = Math.max(...logits);
    const expScores = logits.map(l => Math.exp(l - maxLogit));
    const sumExpScores = expScores.reduce((a, b) => a + b, 0);
    return expScores.map(s => s / sumExpScores);
  }
}

export const modelManager = ModelManager.getInstance();
