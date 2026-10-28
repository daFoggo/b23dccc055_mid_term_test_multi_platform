// Tao id duy nhat (thoi gian + bo dem + ngau nhien), khong can thu vien ngoai.

let counter = 0;

export function createId(): string {
  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
