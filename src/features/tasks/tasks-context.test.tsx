import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {createSeedTasks} from './services/seed-data';
import {TASKS_KEY} from './services/task-storage';
import {TasksProvider, reducer, useTasks} from './tasks-context';
import type {State} from './tasks-context';
import type {Task, TaskInput} from './types';

const task = (over: Partial<Task> = {}): Task => ({
  id: 'a',
  title: 'Việc',
  note: '',
  category: 'Học tập',
  priority: 'Cao',
  dueDate: '20/03/2026',
  done: false,
  ...over,
});
const ready = (tasks: Task[]): State => ({status: 'ready', tasks});

describe('reducer', () => {
  test('hydrate sets tasks and marks ready', () => {
    expect(reducer({status: 'loading', tasks: []}, {type: 'hydrate', tasks: [task()]})).toEqual(
      ready([task()]),
    );
  });
  test('add appends the given task', () => {
    const out = reducer(ready([task()]), {type: 'add', task: task({id: 'b'})});
    expect(out.tasks.map(t => t.id)).toEqual(['a', 'b']);
  });
  test('update keeps id and done', () => {
    const input: TaskInput = {title: 'Mới', note: 'n', category: 'Cá nhân', priority: 'Thấp', dueDate: '01/04/2026'};
    const out = reducer(ready([task({done: true})]), {type: 'update', id: 'a', input});
    expect(out.tasks[0]).toEqual({...input, id: 'a', done: true});
  });
  test('toggle flips done', () => {
    expect(reducer(ready([task()]), {type: 'toggle', id: 'a'}).tasks[0].done).toBe(true);
  });
  test('remove and removeDone', () => {
    const s = ready([task({id: 'a'}), task({id: 'b', done: true}), task({id: 'c', done: true})]);
    expect(reducer(s, {type: 'remove', id: 'a'}).tasks.map(t => t.id)).toEqual(['b', 'c']);
    expect(reducer(s, {type: 'removeDone'}).tasks.map(t => t.id)).toEqual(['a']);
  });
  test('unknown id returns the identical state object', () => {
    const s = ready([task()]);
    expect(reducer(s, {type: 'toggle', id: 'zzz'})).toBe(s);
    expect(reducer(s, {type: 'remove', id: 'zzz'})).toBe(s);
    expect(reducer(s, {type: 'update', id: 'zzz', input: task()})).toBe(s);
  });
});

describe('TasksProvider', () => {
  let api: ReturnType<typeof useTasks>;
  function Probe() {
    api = useTasks();
    return null;
  }
  const settle = async () => {
    for (let i = 0; i < 6; i++) {
      await ReactTestRenderer.act(async () => {
        await new Promise<void>(r => setTimeout(r, 0));
      });
    }
  };
  const mount = async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <TasksProvider>
          <Probe />
        </TasksProvider>,
      );
    });
    await settle();
  };

  beforeEach(async () => {
    await AsyncStorage.clear();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('hydrates the 8 seed tasks on first run', async () => {
    await mount();
    expect(api.isReady).toBe(true);
    expect(api.tasks).toHaveLength(8);
    expect(api.tasks).toEqual(createSeedTasks());
  });

  test('does not write to storage when hydrating existing data', async () => {
    await AsyncStorage.setItem(TASKS_KEY, '[]');
    const spy = jest.spyOn(AsyncStorage, 'setItem');
    await mount();
    expect(api.isReady).toBe(true);
    expect(api.tasks).toEqual([]);
    expect(spy).not.toHaveBeenCalled();
  });

  test('does not persist anything when the initial read keeps failing', async () => {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify([]));
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValue(new Error('io'));
    const setSpy = jest.spyOn(AsyncStorage, 'setItem');
    await mount();
    await ReactTestRenderer.act(async () => {
      api.toggleTask(api.tasks[0].id);
    });
    await settle();
    expect(setSpy).not.toHaveBeenCalled();
  });

  test('addTask persists the new task and returns its id', async () => {
    await AsyncStorage.setItem(TASKS_KEY, '[]');
    await mount();
    let id = '';
    await ReactTestRenderer.act(async () => {
      id = api.addTask({title: 'Mới', note: '', category: 'Cá nhân', priority: 'Thấp', dueDate: '20/03/2026'});
    });
    await settle();
    expect(api.getTask(id)?.title).toBe('Mới');
    expect(api.getTask(id)?.done).toBe(false);
    const stored = JSON.parse((await AsyncStorage.getItem(TASKS_KEY))!);
    expect(stored.map((t: Task) => t.id)).toEqual([id]);
  });

  test('removeDoneTasks returns the removed count', async () => {
    await mount();
    let removed = -1;
    await ReactTestRenderer.act(async () => {
      removed = api.removeDoneTasks();
    });
    await settle();
    expect(removed).toBe(3);
    expect(api.tasks).toHaveLength(5);
    expect(JSON.parse((await AsyncStorage.getItem(TASKS_KEY))!)).toHaveLength(5);
  });

  test('toggle and remove update state', async () => {
    await mount();
    const first = api.tasks[0];
    await ReactTestRenderer.act(async () => {
      api.toggleTask(first.id);
    });
    expect(api.getTask(first.id)?.done).toBe(!first.done);
    await ReactTestRenderer.act(async () => {
      api.removeTask(first.id);
    });
    expect(api.getTask(first.id)).toBeUndefined();
  });
});
