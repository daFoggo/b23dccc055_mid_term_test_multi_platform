// Spacing, bo goc, chu, do bong va kich thuoc cham theo M3 (xem docs/m3/typography-shape-elevation.md).
import type {TextStyle} from 'react-native';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 28,
  full: 999,
} as const;

type TypeStyle = Required<
  Pick<TextStyle, 'fontSize' | 'lineHeight' | 'letterSpacing' | 'fontWeight'>
>;

export const typography: Record<string, TypeStyle> = {
  headlineSmall: {fontSize: 24, lineHeight: 32, letterSpacing: 0, fontWeight: '400'},
  titleLarge: {fontSize: 22, lineHeight: 28, letterSpacing: 0, fontWeight: '400'},
  titleMedium: {fontSize: 16, lineHeight: 24, letterSpacing: 0.15, fontWeight: '500'},
  titleSmall: {fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: '500'},
  bodyLarge: {fontSize: 16, lineHeight: 24, letterSpacing: 0.5, fontWeight: '400'},
  bodyMedium: {fontSize: 14, lineHeight: 20, letterSpacing: 0.25, fontWeight: '400'},
  bodySmall: {fontSize: 12, lineHeight: 16, letterSpacing: 0.4, fontWeight: '400'},
  labelLarge: {fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: '500'},
  labelMedium: {fontSize: 12, lineHeight: 16, letterSpacing: 0.5, fontWeight: '500'},
  labelSmall: {fontSize: 11, lineHeight: 16, letterSpacing: 0.5, fontWeight: '500'},
};

// Muc elevation M3 (0, 1, 3, 6 dp) bieu dien bang elevation (Android) + shadow (iOS).
const shadow = (dp: number) => ({
  elevation: dp,
  shadowColor: '#000000',
  shadowOffset: {width: 0, height: dp},
  shadowOpacity: 0.12 + dp * 0.01,
  shadowRadius: dp * 2,
});

export const elevation = {
  level0: shadow(0),
  level1: shadow(1),
  level2: shadow(3),
  level3: shadow(6),
} as const;

export const touchTarget = 48;

export const metrics = {touchTarget} as const;
