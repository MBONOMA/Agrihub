import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { modelManager } from '../ml';
import { ModelInfo } from '../ml/types';

interface ModelContextType {
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  modelInfo: { crop: ModelInfo; disease: ModelInfo } | null;
  initialize: () => Promise<void>;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [modelInfo, setModelInfo] = useState<{ crop: ModelInfo; disease: ModelInfo } | null>(null);

  const initialize = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize ML models (ONNX Runtime)
      console.log('🚀 Starting ML model initialization...');
      await modelManager.initialize();
      setModelInfo(modelManager.getModelInfo());
      setIsReady(true);
      console.log('✅ All models initialized and ready');
    } catch (err) {
      console.error('❌ Model initialization error:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize models'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <ModelContext.Provider value={{ isReady, isLoading, error, modelInfo, initialize }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel(): ModelContextType {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
}
