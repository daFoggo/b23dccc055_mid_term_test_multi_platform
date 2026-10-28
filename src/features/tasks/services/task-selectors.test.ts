import {parseDate} from '../../../lib/date';
import type {Task} from '../types';
import {
  daysLeft,
  dueLabel,
  filterTasks,
  getProgress,
  isOverdue,
  searchTasks,
  selectVisibleTasks,
  sortTasks,
} from './task-selectors';

const TODAY = parseDate('15/03/2026')!;

let n = 0;
const task = (over: Partial<Task> = {}): Task => ({
  id: `t${++n}`,
  title: 'Việc',
  note: '',
  category: 'Học tập',
  priority: 'Trung bình',
  dueDate: '20/03/2026',
  done: false,
  ...over,
});

describe('isOverdue', () => {
  test('pending past due is overdue; due today and done are not', () => {
    expect(isOverdue(task({dueDate: '14/03/2026'}), TODAY)).toBe(true);
    expect(isOverdue(task({dueDate: '15/03/2026'}), TODAY)).toBe(false);
    expect(isOverdue(task({dueDate: '10/03/2026', done: true}), TODAY)).toBe(false);
  });
  test('corrupt date is not overdue', () => {
    expect(isOverdue(task({dueDate: 'abc'}), TODAY)).toBe(false);
  });
});

describe('daysLeft / dueLabel', () => {
  test.each([
    ['18/03/2026', 'Còn 3 ngày'],
    ['16/03/2026', 'Còn 1 ngày'],
    ['15/03/2026', 'Hạn hôm nay'],
    ['13/03/2026', 'Quá hạn 2 ngày'],
  ])('%s -> %s', (dueDate, label) => {
    expect(dueLabel(task({dueDate}), TODAY)).toBe(label);
  });
  test('done task shows Đã hoàn thành', () => {
    expect(dueLabel(task({dueDate: '13/03/2026', done: true}), TODAY)).toBe('Đã hoàn thành');
  });
  test('corrupt date has no label and no day count', () => {
    expect(dueLabel(task({dueDate: 'abc'}), TODAY)).toBeNull();
    expect(daysLeft(task({dueDate: 'abc'}), TODAY)).toBeNull();
  });
});

describe('getProgress', () => {
  test('empty list is safe', () => {
    expect(getProgress([])).toEqual({
      done: 0,
      total: 0,
      ratio: 0,
      text: 'Đã hoàn thành 0/0 công việc',
    });
  });
  test('3 of 8', () => {
    const tasks = Array.from({length: 8}, (_, i) => task({done: i < 3}));
    const p = getProgress(tasks);
    expect(p.done).toBe(3);
    expect(p.total).toBe(8);
    expect(p.ratio).toBe(0.375);
    expect(p.text).toBe('Đã hoàn thành 3/8 công việc');
  });
});

describe('filterTasks', () => {
  const overdue = task({dueDate: '10/03/2026'});
  const pending = task({dueDate: '20/03/2026'});
  const done = task({done: true});
  const all = [overdue, pending, done];
  test('all', () => expect(filterTasks(all, 'all', TODAY)).toEqual(all));
  test('pending includes overdue', () =>
    expect(filterTasks(all, 'pending', TODAY)).toEqual([overdue, pending]));
  test('done', () => expect(filterTasks(all, 'done', TODAY)).toEqual([done]));
  test('overdue', () => expect(filterTasks(all, 'overdue', TODAY)).toEqual([overdue]));
});

describe('searchTasks', () => {
  const a = task({title: 'Học nhóm'});
  const b = task({title: 'Đi chợ'});
  test.each([
    ['  HỌC ', [a]],
    ['hoc', [a]],
    ['di', [b]],
    ['', [a, b]],
    ['   ', [a, b]],
  ])('query %j', (q, expected) => {
    expect(searchTasks([a, b], q)).toEqual(expected);
  });
  test('regex characters never throw', () => {
    expect(searchTasks([a, b], '(*[')).toEqual([]);
  });
});

describe('sortTasks', () => {
  test('dueDate compares as dates, not strings', () => {
    const t = ['01/04/2026', '20/03/2026', '05/12/2025'].map(dueDate => task({dueDate}));
    expect(sortTasks(t, 'dueDate').map(x => x.dueDate)).toEqual([
      '05/12/2025',
      '20/03/2026',
      '01/04/2026',
    ]);
  });
  test('priority Cao -> Thấp, ties by due date', () => {
    const t = [
      task({priority: 'Thấp', dueDate: '10/03/2026'}),
      task({priority: 'Cao', dueDate: '20/03/2026'}),
      task({priority: 'Trung bình', dueDate: '01/03/2026'}),
      task({priority: 'Cao', dueDate: '16/03/2026'}),
    ];
    const out = sortTasks(t, 'priority').map(x => `${x.priority} ${x.dueDate}`);
    expect(out).toEqual([
      'Cao 16/03/2026',
      'Cao 20/03/2026',
      'Trung bình 01/03/2026',
      'Thấp 10/03/2026',
    ]);
  });
  test('equal tasks keep original order', () => {
    const a = task();
    const b = task();
    const c = task();
    expect(sortTasks([a, b, c], 'dueDate')).toEqual([a, b, c]);
    expect(sortTasks([a, b, c], 'priority')).toEqual([a, b, c]);
  });
  test('corrupt date sorts last in both sorts', () => {
    const bad = task({dueDate: 'abc'});
    const ok = task({dueDate: '20/03/2026'});
    expect(sortTasks([bad, ok], 'dueDate')).toEqual([ok, bad]);
    expect(sortTasks([bad, ok], 'priority')).toEqual([ok, bad]);
  });
  test('does not mutate its input', () => {
    const input = [task({dueDate: '20/03/2026'}), task({dueDate: '01/03/2026'})];
    const copy = [...input];
    sortTasks(input, 'dueDate');
    expect(input).toEqual(copy);
  });
});

describe('selectVisibleTasks', () => {
  test('filter, search and sort combine', () => {
    const tasks = [
      task({title: 'Họp nhóm đồ án', priority: 'Trung bình', dueDate: '16/03/2026'}),
      task({title: 'Họp lớp', priority: 'Cao', dueDate: '10/03/2026', done: true}),
      task({title: 'Chạy bộ', priority: 'Cao', dueDate: '15/03/2026'}),
    ];
    const out = selectVisibleTasks(tasks, {filter: 'pending', query: 'họp', sort: 'priority'}, TODAY);
    expect(out.map(t => t.title)).toEqual(['Họp nhóm đồ án']);
  });
  test('does not throw with a corrupt date in the list', () => {
    const tasks = [task({dueDate: 'abc'}), task()];
    expect(() =>
      selectVisibleTasks(tasks, {filter: 'overdue', query: '', sort: 'dueDate'}, TODAY),
    ).not.toThrow();
  });
});
