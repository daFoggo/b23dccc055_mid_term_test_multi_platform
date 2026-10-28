// Spacing, bo goc, chu, do bong va kich thuoc cham.
// Ket hop M3 (thang chu/shape/elevation) voi phong cach phang cua wattprint: the bo 24, o nhap/nut 16, pill cho chip/badge,
// chi 2 do dam (SemiBold, Bold), chi giu do bong rat nhat cho the danh sach (de bai cham co elevation).
import {fontFamily} from './fonts';

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
  control: 16,
  large: 16,
  card: 24,
  extraLarge: 28,
  full: 999,
} as const;

export type TypeStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

export const typography: Record<string, TypeStyle> = {
  headlineSmall: {fontFamily: fontFamily.bold, fontSize: 24, lineHeight: 32, letterSpacing: 0},
  titleLarge: {fontFamily: fontFamily.semibold, fontSize: 22, lineHeight: 28, letterSpacing: 0},
  titleMedium: {fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 24, letterSpacing: 0},
  titleSmall: {fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20, letterSpacing: 0},
  bodyLarge: {fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24, letterSpacing: 0},
  bodyMedium: {fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20, letterSpacing: 0},
  bodySmall: {fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16, letterSpacing: 0.1},
  labelLarge: {fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20, letterSpacing: 0},
  labelMedium: {fontFamily: fontFamily.bold, fontSize: 12, lineHeight: 16, letterSpacing: 0.1},
  labelSmall: {fontFamily: fontFamily.semibold, fontSize: 11, lineHeight: 16, letterSpacing: 0.2},
};

// Muc elevation M3 (0, 1, 3, 6 dp) bieu dien bang elevation (Android) + shadow (iOS); bong rat nhat.
const shadow = (dp: number) => ({
  elevation: dp,
  shadowColor: '#000000',
  shadowOffset: {width: 0, height: dp},
  shadowOpacity: dp === 0 ? 0 : 0.04 + dp * 0.01,
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
