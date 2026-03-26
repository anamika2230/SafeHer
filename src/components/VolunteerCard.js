import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import CardView from './CardView';
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

function RatingStars({ rating, starColor, emptyColor }) {
  const filled = Math.floor(Number(rating));
  const stars = new Array(5).fill(0).map((_, idx) => (idx < filled ? '★' : '☆'));
  return (
    <Text style={{ color: starColor, fontSize: 13 }}>
      {stars.map((s, idx) => (
        <Text key={`${s}-${idx}`} style={{ color: idx < filled ? starColor : emptyColor }}>
          {s}
        </Text>
      ))}
    </Text>
  );
}

export default function VolunteerCard({ volunteer, onAlert }) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row1: { flexDirection: 'row', alignItems: 'center' },
        avatar: {
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        },
        avatarText: {
          color: colors.textInverse,
          fontSize: 16,
          fontWeight: '800',
          fontFamily: fontFamily.bold,
        },
        name: {
          fontSize: 16,
          fontWeight: fontWeight.semibold,
          color: colors.text,
          flex: 1,
        },
        statusPill: {
          alignSelf: 'flex-start',
          borderRadius: 999,
          paddingHorizontal: 8,
          paddingVertical: 3,
          fontSize: 11,
          fontWeight: '700',
        },
        row2: { marginTop: 8, flexDirection: 'row', alignItems: 'center' },
        distance: { color: colors.textSecondary, fontSize: 13 },
        starsWrap: { marginLeft: 'auto' },
        row3: {
          marginTop: 8,
          flexDirection: 'row',
          alignItems: 'center',
        },
        response: { color: colors.textSecondary, fontSize: 13, flex: 1 },
        alertBtn: {
          backgroundColor: colors.primary,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 8,
          alignItems: 'center',
          justifyContent: 'center',
        },
        alertBtnDisabled: {
          backgroundColor: colors.border,
        },
        alertBtnText: {
          color: colors.textInverse,
          fontFamily: fontFamily.semibold,
          fontSize: 14,
          fontWeight: fontWeight.semibold,
        },
        alertBtnTextDisabled: {
          color: colors.textSecondary,
        },
      }),
    [colors]
  );

  const status = volunteer.status;
  const isAvailable = status === 'Available';
  const avatarBg = volunteer.color || colors.primary;

  const badgeBg = isAvailable
    ? hexToRgba(colors.available, 0.18)
    : hexToRgba(colors.busy, 0.18);
  const badgeText = isAvailable ? colors.available : colors.busy;

  return (
    <CardView elevation="sm" style={{ marginHorizontal: 16, marginVertical: 6 }}>
      <View style={styles.row1}>
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text style={styles.avatarText}>{volunteer.initials}</Text>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {volunteer.name}
        </Text>

        <View style={[styles.statusPill, { backgroundColor: badgeBg }]}>
          <Text style={{ color: badgeText }}>{status}</Text>
        </View>
      </View>

      <View style={styles.row2}>
        <Text style={styles.distance}>{volunteer.distance} km away</Text>
        <View style={styles.starsWrap}>
          <RatingStars rating={volunteer.rating} starColor={colors.star} emptyColor={colors.textTertiary} />
        </View>
      </View>

      <View style={styles.row3}>
        <Text style={styles.response}>~{volunteer.responseTime} min response</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onAlert(volunteer)}
          disabled={!isAvailable}
          style={[styles.alertBtn, !isAvailable ? styles.alertBtnDisabled : null]}
        >
          <Text style={[styles.alertBtnText, !isAvailable ? styles.alertBtnTextDisabled : null]}>
            Alert
          </Text>
        </TouchableOpacity>
      </View>
    </CardView>
  );
}

