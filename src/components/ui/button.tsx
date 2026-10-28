// Nut bam M3: filled / tonal / outlined, co hieu ung nhan va trang thai disabled.
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import {colors} from '../../theme/colors';
import {radius, spacing, touchTarget, typography} from '../../theme/metrics';

type Variant = 'filled' | 'tonal' | 'outlined';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function Button({
  label,
  onPress,
  variant = 'filled',
  disabled = false,
  style,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{disabled}}
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <Text
        style={[
          styles.label,
          labelColor[variant],
          disabled && styles.disabledLabel,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {backgroundColor: colors.primary},
  tonal: {backgroundColor: colors.secondaryContainer},
  outlined: {borderWidth: 1, borderColor: colors.outline},
  pressed: {opacity: 0.7},
  disabled: {
    backgroundColor: colors.surfaceContainerHighest,
    borderColor: colors.outlineVariant,
    opacity: 0.6,
  },
  label: typography.labelLarge,
  disabledLabel: {color: colors.onSurfaceVariant},
});

const labelColor = StyleSheet.create({
  filled: {color: colors.onPrimary},
  tonal: {color: colors.onSecondaryContainer},
  outlined: {color: colors.primary},
});
