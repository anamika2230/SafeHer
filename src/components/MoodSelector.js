import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { fontFamily, fontWeight as fw } from '../theme/typography';

const MOODS = [
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '😢', label: 'Sad', value: 'sad' },
  { emoji: '😐', label: 'Okay', value: 'okay' },
  { emoji: '😊', label: 'Good', value: 'good' },
  { emoji: '😄', label: 'Great', value: 'great' },
];

export default function MoodSelector({ onSelect, selected }) {
  const { colors } = useTheme();

  const scales = useRef(MOODS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    MOODS.forEach((mood, idx) => {
      const toValue = selected === mood.value ? 1.12 : 1;
      Animated.spring(scales[idx], {
        toValue,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [selected, scales]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        option: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        circle: {
          width: 68,
          height: 68,
          borderRadius: 34,
          alignItems: 'center',
          justifyContent: 'center',
        },
        emoji: {
          fontSize: 36,
        },
        label: {
          marginTop: 6,
          fontSize: 12,
          fontFamily: fontFamily.medium,
          fontWeight: fw.medium,
        },
      }),
    [colors]
  );

  return (
    <View style={styles.row}>
      {MOODS.map((mood, idx) => {
        const isSelected = selected === mood.value;
        return (
          <TouchableOpacity
            key={mood.value}
            activeOpacity={0.8}
            onPress={() => onSelect(mood.value)}
          >
            <Animated.View
              style={{
                transform: [{ scale: scales[idx] }],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={[
                  styles.circle,
                  {
                    borderWidth: isSelected ? 3 : 1.5,
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primaryGlow : colors.surface,
                  },
                ]}
              >
                <Text style={[styles.emoji, { color: colors.text }]}>{mood.emoji}</Text>
              </View>
              <Text style={[styles.label, { color: isSelected ? colors.primary : colors.textSecondary }]}>
                {mood.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

