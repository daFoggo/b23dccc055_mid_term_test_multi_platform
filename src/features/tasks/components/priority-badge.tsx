// Nhan muc uu tien co mau rieng: do (Cao), vang (Trung binh), xanh (Thap).
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {priorityColors} from '../../../theme/colors';
import {radius, spacing, typography} from '../../../theme/metrics';
import type {Priority} from '../types';

export function PriorityBadge({priority}: {priority: Priority}) {
  const palette = priorityColors[priority] ?? priorityColors['Trung bình'];
  return (
    <View style={[styles.badge, {backgroundColor: palette.background}]}>
      <Text style={[styles.text, {color: palette.text}]}>{priority}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.small,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  text: typography.labelMedium,
});
