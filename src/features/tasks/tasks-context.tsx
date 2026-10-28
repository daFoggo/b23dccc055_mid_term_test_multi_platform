// State danh sach cong viec: reducer, nap/luu AsyncStorage, hook useTasks.
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import type {ReactNode} from 'react';
import {createId} from '../../lib/id';
import {loadTasks, saveTasks} from './services/task-storage';
import type {Task, TaskInput} from './types';

export type State = {status: 'loading' | 'ready'; tasks: Task[]};

export type Action =
  | {type: 'hydrate'; tasks: Task[]}
  | {type: 'add'; task: Task}
  | {type: 'update'; id: string; input: TaskInput}
  | {type: 'toggle'; id: string}
  | {type: 'remove'; id: string}
  | {type: 'removeDone'};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return {status: 'ready', tasks: action.tasks};
    case 'add':
      return {...state, tasks: [...state.tasks, action.task]};
    case 'update':
      if (!state.tasks.some(t => t.id === action.id)) {
        return state;
      }
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.id ? {...t, ...action.input} : t,
        ),
      };
    case 'toggle':
      if (!state.tasks.some(t => t.id === action.id)) {
        return state;
      }
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.id ? {...t, done: !t.done} : t,
        ),
      };
    case 'remove':
      if (!state.tasks.some(t => t.id === action.id)) {
        return state;
      }
      return {...state, tasks: state.tasks.filter(t => t.id !== action.id)};
    case 'removeDone':
      if (!state.tasks.some(t => t.done)) {
        return state;
      }
      return {...state, tasks: state.tasks.filter(t => !t.done)};
  }
}

export type TasksApi = {
  tasks: Task[];
  isReady: boolean;
  getTask: (id: string) => Task | undefined;
  addTask: (input: TaskInput) => string;
  updateTask: (id: string, input: TaskInput) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  removeDoneTasks: () => number;
};

const TasksContext = createContext<TasksApi | null>(null);

export function TasksProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(reducer, {status: 'loading', tasks: []});
  const skipNextWrite = useRef(true);
  const writeChain = useRef<Promise<unknown>>(Promise.resolve());
  const warned = useRef(false);
  const canPersist = useRef(true);

  useEffect(() => {
    let cancelled = false;
    loadTasks().then(({tasks, persist}) => {
      if (!cancelled) {
        canPersist.current = persist;
        dispatch({type: 'hydrate', tasks});
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state.status !== 'ready') {
      return;
    }
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    if (!canPersist.current) {
      return;
    }
    const snapshot = state.tasks;
    writeChain.current = writeChain.current
      .then(() => saveTasks(snapshot))
      .then(ok => {
        if (!ok && !warned.current) {
          warned.current = true;
          console.warn('Không lưu được dữ liệu công việc');
        }
      });
  }, [state]);

  const addTask = useCallback((input: TaskInput) => {
    const task: Task = {...input, id: createId(), done: false};
    dispatch({type: 'add', task});
    return task.id;
  }, []);
  const updateTask = useCallback(
    (id: string, input: TaskInput) => dispatch({type: 'update', id, input}),
    [],
  );
  const toggleTask = useCallback(
    (id: string) => dispatch({type: 'toggle', id}),
    [],
  );
  const removeTask = useCallback(
    (id: string) => dispatch({type: 'remove', id}),
    [],
  );

  const tasks = state.tasks;
  const api = useMemo<TasksApi>(
    () => ({
      tasks,
      isReady: state.status === 'ready',
      getTask: id => tasks.find(t => t.id === id),
      addTask,
      updateTask,
      toggleTask,
      removeTask,
      removeDoneTasks: () => {
        const count = tasks.filter(t => t.done).length;
        dispatch({type: 'removeDone'});
        return count;
      },
    }),
    [tasks, state.status, addTask, updateTask, toggleTask, removeTask],
  );

  // Man hinh loading that se them o buoc UI; luc nay chi chan render khi chua nap xong.
  if (state.status === 'loading') {
    return null;
  }
  return <TasksContext.Provider value={api}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksApi {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks must be used inside TasksProvider');
  }
  return ctx;
}
