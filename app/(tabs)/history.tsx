import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../src/constants/theme';
import { Card, ConfidenceBar } from '../../src/components/ui';
import { useDatabase } from '../../src/context';
import { ScanHistoryItem } from '../../src/database';

export default function HistoryScreen() {
  const router = useRouter();
  const db = useDatabase();
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  // Reload history every time the tab is focused
  useFocusEffect(
    useCallback(() => {
      db.getScanHistory().then(setHistory);
    }, [])
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleItemPress = (item: ScanHistoryItem) => {
    router.push({
      pathname: '/scan/results',
      params: {
        scanId: item.id,
        imageUri: item.imageUri,
        cropName: item.cropName,
        cropConfidence: item.cropConfidence.toString(),
        diseaseName: item.diseaseName,
        diseaseConfidence: item.diseaseConfidence.toString(),
        isHealthy: item.isHealthy ? 'true' : 'false',
        severity: item.severity || 'unknown',
        inferenceTime: '0',
      },
    });
  };

  return (
    <View style={styles.container}>
      {history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              <Card style={styles.historyCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.imageContainer}>
                    {item.imageUri ? (
                      <Image source={{ uri: item.imageUri }} style={styles.image} />
                    ) : (
                      <View style={styles.imagePlaceholder}>
                        <Ionicons name="leaf" size={32} color={Colors.primary} />
                      </View>
                    )}
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cropName}>{item.cropName}</Text>
                    <View style={styles.diseaseRow}>
                      <View
                        style={[
                          styles.statusBadge,
                          item.isHealthy ? styles.healthyBadge : styles.diseasedBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            item.isHealthy ? styles.healthyText : styles.diseasedText,
                          ]}
                        >
                          {item.diseaseName}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.dateText}>{formatDate(item.scannedAt)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={Colors.textSecondary} />
                </View>
                <View style={styles.confidenceContainer}>
                  <View style={styles.confidenceItem}>
                    <ConfidenceBar
                      confidence={item.cropConfidence}
                      label="Crop"
                      size="small"
                    />
                  </View>
                  <View style={styles.confidenceItem}>
                    <ConfidenceBar
                      confidence={item.diseaseConfidence}
                      label="Disease"
                      size="small"
                    />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Scan History</Text>
          <Text style={styles.emptyText}>
            Your scan history will appear here once you start scanning leaves.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    padding: Spacing.md,
  },
  historyCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: Spacing.md,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cropName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  diseaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  healthyBadge: {
    backgroundColor: Colors.healthy + '20',
  },
  diseasedBadge: {
    backgroundColor: Colors.diseased + '20',
  },
  statusText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  healthyText: {
    color: Colors.healthy,
  },
  diseasedText: {
    color: Colors.diseased,
  },
  dateText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  confidenceContainer: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  confidenceItem: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
