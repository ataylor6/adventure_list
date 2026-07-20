import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppModeProvider } from '@/context/AppModeContext';
import { AuthProvider } from '@/context/AuthContext';
import { FeedProvider } from '@/context/FeedContext';

export default function RootLayout() {
  return (
    <AppModeProvider>
      <AuthProvider>
        <FeedProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(app)" />
          </Stack>
        </FeedProvider>
      </AuthProvider>
    </AppModeProvider>
  );
}
