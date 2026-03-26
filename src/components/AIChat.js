import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTheme } from '../context/ThemeContext';
import { fontFamily } from '../theme/typography';

function getTimestampLabel(ts) {
  try {
    const d = ts instanceof Date ? ts : new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function AIChat({ messages, onSend, loading }) {
  const { colors, isDark } = useTheme();
  const [inputText, setInputText] = useState('');

  const scrollRef = useRef(null);

  const dots = useMemo(() => [new Animated.Value(-8), new Animated.Value(-8), new Animated.Value(-8)], []);
  const typingLoops = useRef([]);

  useEffect(() => {
    if (!loading) {
      typingLoops.current.forEach((l) => l?.stop?.());
      typingLoops.current = [];
      dots.forEach((d) => d.setValue(-8));
      return;
    }

    dots.forEach((dotAnim, idx) => {
      dotAnim.setValue(-8);
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim, {
            toValue: -8,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      const t = setTimeout(() => loop.start(), idx * 150);
      typingLoops.current[idx] = loop;

      return () => clearTimeout(t);
    });

    return undefined;
  }, [loading, dots]);

  useEffect(() => {
    // Auto-scroll on new messages and when typing indicator appears.
    if (!scrollRef.current) return;
    const timeout = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(timeout);
  }, [messages?.length, loading]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, flexDirection: 'column' },
        bubble: {
          paddingHorizontal: 12,
          paddingVertical: 10,
          maxWidth: '78%',
        },
        aiBubble: {
          backgroundColor: colors.surface,
          borderRadius: 16,
          alignSelf: 'flex-start',
        },
        userBubble: {
          backgroundColor: colors.primary,
          borderRadius: 16,
          alignSelf: 'flex-end',
        },
        bubbleRadiusAi: { borderTopLeftRadius: 4, borderTopRightRadius: 16, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
        bubbleRadiusUser: { borderTopLeftRadius: 16, borderTopRightRadius: 4, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
        label: {
          color: colors.primary,
          fontSize: 10,
          marginBottom: 4,
          fontFamily: fontFamily.medium,
          fontWeight: '500',
        },
        timestamp: {
          marginTop: 6,
          fontSize: 10,
          color: colors.textTertiary,
        },
        inputRow: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          padding: 12,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        },
        input: {
          flex: 1,
          backgroundColor: colors.inputBg,
          borderRadius: 24,
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 15,
          fontFamily: fontFamily.regular,
          color: colors.text,
          maxHeight: 100,
        },
        sendBtn: {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 10,
        },
        typingRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8,
          alignSelf: 'flex-start',
        },
        dot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.textTertiary,
          marginRight: 6,
        },
      }),
    [colors, dots]
  );

  const canSend = inputText.trim().length > 0;

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    await onSend(text);
  };

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 10 }}>
        {messages?.map((m) => {
          const isAi = m.role === 'ai';
          const bubbleStyle = isAi ? [styles.aiBubble, styles.bubbleRadiusAi] : [styles.userBubble, styles.bubbleRadiusUser];
          return (
            <View key={m.id} style={{ marginTop: 12 }}>
              {isAi ? <Text style={styles.label}>AI</Text> : null}
              <View style={[styles.bubble, bubbleStyle]}>
                <Text style={{ color: isAi ? colors.text : colors.textInverse }}>{m.text}</Text>
              </View>
              <Text style={styles.timestamp}>{getTimestampLabel(m.timestamp)}</Text>
            </View>
          );
        })}

        {loading ? (
          <View style={styles.typingRow}>
            {dots.map((dotAnim, idx) => (
              <Animated.View
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                style={[
                  styles.dot,
                  {
                    transform: [{ translateY: dotAnim }],
                  },
                ]}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.inputRow}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textTertiary}
            keyboardAppearance={isDark ? 'dark' : 'light'}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSend}
            disabled={!canSend}
            style={[
              styles.sendBtn,
              {
                backgroundColor: canSend ? colors.primary : colors.border,
              },
            ]}
          >
            <Ionicons name="send" size={18} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

