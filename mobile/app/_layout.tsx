import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppModeProvider } from '@/context/AppModeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ExploreModeProvider } from '@/context/ExploreModeContext';
import { FeedProvider } from '@/context/FeedContext';

export default function RootLayout() {
  return (
    <AppModeProvider>
      <AuthProvider>
        <FeedProvider>
          <ExploreModeProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="(app)" />
            </Stack>
          </ExploreModeProvider>
        </FeedProvider>
      </AuthProvider>
    </AppModeProvider>
  );
}
