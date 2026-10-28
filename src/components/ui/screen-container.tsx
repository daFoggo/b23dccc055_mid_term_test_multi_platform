// Khung man hinh: vung an toan + nen surface; tuy chon cuon va tranh ban phim.
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type {ReactNode} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/metrics';

type Props = {children: ReactNode; scroll?: boolean};

export function ScreenContainer({children, scroll = false}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      {scroll ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.surface},
  flex: {flex: 1},
  scrollContent: {padding: spacing.lg},
});
