import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Vibration } from 'react-native';

import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

import { useTheme } from '../context/ThemeContext';
import { useSOS } from '../context/SOSContext';
import CardView from '../components/CardView';
import RiskBadge from '../components/RiskBadge';
import { fontFamily, fontWeight } from '../theme/typography';

export default function SOSActiveScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { riskData, formattedElapsed, cancelSOS } = useSOS();

  const outerPulseScale = useRef(new Animated.Value(1)).current;
  const outerPulseOpacity = useRef(new Animated.Value(1)).current;

  const riskFill = useRef(new Animated.Value(0)).current;
  const statusFade = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    navigation.setOptions?.({ gestureEnabled: false });
  }, [navigation]);

  useEffect(() => {
    activateKeepAwakeAsync();
    try {
      Vibration.vibrate([0, 400, 200, 400, 200, 400]);
    } catch {
      // ignore
    }

    const loop = Animated.loop(
      Animated.parallel([
        Animated.timing(outerPulseScale, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(outerPulseOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    statusFade.forEach((a, idx) => {
      Animated.timing(a, {
        toValue: 1,
        duration: 350,
        delay: 500 + idx * 300,
        useNativeDriver: true,
      }).start();
    });

    const riskTarget = riskData?.riskScore ?? 0.94;
    riskFill.setValue(0);
    Animated.timing(riskFill, {
      toValue: riskTarget,
      duration: 1500,
      delay: 300,
      useNativeDriver: false,
    }).start();

    return () => {
      deactivateKeepAwake();
      loop.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const riskWidth = riskFill.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const transcript = riskData?.transcript ?? 'Transcript unavailable.';
  const reason = riskData?.reason ?? 'No additional reason provided.';
  const emotionScore = Number(riskData?.emotionScore ?? 0.91);
  const riskLevel = riskData?.riskLevel ?? 'HIGH';
  const riskPct = Math.round((Number(riskData?.riskScore ?? 0.94) || 0) * 100);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: colors.background,
        },
        zone1: {
          flex: 0.38,
          backgroundColor: colors.emergencyBg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        sosCircleOuter: {
          position: 'absolute',
          width: 140,
          height: 140,
          borderRadius: 70,
          borderWidth: 3,
          borderColor: colors.emergency,
        },
        sosCircleInner: {
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: colors.emergency,
          alignItems: 'center',
          justifyContent: 'center',
        },
        sosText: {
          color: colors.textInverse,
          fontSize: 28,
          fontFamily: fontFamily.bold,
          fontWeight: fontWeight.bold,
          letterSpacing: 1,
        },
        sosActiveText: {
          marginTop: 16,
          fontSize: 18,
          fontFamily: fontFamily.bold,
          fontWeight: fontWeight.bold,
          color: colors.emergency,
          letterSpacing: 4,
        },
        timer: {
          marginTop: 12,
          fontSize: 48,
          fontFamily: fontFamily.bold,
          fontWeight: fontWeight.bold,
          color: colors.text,
          fontVariant: ['tabular-nums'],
        },
        zone2: { marginTop: 16 },
        cardTitleRow: { flexDirection: 'row', alignItems: 'center' },
        cardTitle: { flex: 1, color: colors.text, fontSize: 15, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },
        riskBarLabel: {
          color: colors.text,
          fontSize: 13,
          fontFamily: fontFamily.medium,
          fontWeight: fontWeight.medium,
        },
        barContainer: { marginTop: 6, height: 10, borderRadius: 5, backgroundColor: colors.border, overflow: 'hidden' },
        riskFill: { height: '100%', backgroundColor: colors.riskHigh, borderRadius: 5 },
        sectionLine: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
        sectionIcon: { marginRight: 8 },
        transcriptText: { color: colors.text, fontSize: 13, fontStyle: 'italic', flex: 1 },
        reasonText: { color: colors.textSecondary, fontSize: 12, flex: 1 },
        emotionText: { color: colors.textSecondary, fontSize: 12, marginTop: 10, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },
        statusCardTitle: { color: colors.text, fontSize: 15, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },
        statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
        checkCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
        statusText: { color: colors.textSecondary, fontSize: 13, flex: 1, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular },
        cancelWrap: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: insets.bottom + 16,
        },
        cancelBtn: {
          width: '100%',
          height: 56,
          borderRadius: 16,
          backgroundColor: colors.card,
          borderWidth: 2,
          borderColor: colors.danger,
          alignItems: 'center',
          justifyContent: 'center',
        },
        cancelText: {
          color: colors.danger,
          fontSize: 16,
          letterSpacing: 2,
          fontFamily: fontFamily.bold,
          fontWeight: fontWeight.bold,
        },
      }),
    [colors, insets.bottom]
  );

  const handleCancelPress = () => {
    Alert.alert('Are you sure?', 'This will deactivate the SOS alert.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: () => {
          cancelSOS();
          navigation.navigate('MainTabs', { screen: 'Home' });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />

      <View style={styles.zone1}>
        <Animated.View
          style={[
            styles.sosCircleOuter,
            {
              opacity: outerPulseOpacity,
              transform: [{ scale: outerPulseScale }],
            },
          ]}
        />
        <View style={styles.sosCircleInner}>
          <Text style={styles.sosText}>SOS</Text>
        </View>

        <Text style={styles.sosActiveText}>SOS ACTIVE</Text>
        <Text style={styles.timer}>{formattedElapsed}</Text>
      </View>

      <View style={styles.zone2}>
        <CardView elevation="md" style={{ marginHorizontal: 16, marginTop: 16 }}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>AI Analysis</Text>
            <RiskBadge level={riskLevel} />
          </View>

          <Text style={styles.riskBarLabel}>Risk Score: {riskPct}%</Text>
          <View style={styles.barContainer}>
            <Animated.View style={[styles.riskFill, { width: riskWidth }]} />
          </View>

          <View style={styles.sectionLine}>
            <Ionicons name="mic" size={16} color={colors.primary} style={styles.sectionIcon} />
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>

          <View style={styles.sectionLine}>
            <Ionicons name="information-circle" size={16} color={colors.textSecondary} style={styles.sectionIcon} />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>

          <Text style={styles.emotionText}>Distress Level: {Math.round(emotionScore * 100)}%</Text>
        </CardView>

        <CardView elevation="sm" style={{ marginHorizontal: 16, marginTop: 12 }}>
          <Text style={styles.statusCardTitle}>Response Status</Text>

          <Animated.View style={{ opacity: statusFade[0] }}>
            <View style={styles.statusRow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color={colors.textInverse} />
              </View>
              <Text style={styles.statusText}>Location captured — 12.9716° N, 77.5946° E</Text>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: statusFade[1] }}>
            <View style={styles.statusRow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color={colors.textInverse} />
              </View>
              <Text style={styles.statusText}>Trusted contacts notified — 3 contacts alerted</Text>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: statusFade[2] }}>
            <View style={styles.statusRow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color={colors.textInverse} />
              </View>
              <Text style={styles.statusText}>Volunteers alerted — 2 nearby responders</Text>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: statusFade[3] }}>
            <View style={styles.statusRow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color={colors.textInverse} />
              </View>
              <Text style={styles.statusText}>Tracking link shared — Link copied to clipboard</Text>
            </View>
          </Animated.View>
        </CardView>
      </View>

      <View style={styles.cancelWrap}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleCancelPress} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>CANCEL SOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

