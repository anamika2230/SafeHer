import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../context/ThemeContext';
import { fontFamily, fontWeight } from '../theme/typography';

export default function SplashScreen({ navigation }) {
  const { colors } = useTheme();

  // Offline-friendly AsyncStorage shim (in-memory).
  const memoryStore = globalThis.__SAFEHER_STORAGE__ || (globalThis.__SAFEHER_STORAGE__ = {});
  const storage = {
    getItem: async (key) =>
      Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null,
    setItem: async (key, value) => {
      memoryStore[key] = value;
    },
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const onboarded = await storage.getItem('safeher_onboarded');
        navigation.replace('MainTabs');
      } catch {
        navigation.replace('MainTabs');
      }
    }, 2500);

    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <Ionicons name="shield-checkmark" size={80} color={colors.textInverse} />
        <Text style={[styles.title, { color: colors.textInverse }]}>SafeHer</Text>
        <Text style={[styles.tagline, { color: colors.textInverse }]}>Your safety, always.</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 42,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    letterSpacing: 3,
  },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontStyle: 'italic',
    opacity: 0.9,
    textAlign: 'center',
  },
});

