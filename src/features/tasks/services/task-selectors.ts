// Ham thuan: qua han, nhan so ngay, tien do, loc, tim kiem, sap xep.
import {diffDays, parseDate} from '../../../lib/date';
import type {DayNumber} from '../../../lib/date';
import {PRIORITY_RANK} from '../types';
import type {Task, TaskFilter, TaskSort} from '../types';

export type Controls = {filter: TaskFilter; query: string; sort: TaskSort};

export function isOverdue(t: Task, today: DayNumber): boolean {
  const due = parseDate(t.dueDate);
  return !t.done && due !== null && due < today;
}

export function daysLeft(t: Task, today: DayNumber): number | null {
  const due = parseDate(t.dueDate);
  return due === null ? null : diffDays(today, due);
}

export function dueLabel(t: Task, today: DayNumber): string | null {
  if (t.done) {
    return 'Đã hoàn thành';
  }
  const n = daysLeft(t, today);
  if (n === null) {
    return null;
  }
  if (n > 0) {
    return `Còn ${n} ngày`;
  }
  if (n === 0) {
    return 'Hạn hôm nay';
  }
  return `Quá hạn ${-n} ngày`;
}

export function getProgress(tasks: Task[]): {
  done: number;
  total: number;
  ratio: number;
  text: string;
} {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const ratio = total === 0 ? 0 : Math.min(1, Math.max(0, done / total));
  return {done, total, ratio, text: `Đã hoàn thành ${done}/${total} công việc`};
}

export function filterTasks(
  tasks: Task[],
  f: TaskFilter,
  today: DayNumber,
): Task[] {
  switch (f) {
    case 'pending':
      return tasks.filter(t => !t.done);
    case 'done':
      return tasks.filter(t => t.done);
    case 'overdue':
      return tasks.filter(t => isOverdue(t, today));
    default:
      return tasks;
  }
}

function fold(s: string): string {
  try {
    return s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase();
  } catch {
    return s.toLowerCase();
  }
}

export function searchTasks(tasks: Task[], query: string): Task[] {
  const q = fold(query.trim());
  if (q === '') {
    return tasks;
  }
  return tasks.filter(t => fold(t.title).includes(q));
}

const NO_DATE = Number.POSITIVE_INFINITY;

function dueOf(t: Task): number {
  return parseDate(t.dueDate) ?? NO_DATE;
}

function rankOf(t: Task): number {
  return PRIORITY_RANK[t.priority] ?? Number.MAX_SAFE_INTEGER;
}

export function sortTasks(tasks: Task[], s: TaskSort): Task[] {
  const indexed = tasks.map((t, i) => ({t, i}));
  indexed.sort((a, b) => {
    const byDue = compare(dueOf(a.t), dueOf(b.t));
    const byRank = compare(rankOf(a.t), rankOf(b.t));
    const primary = s === 'dueDate' ? byDue || byRank : byRank || byDue;
    return primary || a.i - b.i;
  });
  return indexed.map(x => x.t);
}

function compare(a: number, b: number): number {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
}

export function selectVisibleTasks(
  tasks: Task[],
  controls: Controls,
  today: DayNumber,
): Task[] {
  return sortTasks(
    searchTasks(filterTasks(tasks, controls.filter, today), controls.query),
    controls.sort,
  );
}

export type FilterCounts = Record<TaskFilter, number>;

export function getFilterCounts(tasks: Task[], today: DayNumber): FilterCounts {
  return {
    all: tasks.length,
    pending: filterTasks(tasks, 'pending', today).length,
    done: filterTasks(tasks, 'done', today).length,
    overdue: filterTasks(tasks, 'overdue', today).length,
  };
}
