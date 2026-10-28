import { createId } from './id';

test('createId returns unique ids across 1000 calls', () => {
  const ids = new Set<string>();
  for (let i = 0; i < 1000; i++) {
    ids.add(createId());
  }
  expect(ids.size).toBe(1000);
});
