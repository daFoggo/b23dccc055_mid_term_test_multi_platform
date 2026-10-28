// Extended FAB phang (khong do bong): nen primary dac, noi o goc duoi.
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../../theme/colors';
import {radius, spacing, typography} from '../../theme/metrics';
import {Icon} from './icon';

type Props = {
  label: string;
  icon?: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function Fab({label, icon, onPress, accessibilityLabel}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({pressed}) => [styles.fab, pressed && styles.pressed]}>
      {icon ? <Icon name={icon} size={22} color={colors.onPrimary} /> : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.control + 4,
    backgroundColor: colors.primary,
  },
  pressed: {transform: [{scale: 0.97}]},
  label: {...typography.labelLarge, color: colors.onPrimary},
});
