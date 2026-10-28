// Nhan "Qua han" mau do.
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../theme/colors';
import {radius, spacing, typography} from '../../../theme/metrics';
import {Icon} from '../../../components/ui/icon';

export function OverdueBadge() {
  return (
    <View style={styles.badge}>
      <Icon name="warning" size={14} color={colors.onError} />
      <Text style={styles.text}>Quá hạn</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.error,
    borderRadius: radius.small,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  text: {...typography.labelMedium, color: colors.onError},
});
