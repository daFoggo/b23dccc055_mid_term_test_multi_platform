// O nhap nen xam dac, khong vien luc nghi; vien primary khi focus, vien do + thong bao loi ngay duoi o khi sai.
import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import type {TextInputProps} from 'react-native';
import {colors} from '../../theme/colors';
import {radius, spacing, typography} from '../../theme/metrics';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({label, error, hint, style, onFocus, onBlur, ...input}: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.onSurfaceVariant}
        accessibilityLabel={label}
        {...input}
        onFocus={e => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={e => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          input.multiline && styles.multiline,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
          style,
        ]}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {marginBottom: spacing.lg},
  label: {
    ...typography.labelLarge,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.bodyLarge,
    color: colors.onSurface,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: radius.control,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  multiline: {minHeight: 96, textAlignVertical: 'top'},
  inputFocused: {borderColor: colors.primary},
  inputError: {borderColor: colors.error},
  error: {...typography.bodySmall, color: colors.error, marginTop: spacing.xs},
  hint: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
});
