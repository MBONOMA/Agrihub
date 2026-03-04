export const ML_CONFIG = {
  INPUT_SIZE: 224,
  CONFIDENCE_THRESHOLD: 0.7,
  TOP_K_RESULTS: 3,
  // MobileNetV2 normalization values (from model preprocessor config)
  MEAN: [0.5, 0.5, 0.5],
  STD: [0.5, 0.5, 0.5],
  RESCALE_FACTOR: 0.00392156862745098, // 1/255
};

export const APP_CONFIG = {
  MAX_HISTORY_ITEMS: 100,
  IMAGE_QUALITY: 0.8,
  SUPPORTED_FORMATS: ['jpg', 'jpeg', 'png'],
};
