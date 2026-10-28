import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSeedTasks} from './seed-data';
import {TASKS_KEY, isTask, loadTasks, saveTasks} from './task-storage';

const NOW = new Date(2026, 2, 15, 10);

beforeEach(async () => {
  await AsyncStorage.clear();
});
afterEach(() => {
  jest.restoreAllMocks();
});

test('first run returns the seed and persists it', async () => {
  const {tasks, persist} = await loadTasks(NOW);
  expect(persist).toBe(true);
  expect(tasks).toEqual(createSeedTasks(NOW));
  expect(JSON.parse((await AsyncStorage.getItem(TASKS_KEY))!)).toEqual(tasks);
});

test('a stored empty array stays empty (no reseed)', async () => {
  await AsyncStorage.setItem(TASKS_KEY, '[]');
  expect((await loadTasks(NOW)).tasks).toEqual([]);
});

test('corrupt JSON reseeds and overwrites', async () => {
  await AsyncStorage.setItem(TASKS_KEY, '{bad');
  const r = await loadTasks(NOW);
  expect(r).toEqual({tasks: createSeedTasks(NOW), persist: true});
  expect(JSON.parse((await AsyncStorage.getItem(TASKS_KEY))!)).toHaveLength(8);
});

test('a non-array value reseeds', async () => {
  await AsyncStorage.setItem(TASKS_KEY, '{"a":1}');
  expect((await loadTasks(NOW)).tasks).toEqual(createSeedTasks(NOW));
});

test('invalid elements are dropped and valid ones kept', async () => {
  const good = createSeedTasks(NOW)[0];
  const bad = {...good, id: 'x', category: 'Khác'};
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify([good, bad, 5, null]));
  expect((await loadTasks(NOW)).tasks).toEqual([good]);
});

test('a transient read failure retries once and keeps the stored list', async () => {
  const stored = createSeedTasks(NOW).slice(0, 3);
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(stored));
  jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('io'));
  const r = await loadTasks(NOW);
  expect(r).toEqual({tasks: stored, persist: true});
});

test('a persistent read failure shows the seed but never writes over storage', async () => {
  const stored = createSeedTasks(NOW).slice(0, 3);
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(stored));
  jest.spyOn(AsyncStorage, 'getItem').mockRejectedValue(new Error('io'));
  const setSpy = jest.spyOn(AsyncStorage, 'setItem');
  const r = await loadTasks(NOW);
  expect(r).toEqual({tasks: createSeedTasks(NOW), persist: false});
  expect(setSpy).not.toHaveBeenCalled();
  jest.restoreAllMocks();
  expect(JSON.parse((await AsyncStorage.getItem(TASKS_KEY))!)).toEqual(stored);
});

test('saveTasks stores JSON and returns true', async () => {
  const tasks = createSeedTasks(NOW).slice(0, 2);
  expect(await saveTasks(tasks)).toBe(true);
  expect(JSON.parse((await AsyncStorage.getItem(TASKS_KEY))!)).toEqual(tasks);
});

test('isTask validates shape and enums', () => {
  const t = createSeedTasks(NOW)[0];
  expect(isTask(t)).toBe(true);
  expect(isTask({...t, priority: 'Khẩn'})).toBe(false);
  expect(isTask({...t, done: 'no'})).toBe(false);
  expect(isTask(undefined)).toBe(false);
});
