// Checkbox tu lam bang Pressable.
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {colors} from '../../../theme/colors';
import {radius, touchTarget} from '../../../theme/metrics';
import {Icon} from '../../../components/ui/icon';

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
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? (
          <Icon name="check" size={18} color={colors.onPrimary} />
        ) : null}
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {backgroundColor: colors.primary, borderColor: colors.primary},
});
