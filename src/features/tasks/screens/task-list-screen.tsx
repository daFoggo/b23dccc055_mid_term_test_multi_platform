// Man hinh danh sach: tien do, tim kiem, loc, sap xep, xoa viec da xong, FlatList the cong viec.
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {EmptyState} from '../../../components/states/empty-state';
import {Button} from '../../../components/ui/button';
import {ScreenContainer} from '../../../components/ui/screen-container';
import {TextField} from '../../../components/ui/text-field';
import {confirmDestructive} from '../../../lib/confirm';
import type {RootStackParamList} from '../../../navigation/types';
import {spacing} from '../../../theme/metrics';
import {ProgressHeader} from '../components/progress-header';
import {SortToggle} from '../components/sort-toggle';
import {TaskCard} from '../components/task-card';
import {TaskFilterBar} from '../components/task-filter-bar';
import {useTaskListControls} from '../hooks/use-task-list-controls';
import {getProgress} from '../services/task-selectors';
import {useTasks} from '../tasks-context';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export function TaskListScreen({navigation}: Props) {
  const {tasks, toggleTask, removeTask, removeDoneTasks} = useTasks();
  const c = useTaskListControls(tasks);
  const doneCount = getProgress(tasks).done;

  const askRemove = (id: string, title: string) =>
    confirmDestructive({
      title: 'Xoá công việc',
      message: `Bạn có chắc muốn xoá "${title}"?`,
      onConfirm: () => removeTask(id),
    });

  const askRemoveDone = () => {
    if (doneCount === 0) {
      return;
    }
    confirmDestructive({
      title: 'Xoá việc đã hoàn thành',
      message: `Xoá ${doneCount} công việc đã hoàn thành?`,
      onConfirm: () => removeDoneTasks(),
    });
  };

  const header = (
    <View style={styles.header}>
      <ProgressHeader tasks={tasks} />
      <TextField
        label="Tìm kiếm"
        placeholder="Nhập tên công việc"
        value={c.query}
        onChangeText={c.setQuery}
        autoCorrect={false}
        returnKeyType="search"
      />
      <TaskFilterBar value={c.filter} onChange={c.setFilter} />
      <View style={styles.actions}>
        <SortToggle value={c.sort} onToggle={c.toggleSort} />
        <Button
          label={`Xoá việc đã hoàn thành (${doneCount})`}
          variant="tonal"
          disabled={doneCount === 0}
          onPress={askRemoveDone}
        />
      </View>
    </View>
  );

  const empty =
    tasks.length === 0 ? (
      <EmptyState
        title="Chưa có công việc nào"
        message={'Nhấn "+ Thêm việc" để bắt đầu.'}
      />
    ) : (
      <EmptyState title="Không có công việc phù hợp với bộ lọc hoặc tìm kiếm" />
    );

  return (
    <ScreenContainer>
      <FlatList
        data={c.visible}
        keyExtractor={t => t.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        renderItem={({item}) => (
          <TaskCard
            task={item}
            today={c.today}
            onPress={() => navigation.navigate('TaskDetail', {taskId: item.id})}
            onLongPress={() => askRemove(item.id, item.title)}
            onToggle={() => toggleTask(item.id)}
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {padding: spacing.lg, paddingBottom: spacing.xxl},
  header: {marginBottom: spacing.md},
  actions: {gap: spacing.sm, marginTop: spacing.md},
});
