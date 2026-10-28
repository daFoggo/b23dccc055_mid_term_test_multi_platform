// Segmented button dang pill, nen the trang; muc dang chon nen tonal + dau tick.
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme/colors';
import {radius, spacing, touchTarget, typography} from '../../theme/metrics';
import {Icon} from './icon';

export type Segment<T extends string> = {value: T; label: string; icon?: string};

type Props<T extends string> = {
  segments: Segment<T>[];
  value: T;
  onChange: (v: T) => void;
};

export function SegmentedButtons<T extends string>({
  segments,
  value,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.row}>
      {segments.map(s => {
        const selected = s.value === value;
        return (
          <Pressable
            key={s.value}
            accessibilityRole="button"
            accessibilityState={{selected}}
            onPress={() => onChange(s.value)}
            style={({pressed}) => [
              styles.segment,
              selected && styles.selected,
              pressed && styles.pressed,
            ]}>
            <Icon
              name={selected ? 'check' : s.icon ?? 'check'}
              size={18}
              color={selected ? colors.onSecondaryContainer : colors.onSurfaceVariant}
            />
            <Text style={[styles.label, selected && styles.selectedLabel]}>
              {s.label}
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
    borderRadius: radius.full,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  segment: {
    flex: 1,
    minHeight: touchTarget - spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
  },
  selected: {backgroundColor: colors.secondaryContainer},
  pressed: {transform: [{scale: 0.97}]},
  label: {...typography.labelLarge, color: colors.onSurfaceVariant},
  selectedLabel: {color: colors.onSecondaryContainer},
});
