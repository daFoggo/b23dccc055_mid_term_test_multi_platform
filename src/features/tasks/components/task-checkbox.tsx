// Checkbox tu lam bang Pressable.
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../../../theme/colors';
import {radius, touchTarget} from '../../../theme/metrics';

type Props = {checked: boolean; onToggle: () => void; label: string};

export function TaskCheckbox({checked, onToggle, label}: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{checked}}
      hitSlop={8}
      onPress={onToggle}
      style={({pressed}) => [styles.target, pressed && styles.pressed]}>
      <Text
        style={[styles.box, checked && styles.boxChecked]}
        allowFontScaling={false}>
        {checked ? '✓' : ''}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    width: touchTarget - 8,
    height: touchTarget - 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {opacity: 0.6},
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.extraSmall,
    borderWidth: 2,
    borderColor: colors.outline,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 20,
    fontSize: 16,
    color: colors.onPrimary,
    overflow: 'hidden',
  },
  boxChecked: {backgroundColor: colors.primary, borderColor: colors.primary},
});
