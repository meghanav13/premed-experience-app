import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import {
  DMSerifDisplay_400Regular,
  useFonts as useDMSerif,
} from '@expo-google-fonts/dm-serif-display';
import {
  DMSans_400Regular,
  DMSans_700Bold,
  useFonts as useDMSans,
} from '@expo-google-fonts/dm-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ExperiencesProvider } from '@/context/ExperiencesContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Keep splash visible until fonts are ready
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [serifLoaded] = useDMSerif({ DMSerifDisplay_400Regular });
  const [sansLoaded] = useDMSans({ DMSans_400Regular, DMSans_700Bold });

  useEffect(() => {
    if (serifLoaded && sansLoaded) {
      SplashScreen.hideAsync();
    }
  }, [serifLoaded, sansLoaded]);

  if (!serifLoaded || !sansLoaded) return null;

  return (
    <ExperiencesProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="add"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen
            name="draft"
            options={{ headerShown: false }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ExperiencesProvider>
  );
}
