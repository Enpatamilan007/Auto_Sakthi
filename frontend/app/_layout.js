import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider } from '../context/UserContext';
import { IdeaProvider } from '../context/IdeaContext';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { theme as customTheme } from '../utils/theme';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...customTheme.colors,
  },
};

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <UserProvider>
          <IdeaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="adminDashboard" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </IdeaProvider>
        </UserProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}