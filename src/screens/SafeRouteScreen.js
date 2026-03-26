import React from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../components/AppHeader';
import CardView from '../components/CardView';
import SafeRouteCard from '../components/SafeRouteCard';
import { useTheme } from '../context/ThemeContext';
import routesData from '../data/routes';
import { fontFamily, fontWeight } from '../theme/typography';

export default function SafeRouteScreen({ navigation }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    originDestCard: { marginHorizontal: 16, marginTop: 10 },
    dotRow: { flexDirection: 'row', alignItems: 'center' },
    verticalSep: { height: 28, width: 4, marginLeft: 7, borderRadius: 2, backgroundColor: colors.border },
    labelColor: { color: colors.textSecondary, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, fontSize: 14, marginLeft: 10 },
    searchBtn: {
      marginTop: 12,
      height: 44,
      borderRadius: 8,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchBtnText: { color: colors.textInverse, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold, fontSize: 14 },
    sectionTitle: { marginHorizontal: 16, marginTop: 20, color: colors.text, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold, fontSize: 16 },
    mapPlaceholder: {
      height: 200,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 16,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    mapText: { marginTop: 8, color: colors.textSecondary, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, fontSize: 13, textAlign: 'center' },
  });

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Safe Routes" showBack onBack={() => navigation.goBack()} showThemeToggle />
      <ScrollView>
        <CardView elevation="sm" style={styles.originDestCard}>
          <View style={styles.dotRow}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.available }} />
            <Text style={{ color: colors.available, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, fontSize: 14, marginLeft: 10 }}>
              Current Location
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <View style={{ width: 10 }} />
            <View style={styles.verticalSep} />
          </View>

          <View style={[styles.dotRow, { marginTop: 10 }]}>
            <Ionicons name="location-pin" size={18} color={colors.primary} />
            <Text style={{ color: colors.text, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, fontSize: 14, marginLeft: 10 }}>
              MG Road Metro, Bengaluru
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.searchBtn} onPress={() => Alert.alert('Search', 'Route search coming soon.')}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </CardView>

        <Text style={styles.sectionTitle}>Suggested Routes</Text>

        <FlatList
          data={routesData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SafeRouteCard
              route={item}
              onNavigate={() => Alert.alert('Navigating', 'Opening route in maps...')}
            />
          )}
        />

        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color={colors.textTertiary} />
          <Text style={styles.mapText}>Interactive map coming soon</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

