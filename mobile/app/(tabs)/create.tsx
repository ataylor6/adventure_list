import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

export default function CreateScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Ionicons name="camera-outline" size={56} color={Colors.text} />
        <Text style={styles.title}>New post</Text>
        <Text style={styles.body}>
          Skeleton placeholder — wire this up to image picker + POST /api/posts next.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  body: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
