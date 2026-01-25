import { useCallback } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendEmail } from 'react-native-email-action';

const emailPayload = {
  to: 'test@gmail.com',
  cc: ['cc@test.com', 'cc2@test.com'],
  bcc: ['bcc@test.com', 'bcc2@test.com'],
  subject: 'Subject Test',
  body: '1st line.\n2nd line.\n3rd line.\n4th line.',
};

function App() {
  const handleSendEmail = useCallback(async () => {
    try {
      const link = await sendEmail(emailPayload);
      console.log('Email client opened', link);
    } catch (error) {
      console.error('Failed to open email client', error);
      Alert.alert(
        'Email unavailable',
        'Could not open an email client on this device.',
      );
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>React Native Email Action</Text>
        <Text style={styles.subtitle}>
          Opens installed email clients with prefilled recipients, subject, and
          body.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
          <Text style={styles.buttonLabel}>Send Test Email</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0d14',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f4f6fb',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#c5cada',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#3d6ef7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  buttonLabel: {
    color: '#f4f6fb',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default App;
