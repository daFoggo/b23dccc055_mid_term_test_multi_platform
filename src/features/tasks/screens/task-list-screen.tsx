// Man hinh danh sach: tien do, tim kiem, loc kem so luong, sap xep, xoa viec da xong, FAB them viec.
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {EmptyState} from '../../../components/states/empty-state';
import {Button} from '../../../components/ui/button';
import {Fab} from '../../../components/ui/fab';
import {ScreenContainer} from '../../../components/ui/screen-container';
import {SearchBar} from '../../../components/ui/search-bar';
import {useSnackbar} from '../../../components/ui/snackbar';
import {confirmDestructive} from '../../../lib/confirm';
import type {RootStackParamList} from '../../../navigation/types';
import {spacing} from '../../../theme/metrics';
import {ProgressHeader} from '../components/progress-header';
import {SortToggle} from '../components/sort-toggle';
import {TaskCard} from '../components/task-card';
import {TaskFilterBar} from '../components/task-filter-bar';
import {useTaskListControls} from '../hooks/use-task-list-controls';
import {getFilterCounts} from '../services/task-selectors';
import {useTasks} from '../tasks-context';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export function TaskListScreen({navigation}: Props) {
  const {tasks, toggleTask, removeTask, removeDoneTasks} = useTasks();
  const c = useTaskListControls(tasks);
  const showMessage = useSnackbar();
  const counts = getFilterCounts(tasks, c.today);
  const doneCount = counts.done;

  const askRemove = (id: string, title: string) =>
    confirmDestructive({
      title: 'Xoá công việc',
      message: `Bạn có chắc muốn xoá "${title}"?`,
      onConfirm: () => {
        removeTask(id);
        showMessage('Đã xoá công việc');
      },
    });

  const askRemoveDone = () => {
    if (doneCount === 0) {
      return;
    }
    confirmDestructive({
      title: 'Xoá việc đã hoàn thành',
      message: `Xoá ${doneCount} công việc đã hoàn thành?`,
      onConfirm: () => {
        const removed = removeDoneTasks();
        showMessage(`Đã xoá ${removed} công việc đã hoàn thành`);
      },
    });
  };

  const header = (
    <View style={styles.header}>
      <ProgressHeader tasks={tasks} />
      <SearchBar
        value={c.query}
        onChangeText={c.setQuery}
        placeholder="Tìm theo tên công việc"
      />
      <View style={styles.block}>
        <TaskFilterBar value={c.filter} counts={counts} onChange={c.setFilter} />
      </View>
      <View style={styles.block}>
        <SortToggle value={c.sort} onChange={c.setSort} />
      </View>
      <View style={styles.block}>
        <Button
          label={`Xoá việc đã hoàn thành (${doneCount})`}
          icon="delete-sweep"
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
        icon="event-available"
        title="Chưa có công việc nào"
        message={'Nhấn "Thêm việc" để bắt đầu.'}
      />
    ) : (
      <EmptyState
        icon="search-off"
        title="Không có công việc phù hợp với bộ lọc hoặc tìm kiếm"
      />
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
      <Fab
        icon="add"
        label="Thêm việc"
        accessibilityLabel="+ Thêm việc"
        onPress={() => navigation.navigate('TaskForm')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {padding: spacing.lg, paddingBottom: 96},
  header: {marginBottom: spacing.md},
  block: {marginTop: spacing.md},
});
