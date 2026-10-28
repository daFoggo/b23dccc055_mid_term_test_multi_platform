// The cong viec 2 dong: [ten ........ nhan uu tien] va [danh muc · han · Qua han]; checkbox ben trai.
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
        <View style={styles.titleRow}>
          <Text
            numberOfLines={2}
            style={[styles.title, task.done && styles.titleDone]}>
            {task.title}
          </Text>
          <View style={task.done && styles.faded}>
            <PriorityBadge priority={task.priority} />
          </View>
        </View>
        <View style={[styles.metaRow, task.done && styles.faded]}>
          <Icon name={meta.icon} size={16} color={meta.color} />
          <Text style={styles.meta}>{task.category}</Text>
          <Icon name="event" size={16} />
          <Text style={styles.meta}>{task.dueDate}</Text>
          {overdue ? <OverdueBadge /> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...elevation.level1,
  },
  pressed: {opacity: 0.8},
  body: {flex: 1, marginLeft: spacing.sm},
  titleRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm},
  title: {
    flex: 1,
    ...typography.titleMedium,
    color: colors.onSurface,
  },
  titleDone: {textDecorationLine: 'line-through', opacity: 0.5},
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  meta: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginRight: spacing.sm,
  },
  faded: {opacity: 0.5},
});
