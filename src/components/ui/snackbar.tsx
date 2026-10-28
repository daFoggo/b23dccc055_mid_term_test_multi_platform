// Snackbar M3: thong bao ngan sau thao tac, tu an sau vai giay.
import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import {elevation, radius, spacing, typography} from '../../theme/metrics';

const DURATION_MS = 2500;

type Show = (message: string) => void;
const SnackbarContext = createContext<Show>(() => {});

export function SnackbarProvider({children}: {children: ReactNode}) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  const show = useCallback((text: string) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setMessage(text);
    timer.current = setTimeout(() => setMessage(null), DURATION_MS);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  return (
    <SnackbarContext.Provider value={show}>
      {children}
      {message ? (
        <View
          pointerEvents="none"
          accessibilityLiveRegion="polite"
          style={[styles.bar, {bottom: spacing.lg + insets.bottom}]}>
          <Text style={styles.text}>{message}</Text>
        </View>
      ) : null}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): Show {
  return useContext(SnackbarContext);
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: radius.extraSmall,
    backgroundColor: colors.inverseSurface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...elevation.level3,
  },
  text: {...typography.bodyMedium, color: colors.inverseOnSurface},
});
