import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { FeedMode } from '@/constants/adventureFeed';

type ExploreModeContextValue = {
  mode: FeedMode;
  selectMode: (mode: FeedMode) => void;
};

const ExploreModeContext = createContext<ExploreModeContextValue | null>(null);

export function ExploreModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<FeedMode>('travel');

  const selectMode = useCallback((next: FeedMode) => {
    setMode(next);
  }, []);

  const value = useMemo(() => ({ mode, selectMode }), [mode, selectMode]);

  return (
    <ExploreModeContext.Provider value={value}>{children}</ExploreModeContext.Provider>
  );
}

export function useExploreMode() {
  const ctx = useContext(ExploreModeContext);
  if (!ctx) {
    throw new Error('useExploreMode must be used within ExploreModeProvider');
  }
  return ctx;
}
