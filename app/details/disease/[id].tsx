import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../../src/constants/theme';
import { Card } from '../../../src/components/ui';
import { DISEASE_LABELS, CROP_LABELS } from '../../../src/ml/labels';
import { useDatabase, useLanguage } from '../../../src/context';

export default function DiseaseDetailScreen() {
  const { id } = useLocalSearchParams();
  const { t, language, getLabel } = useLanguage();
  const diseaseId = parseInt(id as string, 10);
  const disease = DISEASE_LABELS[diseaseId];
  const db = useDatabase();
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');

  if (!disease) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Disease not found</Text>
      </View>
    );
  }

  const crop = CROP_LABELS[disease.cropIndex];
  const diseaseName = getLabel(disease);
  const cropName = language === 'rw' ? (crop?.name_rw || crop?.name) : crop?.name;

  // Get real treatments from database
  const { organicTreatments, chemicalTreatments, diseaseInfo } = useMemo(() => {
    const cropNameEn = crop?.name || '';
    const diseaseNameEn = disease.name;

    // Try exact match
    let found = db.getDiseaseByName(cropNameEn, diseaseNameEn);
    let allTreatments = found?.treatments || [];

    // Fuzzy search if no match
    if (allTreatments.length === 0 && !disease.isHealthy) {
      const fuzzy = db.findDisease(diseaseNameEn);
      if (fuzzy) {
        allTreatments = fuzzy.disease.treatments;
        found = fuzzy.disease;
      }
    }

    return {
      organicTreatments: allTreatments.filter(t => t.type === 'organic'),
      chemicalTreatments: allTreatments.filter(t => t.type === 'chemical'),
      diseaseInfo: found,
    };
  }, [disease, crop]);

  const treatments = activeTab === 'organic' ? organicTreatments : chemicalTreatments;

  return (
    <>
      <Stack.Screen options={{ title: diseaseName }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              disease.isHealthy ? styles.healthyContainer : styles.diseasedContainer,
            ]}
          >
            <Ionicons
              name={disease.isHealthy ? 'checkmark-circle' : 'warning'}
              size={48}
              color={disease.isHealthy ? Colors.healthy : Colors.diseased}
            />
          </View>
          <Text style={styles.name}>{diseaseName}</Text>
          <View style={styles.cropBadge}>
            <Ionicons name="leaf" size={14} color={Colors.primary} />
            <Text style={styles.cropText}>{cropName || 'Unknown Crop'}</Text>
          </View>
          {!disease.isHealthy && (
            <View
              style={[
                styles.severityBadge,
                { backgroundColor: getSeverityColor(disease.severity) + '20' },
              ]}
            >
              <Text
                style={[styles.severityText, { color: getSeverityColor(disease.severity) }]}
              >
                {t(disease.severity)} {t('severity')}
              </Text>
            </View>
          )}
        </View>

        {/* Status */}
        <Card
          style={[
            styles.statusCard,
            disease.isHealthy ? styles.healthyCard : styles.diseasedCard,
          ]}
        >
          <Text style={styles.statusTitle}>
            {disease.isHealthy ? t('healthy') : t('disease.detected')}
          </Text>
          <Text style={styles.statusDescription}>
            {(language === 'rw' ? diseaseInfo?.description_rw : diseaseInfo?.description) ||
              (disease.isHealthy
                ? t('healthy.subtitle')
                : t('disease.detected'))}
          </Text>
        </Card>

        {/* Symptoms from DB */}
        {diseaseInfo && !disease.isHealthy && (
          <>
            <Text style={styles.sectionTitle}>{t('symptoms')}</Text>
            <Card style={styles.symptomsCard}>
              {(language === 'rw' && diseaseInfo.symptoms_rw ? diseaseInfo.symptoms_rw : diseaseInfo.symptoms || []).map((symptom: string, i: number) => (
                <View key={i} style={styles.symptomItem}>
                  <Ionicons name="ellipse" size={6} color={Colors.diseased} />
                  <Text style={styles.symptomText}>{symptom}</Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {/* Cause */}
        {(diseaseInfo?.causes || diseaseInfo?.causes_rw) && (
          <>
            <Text style={styles.sectionTitle}>{t('cause')}</Text>
            <Card>
              <Text style={styles.statusDescription}>
                {language === 'rw' && diseaseInfo.causes_rw ? diseaseInfo.causes_rw : diseaseInfo.causes}
              </Text>
            </Card>
          </>
        )}

        {/* Treatments (only for diseases) */}
        {!disease.isHealthy && (
          <>
            <Text style={styles.sectionTitle}>{t('treatment.recommendations')}</Text>

            {/* Tabs */}
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
                      {(language === 'rw' && treatment.precautions_rw ? treatment.precautions_rw : treatment.precautions || []).map((p: string, i: number) => (
                        <View key={i} style={styles.precautionItem}>
                          <Ionicons name="alert-circle" size={14} color={Colors.warning} />
                          <Text style={styles.precautionText}>{p}</Text>
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
          </>
        )}

        {/* Prevention Tips */}
        <Text style={styles.sectionTitle}>{t('prevention.tips')}</Text>
        <Card style={styles.tipsCard}>
          {diseaseInfo?.prevention || diseaseInfo?.prevention_rw ? (
            <Text style={styles.statusDescription}>
              {language === 'rw' && diseaseInfo.prevention_rw ? diseaseInfo.prevention_rw : diseaseInfo.prevention}
            </Text>
          ) : (
            <>
              <TipItem icon="water" text={language === 'rw' ? "Irinde kwuhira cyane kandi ube ufite imiferege isohora amazi" : "Avoid overwatering and ensure proper drainage"} />
              <TipItem icon="sunny" text={language === 'rw' ? "Emeza ko ikihingwa kibona imirasire y'izuba ihagije n'umwuka" : "Provide adequate sunlight and air circulation"} />
              <TipItem icon="trash" text={language === 'rw' ? "Kuraho ibisigazwa by'ibihingwa byarwaye vuba bishoboka" : "Remove infected plant debris promptly"} />
            </>
          )}
        </Card>
      </ScrollView>
    </>
  );
}

function TipItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.tipItem}>
      <Ionicons name={icon as any} size={18} color={Colors.primary} />
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return Colors.error;
    case 'high':
      return Colors.diseased;
    case 'medium':
      return Colors.warning;
    case 'low':
      return Colors.success;
    default:
      return Colors.textSecondary;
  }
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: Colors.error,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  healthyContainer: {
    backgroundColor: Colors.healthy + '20',
  },
  diseasedContainer: {
    backgroundColor: Colors.diseased + '20',
  },
  name: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  cropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  cropText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  severityBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  severityText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  statusCard: {
    marginBottom: Spacing.lg,
  },
  healthyCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.healthy,
  },
  diseasedCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.diseased,
  },
  statusTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statusDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
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
    backgroundColor: Colors.background,
    ...Shadows.sm,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.text,
  },
  treatmentCard: {
    marginBottom: Spacing.md,
  },
  treatmentName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  treatmentDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  treatmentDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    marginTop: 2,
  },
  precautionsContainer: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.warning + '10',
    borderRadius: BorderRadius.md,
  },
  precautionsTitle: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.warning,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  precautionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 6,
  },
  precautionText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  treatmentMeta: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  effectivenessBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.success + '15',
    borderRadius: BorderRadius.sm,
  },
  effectivenessText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
    textTransform: 'uppercase',
  },
  symptomsCard: {
    marginBottom: Spacing.lg,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  symptomText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    flex: 1,
  },
  tipsCard: {
    marginBottom: Spacing.xl,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  tipText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    flex: 1,
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
});
