// Thanh tim kiem M3: icon kinh lup, o nhap, nut xoa nhanh.
import React from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {colors} from '../../theme/colors';
import {radius, spacing, touchTarget, typography} from '../../theme/metrics';
import {Icon} from './icon';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
};

export function SearchBar({value, onChangeText, placeholder}: Props) {
  return (
    <View style={styles.bar}>
      <Icon name="search" size={24} />
      <TextInput
        accessibilityLabel="Tìm kiếm"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceVariant}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value !== '' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Xoá tìm kiếm"
          hitSlop={8}
          onPress={() => onChangeText('')}
          style={({pressed}) => [styles.clear, pressed && styles.pressed]}>
          <Icon name="close" size={22} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget + 8,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.onSurface,
    paddingVertical: spacing.sm,
  },
  clear: {
    width: touchTarget - 8,
    height: touchTarget - 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {opacity: 0.6},
});
