// Tien do hoan thanh: chu + thanh tien do tu ve bang View.
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../theme/colors';
import {radius, spacing, typography} from '../../../theme/metrics';
import {getProgress} from '../services/task-selectors';
import type {Task} from '../types';

export function ProgressHeader({tasks}: {tasks: Task[]}) {
  const {ratio, text} = getProgress(tasks);
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, {width: `${Math.round(ratio * 100)}%`}]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {marginBottom: spacing.lg},
  text: {
    ...typography.titleMedium,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  track: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
