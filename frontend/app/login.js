import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Paragraph,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { theme, spacing } from '../utils/theme';
import api from '../utils/api';
import { useRouter } from 'expo-router';
import logo from '../assets/images/logo_new.png';

export default function LoginScreen() {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!employeeNumber || !otp) {
      Alert.alert('Error', 'Please enter both Employee Number and OTP');
      return;
    }

    console.log('Attempting login with:', { employeeNumber, otp });
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        employeeNumber,
        otp,
      });

      console.log('Login response:', response.data);
      console.log('Response data user:', response.data.data);

      if (response.data.success) {
        const loginSuccess = await login(response.data);
        if (loginSuccess) {
          router.replace('/(tabs)');
        } else {
          Alert.alert('Error', 'Failed to save login data');
        }
      } else {
        Alert.alert('Error', response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Unable to connect to the server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Image source={logo} style={styles.logo} />
              <Paragraph style={styles.subtitle}>
                Continuous Improvement Platform
              </Paragraph>
            </View>

            <Card style={styles.card}>
              <Card.Content>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  Sign In
                </Text>

                <TextInput
                  label="Employee Number"
                  value={employeeNumber}
                  onChangeText={setEmployeeNumber}
                  mode="outlined"
                  style={styles.input

                  }
                  keyboardType="numeric"
                />

                <TextInput
                  label="OTP"
                  value={otp}
                  onChangeText={setOtp}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  secureTextEntry
                />

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  style={styles.button}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#FFFFFF" /> : 'Sign In'}
                </Button>

                <View style={styles.demoInfo}>
                  <Text variant="bodySmall" style={styles.demoTitle}>
                    Demo Credentials:
                  </Text>
                  <Text variant="bodySmall" style={styles.demoText}>
                    Employee: 12345 (Employee), 67890 (Reviewer), 11111 (Admin)
                  </Text>
                  <Text variant="bodySmall" style={styles.demoText}>
                    OTP: 1234
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.md,
    resizeMode: 'contain',
    borderRadius : 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    elevation: 4,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: theme.colors.primary,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor:'#fff',
  },
  button: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  demoInfo: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
  },
  demoTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: theme.colors.onSurfaceVariant,
  },
  demoText: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
});
