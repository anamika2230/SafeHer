import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import CardView from './CardView';
import RiskBadge from './RiskBadge';
import { useTheme } from '../context/ThemeContext';
import { formatDate, formatTime } from '../utils/formatters';
import { fontFamily, fontWeight } from '../theme/typography';

function getTriggerMeta(trigger) {
  if (trigger === 'AI Detected') {
    return { icon: 'brain', label: 'AI Detected' };
  }
  if (trigger === 'Voice') {
    return { icon: 'mic', label: 'Voice' };
  }
  return { icon: 'hand-left', label: 'Manual' };
}

export default function IncidentCard({ incident, onViewReport, onExport }) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row1: { flexDirection: 'row', alignItems: 'center' },
        row2: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
        row3: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
        dateTime: {
          color: colors.text,
          fontFamily: fontFamily.medium,
          fontWeight: fontWeight.medium,
          fontSize: 14,
          flex: 1,
        },
        durationChip: {
          marginLeft: 'auto',
          backgroundColor: colors.border,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 999,
          color: colors.textSecondary,
          fontSize: 12,
          fontFamily: fontFamily.regular,
          fontWeight: fontWeight.regular,
        },
        triggerChip: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 6,
        },
        triggerText: {
          marginLeft: 6,
          color: colors.textSecondary,
          fontSize: 12,
          fontFamily: fontFamily.medium,
          fontWeight: fontWeight.medium,
        },
        contactsText: {
          color: colors.textSecondary,
          fontSize: 12,
          marginLeft: 10,
          fontFamily: fontFamily.regular,
          fontWeight: fontWeight.regular,
        },
        viewBtn: {
          marginLeft: 'auto',
          paddingHorizontal: 10,
          paddingVertical: 6,
        },
        viewBtnText: {
          color: colors.primary,
          fontFamily: fontFamily.semibold,
          fontWeight: fontWeight.semibold,
          fontSize: 13,
        },
        exportBtn: {
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surface,
        },
      }),
    [colors]
  );

  const { icon, label } = getTriggerMeta(incident.trigger);

  return (
    <CardView elevation="sm" style={{ marginHorizontal: 16, marginVertical: 6 }}>
      <View style={styles.row1}>
        <Text style={styles.dateTime}>
          {formatDate(incident.date)} {formatTime(incident.time)}
        </Text>
        <RiskBadge level={incident.riskLevel} size="sm" />
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ marginLeft: 10 }}
          onPress={onExport}
          accessibilityRole="button"
        >
          <View style={styles.exportBtn}>
            <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.row2}>
        <Ionicons name="location-pin" size={16} color={colors.textSecondary} />
        <Text style={{ color: colors.text, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular, fontSize: 13, marginLeft: 8, flex: 1 }} numberOfLines={1}>
          {incident.location}
        </Text>
        <Text style={styles.durationChip}>{incident.duration}</Text>
      </View>

      <View style={styles.row3}>
        <View style={styles.triggerChip}>
          <Ionicons name={icon} size={14} color={colors.textSecondary} />
          <Text style={styles.triggerText}>{label}</Text>
        </View>
        <Text style={styles.contactsText}>{incident.contactsNotified} contacts notified</Text>

        <TouchableOpacity activeOpacity={0.8} onPress={onViewReport} style={styles.viewBtn}>
          <Text style={styles.viewBtnText}>View Report</Text>
        </TouchableOpacity>
      </View>
    </CardView>
  );
}

