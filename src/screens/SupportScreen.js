import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AIChat from '../components/AIChat';
import MoodSelector from '../components/MoodSelector';
import { useTheme } from '../context/ThemeContext';
import { sendChatMessage } from '../utils/api';

// ⭐ Star Rating
function StarRating({ rating }) {
  const filled = Math.floor(Number(rating || 0));
  return (
    <View style={{ flexDirection: 'row' }}>
      {new Array(5).fill(0).map((_, i) => (
        <Text key={i}>{i < filled ? '★' : '☆'}</Text>
      ))}
    </View>
  );
}

export default function SupportScreen() {
  const { colors } = useTheme();

  const [tab, setTab] = useState('mood');
  const [selectedMood, setSelectedMood] = useState(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const breatheScale = useRef(new Animated.Value(1)).current;
  const [breathPhase, setBreathPhase] = useState('in');

  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'ai',
      text: "Hi Priya, I'm here for you 💙",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  // 🌬️ Breathing animation
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
    };
  }, [showBreathing]);

  // 💬 Mood messages
  const moodMessages = {
    anxious: "You're safe. Try breathing slowly.",
    sad: "It's okay to feel this way.",
    okay: 'Take it one step at a time.',
    good: 'Glad you’re feeling good 💛',
    great: 'Amazing! Stay safe 😊',
  };

  // 🤖 FIXED API CALL (important)
  const handleSend = async (text) => {
    const userMsg = {
      id: String(Date.now()),
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await sendChatMessage(text);

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          role: 'ai',
          text: res.message,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          role: 'ai',
          text: 'Try again later 💙',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // 👩‍⚕️ Therapists
  const therapists = [
    {
      name: 'Dr. Anita Krishnamurthy',
      specialty: 'Trauma & Anxiety',
      rating: 4.9,
      languages: ['Hindi', 'English', 'Kannada'],
    },
    {
      name: 'Dr. Priya Subramanian',
      specialty: "Women's Mental Health",
      rating: 4.8,
      languages: ['Tamil', 'English'],
    },
    {
      name: 'Dr. Meghna Patil',
      specialty: 'CBT & Crisis Support',
      rating: 4.7,
      languages: ['Marathi', 'Hindi', 'English'],
    },
  ];

  const handleBooking = (t) => {
    Alert.alert(
      "Confirm Booking",
      `Book session with ${t.name}?`,
      [
        { text: "Cancel" },
        {
          text: "Confirm",
          onPress: () =>
            Alert.alert("Booked ✅", `Session with ${t.name} confirmed`)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', margin: 16 }}>
          {['mood', 'ai', 'therapist'].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 20,
                backgroundColor: tab === t ? colors.primary : '#eee',
                alignItems: 'center',
                marginHorizontal: 4,
              }}
            >
              <Text style={{ color: tab === t ? '#fff' : '#000' }}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mood */}
        {tab === 'mood' && (
          <View style={{ padding: 16 }}>
            <MoodSelector onSelect={setSelectedMood} selected={selectedMood} />
            {selectedMood && (
              <View>
                <Text>{moodMessages[selectedMood]}</Text>
                <TouchableOpacity onPress={() => setShowBreathing(true)}>
                  <Text>Start Breathing</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* AI */}
        {tab === 'ai' && (
          <View style={{ height: 600 }}>
            <AIChat messages={messages} onSend={handleSend} loading={isTyping} />
          </View>
        )}

        {/* Therapist */}
        {tab === 'therapist' && (
          <View>
            {therapists.map((t, i) => (
              <View key={i} style={{
                margin: 12,
                padding: 14,
                backgroundColor: '#fff',
                borderRadius: 12,
                elevation: 3
              }}>
                <Text style={{ fontWeight: '700' }}>{t.name}</Text>
                <Text>{t.specialty}</Text>

                <View style={{ flexDirection: 'row', marginTop: 6 }}>
                  <Text>⭐ </Text>
                  <Text>{t.rating}</Text>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                  {t.languages.map((lang) => (
                    <View key={lang} style={{
                      backgroundColor: '#eee',
                      padding: 4,
                      margin: 3,
                      borderRadius: 5
                    }}>
                      <Text>{lang}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => handleBooking(t)}
                  style={{
                    marginTop: 10,
                    backgroundColor: '#ff4d4d',
                    padding: 10,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#fff' }}>Book Session</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Breathing Overlay */}
      {showBreathing && (
        <View style={{
          position: 'absolute',
          top: 0, bottom: 0, left: 0, right: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0005'
        }}>
          <Animated.View style={{ transform: [{ scale: breatheScale }] }}>
            <Text>{breathPhase === 'out' ? 'Breathe out' : 'Breathe in'}</Text>
          </Animated.View>

          <TouchableOpacity onPress={() => setShowBreathing(false)}>
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
