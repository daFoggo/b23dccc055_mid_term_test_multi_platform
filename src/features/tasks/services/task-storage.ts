// Nap/luu danh sach cong viec bang AsyncStorage; chi seed khi chua co key hoac du lieu hong.
import {getJSON, setJSON} from '../../../lib/storage';
import {CATEGORIES, PRIORITIES} from '../types';
import type {Task} from '../types';
import {createSeedTasks} from './seed-data';

export const TASKS_KEY = 'plannerApp.tasks.v1';

export function isTask(x: unknown): x is Task {
  if (typeof x !== 'object' || x === null) {
    return false;
  }
  const t = x as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.note === 'string' &&
    typeof t.dueDate === 'string' &&
    typeof t.done === 'boolean' &&
    (CATEGORIES as readonly unknown[]).includes(t.category) &&
    (PRIORITIES as readonly unknown[]).includes(t.priority)
  );
}

export async function loadTasks(now: Date = new Date()): Promise<Task[]> {
  const result = await getJSON<unknown>(TASKS_KEY);
  if (result.ok && Array.isArray(result.value)) {
    return result.value.filter(isTask);
  }
  const seed = createSeedTasks(now);
  await setJSON(TASKS_KEY, seed);
  return seed;
}

export function saveTasks(tasks: Task[]): Promise<boolean> {
  return setJSON(TASKS_KEY, tasks);
}
