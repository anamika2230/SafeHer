import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../context/ThemeContext';
import { fontFamily, fontWeight } from '../theme/typography';

function hexToRgba(hex, alpha) {
  const value = String(hex).replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const int = parseInt(full, 16);
  // eslint-disable-next-line no-bitwise
  const r = (int >> 16) & 255;
  // eslint-disable-next-line no-bitwise
  const g = (int >> 8) & 255;
  // eslint-disable-next-line no-bitwise
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function OnboardingScreen({ navigation }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  // Offline-friendly AsyncStorage shim (in-memory).
  const memoryStore = globalThis.__SAFEHER_STORAGE__ || (globalThis.__SAFEHER_STORAGE__ = {});
  const storage = {
    getItem: async (key) =>
      Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null,
    setItem: async (key, value) => {
      memoryStore[key] = value;
    },
  };

  const listRef = useRef(null);
  const [index, setIndex] = useState(0);

  const slides = useMemo(
    () => [
      {
        key: 's1',
        icon: 'shield-checkmark',
        title: 'Always Protected',
        subtitle: 'AI detects danger before you even press a button.',
        color: colors.primary,
      },
      {
        key: 's2',
        icon: 'location',
        title: 'Real-Time Tracking',
        subtitle: 'Share your live location with trusted contacts instantly.',
        color: colors.secondary,
      },
      {
        key: 's3',
        icon: 'people',
        title: 'Community Network',
        subtitle: 'Verified volunteers nearby are alerted when you need help.',
        color: colors.riskLow,
      },
    ],
    [colors]
  );

  const dotWidth = useRef([new Animated.Value(8), new Animated.Value(8), new Animated.Value(8)]).current;

  useEffect(() => {
    dotWidth.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === index ? 24 : 8,
        friction: 4,
        tension: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [index, dotWidth]);

  const isLast = index === slides.length - 1;

  const goNext = () => {
    if (isLast) return;
    const nextIndex = index + 1;
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setIndex(nextIndex);
  };

  const handleGetStarted = async () => {
    try {
      await storage.setItem('safeher_onboarded', 'true');
    } catch {
      // Ignore storage failure in offline mode.
    }
    navigation.replace('MainTabs');
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: { flex: 1, backgroundColor: colors.background },
        slide: {
          width,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
        },
        iconCircle: {
          width: 100,
          height: 100,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
        },
        title: {
          fontSize: 28,
          fontFamily: fontFamily.bold,
          fontWeight: fontWeight.bold,
          color: colors.text,
          textAlign: 'center',
          marginTop: 24,
        },
        subtitle: {
          fontSize: 16,
          fontFamily: fontFamily.regular,
          fontWeight: fontWeight.regular,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 24,
          marginHorizontal: 32,
          marginTop: 12,
        },
        bottom: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 16,
          paddingBottom: 22,
          paddingTop: 8,
        },
        dotsRow: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 14,
        },
        dotBase: { height: 8, borderRadius: 999 },
        dotActive: { backgroundColor: colors.primary },
        dotInactive: { backgroundColor: colors.border },
        skipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
        skipText: { color: colors.textSecondary, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },
        cta: {
          height: 56,
          borderRadius: 16,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        ctaText: {
          color: colors.textInverse,
          fontFamily: fontFamily.semibold,
          fontWeight: fontWeight.semibold,
          fontSize: 16,
        },
      }),
    [colors, width]
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconCircle, { backgroundColor: hexToRgba(item.color, 0.2) }]}>
              <Ionicons name={item.icon} size={52} color={item.color} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
        onMomentumScrollEnd={(e) => {
          const nextIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(nextIndex);
        }}
      />

      <View style={styles.bottom}>
        <View style={styles.dotsRow}>
          {slides.map((_, i) => {
            const active = i === index;
            return (
              <Animated.View
                key={`dot-${i}`}
                style={[
                  styles.dotBase,
                  active ? styles.dotActive : styles.dotInactive,
                  { width: dotWidth[i] },
                ]}
              />
            );
          })}
        </View>

        <View style={styles.skipRow}>
          {isLast ? null : (
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.replace('MainTabs')}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.cta} onPress={isLast ? handleGetStarted : goNext}>
          <Text style={styles.ctaText}>{isLast ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

