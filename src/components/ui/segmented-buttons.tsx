// Segmented button M3: chon mot trong vai lua chon ngan (vd. cach sap xep).
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
      {segments.map((s, i) => {
        const selected = s.value === value;
        return (
          <Pressable
            key={s.value}
            accessibilityRole="button"
            accessibilityState={{selected}}
            onPress={() => onChange(s.value)}
            style={({pressed}) => [
              styles.segment,
              i === 0 && styles.first,
              i === segments.length - 1 && styles.last,
              i > 0 && styles.divider,
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
  row: {flexDirection: 'row'},
  segment: {
    flex: 1,
    minHeight: touchTarget - 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: spacing.sm,
  },
  first: {borderTopLeftRadius: radius.full, borderBottomLeftRadius: radius.full},
  last: {borderTopRightRadius: radius.full, borderBottomRightRadius: radius.full},
  divider: {borderLeftWidth: 0},
  selected: {backgroundColor: colors.secondaryContainer},
  pressed: {opacity: 0.7},
  label: {...typography.labelLarge, color: colors.onSurfaceVariant},
  selectedLabel: {color: colors.onSecondaryContainer},
});
