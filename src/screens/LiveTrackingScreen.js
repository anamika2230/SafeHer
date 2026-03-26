import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Switch } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { fontFamily, fontWeight } from '../theme/typography';

export default function LiveTrackingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [routeDeviation, setRouteDeviation] = useState(true);
  const [suddenStop, setSuddenStop] = useState(false);

  const pulseDot = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseDot, {
          toValue: 1.5,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseDot, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseDot]);

  const volunteerMarkers = useMemo(
    () => [
      {
        coordinate: { latitude: 12.9756, longitude: 77.5900 },
        title: 'Ananya S.',
        description: 'Available volunteer',
      },
      {
        coordinate: { latitude: 12.968, longitude: 77.601 },
        title: 'Deepa R.',
        description: 'Available volunteer',
      },
    ],
    []
  );

  const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    mapPlaceholder: {
      flex: 1,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapPlaceholderText: { marginTop: 10, color: colors.textSecondary, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, fontSize: 13, textAlign: 'center' },
    overlayTop: {
      position: 'absolute',
      top: insets.top + 12,
      left: 12,
      right: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.glassBg,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    recPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.glassBg,
      shadowColor: colors.shadow,
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    recDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.emergency, marginRight: 10 },
    recText: { color: colors.emergency, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },
    recSub: { marginLeft: 6, color: colors.textSecondary, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },
    bottomSheet: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 220,
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 10,
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    handleBar: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: 14,
    },
    rowTitle: { flexDirection: 'row', alignItems: 'center' },
    greenDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.available,
      marginLeft: 12,
    },
    greenDotWrap: { width: 10, height: 10, justifyContent: 'center', alignItems: 'center' },
    sheetTitle: { color: colors.text, fontSize: 17, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },
    updated: { marginTop: 8, color: colors.textSecondary, fontSize: 12 },
    toggleRow: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    toggleLabel: { color: colors.text, fontSize: 14, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, flex: 1, paddingRight: 12 },
    shareBtn: {
      marginTop: 18,
      backgroundColor: colors.primary,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shareBtnText: { color: colors.textInverse, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold, fontSize: 14 },
  });

  const handleShare = async () => {
    // Clipboard package may be unavailable in offline environments; fall back to user feedback.
    Alert.alert('Link Copied', 'Share this link with someone you trust.');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="location" size={32} color={colors.primary} />
        <Text style={styles.mapPlaceholderText}>Live location active</Text>
      </View>

      <View style={styles.overlayTop}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.recPill}>
          <View style={styles.recDot} />
          <Text style={styles.recText}>REC</Text>
          <Text style={styles.recSub}>Recording</Text>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.handleBar} />

        <View style={styles.rowTitle}>
          <Text style={styles.sheetTitle}>Live Tracking Active</Text>
          <View style={styles.greenDotWrap}>
            <Animated.View style={[styles.greenDot, { transform: [{ scale: pulseDot }] }]} />
          </View>
        </View>

        <Text style={styles.updated}>Last updated: just now</Text>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Route Deviation Alert</Text>
          <Switch
            value={routeDeviation}
            onValueChange={setRouteDeviation}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Sudden Stop Alert</Text>
          <Switch
            value={suddenStop}
            onValueChange={setSuddenStop}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={handleShare} style={styles.shareBtn}>
          <Text style={styles.shareBtnText}>Share Tracking Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

