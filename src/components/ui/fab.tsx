// Extended FAB M3: nut hanh dong chinh noi o goc duoi.
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../../theme/colors';
import {elevation, radius, spacing, typography} from '../../theme/metrics';
import {Icon} from './icon';

type Props = {
  label: string;
  icon: string;
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
      <Icon name={icon} size={24} color={colors.onPrimaryContainer} />
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
    paddingHorizontal: spacing.lg,
    borderRadius: radius.large,
    backgroundColor: colors.primaryContainer,
    ...elevation.level3,
  },
  pressed: {opacity: 0.85},
  label: {...typography.labelLarge, color: colors.onPrimaryContainer},
});
