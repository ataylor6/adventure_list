import { ProfileFoldersView } from '@/components/ProfileFoldersView';
import { useFeed } from '@/context/FeedContext';

export default function ProfileScreen() {
  const { myProfile } = useFeed();
  return <ProfileFoldersView profile={myProfile} />;
}
