// State form them/sua: gia tri, loi (hien sau lan Luu dau), submit.
import {useRef, useState} from 'react';
import {formatDate, formatDateInput, todayDay} from '../../../lib/date';
import {hasErrors, validateTask} from '../services/task-validation';
import type {TaskErrors} from '../services/task-validation';
import type {Task, TaskInput} from '../types';

type Options = {
  mode: 'create' | 'edit';
  initial?: Task;
  onValid: (v: TaskInput) => void;
};

function initialValues(initial?: Task): TaskInput {
  if (initial) {
    return {
      title: initial.title,
      note: initial.note,
      category: initial.category,
      priority: initial.priority,
      dueDate: initial.dueDate,
    };
  }
  return {
    title: '',
    note: '',
    category: 'Học tập',
    priority: 'Trung bình',
    dueDate: formatDate(new Date()),
  };
}

export function useTaskForm({mode, initial, onValid}: Options) {
  const [values, setValues] = useState<TaskInput>(() => initialValues(initial));
  const [errors, setErrors] = useState<TaskErrors>({});
  const submitted = useRef(false);
  const done = useRef(false);

  const check = (v: TaskInput) => validateTask(v, mode, todayDay());

  const setField = <K extends keyof TaskInput>(key: K, value: TaskInput[K]) => {
    const next = {
      ...values,
      [key]: key === 'dueDate' ? formatDateInput(String(value)) : value,
    } as TaskInput;
    setValues(next);
    if (submitted.current) {
      setErrors(check(next));
    }
  };

  const submit = () => {
    if (done.current) {
      return;
    }
    submitted.current = true;
    const found = check(values);
    setErrors(found);
    if (hasErrors(found)) {
      return;
    }
    done.current = true;
    onValid({
      ...values,
      title: values.title.trim(),
      note: values.note.trim(),
      dueDate: values.dueDate.trim(),
    });
  };

  return {values, errors, setField, submit};
}
