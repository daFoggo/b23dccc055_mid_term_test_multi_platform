// Thanh loc theo trang thai mot hang: so luong o tren, nhan o duoi, 4 o chia deu; o dang chon noi bat.
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../theme/colors';
import {radius, spacing, touchTarget, typography} from '../../../theme/metrics';
import type {FilterCounts} from '../services/task-selectors';
import {FILTER_LABELS} from '../types';
import type {TaskFilter} from '../types';

const ORDER: TaskFilter[] = ['all', 'pending', 'done', 'overdue'];

type Props = {
  value: TaskFilter;
  counts: FilterCounts;
  onChange: (f: TaskFilter) => void;
};

export function TaskFilterBar({value, counts, onChange}: Props) {
  return (
    <View style={styles.row}>
      {ORDER.map(f => {
        const selected = value === f;
        const alert = f === 'overdue' && counts.overdue > 0;
        return (
          <Pressable
            key={f}
            accessibilityRole="button"
            accessibilityLabel={`${FILTER_LABELS[f]}, ${counts[f]} công việc`}
            accessibilityState={{selected}}
            onPress={() => onChange(f)}
            style={({pressed}) => [
              styles.tab,
              selected && styles.selected,
              pressed && styles.pressed,
            ]}>
            <Text
              style={[
                styles.count,
                selected && styles.selectedText,
                alert && styles.alert,
              ]}>
              {counts[f]}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.label, selected && styles.selectedText]}>
              {FILTER_LABELS[f]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.control,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    minHeight: touchTarget + 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.control - spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  selected: {backgroundColor: colors.secondaryContainer},
  pressed: {transform: [{scale: 0.97}]},
  count: {...typography.titleMedium, color: colors.onSurface},
  label: {...typography.bodySmall, color: colors.onSurfaceVariant},
  selectedText: {color: colors.onSecondaryContainer},
  alert: {color: colors.error},
});
