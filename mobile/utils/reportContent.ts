import { Alert } from 'react-native';

export type PostReportReason = 'stolen_content' | 'non_travel_posts';

export const POST_REPORT_OPTIONS: {
  id: PostReportReason;
  label: string;
}[] = [
  { id: 'stolen_content', label: 'Stolen content' },
  { id: 'non_travel_posts', label: 'Non travel posts' },
];

function submitReport(detail?: string) {
  Alert.alert(
    'Report submitted',
    detail
      ? `Thanks for reporting “${detail}”. Our team will review it.`
      : 'Thanks for letting us know. Our team will review it.',
  );
}

/** Mock report flow for another user’s profile. */
export function reportProfile(username: string) {
  Alert.alert(
    'Report profile',
    `Report @${username} for inappropriate content? This won’t notify them.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Report',
        style: 'destructive',
        onPress: () => submitReport('inappropriate content'),
      },
    ],
  );
}

/** Confirm a post report with the chosen reason. */
export function submitPostReport(reason: PostReportReason) {
  const label =
    POST_REPORT_OPTIONS.find((o) => o.id === reason)?.label ?? 'this issue';
  submitReport(label);
}
