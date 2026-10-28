// Kiem tra du lieu form thong bao loi ngay duoi o nhap.
import {parseDate} from '../../../lib/date';
import type {DayNumber} from '../../../lib/date';
import type {TaskInput} from '../types';

export type TaskErrors = Partial<Record<'title' | 'dueDate', string>>;

const FORMAT = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
const MAX_TITLE = 50;

function titleLength(title: string): number {
  try {
    return title.normalize('NFC').length;
  } catch {
    return title.length;
  }
}

export function validateTask(
  v: TaskInput,
  mode: 'create' | 'edit',
  today: DayNumber,
): TaskErrors {
  const errors: TaskErrors = {};

  const title = v.title.trim();
  if (title === '') {
    errors.title = 'Vui lòng nhập tên công việc';
  } else if (titleLength(title) > MAX_TITLE) {
    errors.title = 'Tên không được quá 50 ký tự';
  }

  const due = v.dueDate.trim();
  if (due === '') {
    errors.dueDate = 'Vui lòng nhập hạn hoàn thành';
  } else if (!FORMAT.test(due)) {
    errors.dueDate = 'Hạn phải có dạng dd/mm/yyyy';
  } else {
    const day = parseDate(due);
    if (day === null) {
      errors.dueDate = 'Ngày không tồn tại';
    } else if (mode === 'create' && day < today) {
      errors.dueDate = 'Hạn không được trước hôm nay';
    }
  }

  return errors;
}

export const hasErrors = (e: TaskErrors): boolean => Object.keys(e).length > 0;
