import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../components/AppHeader';
import VolunteerCard from '../components/VolunteerCard';
import { useTheme } from '../context/ThemeContext';
import { volunteers as volunteerData } from '../data/volunteers';
import { fontFamily, fontWeight } from '../theme/typography';

export default function VolunteerListScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('All');
  const enterAnims = useRef([]);

  const filtered = useMemo(() => {
    if (filter === 'Available') return volunteerData.filter((v) => v.status === 'Available');
    if (filter === 'Within 1km') return volunteerData.filter((v) => Number(v.distance) < 1.0);
    return volunteerData;
  }, [filter]);

  useEffect(() => {
    enterAnims.current = filtered.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(16),
    }));

    const animations = enterAnims.current.map((a) =>
      Animated.parallel([
        Animated.timing(a.opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(a.translateY, { toValue: 0, duration: 350, useNativeDriver: true }),
      ])
    );

    Animated.stagger(60, animations).start();
  }, [filter, filtered.length]);

  const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    header: { marginBottom: 8 },
    filterRow: { paddingHorizontal: 16, paddingVertical: 8 },
    pill: {
      height: 34,
      borderRadius: 999,
      paddingHorizontal: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      borderWidth: StyleSheet.hairlineWidth,
    },
    pillText: { fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, fontSize: 13 },
    listEmpty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
    listEmptyText: { marginTop: 12, color: colors.textSecondary, fontSize: 16, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold, textAlign: 'center' },
  });

  const handleAlert = (volunteer) => {
    Alert.alert(
      `Alerting ${volunteer.name}`,
      'Sending your location and SOS signal...'
    );
  };

  const filterOptions = ['All', 'Available', 'Within 1km'];

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title={`Nearby Volunteers (${volunteerData.length})`} showBack={false} showThemeToggle={false} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {filterOptions.map((opt) => {
          const active = filter === opt;
          return (
            <TouchableOpacity
              key={opt}
              activeOpacity={0.8}
              onPress={() => setFilter(opt)}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.pillText, { color: active ? colors.textInverse : colors.text }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          const a = enterAnims.current[index];
          return (
            <Animated.View
              style={{
                opacity: a?.opacity ?? 1,
                transform: [{ translateY: a?.translateY ?? 0 }],
              }}
            >
              <VolunteerCard volunteer={item} onAlert={handleAlert} />
            </Animated.View>
          );
        }}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <View style={styles.listEmpty}>
            <Ionicons name="person-off" size={40} color={colors.textSecondary} />
            <Text style={styles.listEmptyText}>No volunteers match this filter</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

