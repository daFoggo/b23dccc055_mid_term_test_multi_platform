// Boc AsyncStorage dang JSON, khong bao gio throw.
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GetResult<T> =
  | {ok: true; value: T | null}
  | {ok: false; reason: 'read' | 'parse'};

export async function getJSON<T>(key: string): Promise<GetResult<T>> {
  let raw: string | null;
  try {
    raw = await AsyncStorage.getItem(key);
  } catch {
    return {ok: false, reason: 'read'};
  }
  if (raw === null) {
    return {ok: true, value: null};
  }
  try {
    return {ok: true, value: JSON.parse(raw) as T};
  } catch {
    return {ok: false, reason: 'parse'};
  }
}

export async function setJSON(key: string, value: unknown): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
