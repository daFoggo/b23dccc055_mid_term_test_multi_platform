// Boc AsyncStorage dang JSON, khong bao gio throw.
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GetResult<T> = {ok: true; value: T | null} | {ok: false};

export async function getJSON<T>(key: string): Promise<GetResult<T>> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) {
      return {ok: true, value: null};
    }
    return {ok: true, value: JSON.parse(raw) as T};
  } catch {
    return {ok: false};
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
