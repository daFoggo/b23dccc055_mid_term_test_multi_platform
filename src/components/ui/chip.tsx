// Chip chon duoc (loc, danh muc, uu tien); chip dang chon duoc lam noi bat.
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../../theme/colors';
import {radius, spacing, touchTarget, typography} from '../../theme/metrics';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function Chip({label, selected, onPress}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{selected}}
      onPress={onPress}
      style={({pressed}) => [
        styles.chip,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: touchTarget - 8,
    borderRadius: radius.small,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.secondaryContainer,
  },
  pressed: {opacity: 0.7},
  label: {...typography.labelLarge, color: colors.onSurfaceVariant},
  selectedLabel: {color: colors.onSecondaryContainer},
});
