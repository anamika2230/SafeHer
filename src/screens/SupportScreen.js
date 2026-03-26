import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View, Easing } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../context/ThemeContext';
import MoodSelector from '../components/MoodSelector';
import AIChat from '../components/AIChat';
import CardView from '../components/CardView';
import { sendChatMessage } from '../utils/api';
import { fontFamily, fontWeight } from '../theme/typography';

function StarRating({ rating, starColor, emptyColor }) {
  const filled = Math.floor(Number(rating));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {new Array(5).fill(0).map((_, idx) => (
        <Text key={idx} style={{ color: idx < filled ? starColor : emptyColor, fontSize: 13 }}>
          {idx < filled ? '★' : '☆'}
        </Text>
      ))}
    </View>
  );
}

export default function SupportScreen() {
  const { colors } = useTheme();

  const [tab, setTab] = useState('mood'); // mood | ai | therapist

  // Mood tab state
  const [selectedMood, setSelectedMood] = useState(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const breatheScale = useRef(new Animated.Value(1)).current;
  const [breathPhase, setBreathPhase] = useState('in');

  // AI tab state
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'ai',
      text: "Hi Priya, I'm here for you. How are you feeling right now? You're safe to talk to me. 💙",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!showBreathing) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheScale, {
          toValue: 1.5,
          duration: 4000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(breatheScale, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ])
    );

    const sub = breatheScale.addListener(({ value }) => {
      setBreathPhase(value > 1.25 ? 'out' : 'in');
    });

    loop.start();

    return () => {
      breatheScale.stopAnimation();
      breatheScale.removeListener(sub);
      setBreathPhase('in');
    };
  }, [showBreathing, breatheScale]);

  const moodMessages = useMemo(
    () => ({
      anxious:
        "It's okay to feel anxious. You're safe right now. Try the breathing exercise below.",
      sad: 'I hear you. Feeling sad is valid. Whenever you\'re ready, I\'m here to talk.',
      okay: 'Okay is a good place to start. Take it one moment at a time.',
      good: 'That\'s wonderful! Stay safe and keep going. 💛',
      great: 'So glad you\'re feeling great! Your safety matters, always. 😊',
    }),
    []
  );

  const handleSend = async (text) => {
    const userMsg = {
      id: String(Date.now()),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    const history = [...messages, userMsg];
    setMessages(history);
    setIsTyping(true);

    try {
      const res = await sendChatMessage(text, history);
      const aiMsg = {
        id: String(Date.now() + 1),
        role: 'ai',
        text: res.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 2),
          role: 'ai',
          text: "I'm having trouble connecting right now. Please try again in a moment. If you need immediate help, use the SOS button. 💙",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: { flex: 1, backgroundColor: colors.background },
        selectorRow: {
          flexDirection: 'row',
          marginHorizontal: 16,
          marginTop: 8,
        },
        selectorPill: {
          flex: 1,
          height: 40,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
        },
        selectorPillText: { fontSize: 14, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },

        tabHeader: { marginTop: 24, fontSize: 22, fontFamily: fontFamily.bold, fontWeight: fontWeight.bold, textAlign: 'center', color: colors.text },
        breathingOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.overlayLight,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
        },
        breatheCircle: {
          width: 120,
          height: 120,
          borderRadius: 60,
          borderWidth: 3,
          borderColor: colors.primary,
          backgroundColor: colors.primaryGlow,
          alignItems: 'center',
          justifyContent: 'center',
        },
        breatheText: {
          marginTop: 18,
          color: colors.text,
          fontSize: 15,
          fontFamily: fontFamily.semibold,
          fontWeight: fontWeight.semibold,
        },
        doneBtn: {
          marginTop: 16,
          width: '100%',
          height: 48,
          borderRadius: 12,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        doneText: { color: colors.textInverse, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },

        fadeInWrap: { marginHorizontal: 16, marginTop: 20 },
        msgText: { color: colors.text, fontSize: 14, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, lineHeight: 20 },
        breathingBtn: {
          marginTop: 12,
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
        },
        breathingBtnText: { color: colors.primary, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },

        chatWrap: { flex: 1 },

        crisisBanner: {
          marginHorizontal: 16,
          marginTop: 10,
          backgroundColor: colors.riskHighBg,
          borderRadius: 12,
          padding: 16,
        },
        crisisTitle: { color: colors.riskHigh, fontSize: 14, fontFamily: fontFamily.bold, fontWeight: fontWeight.bold },
        crisisRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
        crisisPhone: { marginLeft: 10, color: colors.text, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, fontSize: 14 },
        profTitle: { marginHorizontal: 16, marginTop: 20, color: colors.text, fontSize: 16, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },
        therapistCard: { marginHorizontal: 16, marginVertical: 6 },
        therapistRow1: { flexDirection: 'row', alignItems: 'center' },
        therapistAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
        therapistAvatarText: { color: colors.textInverse, fontSize: 14, fontFamily: fontFamily.bold, fontWeight: fontWeight.bold },
        therapistName: { flex: 1, marginLeft: 12, color: colors.text, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold, fontSize: 14 },
        specialtyBadge: { marginLeft: 8, borderRadius: 999, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 6 },
        specialtyText: { color: colors.textSecondary, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, fontSize: 12 },
        therapistRow2: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
        availability: { marginLeft: 10, color: colors.textSecondary, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular, fontSize: 13 },
        langRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
        langChip: { backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, marginRight: 8, marginBottom: 8 },
        langText: { color: colors.textSecondary, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular, fontSize: 12 },
        bookBtn: { marginTop: 10, backgroundColor: colors.secondary, borderRadius: 8, height: 44, alignItems: 'center', justifyContent: 'center' },
        bookBtnText: { color: colors.textInverse, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },
      }),
    [colors]
  );

  const fadeMsg = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!selectedMood) {
      fadeMsg.setValue(0);
      return;
    }
    fadeMsg.setValue(0);
    Animated.timing(fadeMsg, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, [selectedMood, fadeMsg]);

  const breathingMessage = breathePhase === 'out' ? 'Breathe out...' : 'Breathe in...';

  const therapists = useMemo(
    () => [
      {
        name: 'Dr. Anita Krishnamurthy',
        specialty: 'Trauma & Anxiety',
        rating: 4.9,
        availability: 'Available Mon-Sat 10AM-6PM',
        initials: 'AK',
        languages: ['Hindi', 'English', 'Kannada'],
      },
      {
        name: 'Dr. Priya Subramanian',
        specialty: "Women's Mental Health",
        rating: 4.8,
        availability: 'Available Tue-Sun 2PM-8PM',
        initials: 'PS',
        languages: ['Tamil', 'English'],
      },
      {
        name: 'Dr. Meghna Patil',
        specialty: 'CBT & Crisis Support',
        rating: 4.7,
        availability: 'Available Mon-Fri 9AM-5PM',
        initials: 'MP',
        languages: ['Marathi', 'Hindi', 'English'],
      },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView>
        <View style={styles.selectorRow}>
          {[
            { key: 'mood', label: 'Mood' },
            { key: 'ai', label: 'AI Support' },
            { key: 'therapist', label: 'Therapist' },
          ].map((p) => {
            const active = tab === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                activeOpacity={0.8}
                onPress={() => setTab(p.key)}
                style={[
                  styles.selectorPill,
                  {
                    backgroundColor: active ? colors.primary : colors.surface,
                  },
                ]}
              >
                <Text style={[styles.selectorPillText, { color: active ? colors.textInverse : colors.textSecondary }]}>{p.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {tab === 'mood' ? (
          <View>
            <Text style={styles.tabHeader}>How are you feeling?</Text>
            <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
              <MoodSelector onSelect={setSelectedMood} selected={selectedMood} />
            </View>

            {selectedMood ? (
              <Animated.View style={[{ opacity: fadeMsg }, styles.fadeInWrap]}>
                <CardView elevation="sm">
                  <Text style={styles.msgText}>{moodMessages[selectedMood]}</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.breathingBtn}
                    onPress={() => setShowBreathing(true)}
                  >
                    <Text style={styles.breathingBtnText}>Breathing Exercise</Text>
                  </TouchableOpacity>
                </CardView>
              </Animated.View>
            ) : null}
          </View>
        ) : null}

        {tab === 'ai' ? (
          <View style={{ flex: 1, height: 650 }}>
            <AIChat messages={messages} onSend={handleSend} loading={isTyping} />
          </View>
        ) : null}

        {tab === 'therapist' ? (
          <View style={{ paddingBottom: 24 }}>
            <View style={styles.crisisBanner}>
              <Text style={styles.crisisTitle}>Crisis Helplines</Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Linking.openURL('tel:9152987821')}
              >
                <View style={styles.crisisRow}>
                  <Ionicons name="phone-portrait" size={18} color={colors.riskHigh} />
                  <Text style={styles.crisisPhone}>iCall: 9152987821</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Linking.openURL('tel:18602662345')}
              >
                <View style={styles.crisisRow}>
                  <Ionicons name="phone-portrait" size={18} color={colors.riskHigh} />
                  <Text style={styles.crisisPhone}>Vandrevala Foundation: 1860-2662-345</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.profTitle}>Professional Support</Text>

            {therapists.map((t) => (
              <CardView key={t.name} elevation="sm" style={styles.therapistCard}>
                <View style={styles.therapistRow1}>
                  <View style={styles.therapistAvatar}>
                    <Text style={styles.therapistAvatarText}>{t.initials}</Text>
                  </View>
                  <Text style={styles.therapistName}>{t.name}</Text>
                  <View style={styles.specialtyBadge}>
                    <Text style={styles.specialtyText}>{t.specialty}</Text>
                  </View>
                </View>

                <View style={styles.therapistRow2}>
                  <StarRating
                    rating={t.rating}
                    starColor={colors.star}
                    emptyColor={colors.textTertiary}
                  />
                  <Text style={styles.availability}>{t.availability}</Text>
                </View>

                <View style={styles.langRow}>
                  {t.languages.map((lang) => (
                    <View key={lang} style={styles.langChip}>
                      <Text style={styles.langText}>{lang}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.bookBtn}
                  onPress={() => Alert.alert('Booking', 'Book Session coming soon.')}
                >
                  <Text style={styles.bookBtnText}>Book Session</Text>
                </TouchableOpacity>
              </CardView>
            ))}
          </View>
        ) : null}
      </ScrollView>

      {showBreathing ? (
        <View style={styles.breathingOverlay}>
          <Animated.View style={{ transform: [{ scale: breatheScale }], alignItems: 'center' }}>
            <View style={styles.breatheCircle} />
            <Text style={styles.breatheText}>{breathingMessage}</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.doneBtn} onPress={() => setShowBreathing(false)}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

