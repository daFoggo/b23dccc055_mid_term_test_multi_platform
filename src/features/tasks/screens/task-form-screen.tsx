// Man hinh Them / Sua dung chung mot form.
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {EmptyState} from '../../../components/states/empty-state';
import {Button} from '../../../components/ui/button';
import {Chip} from '../../../components/ui/chip';
import {ScreenContainer} from '../../../components/ui/screen-container';
import {useSnackbar} from '../../../components/ui/snackbar';
import {quickDueDates} from '../../../lib/date';
import {TextField} from '../../../components/ui/text-field';
import type {RootStackParamList} from '../../../navigation/types';
import {colors} from '../../../theme/colors';
import {spacing, typography} from '../../../theme/metrics';
import {useTaskForm} from '../hooks/use-task-form';
import {useTasks} from '../tasks-context';
import {CATEGORIES, PRIORITIES} from '../types';
import type {Task} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

export function TaskFormScreen({navigation, route}: Props) {
  const taskId = route.params?.taskId;
  const {getTask} = useTasks();
  const initial = taskId ? getTask(taskId) : undefined;

  if (taskId && !initial) {
    return (
      <ScreenContainer>
        <EmptyState title="Không tìm thấy công việc" />
        <View style={styles.back}>
          <Button label="Quay lại" onPress={() => navigation.goBack()} />
        </View>
      </ScreenContainer>
    );
  }
  return <TaskForm initial={initial} navigation={navigation} />;
}

function TaskForm({
  initial,
  navigation,
}: {
  initial?: Task;
  navigation: Props['navigation'];
}) {
  const {addTask, updateTask} = useTasks();
  const showMessage = useSnackbar();
  const {values, errors, setField, submit} = useTaskForm({
    mode: initial ? 'edit' : 'create',
    initial,
    onValid: v => {
      if (initial) {
        updateTask(initial.id, v);
        showMessage('Đã cập nhật công việc');
      } else {
        addTask(v);
        showMessage('Đã thêm công việc');
      }
      navigation.goBack();
    },
  });
  const over = values.title.trim().length > 50;

  return (
    <ScreenContainer scroll>
      <TextField
        label="Tên công việc"
        value={values.title}
        onChangeText={t => setField('title', t)}
        error={errors.title}
        hint={`${values.title.trim().length}/50`}
        placeholder="Ví dụ: Ôn tập giữa kỳ"
        style={over ? styles.over : undefined}
      />
      <TextField
        label="Ghi chú"
        value={values.note}
        onChangeText={t => setField('note', t)}
        multiline
        maxLength={500}
        placeholder="Không bắt buộc"
      />
      <Text style={styles.groupLabel}>Danh mục</Text>
      <View style={styles.chips}>
        {CATEGORIES.map(c => (
          <Chip
            key={c}
            label={c}
            selected={values.category === c}
            onPress={() => setField('category', c)}
          />
        ))}
      </View>
      <Text style={styles.groupLabel}>Mức ưu tiên</Text>
      <View style={styles.chips}>
        {PRIORITIES.map(p => (
          <Chip
            key={p}
            label={p}
            selected={values.priority === p}
            onPress={() => setField('priority', p)}
          />
        ))}
      </View>
      <TextField
        label="Hạn hoàn thành"
        value={values.dueDate}
        onChangeText={t => setField('dueDate', t)}
        error={errors.dueDate}
        keyboardType="numeric"
        maxLength={10}
        placeholder="dd/mm/yyyy"
      />
      <View style={styles.quickRow}>
        {quickDueDates().map(q => (
          <Chip
            key={q.label}
            label={q.label}
            selected={values.dueDate === q.value}
            onPress={() => setField('dueDate', q.value)}
          />
        ))}
      </View>
      <Button
        label={initial ? 'Lưu thay đổi' : 'Thêm công việc'}
        icon={initial ? 'save' : 'add-task'}
        onPress={submit}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: {padding: spacing.lg},
  groupLabel: {
    ...typography.labelLarge,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  over: {borderColor: colors.error},
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: -spacing.sm,
    marginBottom: spacing.xl,
  },
});
