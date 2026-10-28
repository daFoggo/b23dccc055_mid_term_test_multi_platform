// Chip dang pill: nen the trang khi chua chon, nen tonal + dau tick khi dang chon.
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../../theme/colors';
import {radius, spacing, touchTarget, typography} from '../../theme/metrics';
import {Icon} from './icon';

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
      {selected ? (
        <Icon name="check" size={18} color={colors.onSecondaryContainer} />
      ) : null}
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: touchTarget,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {backgroundColor: colors.secondaryContainer},
  pressed: {transform: [{scale: 0.97}]},
  label: {...typography.labelLarge, color: colors.onSurfaceVariant},
  selectedLabel: {color: colors.onSecondaryContainer},
});
