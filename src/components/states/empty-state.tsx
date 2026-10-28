// Trang thai danh sach rong.
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing, typography} from '../../theme/metrics';
import {Icon} from '../ui/icon';

type Props = {title: string; message?: string; icon?: string};

export function EmptyState({title, message, icon = 'inbox'}: Props) {
  return (
    <View style={styles.wrap}>
      <Icon name={icon} size={56} color={colors.outline} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', padding: spacing.xxl},
  title: {
    marginTop: spacing.md,
    ...typography.titleMedium,
    color: colors.onSurface,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
