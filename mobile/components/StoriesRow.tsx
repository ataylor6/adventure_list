import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import type { Story } from '@/types/api';

type Props = {
  stories: Story[];
  onPressStory?: (story: Story) => void;
};

export function StoriesRow({ stories, onPressStory }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.container}
    >
      {stories.map((story) => {
        const isYou = story.user.username === 'you';
        return (
          <Pressable
            key={story.id}
            style={styles.item}
            onPress={() => onPressStory?.(story)}
          >
            <View style={styles.ringWrap}>
              {story.seen ? (
                <View style={[styles.ring, styles.seenRing]}>
                  <Image source={{ uri: story.user.avatar_url }} style={styles.avatar} />
                </View>
              ) : (
                <LinearGradient
                  colors={[...Colors.storyRing]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ring}
                >
                  <View style={styles.avatarInner}>
                    <Image source={{ uri: story.user.avatar_url }} style={styles.avatar} />
                  </View>
                </LinearGradient>
              )}
              {isYou && (
                <View style={styles.addBadge}>
                  <Ionicons name="add" size={14} color="#fff" />
                </View>
              )}
            </View>
            <Text style={styles.username} numberOfLines={1}>
              {isYou ? 'Your story' : story.user.username}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  row: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 14,
  },
  item: {
    width: 74,
    alignItems: 'center',
  },
  ringWrap: {
    position: 'relative',
  },
  ring: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seenRing: {
    borderWidth: 1.5,
    borderColor: Colors.storySeen,
    padding: 2,
  },
  avatarInner: {
    backgroundColor: Colors.background,
    borderRadius: 32,
    padding: 2,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EFEFEF',
  },
  addBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0095F6',
    borderWidth: 2,
    borderColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.text,
    width: '100%',
    textAlign: 'center',
  },
});
