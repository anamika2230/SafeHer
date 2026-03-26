import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { useSOS } from '../context/SOSContext';
import SOSButton from '../components/SOSButton';
import CardView from '../components/CardView';
import RiskBadge from '../components/RiskBadge';
import { getGreeting } from '../utils/formatters';
import { defaultTrustedContacts } from '../utils/sosHelper';
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

export default function HomeScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { sosActive, triggerSOS, loading, riskData } = useSOS();

  const cardsAnim = useRef(
    new Array(4).fill(0).map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  useEffect(() => {
    const animations = cardsAnim.map((a) =>
      Animated.parallel([
        Animated.timing(a.opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(a.translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    );
    Animated.stagger(80, animations).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [tip] = useState(() => {
    const tips = [
      'If you feel uneasy, move toward well-lit areas and stay around people.',
      'Share your live route with a trusted contact before heading out.',
      'Trust your instincts. If something feels off, step away and call for help.',
      'Save SOS contacts and keep your phone charged for emergencies.',
      'When commuting at night, avoid isolated stretches and walk confidently.',
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  });

  const riskLevel = riskData?.riskLevel || 'LOW';
  const targetPercent = riskLevel === 'LOW' ? 100 : riskLevel === 'MEDIUM' ? 60 : 85;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    barAnim.setValue(0);
    Animated.timing(barAnim, {
      toValue: targetPercent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [targetPercent, barAnim]);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const barColor = riskLevel === 'LOW' ? colors.available : riskLevel === 'MEDIUM' ? colors.warning : colors.danger;

  const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: 24 },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 8 },
    leftHeader: { flex: 1 },
    greeting: {
      fontSize: 22,
      fontFamily: fontFamily.bold,
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    subtext: { marginTop: 4, fontSize: 14, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular, color: colors.textSecondary },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    themeCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    iconBtn: { marginLeft: 10 },
    riskCard: { marginHorizontal: 16, marginTop: 16 },
    riskRow1: { flexDirection: 'row', alignItems: 'center' },
    riskLabel: { color: colors.textSecondary, fontSize: 14, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, flex: 1 },
    lastChecked: { marginTop: 10, color: colors.textSecondary, fontSize: 12 },
    progressContainer: { marginTop: 10, height: 4, backgroundColor: colors.border, borderRadius: 999, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: barColor },
    monitorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    monitorDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.available },
    monitorText: { marginLeft: 10, color: colors.textSecondary, fontSize: 14, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },
    sosWrap: { alignItems: 'center', paddingVertical: 32 },
    gridWrap: { paddingHorizontal: 16, marginTop: 4, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    quickCardInner: { alignItems: 'center', justifyContent: 'center' },
    iconBg: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    quickLabel: { fontSize: 13, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, color: colors.text, textAlign: 'center' },
    contactsHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 18 },
    contactsTitle: { fontSize: 16, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold, color: colors.text, flex: 1 },
    editLink: { color: colors.textSecondary, fontSize: 14, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },
    contactsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12 },
    contactItem: { flex: 1, alignItems: 'center' },
    contactAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
    contactInitials: { color: colors.textInverse, fontSize: 16, fontFamily: fontFamily.bold, fontWeight: fontWeight.bold },
    contactName: { marginTop: 8, fontSize: 12, color: colors.textSecondary, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular, textAlign: 'center' },
    tipCard: {
      marginHorizontal: 16,
      marginTop: 16,
      backgroundColor: hexToRgba(colors.accent, 0.15),
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    tipText: { marginLeft: 12, color: colors.text, fontSize: 14, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, flex: 1 },
  });

  const handleSOSPress = async () => {
    try {
      await triggerSOS();
      navigation.navigate('SOSActive');
    } catch {
      Alert.alert('SOS Activation Failed', 'Please try again in a moment.');
    }
  };

  const quickActions = [
    { icon: 'location', label: 'Share Location', onPress: () => navigation.navigate('Tracking') },
    { icon: 'map', label: 'Safe Route', onPress: () => navigation.navigate('SafeRoute') },
    { icon: 'people', label: 'Volunteers', onPress: () => navigation.navigate('Volunteers') },
    { icon: 'heart', label: 'Support', onPress: () => navigation.navigate('Support') },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.leftHeader}>
            <Text style={styles.greeting}>{getGreeting() + ', Priya 👋'}</Text>
            <Text style={styles.subtext}>Stay safe today</Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity activeOpacity={0.8} onPress={toggleTheme}>
              <View style={styles.themeCircle}>
                <Ionicons name={isDark ? 'sunny' : 'moon'} size={20} color={colors.text} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('IncidentHistory')} style={styles.iconBtn}>
              <Ionicons name="notifications" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Risk */}
        <CardView elevation="none" style={[styles.riskCard, { borderRadius: 16 }]}>
          <View style={styles.riskRow1}>
            <Text style={styles.riskLabel}>Current Risk Level</Text>
            <RiskBadge level={riskLevel} />
          </View>
          <Text style={styles.lastChecked}>Last checked: just now</Text>

          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressFill, { width: barWidth }]} />
          </View>

          <View style={styles.monitorRow}>
            <View style={styles.monitorDot} />
            <Text style={styles.monitorText}>AI Monitoring Active</Text>
          </View>
        </CardView>

        {/* SOS */}
        <View style={styles.sosWrap}>
          <SOSButton size={180} isActive={sosActive} onLongPress={handleSOSPress} />
        </View>

        {/* Quick actions */}
        <View style={styles.gridWrap}>
          {quickActions.map((a, idx) => (
            <Animated.View
              // eslint-disable-next-line react/no-array-index-key
              key={a.label}
              style={[
                { width: '48%', aspectRatio: 1 },
                {
                  opacity: cardsAnim[idx].opacity,
                  transform: [{ translateY: cardsAnim[idx].translateY }],
                },
              ]}
            >
              <CardView elevation="sm" onPress={a.onPress} style={styles.quickCardInner}>
                <View style={[styles.iconBg, { backgroundColor: colors.primaryGlow }]}>
                  <Ionicons name={a.icon} size={32} color={colors.primary} />
                </View>
                <Text style={styles.quickLabel}>{a.label}</Text>
              </CardView>
            </Animated.View>
          ))}
        </View>

        {/* Trusted contacts */}
        <View style={styles.contactsHeader}>
          <Text style={styles.contactsTitle}>Trusted Contacts</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Alert.alert('Edit contacts', 'Coming soon.')}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactsRow}>
          {defaultTrustedContacts.map((c) => (
            <View key={c.id} style={styles.contactItem}>
              <View style={[styles.contactAvatar, { backgroundColor: c.color }]}>
                <Text style={styles.contactInitials}>{c.initials}</Text>
              </View>
              <Text style={styles.contactName}>{c.name}</Text>
            </View>
          ))}
        </View>

        {/* Safety tip */}
        {!sosActive ? (
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={24} color={colors.accent} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

