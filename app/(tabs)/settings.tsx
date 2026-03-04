import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../src/constants/theme';
import { Card } from '../../src/components/ui';
import { useModel, useDatabase, useLanguage } from '../../src/context';

const PREFS_KEY = '@agrihub_preferences';

export default function SettingsScreen() {
  const { modelInfo, isReady } = useModel();
  const db = useDatabase();
  const { t } = useLanguage();
  const [saveHistory, setSaveHistory] = React.useState(true);
  const [highAccuracyMode, setHighAccuracyMode] = React.useState(false);

  // Load persisted preferences
  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY).then(json => {
      if (json) {
        const prefs = JSON.parse(json);
        if (prefs.saveHistory !== undefined) setSaveHistory(prefs.saveHistory);
        if (prefs.highAccuracyMode !== undefined) setHighAccuracyMode(prefs.highAccuracyMode);
      }
    });
  }, []);

  // Persist preference changes
  const updatePref = useCallback((key: string, value: boolean) => {
    AsyncStorage.getItem(PREFS_KEY).then(json => {
      const prefs = json ? JSON.parse(json) : {};
      prefs[key] = value;
      AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    });
  }, []);

  const handleSaveHistoryChange = (value: boolean) => {
    setSaveHistory(value);
    updatePref('saveHistory', value);
  };

  const handleHighAccuracyChange = (value: boolean) => {
    setHighAccuracyMode(value);
    updatePref('highAccuracyMode', value);
  };

  const handleClearHistory = () => {
    Alert.alert(
      t('clear.history'),
      t('clear.history.confirm'),
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await db.clearScanHistory();
            Alert.alert('Success', t('clear.success'));
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* App Info */}
      <Card style={styles.card}>
        <View style={styles.appHeader}>
          <View style={styles.appIcon}>
            <Ionicons name="leaf" size={32} color={Colors.textLight} />
          </View>
          <View>
            <Text style={styles.appName}>AgriHub</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>
        </View>
        <Text style={styles.appDescription}>
          Offline plant disease detection powered by on-device AI
        </Text>
      </Card>

      {/* Model Status */}
      <Text style={styles.sectionTitle}>{t('settings.tab')} - ML</Text>
      <Card style={styles.card}>
        <View style={styles.statusRow}>
          <Ionicons
            name={isReady ? 'checkmark-circle' : 'time'}
            size={24}
            color={isReady ? Colors.success : Colors.warning}
          />
          <Text style={styles.statusText}>
            {isReady ? 'Models Loaded' : 'Loading Models...'}
          </Text>
        </View>
        {modelInfo && (
          <View style={styles.modelInfo}>
            <View style={styles.modelItem}>
              <Text style={styles.modelLabel}>Crop Classifier</Text>
              <Text style={styles.modelValue}>
                {modelInfo.crop.numClasses} classes
              </Text>
            </View>
            <View style={styles.modelItem}>
              <Text style={styles.modelLabel}>Disease Detector</Text>
              <Text style={styles.modelValue}>
                {modelInfo.disease.numClasses} classes
              </Text>
            </View>
          </View>
        )}
      </Card>

      {/* Developers Section */}
      <Text style={styles.sectionTitle}>{t('developer.section')}</Text>
      <View style={styles.glassCard}>
        <View style={styles.devHeader}>
          <View style={styles.devAvatar}>
            <Ionicons name="person" size={30} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.devName}>Omar MBONABUCYA</Text>
            <Text style={styles.devRole}>Lead Developer</Text>
          </View>
        </View>
        
        <View style={styles.socialLinks}>
          <TouchableOpacity 
            style={styles.socialIcon} 
            onPress={() => Linking.openURL('https://www.linkedin.com/in/omar-mbonabucya')}
          >
            <Ionicons name="logo-linkedin" size={28} color="#0077b5" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialIcon} 
            onPress={() => Linking.openURL('https://wa.me/250795605472')}
          >
            <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialIcon} 
            onPress={() => Linking.openURL('https://www.instagram.com/0mar_rw')}
          >
            <Ionicons name="logo-instagram" size={28} color="#E4405F" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Preferences */}
      <Text style={styles.sectionTitle}>{t('settings.tab')}</Text>
      <Card style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>{t('history.tab')}</Text>
            <Text style={styles.settingDescription}>
              Keep a record of all your scans
            </Text>
          </View>
          <Switch
            value={saveHistory}
            onValueChange={handleSaveHistoryChange}
            trackColor={{ true: Colors.primary }}
            thumbColor={Colors.surface}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>High Accuracy Mode</Text>
            <Text style={styles.settingDescription}>
              Use more processing power for better results
            </Text>
          </View>
          <Switch
            value={highAccuracyMode}
            onValueChange={handleHighAccuracyChange}
            trackColor={{ true: Colors.primary }}
            thumbColor={Colors.surface}
          />
        </View>
      </Card>

      {/* Data Management */}
      <Text style={styles.sectionTitle}>Data</Text>
      <Card style={styles.card}>
        <TouchableOpacity style={styles.actionRow} onPress={handleClearHistory}>
          <Ionicons name="trash-outline" size={24} color={Colors.error} />
          <Text style={[styles.actionText, { color: Colors.error }]}>
            {t('clear.history')}
          </Text>
        </TouchableOpacity>
      </Card>

      {/* About */}
      <Text style={styles.sectionTitle}>About</Text>
      <Card style={styles.card}>
        <TouchableOpacity style={styles.actionRow}>
          <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
          <Text style={styles.actionText}>How it works</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionRow}>
          <Ionicons name="document-text-outline" size={24} color={Colors.primary} />
          <Text style={styles.actionText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionRow}>
          <Ionicons name="star-outline" size={24} color={Colors.primary} />
          <Text style={styles.actionText}>Rate the App</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </Card>

      <Text style={styles.footer}>
        Made with care for farmers worldwide
      </Text>
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
  card: {
    marginBottom: Spacing.md,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  appIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  appName: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  appVersion: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  appDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text,
  },
  modelInfo: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  modelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modelLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  modelValue: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text,
  },
  settingDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  actionText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  footer: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  devHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  devAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  devName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  devRole: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  socialIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
});
