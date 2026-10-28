// Man hinh chi tiet: day du thong tin, so ngay con lai, nhan qua han, Sua / Doi trang thai.
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {EmptyState} from '../../../components/states/empty-state';
import {Button} from '../../../components/ui/button';
import {Icon} from '../../../components/ui/icon';
import {ScreenContainer} from '../../../components/ui/screen-container';
import {todayDay} from '../../../lib/date';
import type {RootStackParamList} from '../../../navigation/types';
import {colors} from '../../../theme/colors';
import {radius, spacing, typography} from '../../../theme/metrics';
import {OverdueBadge} from '../components/overdue-badge';
import {PriorityBadge} from '../components/priority-badge';
import {categoryMeta} from '../category-meta';
import {dueLabel, isOverdue} from '../services/task-selectors';
import {useTasks} from '../tasks-context';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export function TaskDetailScreen({navigation, route}: Props) {
  const {getTask, toggleTask} = useTasks();
  const task = getTask(route.params.taskId);

  if (!task) {
    return (
      <ScreenContainer>
        <EmptyState title="Không tìm thấy công việc" />
        <View style={styles.pad}>
          <Button label="Quay lại" onPress={() => navigation.goBack()} />
        </View>
      </ScreenContainer>
    );
  }

  const today = todayDay();
  const overdue = isOverdue(task, today);
  const label = dueLabel(task, today);
  const meta = categoryMeta(task.category);

  return (
    <ScreenContainer scroll>
      <View style={styles.card}>
        <Text style={[styles.title, task.done && styles.done]}>{task.title}</Text>
        <View style={styles.badges}>
          <PriorityBadge priority={task.priority} />
          {overdue ? <OverdueBadge /> : null}
        </View>
        <Row icon={meta.icon} iconColor={meta.color} name="Danh mục" value={task.category} />
        <Row icon="event" name="Hạn hoàn thành" value={task.dueDate} />
        {label ? (
          <Row
            icon="schedule"
            iconColor={overdue ? colors.error : undefined}
            name="Thời hạn"
            value={label}
            highlight={overdue}
          />
        ) : null}
        <Row
          icon={task.done ? 'check-circle' : 'radio-button-unchecked'}
          name="Trạng thái"
          value={task.done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
        />
        <Row
          icon="notes"
          name="Ghi chú"
          value={task.note.trim() === '' ? 'Không có' : task.note}
        />
      </View>
      <View style={styles.actions}>
        <Button
          label="Sửa"
          icon="edit"
          onPress={() => navigation.navigate('TaskForm', {taskId: task.id})}
        />
        <Button
          variant="tonal"
          icon={task.done ? 'undo' : 'done'}
          label={task.done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
          onPress={() => toggleTask(task.id)}
        />
      </View>
    </ScreenContainer>
  );
}

type RowProps = {
  icon: string;
  iconColor?: string;
  name: string;
  value: string;
  highlight?: boolean;
};

function Row({icon, iconColor, name, value, highlight}: RowProps) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={22} color={iconColor} />
      <View style={styles.rowText}>
        <Text style={styles.rowName}>{name}</Text>
        <Text style={[styles.rowValue, highlight && styles.rowHighlight]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {padding: spacing.lg},
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.medium,
    padding: spacing.lg,
  },
  title: {...typography.headlineSmall, color: colors.onSurface},
  done: {textDecorationLine: 'line-through', opacity: 0.5},
  badges: {flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.md},
  row: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginTop: spacing.md},
  rowText: {flex: 1},
  rowName: {...typography.labelMedium, color: colors.onSurfaceVariant},
  rowValue: {...typography.bodyLarge, color: colors.onSurface, marginTop: spacing.xs},
  rowHighlight: {color: colors.error, fontWeight: '500'},
  actions: {gap: spacing.md, marginTop: spacing.xl},
});
