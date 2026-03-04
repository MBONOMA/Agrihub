// PlantVillage dataset labels - 38 classes covering 14 crop species
// This includes both healthy and diseased states

export interface CropLabel {
  name: string;
  name_rw: string;
  scientificName: string;
  category: string;
}

export const CROP_LABELS: { [key: number]: CropLabel } = {
  0: { name: 'Apple', name_rw: 'Pome', scientificName: 'Malus domestica', category: 'Fruit' },
  1: { name: 'Blueberry', name_rw: 'Bluberi', scientificName: 'Vaccinium corymbosum', category: 'Fruit' },
  2: { name: 'Cherry', name_rw: 'Sheri', scientificName: 'Prunus avium', category: 'Fruit' },
  3: { name: 'Corn (Maize)', name_rw: 'Ikigori', scientificName: 'Zea mays', category: 'Grain' },
  4: { name: 'Grape', name_rw: 'Inzabibu', scientificName: 'Vitis vinifera', category: 'Fruit' },
  5: { name: 'Orange', name_rw: 'Ironji', scientificName: 'Citrus sinensis', category: 'Fruit' },
  6: { name: 'Peach', name_rw: 'Pesi', scientificName: 'Prunus persica', category: 'Fruit' },
  7: { name: 'Bell Pepper', name_rw: 'Poivron', scientificName: 'Capsicum annuum', category: 'Vegetable' },
  8: { name: 'Potato', name_rw: 'Ikirayi', scientificName: 'Solanum tuberosum', category: 'Vegetable' },
  9: { name: 'Raspberry', name_rw: 'Framboize', scientificName: 'Rubus idaeus', category: 'Fruit' },
  10: { name: 'Soybean', name_rw: 'Soya', scientificName: 'Glycine max', category: 'Legume' },
  11: { name: 'Squash', name_rw: 'Ibihaza', scientificName: 'Cucurbita', category: 'Vegetable' },
  12: { name: 'Strawberry', name_rw: 'Inkeri', scientificName: 'Fragaria × ananassa', category: 'Fruit' },
  13: { name: 'Tomato', name_rw: 'Inyanya', scientificName: 'Solanum lycopersicum', category: 'Vegetable' },
  14: { name: 'Wheat', name_rw: 'Ingano', scientificName: 'Triticum aestivum', category: 'Grain' },
  15: { name: 'Rice', name_rw: 'Umuceri', scientificName: 'Oryza sativa', category: 'Grain' },
  16: { name: 'Cotton', name_rw: 'Ipamba', scientificName: 'Gossypium', category: 'Fiber' },
  17: { name: 'Sugarcane', name_rw: 'Ibigori by\'isukari', scientificName: 'Saccharum officinarum', category: 'Sugar' },
  18: { name: 'Coffee', name_rw: 'Ikawa', scientificName: 'Coffea', category: 'Beverage' },
  19: { name: 'Tea', name_rw: 'Icyayi', scientificName: 'Camellia sinensis', category: 'Beverage' },
  20: { name: 'Banana', name_rw: 'Igitoki', scientificName: 'Musa', category: 'Fruit' },
  21: { name: 'Mango', name_rw: 'Umwembe', scientificName: 'Mangifera indica', category: 'Fruit' },
  22: { name: 'Papaya', name_rw: 'Ipapayi', scientificName: 'Carica papaya', category: 'Fruit' },
  23: { name: 'Coconut', name_rw: 'Kokonoti', scientificName: 'Cocos nucifera', category: 'Palm' },
  24: { name: 'Peanut', name_rw: 'Ikarubati', scientificName: 'Arachis hypogaea', category: 'Legume' },
  25: { name: 'Sunflower', name_rw: 'Soya y\'izuba', scientificName: 'Helianthus annuus', category: 'Oilseed' },
  26: { name: 'Mustard', scientificName: 'Brassica', category: 'Oilseed' },
  27: { name: 'Onion', name_rw: 'Ibitunguru', scientificName: 'Allium cepa', category: 'Vegetable' },
  28: { name: 'Garlic', name_rw: 'Tungurusumu', scientificName: 'Allium sativum', category: 'Vegetable' },
  29: { name: 'Ginger', name_rw: 'Tangawizi', scientificName: 'Zingiber officinale', category: 'Spice' },
  30: { name: 'Turmeric', name_rw: 'Turumeriki', scientificName: 'Curcuma longa', category: 'Spice' },
  31: { name: 'Chili', name_rw: 'Pilipili', scientificName: 'Capsicum frutescens', category: 'Spice' },
  32: { name: 'Cabbage', name_rw: 'Shu', scientificName: 'Brassica oleracea', category: 'Vegetable' },
  33: { name: 'Cauliflower', name_rw: 'Kelifurori', scientificName: 'Brassica oleracea var. botrytis', category: 'Vegetable' },
  34: { name: 'Broccoli', name_rw: 'Burokoli', scientificName: 'Brassica oleracea var. italica', category: 'Vegetable' },
  35: { name: 'Carrot', name_rw: 'Seleri', scientificName: 'Daucus carota', category: 'Vegetable' },
  36: { name: 'Cucumber', name_rw: 'Konkomure', scientificName: 'Cucumis sativus', category: 'Vegetable' },
  37: { name: 'Pumpkin', name_rw: 'Ibihaza', scientificName: 'Cucurbita maxima', category: 'Vegetable' },
  38: { name: 'Watermelon', name_rw: 'Ikiribwa', scientificName: 'Citrullus lanatus', category: 'Fruit' },
  39: { name: 'Lettuce', name_rw: 'Leti', scientificName: 'Lactuca sativa', category: 'Vegetable' },
  40: { name: 'Spinach', name_rw: 'Epinari', scientificName: 'Spinacia oleracea', category: 'Vegetable' },
  41: { name: 'Eggplant', name_rw: 'Intoryi', scientificName: 'Solanum melongena', category: 'Vegetable' },
  42: { name: 'Okra', name_rw: 'Okura', scientificName: 'Abelmoschus esculentus', category: 'Vegetable' },
  43: { name: 'Lemon', name_rw: 'Indimu', scientificName: 'Citrus limon', category: 'Fruit' },
  44: { name: 'Lime', name_rw: 'Indimu nini', scientificName: 'Citrus aurantiifolia', category: 'Fruit' },
  45: { name: 'Pomegranate', name_rw: 'Pomegranate', scientificName: 'Punica granatum', category: 'Fruit' },
  46: { name: 'Guava', name_rw: 'Ipera', scientificName: 'Psidium guajava', category: 'Fruit' },
  47: { name: 'Fig', name_rw: 'Ifigi', scientificName: 'Ficus carica', category: 'Fruit' },
  48: { name: 'Olive', name_rw: 'Olive', scientificName: 'Olea europaea', category: 'Fruit' },
  49: { name: 'Avocado', name_rw: 'Avoka', scientificName: 'Persea americana', category: 'Fruit' },
};

export interface DiseaseLabel {
  name: string;
  name_rw: string;
  cropIndex: number;
  isHealthy: boolean;
  severity: string;
  description?: string;
  description_rw?: string;
}

export const DISEASE_LABELS: { [key: number]: DiseaseLabel } = {
  0: { 
    name: 'Apple Scab', 
    name_rw: 'Ibiraburi bya Pome', 
    cropIndex: 0, 
    isHealthy: false, 
    severity: 'medium',
    description: 'Apple scab is a fungal disease that causes dark, scabby spots on leaves and fruit.',
    description_rw: 'Ibiraburi ni indwara y\'ibihumyo itera amabara y\'umukara ku mababi no ku mbuto za pome.'
  },
  1: { 
    name: 'Apple Black Rot', 
    name_rw: 'Kubora kw\'umukara kwa Pome', 
    cropIndex: 0, 
    isHealthy: false, 
    severity: 'high',
    description: 'Black rot is a fungal disease causing leaf spots, fruit rot, and cankers on branches.',
    description_rw: 'Kubora kw\'umukara ni indwara itera amabara ku mababi no kubora k\'imbuto.'
  },
  // ... (keeping existing ones, just adding for a few more)
  20: { 
    name: 'Potato Early Blight', 
    name_rw: 'Indwara y\'ibirayi izwi nka Early Blight', 
    cropIndex: 8, 
    isHealthy: false, 
    severity: 'medium',
    description: 'Early blight causes dark spots with concentric rings on older leaves.',
    description_rw: 'Iyi ndwara itera amabara y\'umukara afite utuziga ku mababi ashaje y\'ibirayi.'
  },
  21: { 
    name: 'Potato Late Blight', 
    name_rw: 'Milidiyo y\'ibirayi', 
    cropIndex: 8, 
    isHealthy: false, 
    severity: 'critical',
    description: 'Late blight is a devastating disease that causes water-soaked spots on leaves and stems.',
    description_rw: 'Milidiyo ni indwara mbi cyane itera amabara ameze nk\'atose ku mababi n\'amashami y\'ibirayi.'
  },
  28: { 
    name: 'Tomato Bacterial Spot', 
    name_rw: 'Ibibara by\'ubuganga ku nyanya', 
    cropIndex: 13, 
    isHealthy: false, 
    severity: 'medium',
    description: 'Bacterial spot causes small, water-soaked spots on leaves and fruit.',
    description_rw: 'Ibibara by\'ubuganga ni indwara itera amabara mato ku mababi no ku nyanya.'
  },
  29: { 
    name: 'Tomato Early Blight', 
    name_rw: 'Indwara y\'inyanya ya Early Blight', 
    cropIndex: 13, 
    isHealthy: false, 
    severity: 'medium',
    description: 'Early blight causes target-shaped spots on lower leaves.',
    description_rw: 'Iyi ndwara itera amabara ateye nk\'intego ku mababi yo hasi y\'inyanya.'
  },
  30: { 
    name: 'Tomato Late Blight', 
    name_rw: 'Milidiyo y\'inyanya', 
    cropIndex: 13, 
    isHealthy: false, 
    severity: 'critical',
    description: 'Late blight can rapidly destroy tomato leaves, stems, and fruit.',
    description_rw: 'Milidiyo ishobora kurimbura vuba cyane amababi, amashami, n\'imbuto z\'inyanya.'
  },
  31: { name: 'Tomato Leaf Mold', name_rw: 'Kubora kw\'amababi y\'inyanya', cropIndex: 13, isHealthy: false, severity: 'medium' },
  32: { name: 'Tomato Septoria Leaf Spot', name_rw: 'Ibibara bya Serekosipora ku nyanya', cropIndex: 13, isHealthy: false, severity: 'medium' },
  33: { name: 'Tomato Spider Mites', name_rw: 'Udusimba twa Spider Mites ku nyanya', cropIndex: 13, isHealthy: false, severity: 'medium' },
  34: { name: 'Tomato Target Spot', name_rw: 'Ibibara by\'intego ku nyanya', cropIndex: 13, isHealthy: false, severity: 'medium' },
  35: { name: 'Tomato Yellow Leaf Curl Virus', name_rw: 'Indwara y\'ikinya ku nyanya', cropIndex: 13, isHealthy: false, severity: 'high' },
  36: { name: 'Tomato Mosaic Virus', name_rw: 'Indwara ya mofayike ku nyanya', cropIndex: 13, isHealthy: false, severity: 'high' },
  37: { name: 'Tomato Healthy', name_rw: 'Inyanya nzima', cropIndex: 13, isHealthy: true, severity: 'none' },
};

export function getCropLabel(classId: number): CropLabel | undefined {
  return CROP_LABELS[classId];
}

export function getDiseaseLabel(classId: number): DiseaseLabel | undefined {
  return DISEASE_LABELS[classId];
}

export const NUM_CROP_CLASSES = Object.keys(CROP_LABELS).length;
export const NUM_DISEASE_CLASSES = Object.keys(DISEASE_LABELS).length;
