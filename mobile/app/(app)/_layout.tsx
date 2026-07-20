import { Redirect, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppTabBar } from '@/components/AppTabBar';
import { useAppMode } from '@/context/AppModeContext';

export default function AppLayout() {
  const { isWaitlist } = useAppMode();

  if (isWaitlist) {
    return <Redirect href="/" />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
      </View>
      <AppTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
