import {
  addDaysToToday,
  diffDays,
  formatDate,
  formatDateInput,
  isRealDate,
  parseDate,
  todayDay,
} from './date';

const NOW = new Date(2026, 2, 15, 10);

describe('parseDate', () => {
  test('parses a valid date to a day number', () => {
    expect(parseDate('15/03/2026')).toBe(Date.UTC(2026, 2, 15) / 86_400_000);
  });
  test.each([
    '31/02/2026',
    '29/02/2026',
    '29/02/2100',
    '5/3/2026',
    '15-03-2026',
    '',
    '15/03/20261',
    '00/03/2026',
    '15/13/2026',
    '15/03/0026',
    '١٥/٠٣/٢٠٢٦',
  ])('rejects %s', input => {
    expect(parseDate(input)).toBeNull();
  });
  test.each(['29/02/2028', '29/02/2000'])('accepts leap day %s', input => {
    expect(parseDate(input)).not.toBeNull();
  });
});

describe('isRealDate', () => {
  test('mirrors parseDate', () => {
    expect(isRealDate('28/02/2026')).toBe(true);
    expect(isRealDate('31/02/2026')).toBe(false);
  });
});

describe('diffDays / todayDay', () => {
  test('is DST-safe across the Berlin spring-forward day', () => {
    const a = parseDate('15/03/2026')!;
    const b = parseDate('30/03/2026')!;
    expect(diffDays(a, b)).toBe(15);
  });
  test('is negative when target is earlier', () => {
    expect(diffDays(parseDate('15/03/2026')!, parseDate('14/03/2026')!)).toBe(-1);
  });
  test('todayDay ignores the time of day', () => {
    expect(todayDay(new Date(2026, 2, 15, 23, 59))).toBe(parseDate('15/03/2026'));
  });
});

describe('formatDate / addDaysToToday', () => {
  test('pads day and month', () => {
    expect(formatDate(new Date(2026, 2, 5))).toBe('05/03/2026');
  });
  test('adds and subtracts days relative to now', () => {
    expect(addDaysToToday(2, NOW)).toBe('17/03/2026');
    expect(addDaysToToday(-15, NOW)).toBe('28/02/2026');
  });
});

describe('formatDateInput', () => {
  test.each([
    ['15032026', '15/03/2026'],
    ['150', '15/0'],
    ['15/', '15'],
    ['ab12', '12'],
    ['150320269999', '15/03/2026'],
    ['15/03/2026', '15/03/2026'],
    ['', ''],
  ])('%s -> %s', (raw, expected) => {
    expect(formatDateInput(raw)).toBe(expected);
  });
});
