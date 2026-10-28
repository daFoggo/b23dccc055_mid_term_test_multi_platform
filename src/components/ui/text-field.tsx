// O nhap co nhan, vien do + thong bao loi ngay duoi o khi sai.
import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import type {TextInputProps} from 'react-native';
import {colors} from '../../theme/colors';
import {radius, spacing, typography} from '../../theme/metrics';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({label, error, hint, style, ...input}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.onSurfaceVariant}
        accessibilityLabel={label}
        {...input}
        style={[
          styles.input,
          input.multiline && styles.multiline,
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
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: radius.extraSmall,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  multiline: {minHeight: 96, textAlignVertical: 'top'},
  inputError: {borderColor: colors.error, borderWidth: 2},
  error: {...typography.bodySmall, color: colors.error, marginTop: spacing.xs},
  hint: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
});
