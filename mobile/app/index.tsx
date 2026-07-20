import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppMode } from '@/context/AppModeContext';
import { api } from '@/services/api';

export default function AdventureListSignupScreen() {
  const { isFullApp } = useAppMode();
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (isFullApp) {
    return <Redirect href="/(app)/home" />;
  }

  const onRequestAccount = async () => {
    const trimmedEmail = email.trim();
    const trimmedHandle = handle.trim().replace(/^@/, '');

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      Alert.alert('Email required', 'Please enter a valid email address.');
      return;
    }
    if (!trimmedHandle) {
      Alert.alert('Handle required', 'Please choose an account handle.');
      return;
    }
    if (submitting || submitted) {
      return;
    }

    setSubmitting(true);
    try {
      await api.createBetaLead(trimmedEmail, trimmedHandle);
      setSubmitted(true);
      Alert.alert(
        "You're on the list!",
        `We'll email ${trimmedEmail} when Adventure List is ready for @${trimmedHandle} to test.`,
      );
    } catch (e) {
      Alert.alert(
        'Could not sign up',
        e instanceof Error ? e.message : 'Something went wrong. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top 2/3 — image */}
        <View style={styles.logoWrap}>
          <Image
            source={require('../assets/adventure-list-logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Adventure List"
          />
        </View>

        {/* Bottom 1/3 — copy + form */}
        <View style={styles.bottom}>
          <Text style={styles.pitch}>
            Sign up to be a beta tester and get updates when the app is ready for you
            to test!
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor="#9A9A9A"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />

            <Text style={styles.label}>Account handle</Text>
            <View style={styles.handleRow}>
              <Text style={styles.at}>@</Text>
              <TextInput
                style={[styles.input, styles.handleInput]}
                value={handle}
                onChangeText={setHandle}
                placeholder="yourhandle"
                placeholderTextColor="#9A9A9A"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                textContentType="username"
                returnKeyType="done"
                onSubmitEditing={onRequestAccount}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                (submitted || submitting) && styles.buttonDone,
              ]}
              onPress={onRequestAccount}
              disabled={submitting || submitted}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {submitted ? 'Request sent' : 'Request account'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  flex: {
    flex: 1,
  },
  // flex: 2 + flex: 1 = top 2/3, bottom 1/3 of *available* space (after safe area)
  logoWrap: {
    flex: 2,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 28,
    paddingTop: 0,
    paddingBottom: 8,
    marginTop: -28,
  },
  pitch: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4A5550',
    textAlign: 'center',
  },
  form: {
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C2B24',
    marginTop: 2,
    marginBottom: 2,
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: '#D5D8D4',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1C2B24',
    backgroundColor: '#FFFFFF',
  },
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  at: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C2B24',
    marginRight: 8,
  },
  handleInput: {
    flex: 1,
  },
  button: {
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1C2B24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonDone: {
    backgroundColor: '#3D5A4A',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
