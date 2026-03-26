import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SOSButton from '../components/SOSButton';
import { useSOS } from '../context/SOSContext';
import { useTheme } from '../context/ThemeContext';
import { fontFamily, fontWeight } from '../theme/typography';
import { getGreeting } from '../utils/formatters';

// ✅ VOICE IMPORT
import { startListening } from '../utils/voiceTrigger';

function hexToRgba(hex, alpha) {
  const value = String(hex).replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function HomeScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { sosActive, triggerSOS, riskData } = useSOS();

  const cardsAnim = useRef(
    new Array(4).fill(0).map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  // UI animation (existing)
  useEffect(() => {
    const animations = cardsAnim.map((a) =>
      Animated.parallel([
        Animated.timing(a.opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(a.translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    );
    Animated.stagger(80, animations).start();
  }, []);

  // ✅ VOICE TRIGGER FUNCTION
  const triggerSOSByVoice = async () => {
    console.log("🎤 Voice SOS Triggered");

    try {
      await triggerSOS();
      navigation.navigate('SOSActive');
    } catch {
      Alert.alert('SOS Activation Failed', 'Voice trigger failed.');
    }
  };

  // ✅ START LISTENING (IMPORTANT)
  useEffect(() => {
    startListening(triggerSOSByVoice);
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

  const barColor =
    riskLevel === 'LOW'
      ? colors.available
      : riskLevel === 'MEDIUM'
      ? colors.warning
      : colors.danger;

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
    subtext: {
      marginTop: 4,
      fontSize: 14,
      fontFamily: fontFamily.regular,
      fontWeight: fontWeight.regular,
      color: colors.textSecondary,
    },
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
    riskLabel: {
      color: colors.textSecondary,
      fontSize: 14,
      fontFamily: fontFamily.medium,
      fontWeight: fontWeight.medium,
      flex: 1,
    },
    lastChecked: { marginTop: 10, color: colors.textSecondary, fontSize: 12 },
    progressContainer: {
      marginTop: 10,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 999,
      overflow: 'hidden',
    },
    progressFill: { height: '100%', backgroundColor: barColor },
    monitorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    monitorDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.available,
    },
    monitorText: {
      marginLeft: 10,
      color: colors.textSecondary,
      fontSize: 14,
      fontFamily: fontFamily.medium,
      fontWeight: fontWeight.medium,
    },
    sosWrap: { alignItems: 'center', paddingVertical: 32 },
    gridWrap: {
      paddingHorizontal: 16,
      marginTop: 4,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    quickCardInner: { alignItems: 'center', justifyContent: 'center' },
    iconBg: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    quickLabel: {
      fontSize: 13,
      fontFamily: fontFamily.medium,
      fontWeight: fontWeight.medium,
      color: colors.text,
      textAlign: 'center',
    },
  });

  const handleSOSPress = async () => {
    try {
      await triggerSOS();
      navigation.navigate('SOSActive');
    } catch {
      Alert.alert('SOS Activation Failed', 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.leftHeader}>
            <Text style={styles.greeting}>{getGreeting() + ', Priya 👋'}</Text>
            <Text style={styles.subtext}>Stay safe today</Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={toggleTheme}>
              <View style={styles.themeCircle}>
                <Ionicons name={isDark ? 'sunny' : 'moon'} size={20} color={colors.text} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sosWrap}>
          <SOSButton size={180} isActive={sosActive} onLongPress={handleSOSPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}