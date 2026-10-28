import {parseDate} from '../../../lib/date';
import type {TaskInput} from '../types';
import {hasErrors, validateTask} from './task-validation';

const TODAY = parseDate('15/03/2026')!;

const valid = (over: Partial<TaskInput> = {}): TaskInput => ({
  title: 'Ôn bài',
  note: '',
  category: 'Học tập',
  priority: 'Trung bình',
  dueDate: '20/03/2026',
  ...over,
});

describe('title', () => {
  test.each(['', '   '])('rejects empty title %j', title => {
    expect(validateTask(valid({title}), 'create', TODAY).title).toBe(
      'Vui lòng nhập tên công việc',
    );
  });
  test('accepts exactly 50 characters and rejects 51', () => {
    expect(validateTask(valid({title: 'a'.repeat(50)}), 'create', TODAY).title).toBeUndefined();
    expect(validateTask(valid({title: 'a'.repeat(51)}), 'create', TODAY).title).toBe(
      'Tên không được quá 50 ký tự',
    );
  });
  test('trims before counting', () => {
    const title = '  ' + 'a'.repeat(50) + '  ';
    expect(validateTask(valid({title}), 'create', TODAY).title).toBeUndefined();
  });
  test('counts NFD input after NFC normalisation', () => {
    const fifty = 'ế'.repeat(50).normalize('NFD');
    const fiftyOne = 'ế'.repeat(51).normalize('NFD');
    expect(validateTask(valid({title: fifty}), 'create', TODAY).title).toBeUndefined();
    expect(validateTask(valid({title: fiftyOne}), 'create', TODAY).title).toBe(
      'Tên không được quá 50 ký tự',
    );
  });
});

describe('dueDate', () => {
  test('rejects empty', () => {
    expect(validateTask(valid({dueDate: ''}), 'create', TODAY).dueDate).toBe(
      'Vui lòng nhập hạn hoàn thành',
    );
  });
  test.each(['1/3/2026', '١٥/٠٣/٢٠٢٦', '15-03-2026'])('rejects bad format %s', dueDate => {
    expect(validateTask(valid({dueDate}), 'create', TODAY).dueDate).toBe(
      'Hạn phải có dạng dd/mm/yyyy',
    );
  });
  test.each(['create', 'edit'] as const)('rejects 31/02/2026 in %s mode', mode => {
    expect(validateTask(valid({dueDate: '31/02/2026'}), mode, TODAY).dueDate).toBe(
      'Ngày không tồn tại',
    );
  });
  test('create rejects yesterday but accepts today', () => {
    expect(validateTask(valid({dueDate: '14/03/2026'}), 'create', TODAY).dueDate).toBe(
      'Hạn không được trước hôm nay',
    );
    expect(validateTask(valid({dueDate: '15/03/2026'}), 'create', TODAY).dueDate).toBeUndefined();
  });
  test('edit accepts a past date', () => {
    expect(validateTask(valid({dueDate: '10/03/2026'}), 'edit', TODAY).dueDate).toBeUndefined();
  });
  test('trims surrounding whitespace', () => {
    expect(validateTask(valid({dueDate: '15/03/2026 '}), 'create', TODAY).dueDate).toBeUndefined();
  });
});

test('hasErrors reflects the error object', () => {
  expect(hasErrors({})).toBe(false);
  expect(hasErrors({title: 'x'})).toBe(true);
  expect(hasErrors(validateTask(valid(), 'create', TODAY))).toBe(false);
});
