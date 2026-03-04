// In-memory database with AsyncStorage persistence for scan history

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEED_DATA, CropData, DiseaseData, TreatmentData } from './seed/treatmentData';

const HISTORY_KEY = '@agrihub_scan_history';

// In-memory storage
const crops: CropData[] = [...SEED_DATA];
let scanHistory: ScanHistoryItem[] = [];
let historyLoaded = false;

export interface ScanHistoryItem {
  id: string;
  imageUri: string;
  cropName: string;
  diseaseName: string;
  cropConfidence: number;
  diseaseConfidence: number;
  isHealthy: boolean;
  severity: string;
  scannedAt: Date;
}

// Load history from AsyncStorage
async function loadHistory(): Promise<void> {
  if (historyLoaded) return;
  try {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      scanHistory = parsed.map((item: any) => ({
        ...item,
        scannedAt: new Date(item.scannedAt),
      }));
    }
    historyLoaded = true;
  } catch (error) {
    console.error('Failed to load scan history:', error);
    historyLoaded = true;
  }
}

// Save history to AsyncStorage
async function saveHistory(): Promise<void> {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(scanHistory));
  } catch (error) {
    console.error('Failed to save scan history:', error);
  }
}

// Database API
export const database = {
  // Crops
  getAllCrops(): CropData[] {
    return crops;
  },

  getCropByName(name: string): CropData | undefined {
    return crops.find(c => c.name.toLowerCase() === name.toLowerCase());
  },

  getCropByIndex(index: number): CropData | undefined {
    return crops[index];
  },

  // Diseases
  getDiseasesForCrop(cropName: string): DiseaseData[] {
    const crop = this.getCropByName(cropName);
    return crop?.diseases || [];
  },

  getDiseaseByName(cropName: string, diseaseName: string): DiseaseData | undefined {
    const diseases = this.getDiseasesForCrop(cropName);
    return diseases.find(d => d.name.toLowerCase() === diseaseName.toLowerCase());
  },

  // Find disease across all crops by disease display name
  findDisease(diseaseName: string): { crop: CropData; disease: DiseaseData } | undefined {
    for (const crop of crops) {
      const disease = crop.diseases.find(d =>
        diseaseName.toLowerCase().includes(d.name.toLowerCase()) ||
        d.name.toLowerCase().includes(diseaseName.toLowerCase())
      );
      if (disease) {
        return { crop, disease };
      }
    }
    return undefined;
  },

  // Treatments
  getTreatmentsForDisease(cropName: string, diseaseName: string): TreatmentData[] {
    const disease = this.getDiseaseByName(cropName, diseaseName);
    return disease?.treatments || [];
  },

  getOrganicTreatments(cropName: string, diseaseName: string): TreatmentData[] {
    return this.getTreatmentsForDisease(cropName, diseaseName)
      .filter(t => t.type === 'organic');
  },

  getChemicalTreatments(cropName: string, diseaseName: string): TreatmentData[] {
    return this.getTreatmentsForDisease(cropName, diseaseName)
      .filter(t => t.type === 'chemical');
  },

  // Scan History (persisted)
  async getScanHistory(): Promise<ScanHistoryItem[]> {
    await loadHistory();
    return [...scanHistory].sort((a, b) =>
      b.scannedAt.getTime() - a.scannedAt.getTime()
    );
  },

  async getScanById(id: string): Promise<ScanHistoryItem | undefined> {
    await loadHistory();
    return scanHistory.find(s => s.id === id);
  },

  async addScanToHistory(scan: Omit<ScanHistoryItem, 'id'>): Promise<ScanHistoryItem> {
    await loadHistory();
    const newScan: ScanHistoryItem = {
      ...scan,
      id: Date.now().toString(),
    };
    scanHistory.push(newScan);
    await saveHistory();
    return newScan;
  },

  async clearScanHistory(): Promise<void> {
    scanHistory = [];
    historyLoaded = true;
    await AsyncStorage.removeItem(HISTORY_KEY);
  },

  // Search
  searchCrops(query: string): CropData[] {
    const lowerQuery = query.toLowerCase();
    return crops.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.scientificName.toLowerCase().includes(lowerQuery) ||
      c.category.toLowerCase().includes(lowerQuery)
    );
  },
};

export type { CropData, DiseaseData, TreatmentData };
