// Bang mau theo vai tro M3 (seed #6750A4) nhung be mat trung tinh kieu wattprint:
// nen trang xam #F4F4F4, the trang (chenh mau thay cho vien/bong), o nhap xam dac.
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
  surface: '#F4F4F4',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#5F5F63',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#FFFFFF',
  surfaceContainer: '#F0F0F0',
  surfaceContainerHigh: '#ECEEED',
  surfaceContainerHighest: '#E0E3E1',
  outline: '#79747E',
  outlineVariant: '#E0E3E1',
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
