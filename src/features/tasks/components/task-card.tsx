// The cong viec: checkbox, ten (gach ngang khi xong), danh muc, han, nhan uu tien / qua han.
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../theme/colors';
import {elevation, radius, spacing, typography} from '../../../theme/metrics';
import {Icon} from '../../../components/ui/icon';
import {categoryMeta} from '../category-meta';
import {isOverdue} from '../services/task-selectors';
import type {Task} from '../types';
import {OverdueBadge} from './overdue-badge';
import {PriorityBadge} from './priority-badge';
import {TaskCheckbox} from './task-checkbox';

type Props = {
  task: Task;
  today: number;
  onPress: () => void;
  onLongPress: () => void;
  onToggle: () => void;
};

export function TaskCard({task, today, onPress, onLongPress, onToggle}: Props) {
  const overdue = isOverdue(task, today);
  const meta = categoryMeta(task.category);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={task.title}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <TaskCheckbox
        checked={task.done}
        onToggle={onToggle}
        label={`Đánh dấu hoàn thành ${task.title}`}
      />
      <View style={styles.body}>
        <Text
          numberOfLines={2}
          style={[styles.title, task.done && styles.titleDone]}>
          {task.title}
        </Text>
        <View style={[styles.metaRow, task.done && styles.faded]}>
          <Icon name={meta.icon} size={16} color={meta.color} />
          <Text style={styles.meta}>{task.category}</Text>
          <Icon name="event" size={16} />
          <Text style={styles.meta}>{task.dueDate}</Text>
        </View>
        <View style={[styles.badges, task.done && styles.faded]}>
          <PriorityBadge priority={task.priority} />
          {overdue ? <OverdueBadge /> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.medium,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...elevation.level1,
  },
  pressed: {opacity: 0.8},
  body: {flex: 1, marginLeft: spacing.sm},
  title: {...typography.titleMedium, color: colors.onSurface},
  titleDone: {textDecorationLine: 'line-through', opacity: 0.5},
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  meta: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginRight: spacing.sm,
  },
  badges: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm},
  faded: {opacity: 0.5},
});
