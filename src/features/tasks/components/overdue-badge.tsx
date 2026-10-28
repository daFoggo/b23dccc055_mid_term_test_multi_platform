// Nhan "Qua han" mau do.
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../theme/colors';
import {radius, spacing, typography} from '../../../theme/metrics';

export function OverdueBadge() {
  return (
    <View style={styles.badge}>
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
  },
  text: {...typography.labelMedium, color: colors.onError},
});
