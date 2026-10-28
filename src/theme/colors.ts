// Bang mau M3 theo vai tro (baseline light scheme, seed #6750A4) + mau uu tien/trang thai.
import type {Priority} from '../features/tasks/types';

export const colors = {
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  tertiary: '#7D5260',
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
  surface: '#FEF7FF',
  onSurface: '#1D1B20',
  onSurfaceVariant: '#49454F',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F7F2FA',
  surfaceContainer: '#F3EDF7',
  surfaceContainerHigh: '#ECE6F0',
  surfaceContainerHighest: '#E6E0E9',
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  inverseSurface: '#322F35',
  inverseOnSurface: '#F5EFF7',
  scrim: '#000000',
} as const;

// Do (Cao), vang (Trung binh), xanh (Thap) theo de bai.
export const priorityColors: Record<
  Priority,
  {background: string; text: string}
> = {
  Cao: {background: '#F9DEDC', text: '#8C1D18'},
  'Trung bình': {background: '#FFE8A3', text: '#5C4300'},
  Thấp: {background: '#C8EBCB', text: '#0F5223'},
};

export const statusColors = {
  overdue: '#B3261E',
} as const;
