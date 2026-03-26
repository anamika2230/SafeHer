import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CardView from './CardView';
import { useTheme } from '../context/ThemeContext';
import { fontFamily, fontWeight } from '../theme/typography';

export default function SafeRouteCard({ route, onNavigate }) {
  const { colors } = useTheme();

  const barAnim = useRef(new Animated.Value(0)).current;

  const targetPct = useMemo(() => (Number(route.safetyScore) / 10) * 100, [route.safetyScore]);

  useEffect(() => {
    barAnim.setValue(0);
    Animated.timing(barAnim, {
      toValue: targetPct,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [barAnim, targetPct]);

  const scoreColor = Number(route.safetyScore) > 7 ? colors.success : Number(route.safetyScore) >= 5 ? colors.warning : colors.danger;

  const barWidth = barAnim.interpolate({
    inputRange: [0, targetPct || 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row1: { flexDirection: 'row', alignItems: 'center' },
        routeName: {
          fontSize: 16,
          color: colors.text,
          fontFamily: fontFamily.semibold,
          fontWeight: fontWeight.semibold,
          flex: 1,
        },
        recommended: {
          borderRadius: 999,
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: colors.successBg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.success,
        },
        recommendedText: {
          color: colors.success,
          fontFamily: fontFamily.semibold,
          fontWeight: fontWeight.semibold,
          fontSize: 12,
        },
        row2: { marginTop: 10 },
        scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
        barContainer: {
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.border,
          overflow: 'hidden',
        },
        barFill: {
          height: '100%',
          borderRadius: 4,
        },
        scoreText: { marginLeft: 10, color: colors.textSecondary, fontSize: 13 },
        pillRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
        distancePill: {
          backgroundColor: colors.secondary,
          borderRadius: 999,
          paddingHorizontal: 12,
          paddingVertical: 6,
          marginRight: 10,
        },
        pillTextInverse: { color: colors.textInverse, fontSize: 12, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },
        etaPill: {
          backgroundColor: colors.surface,
          borderRadius: 999,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        tagsWrap: { marginTop: 10 },
        tag: {
          backgroundColor: colors.surface,
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 6,
          marginRight: 8,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        tagText: { color: colors.textSecondary, fontSize: 11, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular },
        row4: { marginTop: 14 },
        navBtn: {
          width: '100%',
          height: 48,
          borderRadius: 14,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        navBtnText: {
          color: colors.textInverse,
          fontFamily: fontFamily.semibold,
          fontWeight: fontWeight.semibold,
          fontSize: 14,
        },
      }),
    [colors]
  );

  return (
    <CardView elevation="md" style={{ marginHorizontal: 16, marginVertical: 6 }}>
      <View style={styles.row1}>
        <Text style={styles.routeName}>{route.name}</Text>
        {route.recommended ? (
          <View style={styles.recommended}>
            <Text style={styles.recommendedText}>Recommended</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.row2}>
        <View style={styles.scoreRow}>
          <View style={styles.barContainer}>
            <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: scoreColor }]} />
          </View>
          <Text style={styles.scoreText}>{Math.round(Number(route.safetyScore) * 10) / 10}</Text>
        </View>
      </View>

      <View style={styles.pillRow}>
        <View style={styles.distancePill}>
          <Text style={styles.pillTextInverse}> {route.distance} </Text>
        </View>
        <View style={styles.etaPill}>
          <Text style={{ color: colors.textSecondary, fontSize: 12, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium }}>
            {route.eta}
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsWrap}>
        {route.tags?.map((t) => (
          <View key={t} style={styles.tag}>
            <Text style={styles.tagText}>{t}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.row4}>
        <TouchableOpacity activeOpacity={0.8} onPress={onNavigate} style={styles.navBtn}>
          <Text style={styles.navBtnText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </CardView>
  );
}

