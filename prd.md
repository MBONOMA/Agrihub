# 🌿 AgriHub – Offline Plant Disease Detection System  
## Product Requirements Document (PRD)

---

## 1. Product Overview

**Product Name:** AgriHub  
**Platform:** Mobile Application (Android & iOS)  
**Mode:** Fully Offline  
**Category:** Agriculture | AI | Computer Vision  

AgriHub is an offline mobile application that identifies plant/crop types and detects plant diseases using leaf images. It provides accurate treatment recommendations, including organic and chemical remedies, without requiring an internet connection.

---

## 2. Purpose & Vision

The vision of AgriHub is to empower farmers and agricultural professionals with an intelligent, easy-to-use, and offline plant disease detection system, especially for rural and remote areas with limited connectivity.

---

## 3. Problem Statement

- Farmers lack access to agricultural experts
- Internet connectivity is unreliable in rural regions
- Existing apps rely heavily on cloud-based APIs
- Delayed disease detection leads to crop loss and misuse of chemicals

---

## 4. Proposed Solution

AgriHub provides:
- Offline crop identification using leaf images
- Offline disease detection using on-device ML models
- Organic and chemical treatment recommendations
- Fast and accurate results without internet dependency

---

## 5. Scope

### 5.1 In-Scope
- Offline image-based disease detection
- Support for at least **50 crops/plants**
- On-device ML inference
- Local treatment database
- Android and iOS support

### 5.2 Out of Scope
- Cloud-based processing
- Live expert consultation
- Weather-based recommendations
- IoT sensor integration

---

## 6. Target Users

| User Type | Description |
|---------|-------------|
| Farmers | Identify crop diseases in fields |
| Agriculture Students | Educational and research use |
| Researchers | Disease analysis |
| NGOs | Rural agricultural support |

---

## 7. Functional Requirements

### FR-1: Image Acquisition
- Capture image via camera
- Upload image from gallery
- Works completely offline

### FR-2: Image Preprocessing
- Resize image
- Normalize pixel values
- Noise removal (optional)
- Background cropping (optional)

### FR-3: Crop Identification
- Identify plant/crop type
- Minimum support: **50 crops**
- Display confidence score

### FR-4: Disease Detection
- Detect healthy or diseased leaf
- Crop-specific disease classification
- Display confidence score

### FR-5: Treatment Recommendation
- Organic remedies
- Chemical remedies
- Dosage and safety precautions
- Data fetched from local database

### FR-6: Result Display
- Crop name
- Disease name
- Confidence score
- Treatment recommendations

### FR-7: Offline Operation
- No internet required
- All models and data stored locally

### FR-8: Local Storage
- ML models stored inside app
- Treatment database stored locally
- Detection history (optional)

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Inference time < 2 seconds
- Image processing < 1 second

### 8.2 Accuracy
- Crop identification ≥ 90%
- Disease detection ≥ 85%

### 8.3 Usability
- Simple UI
- Minimal user steps
- Optional multi-language support

### 8.4 Security
- No data uploaded to cloud
- Local-only image storage

### 8.5 Portability
- Android & iOS compatibility
- Works on mid-range devices

---

## 9. System Architecture (Offline)

### Components
1. Mobile UI Layer
2. Image Processing Module
3. Crop Classification Model
4. Disease Detection Model
5. Local Treatment Database
6. Result Visualization Module

---

## 10. Machine Learning Design

### 10.1 Models
| Task | Model |
|----|------|
| Crop Identification | CNN (MobileNet / EfficientNet) |
| Disease Detection | CNN (Multi-class classifier) |

### 10.2 Deployment
- TensorFlow Lite for Android
- Core ML for iOS
- Models bundled within app

---

## 11. Dataset Requirements

- At least **50 crops**
- Multiple diseases per crop
- Sources:
  - PlantVillage
  - Kaggle datasets
  - Field-collected images
- Data augmentation:
  - Rotation
  - Zoom
  - Brightness variation

---

## 12. Offline App Flow

