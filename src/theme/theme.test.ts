import {PRIORITIES} from '../features/tasks/types';
import {colors, priorityColors, statusColors} from './colors';
import {elevation, metrics, radius, spacing, touchTarget, typography} from './metrics';

const HEX = /^#[0-9A-Fa-f]{6}$/;

test('every colour token is a #RRGGBB string', () => {
  for (const value of Object.values(colors)) {
    expect(value).toMatch(HEX);
  }
  expect(statusColors.overdue).toMatch(HEX);
});

test('priorityColors has exactly the keys of PRIORITIES with background and text', () => {
  expect(Object.keys(priorityColors).sort()).toEqual([...PRIORITIES].sort());
  for (const p of PRIORITIES) {
    expect(priorityColors[p].background).toMatch(HEX);
    expect(priorityColors[p].text).toMatch(HEX);
  }
});

test('typography entries have numeric size and lineHeight', () => {
  for (const style of Object.values(typography)) {
    expect(typeof style.fontSize).toBe('number');
    expect(typeof style.lineHeight).toBe('number');
    expect(style.lineHeight).toBeGreaterThanOrEqual(style.fontSize);
  }
});

test('spacing values are multiples of 4', () => {
  for (const value of Object.values(spacing)) {
    expect(value % 4).toBe(0);
  }
});

test('touchTarget is 48 and radius/elevation tokens are numbers', () => {
  expect(touchTarget).toBe(48);
  expect(metrics.touchTarget).toBe(48);
  expect(radius.medium).toBe(12);
  expect(elevation.level1.elevation).toBe(1);
});
