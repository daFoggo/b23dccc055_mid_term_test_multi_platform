// Nut bam: filled / tonal / outlined, cao 48dp, bo 16, nhan thi thu nho nhe, disabled mo di.
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import {colors} from '../../theme/colors';
import {radius, spacing, touchTarget, typography} from '../../theme/metrics';
import {Icon} from './icon';

type Variant = 'filled' | 'tonal' | 'outlined';

type Props = {
  label: string;
  icon?: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function Button({
  label,
  icon,
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
      {icon ? <Icon name={icon} size={18} color={labelColor[variant]} /> : null}
      <Text style={[styles.label, {color: labelColor[variant]}]}>{label}</Text>
    </Pressable>
  );
}

const labelColor: Record<Variant, string> = {
  filled: colors.onPrimary,
  tonal: colors.onSecondaryContainer,
  outlined: colors.primary,
};

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget,
    borderRadius: radius.control,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {backgroundColor: colors.primary},
  tonal: {backgroundColor: colors.secondaryContainer},
  outlined: {borderWidth: 1, borderColor: colors.outline},
  pressed: {transform: [{scale: 0.97}], opacity: 0.9},
  disabled: {opacity: 0.4},
  label: typography.labelLarge,
});
