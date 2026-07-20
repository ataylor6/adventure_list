import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import type { AppMode } from '@/constants/config';
import { Colors } from '@/constants/theme';
import { api } from '@/services/api';

type AppModeContextValue = {
  mode: AppMode;
  isWaitlist: boolean;
  isFullApp: boolean;
  refresh: () => Promise<void>;
};

const AppModeContext = createContext<AppModeContextValue | null>(null);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const health = await api.getHealth();
      setMode(health.mode === 'full' ? 'full' : 'waitlist');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach API');
      // Safe default if API is down — stay on waitlist signup
      setMode('waitlist');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo<AppModeContextValue | null>(() => {
    if (!mode) return null;
    return {
      mode,
      isWaitlist: mode === 'waitlist',
      isFullApp: mode === 'full',
      refresh,
    };
  }, [mode, refresh]);

  if (!value) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={Colors.accentBlue} />
        <Text style={styles.bootText}>Connecting…</Text>
        {error ? <Text style={styles.bootError}>{error}</Text> : null}
      </View>
    );
  }

  return <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>;
}

export function useAppMode() {
  const ctx = useContext(AppModeContext);
  if (!ctx) {
    throw new Error('useAppMode must be used within AppModeProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAF8',
    gap: 12,
    paddingHorizontal: 24,
  },
  bootText: {
    fontSize: 16,
    color: '#4A5550',
  },
  bootError: {
    fontSize: 13,
    color: '#8B4513',
    textAlign: 'center',
  },
});
