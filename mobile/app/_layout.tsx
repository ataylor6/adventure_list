import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppModeProvider } from '@/context/AppModeContext';

export default function RootLayout() {
  return (
    <AppModeProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppModeProvider>
  );
}
