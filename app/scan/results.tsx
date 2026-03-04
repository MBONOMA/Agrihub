import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../src/constants/theme';
import { Card, ConfidenceBar, Button } from '../../src/components/ui';
import { useDatabase, useLanguage } from '../../src/context';
import { TreatmentData, DiseaseData } from '../../src/database';
import { CROP_LABELS, DISEASE_LABELS } from '../../src/ml/labels';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const db = useDatabase();
  const { t, language, getLabel } = useLanguage();
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');

  const imageUri = params.imageUri as string;
  const cropName = params.cropName as string;
  const cropConfidence = parseFloat(params.cropConfidence as string);
  const diseaseName = params.diseaseName as string;
  const diseaseConfidence = parseFloat(params.diseaseConfidence as string);
  const isHealthy = params.isHealthy === 'true';
  const severity = params.severity as string;
  const inferenceTime = params.inferenceTime as string;

  // Get localized names
  const localizedCropName = useMemo(() => {
    const crop = Object.values(CROP_LABELS).find(c => c.name === cropName);
    return crop ? (language === 'rw' ? (crop.name_rw || crop.name) : crop.name) : cropName;
  }, [cropName, language]);

  const localizedDiseaseName = useMemo(() => {
    const disease = Object.values(DISEASE_LABELS).find(d => d.name === diseaseName);
    return disease ? getLabel(disease) : diseaseName;
  }, [diseaseName, language]);

  // Get real treatments from database
  const { organicTreatments, chemicalTreatments, diseaseInfo } = useMemo(() => {
    // Try exact match first: crop + disease name
    let treatments = db.getTreatmentsForDisease(cropName, diseaseName);
    let info: DiseaseData | undefined = db.getDiseaseByName(cropName, diseaseName);

    // If no match, try fuzzy search across all crops
    if (treatments.length === 0 && !isHealthy) {
      const found = db.findDisease(diseaseName);
      if (found) {
        treatments = found.disease.treatments;
        info = found.disease;
      }
    }

    return {
      organicTreatments: treatments.filter(t => t.type === 'organic'),
      chemicalTreatments: treatments.filter(t => t.type === 'chemical'),
      diseaseInfo: info,
    };
  }, [cropName, diseaseName, isHealthy]);

  const treatments = activeTab === 'organic' ? organicTreatments : chemicalTreatments;

  const handleScanAgain = () => {
    router.replace('/scan/camera');
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Image Preview */}
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="leaf" size={48} color={Colors.primary} />
          </View>
        )}
        <View style={styles.inferenceTime}>
          <Ionicons name="flash" size={14} color={Colors.textLight} />
          <Text style={styles.inferenceTimeText}>{inferenceTime}ms</Text>
        </View>
      </View>

      {/* Crop Result */}
      <Card style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={styles.resultIcon}>
            <Ionicons name="leaf" size={24} color={Colors.primary} />
          </View>
          <View style={styles.resultInfo}>
            <Text style={styles.resultLabel}>{t('identified.crop')}</Text>
            <Text style={styles.resultValue}>{localizedCropName}</Text>
          </View>
        </View>
        <ConfidenceBar confidence={cropConfidence} label={t('confidence')} />
      </Card>

      {/* Disease Result */}
      <Card style={[styles.resultCard, isHealthy ? styles.healthyCard : styles.diseasedCard]}>
        <View style={styles.resultHeader}>
          <View style={[styles.resultIcon, isHealthy ? styles.healthyIcon : styles.diseasedIcon]}>
            <Ionicons
              name={isHealthy ? 'checkmark-circle' : 'warning'}
              size={24}
              color={isHealthy ? Colors.healthy : Colors.diseased}
            />
          </View>
          <View style={styles.resultInfo}>
            <Text style={styles.resultLabel}>{t('disease.detection')}</Text>
            <Text style={styles.resultValue}>{localizedDiseaseName}</Text>
            {!isHealthy && severity && (
              <View style={styles.severityBadge}>
                <Text style={styles.severityText}>
                  {t('severity')}: {t(severity)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <ConfidenceBar confidence={diseaseConfidence} label={t('confidence')} />
      </Card>

      {/* Health Status */}
      {/* Disease Info from DB */}
      {diseaseInfo && !isHealthy && (
        <Card style={styles.resultCard}>
          <Text style={styles.sectionTitle}>{t('symptoms')}</Text>
          {(language === 'rw' && diseaseInfo.symptoms_rw ? diseaseInfo.symptoms_rw : diseaseInfo.symptoms || []).map((symptom: string, i: number) => (
            <View key={i} style={styles.symptomItem}>
              <Ionicons name="ellipse" size={6} color={Colors.primary} />
              <Text style={styles.symptomText}>{symptom}</Text>
            </View>
          ))}
          {(diseaseInfo.causes || diseaseInfo.causes_rw) && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>{t('cause')}</Text>
              <Text style={styles.causeText}>
                {language === 'rw' && diseaseInfo.causes_rw ? diseaseInfo.causes_rw : diseaseInfo.causes}
              </Text>
            </>
          )}
        </Card>
      )}

      {isHealthy ? (
        <Card style={styles.statusCard}>
          <Ionicons name="happy" size={48} color={Colors.healthy} />
          <Text style={styles.statusTitle}>{t('healthy.msg')}</Text>
          <Text style={styles.statusText}>
            {t('healthy.subtitle')}
          </Text>
        </Card>
      ) : (
        <>
          {/* Treatment Tabs */}
          <Text style={styles.sectionTitle}>{t('treatment.recommendations')}</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'organic' && styles.activeTab]}
              onPress={() => setActiveTab('organic')}
            >
              <Ionicons
                name="leaf"
                size={18}
                color={activeTab === 'organic' ? Colors.organic : Colors.textSecondary}
              />
              <Text
                style={[styles.tabText, activeTab === 'organic' && styles.activeTabText]}
              >
                {t('organic')} ({organicTreatments.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'chemical' && styles.activeTab]}
              onPress={() => setActiveTab('chemical')}
            >
              <Ionicons
                name="flask"
                size={18}
                color={activeTab === 'chemical' ? Colors.chemical : Colors.textSecondary}
              />
              <Text
                style={[styles.tabText, activeTab === 'chemical' && styles.activeTabText]}
              >
                {t('chemical')} ({chemicalTreatments.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Treatment List */}
          {treatments.length > 0 ? (
            treatments.map((treatment, index) => (
              <Card key={index} style={styles.treatmentCard}>
                <Text style={styles.treatmentName}>
                  {language === 'rw' && treatment.name_rw ? treatment.name_rw : treatment.name}
                </Text>
                <Text style={styles.treatmentDescription}>
                  {language === 'rw' && treatment.description_rw ? treatment.description_rw : treatment.description}
                </Text>

                <View style={styles.treatmentDetail}>
                  <Ionicons name="color-wand" size={16} color={Colors.primary} />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>{t('application')}</Text>
                    <Text style={styles.detailText}>
                      {language === 'rw' && treatment.applicationMethod_rw ? treatment.applicationMethod_rw : treatment.applicationMethod}
                    </Text>
                  </View>
                </View>

                <View style={styles.treatmentDetail}>
                  <Ionicons name="beaker" size={16} color={Colors.primary} />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>{t('dosage')}</Text>
                    <Text style={styles.detailText}>
                      {language === 'rw' && treatment.dosage_rw ? treatment.dosage_rw : treatment.dosage}
                    </Text>
                  </View>
                </View>

                {(treatment.frequency || treatment.frequency_rw) && (
                  <View style={styles.treatmentDetail}>
                    <Ionicons name="repeat" size={16} color={Colors.primary} />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>{t('frequency')}</Text>
                      <Text style={styles.detailText}>
                        {language === 'rw' && treatment.frequency_rw ? treatment.frequency_rw : treatment.frequency}
                      </Text>
                    </View>
                  </View>
                )}

                {((treatment.precautions && treatment.precautions.length > 0) || (treatment.precautions_rw && treatment.precautions_rw.length > 0)) && (
                  <View style={styles.precautionsContainer}>
                    <Text style={styles.precautionsTitle}>{t('precautions')}</Text>
                    {(language === 'rw' && treatment.precautions_rw ? treatment.precautions_rw : treatment.precautions || []).map((precaution: string, i: number) => (
                      <View key={i} style={styles.precautionItem}>
                        <Ionicons name="alert-circle" size={14} color={Colors.warning} />
                        <Text style={styles.precautionText}>{precaution}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.treatmentMeta}>
                  <View style={styles.effectivenessBadge}>
                    <Text style={styles.effectivenessText}>
                      {t('effectiveness')}: {language === 'rw' ? t(treatment.effectiveness) : treatment.effectiveness}
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {t('no.treatments')}
              </Text>
            </Card>
          )}

          {/* Prevention */}
          {(diseaseInfo?.prevention || diseaseInfo?.prevention_rw) && (
            <>
              <Text style={styles.sectionTitle}>{t('prevention.tips')}</Text>
              <Card>
                <Text style={styles.causeText}>
                  {language === 'rw' && diseaseInfo.prevention_rw ? diseaseInfo.prevention_rw : diseaseInfo.prevention}
                </Text>
              </Card>
            </>
          )}
        </>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={t('scan.another')}
          onPress={handleScanAgain}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title={t('go.home')}
          onPress={handleGoHome}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  imageContainer: {
    height: 200,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inferenceTime: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  inferenceTimeText: {
    color: Colors.textLight,
    fontSize: FontSizes.xs,
  },
  resultCard: {
    marginBottom: Spacing.md,
  },
  healthyCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.healthy,
  },
  diseasedCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.diseased,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  healthyIcon: {
    backgroundColor: Colors.healthy + '20',
  },
  diseasedIcon: {
    backgroundColor: Colors.diseased + '20',
  },
  resultInfo: {
    flex: 1,
  },
  resultLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  resultValue: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  severityBadge: {
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  severityText: {
    fontSize: FontSizes.xs,
    color: Colors.warning,
    fontWeight: '500',
  },
  statusCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  statusTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.healthy,
    marginTop: Spacing.md,
  },
  statusText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  activeTab: {
    backgroundColor: Colors.primaryLight + '20',
  },
  tabText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  treatmentCard: {
    marginBottom: Spacing.md,
  },
  treatmentName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  treatmentDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  treatmentDetail: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  detailContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  detailText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  precautionsContainer: {
    backgroundColor: Colors.warning + '10',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  precautionsTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.warning,
    marginBottom: Spacing.xs,
  },
  precautionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginTop: 4,
  },
  precautionText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  treatmentMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    flexWrap: 'wrap',
  },
  effectivenessBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  effectivenessText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: '500',
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  symptomText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  causeText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});
