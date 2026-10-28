// State loc / tim kiem / sap xep cua man danh sach va danh sach hien thi.
import {useMemo, useState} from 'react';
import {todayDay} from '../../../lib/date';
import {selectVisibleTasks} from '../services/task-selectors';
import type {Task, TaskFilter, TaskSort} from '../types';

export function useTaskListControls(tasks: Task[]) {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<TaskSort>('dueDate');
  const today = todayDay();

  const visible = useMemo(
    () => selectVisibleTasks(tasks, {filter, query, sort}, today),
    [tasks, filter, query, sort, today],
  );

  return {filter, setFilter, query, setQuery, sort, setSort, visible, today};
}
