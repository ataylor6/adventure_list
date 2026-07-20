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
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppMode } from '@/context/AppModeContext';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { isWaitlist } = useAppMode();
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isWaitlist) {
    return <Redirect href="/" />;
  }

  if (isLoggedIn) {
    return <Redirect href="/(app)/home" />;
  }

  const onLogin = async () => {
    const trimmedHandle = handle.trim().replace(/^@/, '');

    if (!trimmedHandle) {
      Alert.alert('Handle required', 'Please enter your account handle.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Password required', 'Please enter your password.');
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    try {
      // Mock auth — accept any credentials for beta testing
      await new Promise((r) => setTimeout(r, 400));
      login(trimmedHandle);
      router.replace('/(app)/home');
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
        <View style={styles.logoWrap}>
          <Image
            source={require('../assets/adventure-list-logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Adventure List"
          />
        </View>

        <View style={styles.bottom}>
          <Text style={styles.pitch}>
            Welcome back — log in to explore adventures and plan your next trip.
          </Text>

          <View style={styles.form}>
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
                returnKeyType="next"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#9A9A9A"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={onLogin}
            />

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                submitting && styles.buttonDone,
              ]}
              onPress={onLogin}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Log in</Text>
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
    color: '#000000',
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
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  at: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  handleInput: {
    flex: 1,
  },
  button: {
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonDone: {
    backgroundColor: 'rgba(90, 200, 250, 0.55)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
