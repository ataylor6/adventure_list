import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppModeProvider } from '@/context/AppModeContext';
import { FeedProvider } from '@/context/FeedContext';

export default function RootLayout() {
  return (
    <AppModeProvider>
      <FeedProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(app)" />
        </Stack>
      </FeedProvider>
    </AppModeProvider>
  );
}
