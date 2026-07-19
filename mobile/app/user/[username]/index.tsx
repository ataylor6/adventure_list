import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ProfileFoldersView } from '@/components/ProfileFoldersView';
import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { resolveProfile } = useFeed();
  const profile = resolveProfile(username ?? '');

  if (!profile) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>User not found</Text>
      </View>
    );
  }

  return <ProfileFoldersView profile={profile} showBack />;
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  missingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
