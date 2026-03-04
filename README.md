# AgriHub

Offline plant disease detection mobile app powered by on-device machine learning. Identify crop diseases from leaf photos without an internet connection.

## Features

- **Offline ML Inference** -- Runs MobileNetV2 on-device using ONNX Runtime, no server required
- **38 Disease Classes** -- Covers 14 crop species including Apple, Tomato, Corn, Grape, Potato, and more
- **Camera & Gallery** -- Capture a leaf photo or pick from gallery for instant analysis
- **Disease Details** -- View confidence scores, severity, and crop identification
- **Scan History** -- Track past scans with local storage
- **Treatment Info** -- Organic and chemical treatment recommendations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | Expo Router 6 (file-based) |
| ML Runtime | ONNX Runtime React Native 1.23 |
| ML Model | MobileNetV2 (PlantVillage dataset) |
| Image Processing | expo-image-manipulator + jpeg-js |
| Storage | AsyncStorage |
| Language | TypeScript 5.9 |

## Project Structure

```
AgriHub/
├── app/                        # Expo Router screens
│   ├── (tabs)/                 # Tab navigation
│   │   ├── index.tsx           # Home / scan screen
│   │   ├── browse.tsx          # Browse crops & diseases
│   │   ├── history.tsx         # Scan history
│   │   └── settings.tsx        # App settings
│   ├── scan/
│   │   ├── camera.tsx          # Camera capture
│   │   └── results.tsx         # Analysis results
│   └── details/
│       ├── crop/[id].tsx       # Crop detail page
│       └── disease/[id].tsx    # Disease detail page
├── src/
│   ├── ml/                     # Machine learning
│   │   ├── ModelManager.ts     # ONNX inference engine
│   │   ├── labels.ts           # 38 disease + 14 crop labels
│   │   └── types.ts            # ML type definitions
│   ├── components/ui/          # Reusable UI components
│   ├── constants/              # App & ML config
│   ├── context/                # React providers
│   └── database/               # Local data & seed data
├── assets/models/
│   └── plant_disease.onnx      # MobileNetV2 ONNX model (8.9 MB)
├── plugins/
│   └── withOnnxruntimePackage.js  # Expo config plugin (see note below)
├── scripts/
│   └── convert_model_to_onnx.py   # PyTorch to ONNX converter
└── prd.md                      # Product requirements
```

## ML Pipeline

```
Camera/Gallery Image
       │
       ▼
Resize to 224x224 (JPEG)
       │
       ▼
Decode pixels (jpeg-js)
       │
       ▼
Normalize: (pixel - 127.5) / 127.5
Convert to NCHW [1, 3, 224, 224]
       │
       ▼
ONNX Runtime Inference (CPU)
       │
       ▼
Softmax → Top-K Predictions
       │
       ▼
Disease + Crop Identification
```

**Model**: [`linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification`](https://huggingface.co/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification) converted from PyTorch to ONNX format.

## Supported Crops

Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

## Setup on a New System

### Prerequisites

- **Node.js** >= 18
- **Android SDK** with accepted licenses (for local Android builds)
- **Xcode** (for iOS builds, macOS only)

### 1. Clone & Install

```bash
git clone <repo-url>
cd AgriHub
npm install
```

### 2. Generate Native Projects

The `android/` and `ios/` folders are gitignored (generated code). Regenerate them with:

```bash
npx expo prebuild
```

This automatically:
- Creates the `android/` and `ios/` directories
- Adds the `onnxruntime-react-native` Gradle dependency (via its official plugin)
- **Registers `OnnxruntimePackage` in `MainApplication.kt`** (via `plugins/withOnnxruntimePackage.js`)

### 3. Accept Android SDK Licenses

If building locally for Android, make sure all SDK licenses are accepted:

```bash
sdkmanager --licenses
```

Also set the `ANDROID_HOME` environment variable:

```bash
# Add to ~/.zshrc or ~/.bashrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 4. Run

```bash
# Start Metro bundler
npm start

# Build & run on connected Android device
npm run android

# Build & run on iOS simulator (macOS only)
npm run ios
```

> **Important**: This app uses `onnxruntime-react-native` (native module). It requires a development build and will **not** work in Expo Go.

## Build APK

### Local Debug APK

```bash
npx expo run:android
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### EAS Cloud Build (no local SDK needed)

```bash
npx eas build --platform android --profile preview
```

## About `withOnnxruntimePackage` Plugin

The official `onnxruntime-react-native` Expo plugin adds the Gradle dependency but does **not** register its native modules with the React Native bridge. Without the custom plugin at `plugins/withOnnxruntimePackage.js`, the app will crash at runtime with:

```
TypeError: Cannot read property 'install' of null
```

The plugin automatically injects `OnnxruntimePackage()` into `MainApplication.kt` during `expo prebuild`, so no manual patching is needed.

## Model Conversion

To re-convert the model from HuggingFace:

```bash
pip install torch torchvision transformers onnx
python scripts/convert_model_to_onnx.py
cp plant_disease.onnx assets/models/
```

## License

Private project.
