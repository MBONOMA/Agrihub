import React, { createContext, useContext, useState, ReactNode } from 'react';

type Translations = {
  [key: string]: string;
};

type Languages = {
  [key: string]: Translations;
};

const languages: Languages = {
  en: {
    'app.name': 'AgriHub',
    'scan.tab': 'Scan',
    'browse.tab': 'Browse',
    'history.tab': 'History',
    'settings.tab': 'Settings',
    'camera.access': 'Camera Access',
    'camera.needed': 'AgriHub needs camera access to scan plant leaves for disease detection.',
    'grant.permission': 'Grant Permission',
    'preview': 'Preview',
    'preview.subtitle': 'Analyzing leaf health...',
    'retake': 'Retake',
    'analyze': 'Analyze',
    'analyzing': 'Analyzing...',
    'guide.text': 'Align leaf within the frame',
    'match': 'Match',
    'live': 'Live',
    'manual': 'Manual',
    'history.empty': 'No scan history yet',
    'scan.results': 'Scan Results',
    'crop.type': 'Crop Type',
    'disease.detected': 'Disease Detected',
    'healthy': 'Healthy',
    'confidence': 'Confidence',
    'severity': 'Severity',
    'treatment': 'Treatment',
    'developer.section': 'Developer',
    'clear.history': 'Clear History',
    'clear.history.confirm': 'Are you sure you want to clear all scan history?',
    'clear.success': 'History cleared successfully',
    'features': 'Features',
    'feature.offline': '100% Offline',
    'feature.offline.desc': 'No internet needed',
    'feature.fast': 'Fast Detection',
    'feature.fast.desc': 'Results in seconds',
    'feature.tips': 'Treatment Tips',
    'feature.tips.desc': 'Organic & chemical',
    'feature.crops': '50+ Crops',
    'feature.crops.desc': 'Wide coverage',
    'tips.title': 'Tips for Best Results',
    'tip.lighting': 'Ensure good lighting on the leaf',
    'tip.focus': 'Focus on a single leaf',
    'tip.frame': 'Fill the frame with the leaf',
    'tip.steady': 'Keep the camera steady',
    'identified.crop': 'Identified Crop',
    'disease.detection': 'Disease Detection',
    'symptoms': 'Symptoms',
    'cause': 'Cause',
    'healthy.msg': 'Great news!',
    'healthy.subtitle': 'Your plant looks healthy and shows no signs of disease.',
    'treatment.recommendations': 'Treatment Recommendations',
    'organic': 'Organic',
    'chemical': 'Chemical',
    'application': 'Application',
    'dosage': 'Dosage',
    'frequency': 'Frequency',
    'precautions': 'Precautions',
    'scan.another': 'Scan Another',
    'go.home': 'Go Home',
  },
  rw: {
    'app.name': 'AgriHub',
    'scan.tab': 'Sikana',
    'browse.tab': 'Shakisha',
    'history.tab': 'Amateka',
    'settings.tab': 'Igenamiterere',
    'camera.access': 'Uburenganzira bwa Kamera',
    'camera.needed': 'AgriHub ikenera uburenganzira bwa kamera kugira ngo isikane amababi y\'ibihingwa.',
    'grant.permission': 'Tanga Uburenganzira',
    'preview': 'Irebere',
    'preview.subtitle': 'Gusuzuma ubuzima bw\'ibabi...',
    'retake': 'Ongera ufotore',
    'analyze': 'Suzuma',
    'analyzing': 'Gusuzuma...',
    'guide.text': 'Shyira ibabi mu ruziga',
    'match': 'Bihuye',
    'live': 'Ako kanya',
    'manual': 'Intoke',
    'history.empty': 'Nta mateka yo gusikana arahari',
    'scan.results': 'Ibyavuye mu isuzuma',
    'crop.type': 'Ubwoko bw\'igihingwa',
    'disease.detected': 'Indwara yabonetse',
    'healthy': 'Nta ndwara',
    'confidence': 'Icyizere',
    'severity': 'Ubukana',
    'treatment': 'Uburyo bwo kuvura',
    'developer.section': 'Abakoze porogaramu',
    'clear.history': 'Siba amateka',
    'clear.history.confirm': 'Uremeza ko ushaka gusiba amateka yose yo gusikana?',
    'clear.success': 'Amateka yasibwe neza',
    'features': 'Ibiranga porogaramu',
    'feature.offline': '100% Idakenera interineti',
    'feature.offline.desc': 'Nta nterineti ikenerwa',
    'feature.fast': 'Gusuzuma byihuse',
    'feature.fast.desc': 'Ibisubizo mu masegonda',
    'feature.tips': 'Inama zo kuvura',
    'feature.tips.desc': 'Uburyo bwa kimeza n\'imiti',
    'feature.crops': 'Ibihingwa 50+',
    'feature.crops.desc': 'Ibihingwa byinshi',
    'tips.title': 'Inama z\'ibisuzuma byiza',
    'tip.lighting': 'Emeza ko habona neza ku ibabi',
    'tip.focus': 'Shyira imbaraga ku ibabi rimwe',
    'tip.frame': 'Uzuza ibabi mu ruziga',
    'tip.steady': 'Gumya terefone itanyeganyega',
    'identified.crop': 'Igihingwa cyabonetse',
    'disease.detection': 'Indwara yabonetse',
    'symptoms': 'Ibimenyetso',
    'cause': 'Igitera indwara',
    'healthy.msg': 'Amakuru meza!',
    'healthy.subtitle': 'Igihingwa cyawe kirasa neza, nta ndwara igaragaramo.',
    'treatment.recommendations': 'Inama zo kuvura',
    'organic': 'Kimeza',
    'chemical': 'Imiti',
    'application': 'Uko bikoreshwa',
    'dosage': 'Uragereranyo',
    'frequency': 'Incuro',
    'precautions': 'Icyitonderwa',
    'scan.another': 'Sikana ikindi',
    'go.home': 'Subira ku itangiriro',
  },
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  getLabel: (obj: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return languages[language]?.[key] || key;
  };

  const getLabel = (obj: any): string => {
    if (!obj) return '';
    if (language === 'rw') {
      return obj.name_rw || obj.className_rw || obj.name || obj.className || '';
    }
    return obj.className || obj.name || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLabel }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
