// Treatment database seed data
// Based on agricultural extension resources and PlantVillage dataset

export interface TreatmentData {
  name: string;
  name_rw?: string;
  type: 'organic' | 'chemical';
  description: string;
  description_rw?: string;
  applicationMethod: string;
  applicationMethod_rw?: string;
  dosage: string;
  dosage_rw?: string;
  frequency?: string;
  frequency_rw?: string;
  precautions: string[];
  precautions_rw?: string[];
  effectiveness: 'low' | 'medium' | 'high';
  costLevel?: 'low' | 'medium' | 'high';
}

export interface DiseaseData {
  name: string;
  name_rw?: string;
  scientificName?: string;
  description: string;
  description_rw?: string;
  symptoms: string[];
  symptoms_rw?: string[];
  causes?: string;
  causes_rw?: string;
  prevention?: string;
  prevention_rw?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isHealthy: boolean;
  treatments: TreatmentData[];
}

export interface CropData {
  name: string;
  name_rw?: string;
  scientificName: string;
  category: string;
  description: string;
  description_rw?: string;
  growingTips?: string;
  growingTips_rw?: string;
  diseases: DiseaseData[];
}

export const SEED_DATA: CropData[] = [
  {
    name: 'Tomato',
    name_rw: 'Inyanya',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetable',
    description: 'One of the most widely grown vegetables, susceptible to various fungal and viral diseases.',
    description_rw: 'Kimwe mu mboga zihingwa cyane, cyibasirwa n\'indwara zitandukanye ziterwa n\'imiyege n\'avirusi.',
    growingTips: 'Needs full sun, regular watering, and support for vines. Avoid overhead watering to prevent disease.',
    growingTips_rw: 'Ikenera izuba ryinshi, kuvomerwa buri gihe, n\'inkunga y\'inganzu. Irinde kuvomera hejuru kugira ngo wirinde indwara.',
    diseases: [
      {
        name: 'Healthy',
        name_rw: 'Nta ndwara',
        description: 'The plant shows no signs of disease and is in optimal condition.',
        description_rw: 'Igihingwa nticyerekana ibimenyetso by\'indwara kandi kimeze neza cyane.',
        symptoms: ['Vibrant green leaves', 'Strong stems', 'Normal fruit development'],
        symptoms_rw: ['Amababi y\'icyatsi kibisi', 'Inshinge zikomeye', 'Iterambere ryiza ry\'imbuto'],
        severity: 'low',
        isHealthy: true,
        treatments: [],
      },
      {
        name: 'Early Blight',
        name_rw: 'Indwara ya Early Blight',
        scientificName: 'Alternaria solani',
        description: 'Fungal disease causing dark spots with concentric rings on leaves.',
        description_rw: 'Indwara iterwa n\'imiyege itera ibibara by\'umukara bifite imirongo ku mababi.',
        symptoms: [
          'Dark brown spots with concentric rings',
          'Yellowing around spots',
          'Lower leaves affected first',
          'Leaf drop',
        ],
        symptoms_rw: [
          'Ibibara by\'ikigina n\'imirongo',
          'Umuhondo hirya y\'ibibara',
          'Amababi yo hasi niyo abanza gufatwa',
          'Amababi akurunguruka',
        ],
        causes: 'Fungus spreads through infected plant debris and water splash.',
        causes_rw: 'Umuuyege ukwirakwizwa n\'ibisigazwa by\'ibimera byanduye n\'amazi asatira.',
        prevention: 'Crop rotation, mulching, avoid overhead watering, remove infected leaves.',
        prevention_rw: 'Guhindura ibihingwa, gusasira, kwirinda kuvomera hejuru, gukuraho amababi yanduye.',
        severity: 'medium',
        isHealthy: false,
        treatments: [
          {
            name: 'Neem Oil Spray',
            name_rw: 'Umubavu w\'amavuta ya Neem',
            type: 'organic',
            description: 'Natural fungicide from neem tree seeds',
            description_rw: 'Umuti wicira imiyege ukomoka ku mbuto z\'igiti cya neem',
            applicationMethod: 'Spray on affected leaves, covering both surfaces',
            applicationMethod_rw: 'Tera ku mababi yafashwe, ugeze ku mpande zombi',
            dosage: '2-4 tablespoons per gallon of water',
            dosage_rw: 'Ikiyiko 2-4 kuri litiro 4 z\'amazi',
            frequency: 'Every 7-14 days',
            frequency_rw: 'Buri minsi 7-14',
            precautions: ['Avoid spraying in direct sunlight', 'Test on small area first'],
            precautions_rw: ['Irinde gutera mu zuba ryinshi', 'Banza ugerageze ku gace gato'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Copper Fungicide',
            type: 'organic',
            description: 'Copper-based spray for fungal prevention',
            applicationMethod: 'Apply as preventive spray or at first signs',
            dosage: '1-4 tablespoons per gallon per label',
            frequency: 'Weekly during wet conditions',
            precautions: ['Can build up in soil', 'Avoid during hot weather'],
            effectiveness: 'high',
            costLevel: 'medium',
          },
          {
            name: 'Chlorothalonil',
            type: 'chemical',
            description: 'Broad-spectrum contact fungicide',
            applicationMethod: 'Spray every 7-10 days during disease pressure',
            dosage: 'Follow manufacturer label',
            frequency: 'Every 7-10 days',
            precautions: [
              'Wear protective equipment',
              'Keep away from water sources',
              'Observe pre-harvest interval',
            ],
            effectiveness: 'high',
            costLevel: 'medium',
          },
        ],
      },
      {
        name: 'Late Blight',
        scientificName: 'Phytophthora infestans',
        description: 'Devastating disease that caused the Irish Potato Famine. Spreads rapidly in cool, wet conditions.',
        symptoms: [
          'Water-soaked lesions on leaves',
          'White fuzzy growth on leaf undersides',
          'Brown/black blotches on stems',
          'Rapid plant death',
        ],
        causes: 'Oomycete pathogen thrives in cool, humid conditions.',
        prevention: 'Plant resistant varieties, ensure air circulation, avoid overhead irrigation.',
        severity: 'critical',
        isHealthy: false,
        treatments: [
          {
            name: 'Remove Infected Plants',
            type: 'organic',
            description: 'Immediately remove and destroy infected plants',
            applicationMethod: 'Bag and dispose of infected material, do not compost',
            dosage: 'N/A',
            precautions: ['Do not compost infected material', 'Sanitize tools'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Copper Hydroxide',
            type: 'organic',
            description: 'Preventive copper fungicide',
            applicationMethod: 'Apply before disease appears or at first sign',
            dosage: 'Per label instructions',
            frequency: 'Every 5-7 days during wet weather',
            precautions: ['Apply before rain', 'Reapply after heavy rain'],
            effectiveness: 'medium',
            costLevel: 'medium',
          },
          {
            name: 'Mefenoxam + Chlorothalonil',
            type: 'chemical',
            description: 'Systemic plus contact fungicide combination',
            applicationMethod: 'Spray at first sign of disease',
            dosage: 'Per manufacturer instructions',
            frequency: 'Every 7-14 days',
            precautions: [
              'Rotate with other fungicides',
              'PPE required',
              'Follow label intervals',
            ],
            effectiveness: 'high',
            costLevel: 'high',
          },
        ],
      },
      {
        name: 'Bacterial Spot',
        scientificName: 'Xanthomonas campestris',
        description: 'Bacterial disease causing leaf spots and fruit lesions.',
        symptoms: [
          'Small, dark, water-soaked spots',
          'Spots may have yellow halos',
          'Raised scabby spots on fruit',
          'Leaf distortion',
        ],
        causes: 'Bacteria spread by water splash, infected seeds, and transplants.',
        prevention: 'Use disease-free seeds, avoid overhead watering, crop rotation.',
        severity: 'medium',
        isHealthy: false,
        treatments: [
          {
            name: 'Copper-based Bactericide',
            type: 'organic',
            description: 'Copper compounds for bacterial control',
            applicationMethod: 'Apply at first sign of disease',
            dosage: 'Per label recommendations',
            frequency: 'Every 7-10 days',
            precautions: ['May cause phytotoxicity in hot weather', 'Limit applications'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Streptomycin',
            type: 'chemical',
            description: 'Antibiotic for bacterial diseases',
            applicationMethod: 'Spray at transplanting and early growth',
            dosage: 'Per label',
            frequency: 'Every 5-7 days during infection period',
            precautions: [
              'Resistance can develop',
              'Not for use near harvest',
              'Check local regulations',
            ],
            effectiveness: 'high',
            costLevel: 'medium',
          },
        ],
      },
      {
        name: 'Leaf Mold',
        scientificName: 'Passalora fulva',
        description: 'Fungal disease primarily affecting greenhouse tomatoes.',
        symptoms: [
          'Pale green to yellow spots on upper leaf',
          'Olive-green to brown velvety growth on underside',
          'Leaves curl and drop',
        ],
        causes: 'High humidity and poor air circulation.',
        prevention: 'Improve ventilation, reduce humidity, resistant varieties.',
        severity: 'medium',
        isHealthy: false,
        treatments: [
          {
            name: 'Improve Ventilation',
            type: 'organic',
            description: 'Increase airflow around plants',
            applicationMethod: 'Prune lower leaves, space plants wider',
            dosage: 'N/A',
            precautions: ['Sanitize pruning tools'],
            effectiveness: 'high',
            costLevel: 'low',
          },
          {
            name: 'Potassium Bicarbonate',
            type: 'organic',
            description: 'Contact fungicide safe for food crops',
            applicationMethod: 'Spray on affected foliage',
            dosage: '1-2 tablespoons per gallon',
            frequency: 'Weekly',
            precautions: ['May require repeat applications'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
        ],
      },
      {
        name: 'Septoria Leaf Spot',
        scientificName: 'Septoria lycopersici',
        description: 'Common fungal disease causing numerous small spots on leaves.',
        symptoms: [
          'Small circular spots with dark borders',
          'Tan/gray centers with dark specks',
          'Lower leaves affected first',
          'Severe defoliation possible',
        ],
        causes: 'Fungal spores spread by rain splash and wind.',
        prevention: 'Mulching, crop rotation, avoid overhead watering.',
        severity: 'medium',
        isHealthy: false,
        treatments: [
          {
            name: 'Baking Soda Spray',
            type: 'organic',
            description: 'Home remedy creating unfavorable pH for fungus',
            applicationMethod: 'Spray on leaves weekly',
            dosage: '1 tbsp baking soda + 1 tsp liquid soap per gallon',
            frequency: 'Weekly',
            precautions: ['Too much can harm plants', 'Test first'],
            effectiveness: 'low',
            costLevel: 'low',
          },
          {
            name: 'Chlorothalonil',
            type: 'chemical',
            description: 'Protective fungicide',
            applicationMethod: 'Apply before disease appears or at first sign',
            dosage: 'Per label',
            frequency: 'Every 7-14 days',
            precautions: ['Wear PPE', 'Follow pre-harvest interval'],
            effectiveness: 'high',
            costLevel: 'medium',
          },
        ],
      },
      {
        name: 'Yellow Leaf Curl Virus',
        scientificName: 'Tomato yellow leaf curl virus (TYLCV)',
        description: 'Viral disease transmitted by whiteflies causing severe yield loss.',
        symptoms: [
          'Upward curling of leaf margins',
          'Yellowing of leaves',
          'Stunted growth',
          'Reduced fruit production',
        ],
        causes: 'Transmitted by silverleaf whitefly (Bemisia tabaci).',
        prevention: 'Control whiteflies, use reflective mulches, plant resistant varieties.',
        severity: 'high',
        isHealthy: false,
        treatments: [
          {
            name: 'Whitefly Control - Insecticidal Soap',
            type: 'organic',
            description: 'Control vector to prevent spread',
            applicationMethod: 'Spray on whitefly populations',
            dosage: 'Per label, usually 2% solution',
            frequency: 'Every 5-7 days',
            precautions: ['Direct contact required', 'May need multiple applications'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Remove Infected Plants',
            type: 'organic',
            description: 'No cure exists - remove infected plants',
            applicationMethod: 'Remove and destroy infected plants promptly',
            dosage: 'N/A',
            precautions: ['Bag before removing to avoid spreading whiteflies'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Imidacloprid',
            type: 'chemical',
            description: 'Systemic insecticide for whitefly control',
            applicationMethod: 'Soil drench or foliar spray',
            dosage: 'Per label instructions',
            frequency: 'As needed for whitefly control',
            precautions: [
              'Toxic to bees - avoid bloom time',
              'Systemic residues',
              'Follow label restrictions',
            ],
            effectiveness: 'high',
            costLevel: 'medium',
          },
        ],
      },
    ],
  },
  {
    name: 'Apple',
    scientificName: 'Malus domestica',
    category: 'Fruit',
    description: 'Popular fruit tree susceptible to scab, fire blight, and cedar apple rust.',
    growingTips: 'Requires winter chill hours. Prune annually for best production and disease prevention.',
    diseases: [
      {
        name: 'Healthy',
        description: 'Tree shows no signs of disease with healthy foliage and fruit.',
        symptoms: ['Clean, green leaves', 'No spots or lesions', 'Normal fruit development'],
        severity: 'low',
        isHealthy: true,
        treatments: [],
      },
      {
        name: 'Apple Scab',
        scientificName: 'Venturia inaequalis',
        description: 'Most common apple disease causing olive-colored spots on leaves and fruit.',
        symptoms: [
          'Olive-green velvety spots on leaves',
          'Spots turn brown and may crack',
          'Scabby lesions on fruit',
          'Premature leaf drop',
        ],
        causes: 'Fungus overwinters in fallen leaves, spreads in spring rains.',
        prevention: 'Remove fallen leaves, plant resistant varieties, proper spacing.',
        severity: 'medium',
        isHealthy: false,
        treatments: [
          {
            name: 'Sulfur Spray',
            type: 'organic',
            description: 'Traditional fungicide for scab prevention',
            applicationMethod: 'Apply from green tip through petal fall',
            dosage: 'Per label, usually lime-sulfur or wettable sulfur',
            frequency: 'Every 7-10 days during wet spring',
            precautions: ['Do not use with oil sprays', 'Can cause russeting'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Captan',
            type: 'chemical',
            description: 'Protectant fungicide for scab',
            applicationMethod: 'Apply on 7-10 day schedule',
            dosage: 'Per label instructions',
            frequency: 'Every 7-10 days',
            precautions: ['Avoid application near harvest', 'PPE required'],
            effectiveness: 'high',
            costLevel: 'medium',
          },
        ],
      },
      {
        name: 'Black Rot',
        scientificName: 'Botryosphaeria obtusa',
        description: 'Fungal disease affecting leaves, fruit, and branches.',
        symptoms: [
          'Frogeye leaf spots (tan centers, purple margins)',
          'Black rotting on fruit',
          'Cankers on branches',
          'Mummified fruit',
        ],
        causes: 'Fungus overwinters in mummified fruit and cankers.',
        prevention: 'Remove mummies and cankers, improve air circulation.',
        severity: 'high',
        isHealthy: false,
        treatments: [
          {
            name: 'Sanitation',
            type: 'organic',
            description: 'Remove and destroy infected material',
            applicationMethod: 'Prune cankers 6-8 inches below visible infection',
            dosage: 'N/A',
            precautions: ['Sterilize tools between cuts', 'Destroy prunings'],
            effectiveness: 'high',
            costLevel: 'low',
          },
          {
            name: 'Captan + Myclobutanil',
            type: 'chemical',
            description: 'Combination of protectant and systemic fungicide',
            applicationMethod: 'Apply during primary infection period',
            dosage: 'Per label',
            frequency: 'Every 10-14 days',
            precautions: ['Follow all label directions', 'Observe PHI'],
            effectiveness: 'high',
            costLevel: 'high',
          },
        ],
      },
      {
        name: 'Cedar Apple Rust',
        scientificName: 'Gymnosporangium juniperi-virginianae',
        description: 'Rust disease requiring both apple and juniper hosts to complete life cycle.',
        symptoms: [
          'Bright orange spots on leaves',
          'Spots develop tube-like projections underneath',
          'Fruit may show raised rings',
          'Premature defoliation',
        ],
        causes: 'Fungus alternates between apple and juniper/cedar hosts.',
        prevention: 'Remove nearby junipers within 500ft if possible, plant resistant varieties.',
        severity: 'medium',
        isHealthy: false,
        treatments: [
          {
            name: 'Remove Juniper Galls',
            type: 'organic',
            description: 'Break the disease cycle by removing galls from nearby junipers',
            applicationMethod: 'Remove orange gelatinous galls from junipers in early spring',
            dosage: 'N/A',
            precautions: ['Must be done before spore release'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Myclobutanil',
            type: 'chemical',
            description: 'Systemic fungicide effective against rusts',
            applicationMethod: 'Apply from pink bud through cover sprays',
            dosage: 'Per label',
            frequency: 'Every 7-14 days during infection period',
            precautions: ['Resistance management important', 'Follow label'],
            effectiveness: 'high',
            costLevel: 'medium',
          },
        ],
      },
    ],
  },
  {
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    category: 'Vegetable',
    description: 'Important staple crop susceptible to early and late blight.',
    growingTips: 'Plant in well-drained soil, hill soil around stems, avoid wet conditions.',
    diseases: [
      {
        name: 'Healthy',
        description: 'Plant is disease-free with normal growth.',
        symptoms: ['Healthy green foliage', 'Strong stems', 'Normal tuber development'],
        severity: 'low',
        isHealthy: true,
        treatments: [],
      },
      {
        name: 'Early Blight',
        scientificName: 'Alternaria solani',
        description: 'Fungal disease similar to tomato early blight.',
        symptoms: [
          'Brown spots with concentric rings (target spots)',
          'Lower leaves affected first',
          'Yellowing and leaf drop',
        ],
        causes: 'Same pathogen as tomato early blight.',
        prevention: 'Crop rotation (3+ years), certified seed, adequate fertility.',
        severity: 'medium',
        isHealthy: false,
        treatments: [
          {
            name: 'Copper Fungicide',
            type: 'organic',
            description: 'Preventive spray for early blight',
            applicationMethod: 'Apply before symptoms appear',
            dosage: 'Per label',
            frequency: 'Every 7-10 days',
            precautions: ['Avoid excessive applications'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Azoxystrobin',
            type: 'chemical',
            description: 'Strobilurin fungicide with protectant and curative activity',
            applicationMethod: 'Apply at first sign or preventively',
            dosage: 'Per label instructions',
            frequency: 'Every 7-14 days',
            precautions: ['Rotate with other modes of action', 'Follow PHI'],
            effectiveness: 'high',
            costLevel: 'medium',
          },
        ],
      },
      {
        name: 'Late Blight',
        scientificName: 'Phytophthora infestans',
        description: 'The disease that caused the Irish Potato Famine - highly destructive.',
        symptoms: [
          'Water-soaked lesions on leaves',
          'White mold on leaf undersides',
          'Stem lesions',
          'Rapid plant death in cool, wet weather',
        ],
        causes: 'Oomycete spreads rapidly in cool, humid conditions.',
        prevention: 'Plant certified seed, destroy cull piles, monitor weather forecasts.',
        severity: 'critical',
        isHealthy: false,
        treatments: [
          {
            name: 'Destroy Infected Plants',
            type: 'organic',
            description: 'Remove infected plants immediately',
            applicationMethod: 'Bag and remove, vine kill before harvest if infected',
            dosage: 'N/A',
            precautions: ['Do not compost', 'Clean equipment'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Cymoxanil + Mancozeb',
            type: 'chemical',
            description: 'Curative and protectant combination',
            applicationMethod: 'Apply at first detection',
            dosage: 'Per label',
            frequency: 'Every 5-7 days during outbreaks',
            precautions: ['Wear full PPE', 'Mandatory under some regulations'],
            effectiveness: 'high',
            costLevel: 'high',
          },
        ],
      },
    ],
  },
  {
    name: 'Grape',
    scientificName: 'Vitis vinifera',
    category: 'Fruit',
    description: 'Vine crop used for wine, juice, and fresh eating. Susceptible to various fungal diseases.',
    growingTips: 'Good air circulation essential. Train vines properly and prune annually.',
    diseases: [
      {
        name: 'Healthy',
        description: 'Vines are disease-free with healthy growth.',
        symptoms: ['Green leaves', 'Proper fruit set', 'No spots or lesions'],
        severity: 'low',
        isHealthy: true,
        treatments: [],
      },
      {
        name: 'Black Rot',
        scientificName: 'Guignardia bidwellii',
        description: 'Devastating fungal disease that can destroy entire grape crop.',
        symptoms: [
          'Tan spots with dark borders on leaves',
          'Fruit turns brown, shrivels to hard mummies',
          'Black pycnidia visible on mummies',
        ],
        causes: 'Fungus overwinters in mummified fruit.',
        prevention: 'Remove all mummies, good canopy management, sanitation.',
        severity: 'high',
        isHealthy: false,
        treatments: [
          {
            name: 'Mummy Removal',
            type: 'organic',
            description: 'Remove and destroy all mummified fruit',
            applicationMethod: 'Collect and burn or bury deeply',
            dosage: 'N/A',
            frequency: 'Before bud break',
            precautions: ['Must remove all mummies'],
            effectiveness: 'high',
            costLevel: 'low',
          },
          {
            name: 'Mancozeb',
            type: 'chemical',
            description: 'Protectant fungicide',
            applicationMethod: 'Apply from early shoot growth through veraison',
            dosage: 'Per label',
            frequency: 'Every 7-14 days',
            precautions: ['66-day PHI', 'Wear PPE'],
            effectiveness: 'high',
            costLevel: 'low',
          },
        ],
      },
      {
        name: 'Esca (Black Measles)',
        scientificName: 'Phaeomoniella chlamydospora complex',
        description: 'Complex trunk disease affecting mature vines.',
        symptoms: [
          'Tiger stripe pattern on leaves',
          'Dark spotting on berries',
          'Vine decline and death',
          'Internal wood necrosis',
        ],
        causes: 'Multiple fungi colonizing wood, enters through pruning wounds.',
        prevention: 'Delay pruning until late winter, protect wounds, avoid stress.',
        severity: 'high',
        isHealthy: false,
        treatments: [
          {
            name: 'Pruning Wound Protection',
            type: 'organic',
            description: 'Apply wound sealant after pruning',
            applicationMethod: 'Paint or spray on fresh pruning cuts',
            dosage: 'Cover wound completely',
            precautions: ['Apply immediately after pruning'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Trunk Renewal',
            type: 'organic',
            description: 'Train new trunk from sucker',
            applicationMethod: 'Select healthy sucker and train as replacement trunk',
            dosage: 'N/A',
            precautions: ['Multi-year process'],
            effectiveness: 'high',
            costLevel: 'medium',
          },
        ],
      },
      {
        name: 'Leaf Blight',
        scientificName: 'Isariopsis leaf spot',
        description: 'Fungal disease causing necrotic lesions on leaves.',
        symptoms: [
          'Irregular brown spots',
          'Necrotic areas on leaves',
          'Premature defoliation',
        ],
        causes: 'Fungal pathogen favored by humid conditions.',
        prevention: 'Good air circulation, remove infected leaves.',
        severity: 'medium',
        isHealthy: false,
        treatments: [
          {
            name: 'Improve Canopy Management',
            type: 'organic',
            description: 'Open canopy to improve air flow',
            applicationMethod: 'Leaf pulling and shoot positioning',
            dosage: 'N/A',
            precautions: ['Avoid excessive leaf removal'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Copper Spray',
            type: 'organic',
            description: 'Copper fungicide application',
            applicationMethod: 'Apply during growing season',
            dosage: 'Per label',
            frequency: 'Every 10-14 days',
            precautions: ['Can accumulate in vineyard soils'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
        ],
      },
    ],
  },
  {
    name: 'Corn (Maize)',
    scientificName: 'Zea mays',
    category: 'Grain',
    description: 'Major grain crop susceptible to various foliar diseases.',
    growingTips: 'Plant in blocks for pollination. Needs full sun and consistent moisture.',
    diseases: [
      {
        name: 'Healthy',
        description: 'Plants are healthy with normal development.',
        symptoms: ['Green leaves', 'Strong stalks', 'Normal ear development'],
        severity: 'low',
        isHealthy: true,
        treatments: [],
      },
      {
        name: 'Northern Leaf Blight',
        scientificName: 'Exserohilum turcicum',
        description: 'Major foliar disease of corn in temperate regions.',
        symptoms: [
          'Long, elliptical gray-green lesions',
          'Lesions can be 1-6 inches long',
          'May coalesce and kill leaves',
        ],
        causes: 'Fungus survives on corn debris, favored by moderate temperatures and humidity.',
        prevention: 'Resistant hybrids, crop rotation, residue management.',
        severity: 'high',
        isHealthy: false,
        treatments: [
          {
            name: 'Crop Rotation',
            type: 'organic',
            description: 'Rotate to non-host crops',
            applicationMethod: 'Plant soybeans or other non-grass crops',
            dosage: 'At least 1 year rotation',
            precautions: ['Check neighboring fields for inoculum'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Azoxystrobin + Propiconazole',
            type: 'chemical',
            description: 'Combination fungicide for foliar diseases',
            applicationMethod: 'Apply at tasseling if disease present',
            dosage: 'Per label',
            frequency: 'Usually single application',
            precautions: ['Economics depend on yield potential and disease pressure'],
            effectiveness: 'high',
            costLevel: 'high',
          },
        ],
      },
      {
        name: 'Common Rust',
        scientificName: 'Puccinia sorghi',
        description: 'Rust disease common in sweet corn and dent corn.',
        symptoms: [
          'Reddish-brown pustules on both leaf surfaces',
          'Pustules burst releasing spores',
          'Severe infection causes yellowing',
        ],
        causes: 'Spores blown in from southern regions, cannot overwinter in cold climates.',
        prevention: 'Resistant varieties, early planting.',
        severity: 'medium',
        isHealthy: false,
        treatments: [
          {
            name: 'Resistant Varieties',
            type: 'organic',
            description: 'Plant rust-resistant hybrids',
            applicationMethod: 'Select at planting time',
            dosage: 'N/A',
            precautions: ['Check regional disease pressure'],
            effectiveness: 'high',
            costLevel: 'low',
          },
          {
            name: 'Propiconazole',
            type: 'chemical',
            description: 'Triazole fungicide for rust control',
            applicationMethod: 'Apply when rust first appears',
            dosage: 'Per label',
            frequency: 'May need repeat application',
            precautions: ['Timing is critical', 'Follow PHI'],
            effectiveness: 'high',
            costLevel: 'medium',
          },
        ],
      },
      {
        name: 'Cercospora Leaf Spot',
        scientificName: 'Cercospora zeae-maydis',
        description: 'Gray leaf spot - serious disease in humid regions.',
        symptoms: [
          'Rectangular gray lesions parallel to veins',
          'Lesions have sharp, linear margins',
          'Can coalesce killing entire leaves',
        ],
        causes: 'Fungus survives in crop residue, favors extended leaf wetness.',
        prevention: 'Resistant hybrids, tillage of residue, crop rotation.',
        severity: 'medium',
        isHealthy: false,
        treatments: [
          {
            name: 'Residue Management',
            type: 'organic',
            description: 'Bury or decompose corn residue',
            applicationMethod: 'Tillage or rotation to accelerate breakdown',
            dosage: 'N/A',
            precautions: ['Balance with soil conservation needs'],
            effectiveness: 'medium',
            costLevel: 'low',
          },
          {
            name: 'Trifloxystrobin',
            type: 'chemical',
            description: 'Strobilurin fungicide',
            applicationMethod: 'Apply at VT-R1 growth stage',
            dosage: 'Per label',
            frequency: 'Usually single application',
            precautions: ['Apply before severe infection'],
            effectiveness: 'high',
            costLevel: 'medium',
          },
        ],
      },
    ],
  },
];

// Function to get all crops
export function getAllCrops(): CropData[] {
  return SEED_DATA;
}

// Function to get crop by name
export function getCropByName(name: string): CropData | undefined {
  return SEED_DATA.find(crop => crop.name.toLowerCase() === name.toLowerCase());
}

// Function to get diseases for a crop
export function getDiseasesForCrop(cropName: string): DiseaseData[] {
  const crop = getCropByName(cropName);
  return crop?.diseases || [];
}

// Function to get treatments for a disease
export function getTreatmentsForDisease(cropName: string, diseaseName: string): TreatmentData[] {
  const diseases = getDiseasesForCrop(cropName);
  const disease = diseases.find(d => d.name.toLowerCase() === diseaseName.toLowerCase());
  return disease?.treatments || [];
}
