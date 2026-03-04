import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../src/constants/theme';
import { CROP_LABELS, DISEASE_LABELS } from '../../src/ml/labels';

// Count disease classes per crop from PlantVillage dataset
const diseaseCountByCrop: { [cropIndex: number]: number } = {};
Object.values(DISEASE_LABELS).forEach(d => {
  diseaseCountByCrop[d.cropIndex] = (diseaseCountByCrop[d.cropIndex] || 0) + 1;
});

export default function BrowseScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const crops = Object.entries(CROP_LABELS)
    .map(([id, crop]) => ({
      id,
      ...crop,
      diseaseCount: diseaseCountByCrop[parseInt(id)] || 0,
      isSupported: (diseaseCountByCrop[parseInt(id)] || 0) > 0,
    }))
    // Sort: supported crops first (by disease count desc), then unsupported alphabetically
    .sort((a, b) => {
      if (a.isSupported && !b.isSupported) return -1;
      if (!a.isSupported && b.isSupported) return 1;
      if (a.isSupported && b.isSupported) return b.diseaseCount - a.diseaseCount;
      return a.name.localeCompare(b.name);
    });

  const categories = ['All', 'Supported', ...new Set(crops.map((c) => c.category))];

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Supported' ? crop.isSupported : crop.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleCropPress = (cropId: string) => {
    router.push(`/details/crop/${cropId}`);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search crops..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategory === item && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Crops List */}
      <FlatList
        data={filteredCrops}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.cropCard, item.isSupported && styles.supportedCard]}
            onPress={() => handleCropPress(item.id)}
            activeOpacity={0.7}
          >
            {item.isSupported && (
              <View style={styles.supportedBadge}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.textLight} />
                <Text style={styles.supportedBadgeText}>
                  {item.diseaseCount} {item.diseaseCount === 1 ? 'class' : 'classes'}
                </Text>
              </View>
            )}
            <View style={[styles.cropIconContainer, item.isSupported && styles.supportedIcon]}>
              <Ionicons name="leaf" size={32} color={item.isSupported ? Colors.primary : Colors.textSecondary} />
            </View>
            <Text style={styles.cropName}>{item.name}</Text>
            <Text style={styles.cropScientific} numberOfLines={1}>
              {item.scientificName}
            </Text>
            <View style={[styles.categoryBadge, !item.isSupported && styles.unsupportedBadge]}>
              <Text style={[styles.categoryBadgeText, !item.isSupported && styles.unsupportedBadgeText]}>
                {item.category}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No crops found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.textLight,
    fontWeight: '600',
  },
  listContainer: {
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  cropCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  supportedCard: {
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  supportedBadge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 3,
  },
  supportedBadgeText: {
    fontSize: 9,
    color: Colors.textLight,
    fontWeight: '700',
  },
  cropIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  supportedIcon: {
    backgroundColor: Colors.primaryLight + '30',
  },
  cropName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  cropScientific: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
    textAlign: 'center',
  },
  categoryBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: BorderRadius.sm,
  },
  categoryBadgeText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: '500',
  },
  unsupportedBadge: {
    backgroundColor: Colors.textSecondary + '15',
  },
  unsupportedBadgeText: {
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
});
