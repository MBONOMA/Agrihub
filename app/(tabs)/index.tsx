import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../src/constants/theme';
import { Card } from '../../src/components/ui';
import { useModel, useLanguage } from '../../src/context';

export default function ScanScreen() {
  const router = useRouter();
  const { isReady, isLoading, error } = useModel();
  const { t } = useLanguage();

  const handleScan = () => {
    router.push('/scan/camera');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="leaf" size={64} color={Colors.primary} />
        </View>
        <Text style={styles.heroTitle}>{t('app.name')}</Text>
        <Text style={styles.heroSubtitle}>
          {t('preview.subtitle')}
        </Text>
      </View>

      {/* Scan Button */}
      <TouchableOpacity
        style={[styles.scanButton, !isReady && styles.scanButtonDisabled]}
        onPress={handleScan}
        disabled={!isReady}
        activeOpacity={0.8}
      >
        <View style={styles.scanButtonInner}>
          <Ionicons name="camera" size={48} color={Colors.textLight} />
          <Text style={styles.scanButtonText}>
            {isLoading ? t('analyzing') : t('scan.tab')}
          </Text>
        </View>
      </TouchableOpacity>

      {error && (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>
            Failed to load ML models. Please restart the app.
          </Text>
        </Card>
      )}

      {/* Features */}
      <Text style={styles.sectionTitle}>{t('features')}</Text>
      <View style={styles.features}>
        <FeatureCard
          icon="cloud-offline"
          title={t('feature.offline')}
          description={t('feature.offline.desc')}
        />
        <FeatureCard
          icon="flash"
          title={t('feature.fast')}
          description={t('feature.fast.desc')}
        />
        <FeatureCard
          icon="medical"
          title={t('feature.tips')}
          description={t('feature.tips.desc')}
        />
        <FeatureCard
          icon="leaf"
          title={t('feature.crops')}
          description={t('feature.crops.desc')}
        />
      </View>

      {/* Quick Tips */}
      <Text style={styles.sectionTitle}>{t('tips.title')}</Text>
      <Card style={styles.tipsCard}>
        <TipItem icon="sunny" text={t('tip.lighting')} />
        <TipItem icon="locate" text={t('tip.focus')} />
        <TipItem icon="resize" text={t('tip.frame')} />
        <TipItem icon="camera" text={t('tip.steady')} />
      </Card>
    </ScrollView>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon as any} size={24} color={Colors.primary} />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

function TipItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.tipItem}>
      <Ionicons name={icon as any} size={20} color={Colors.primary} />
      <Text style={styles.tipText}>{text}</Text>
    </View>
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
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  scanButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.lg,
  },
  scanButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  scanButtonInner: {
    alignItems: 'center',
  },
  scanButtonText: {
    color: Colors.textLight,
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  errorCard: {
    backgroundColor: Colors.error + '10',
    borderColor: Colors.error,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  featureCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  featureDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tipsCard: {
    gap: Spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  tipText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    flex: 1,
  },
});
