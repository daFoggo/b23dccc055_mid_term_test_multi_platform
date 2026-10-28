// Hang nut loc theo trang thai kem so luong; nut dang chon duoc lam noi bat.
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip} from '../../../components/ui/chip';
import {spacing} from '../../../theme/metrics';
import type {FilterCounts} from '../services/task-selectors';
import {FILTER_LABELS} from '../types';
import type {TaskFilter} from '../types';

const ORDER: TaskFilter[] = ['all', 'pending', 'done', 'overdue'];

type Props = {
  value: TaskFilter;
  counts: FilterCounts;
  onChange: (f: TaskFilter) => void;
};

export function TaskFilterBar({value, counts, onChange}: Props) {
  return (
    <View style={styles.row}>
      {ORDER.map(f => (
        <Chip
          key={f}
          label={`${FILTER_LABELS[f]} (${counts[f]})`}
          selected={value === f}
          onPress={() => onChange(f)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
});
