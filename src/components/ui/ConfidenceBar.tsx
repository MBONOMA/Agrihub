import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';

interface ConfidenceBarProps {
  confidence: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function ConfidenceBar({
  confidence,
  label,
  showPercentage = true,
  size = 'medium',
}: ConfidenceBarProps) {
  const percentage = Math.round(confidence * 100);
  const barColor = getConfidenceColor(confidence);

  const heights = {
    small: 4,
    medium: 8,
    large: 12,
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && <Text style={styles.percentage}>{percentage}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height: heights[size] }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
              height: heights[size],
            },
          ]}
        />
      </View>
    </View>
  );
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return Colors.success;
  if (confidence >= 0.6) return Colors.warning;
  return Colors.error;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  percentage: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  track: {
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BorderRadius.full,
  },
});
