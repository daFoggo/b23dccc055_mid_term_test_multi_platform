// Tien ich ngay thang dd/mm/yyyy: parse, kiem tra ngay that, so ngay, dinh dang.

const MS_PER_DAY = 86_400_000;
const DATE_PATTERN = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

/** So ngay ke tu epoch (lich duong, khong gio). */
export type DayNumber = number;

export function parseDate(s: string): DayNumber | null {
  const match = DATE_PATTERN.exec(s);
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const t = Date.UTC(year, month - 1, day);
  const d = new Date(t);
  if (
    d.getUTCFullYear() !== year ||
    d.getUTCMonth() !== month - 1 ||
    d.getUTCDate() !== day
  ) {
    return null;
  }
  return t / MS_PER_DAY;
}

export function isRealDate(s: string): boolean {
  return parseDate(s) !== null;
}

export function todayDay(now: Date = new Date()): DayNumber {
  return (
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / MS_PER_DAY
  );
}

export function diffDays(from: DayNumber, to: DayNumber): number {
  return to - from;
}

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

export function formatDate(d: Date): string {
  return `${pad(d.getDate(), 2)}/${pad(d.getMonth() + 1, 2)}/${pad(
    d.getFullYear(),
    4,
  )}`;
}

export function addDaysToToday(n: number, now: Date = new Date()): string {
  return formatDate(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + n),
  );
}

/** Giu toi da 8 chu so va tu chen '/' thanh dd/mm/yyyy. */
export function formatDateInput(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '').slice(0, 8);
  let out = digits.slice(0, 2);
  if (digits.length > 2) {
    out += '/' + digits.slice(2, 4);
  }
  if (digits.length > 4) {
    out += '/' + digits.slice(4, 8);
  }
  return out;
}
