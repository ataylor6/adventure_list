import { useLocalSearchParams } from 'expo-router';

import { MissingState } from '@/components/MissingState';
import { ProfileFoldersView } from '@/components/ProfileFoldersView';
import { useFeed } from '@/context/FeedContext';

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { resolveProfile } = useFeed();
  const profile = resolveProfile(username ?? '');

  if (!profile) {
    return (
      <MissingState
        title="User not found"
        message={`We couldn’t find @${username || 'this user'}.`}
      />
    );
  }

  return <ProfileFoldersView profile={profile} showBack />;
}
