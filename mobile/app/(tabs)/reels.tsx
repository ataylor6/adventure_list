import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

export default function ReelsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Ionicons name="play-circle-outline" size={56} color={Colors.text} />
        <Text style={styles.title}>Reels</Text>
        <Text style={styles.body}>
          Vertical short-form feed stub — add a paging FlatList + video player here.
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
