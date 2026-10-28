import AsyncStorage from '@react-native-async-storage/async-storage';
import { getJSON, setJSON } from './storage';

afterEach(() => {
  jest.restoreAllMocks();
});

test('getJSON returns null value for a missing key', async () => {
  expect(await getJSON('missing')).toEqual({ ok: true, value: null });
});

test('setJSON then getJSON round-trips', async () => {
  expect(await setJSON('a', [1, 2])).toBe(true);
  expect(await getJSON<number[]>('a')).toEqual({ ok: true, value: [1, 2] });
});

test('getJSON reports failure for corrupted JSON', async () => {
  await AsyncStorage.setItem('bad', '{bad');
  expect(await getJSON('bad')).toEqual({ ok: false });
});

test('getJSON reports failure when getItem rejects', async () => {
  jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('io'));
  expect(await getJSON('x')).toEqual({ ok: false });
});

test('setJSON returns false when setItem rejects', async () => {
  jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('io'));
  expect(await setJSON('x', 1)).toBe(false);
});
