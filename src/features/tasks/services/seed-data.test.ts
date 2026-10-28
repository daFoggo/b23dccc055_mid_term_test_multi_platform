import {parseDate, todayDay} from '../../../lib/date';
import {createSeedTasks} from './seed-data';
import {getProgress, isOverdue} from './task-selectors';

const NOW = new Date(2026, 2, 15, 10);
const TODAY = todayDay(NOW);

test('creates the 8 sample tasks with unique ids', () => {
  const tasks = createSeedTasks(NOW);
  expect(tasks).toHaveLength(8);
  expect(new Set(tasks.map(t => t.id)).size).toBe(8);
});

test('has 3 done tasks, at least 2 overdue, and one due today', () => {
  const tasks = createSeedTasks(NOW);
  expect(getProgress(tasks).done).toBe(3);
  expect(tasks.filter(t => isOverdue(t, TODAY)).length).toBeGreaterThanOrEqual(2);
  expect(tasks.filter(t => parseDate(t.dueDate) === TODAY && !t.done)).toHaveLength(1);
});

test('mixes categories and priorities', () => {
  const tasks = createSeedTasks(NOW);
  expect(new Set(tasks.map(t => t.category)).size).toBe(4);
  expect(new Set(tasks.map(t => t.priority)).size).toBe(3);
});
