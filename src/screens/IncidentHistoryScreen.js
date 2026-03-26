import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '../components/AppHeader';
import CardView from '../components/CardView';
import IncidentCard from '../components/IncidentCard';
import RiskBadge from '../components/RiskBadge';
import { useTheme } from '../context/ThemeContext';
import { incidents as incidentData } from '../data/incidents';
import { formatDate, formatTime } from '../utils/formatters';
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

export default function IncidentHistoryScreen({ navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const incidents = incidentData;

  const counts = useMemo(() => {
    const total = incidents.length;
    const high = incidents.filter((i) => i.riskLevel === 'HIGH').length;
    const ai = incidents.filter((i) => i.trigger === 'AI Detected' || i.trigger === 'Voice').length;
    return { total, high, ai };
  }, [incidents]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: { flex: 1, backgroundColor: colors.background },
        statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 10 },
        statPill: { flex: 1, padding: 14, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
        statValue: { fontFamily: fontFamily.bold, fontWeight: fontWeight.bold, fontSize: 18, color: colors.text },
        statLabel: { marginTop: 4, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, fontSize: 13, color: colors.textSecondary },
        listEmpty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
        listEmptyText: { marginTop: 12, color: colors.textSecondary, fontSize: 18, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold, textAlign: 'center' },
        listEmptySub: { marginTop: 10, color: colors.textSecondary, fontSize: 14, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular, textAlign: 'center' },
        modalContainer: { flex: 1, backgroundColor: colors.background },
        modalInner: { paddingHorizontal: 16, paddingTop: 12, flex: 1 },
        modalHeaderRow: { flexDirection: 'row', alignItems: 'center' },
        modalDate: { flex: 1, color: colors.text, fontSize: 16, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },
        sectionTitle: { marginTop: 16, color: colors.text, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold, fontSize: 15 },
        mapRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
        rowText: { color: colors.textSecondary, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular, fontSize: 13, flex: 1, marginLeft: 10 },
        timeline: { marginTop: 12, flexDirection: 'row' },
        timelineLine: { width: 10, alignItems: 'center' },
        timelineDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
        timelineStem: { width: 2, backgroundColor: colors.border, flex: 1, marginTop: 2, marginBottom: 2 },
        timelineContent: { flex: 1, marginLeft: 10 },
        timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
        timelineText: { color: colors.textSecondary, fontSize: 13, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular, lineHeight: 18 },
        quoteBox: { marginTop: 10, backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
        quoteText: { color: colors.text, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular, fontSize: 13, fontStyle: 'italic', lineHeight: 18 },
        scoreBar: { height: 10, borderRadius: 5, backgroundColor: colors.border, overflow: 'hidden', marginTop: 8 },
        scoreFill: { height: '100%', borderRadius: 5, backgroundColor: colors.riskHigh },
        closeBtn: {
          marginTop: 'auto',
          marginBottom: insets.bottom,
          backgroundColor: colors.primary,
          height: 56,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
        },
        closeBtnText: { color: colors.textInverse, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold, fontSize: 16 },
      }),
    [colors, insets.bottom]
  );

  const openModal = (incident) => {
    setSelectedIncident(incident);
    setModalVisible(true);
  };

  const handleExport = () => {
    Alert.alert('Export', 'Export coming soon.');
  };

  const aiDetectedBg = hexToRgba(colors.secondary, 0.15);

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Incident History" showBack showThemeToggle onBack={() => navigation.goBack()} />

      <View style={{ flex: 1 }}>
        <View style={styles.statsRow}>
          <CardView elevation="none" style={[styles.statPill, { flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.card }]}>
            <Text style={styles.statValue}>{counts.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </CardView>

          <CardView
            elevation="none"
            style={[styles.statPill, { backgroundColor: colors.riskHighBg }]}
          >
            <Text style={[styles.statValue, { color: colors.riskHigh }]}>{counts.high}</Text>
            <Text style={[styles.statLabel, { color: colors.riskHigh }]}>&nbsp;HIGH risk</Text>
          </CardView>

          <CardView elevation="none" style={[styles.statPill, { backgroundColor: aiDetectedBg }]}>
            <Text style={[styles.statValue, { color: colors.secondary }]}>{counts.ai}</Text>
            <Text style={[styles.statLabel, { color: colors.secondary }]}>AI Detected</Text>
          </CardView>
        </View>

        <FlatList
          data={incidents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <IncidentCard
              incident={item}
              onViewReport={() => openModal(item)}
              onExport={() => handleExport(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.listEmpty}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
              <Text style={styles.listEmptyText}>No incidents recorded</Text>
              <Text style={styles.listEmptySub}>Stay safe out there 💙</Text>
            </View>
          }
        />
      </View>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalInner}>
            {selectedIncident ? (
              <>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalDate}>
                    {formatDate(selectedIncident.date)} {formatTime(selectedIncident.time)}
                  </Text>
                  <RiskBadge level={selectedIncident.riskLevel} />
                </View>

                <View style={styles.mapRow}>
                  <Ionicons name="location-pin" size={16} color={colors.textSecondary} />
                  <Text style={styles.rowText}>{selectedIncident.location}</Text>
                </View>

                <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.rowText, { marginLeft: 0 }]}>
                    Trigger: {selectedIncident.trigger} • Duration: {selectedIncident.duration}
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>Timeline</Text>
                <View style={styles.timeline}>
                  <View style={styles.timelineLine}>
                    <View style={styles.timelineDot}>
                      <Text>📍</Text>
                    </View>
                    <View style={styles.timelineStem} />
                    <View style={styles.timelineDot}>
                      <Text>🚨</Text>
                    </View>
                    <View style={styles.timelineStem} />
                    <View style={styles.timelineDot}>
                      <Text>📱</Text>
                    </View>
                    <View style={styles.timelineStem} />
                    <View style={styles.timelineDot}>
                      <Text>👥</Text>
                    </View>
                    <View style={styles.timelineStem} />
                    <View style={styles.timelineDot}>
                      <Text>✅</Text>
                    </View>
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineRow}>
                      <Text style={styles.timelineText}>Location captured — 12.9716° N, 77.5946° E</Text>
                    </View>
                    <View style={styles.timelineRow}>
                      <Text style={styles.timelineText}>SOS activated — {selectedIncident.trigger}</Text>
                    </View>
                    <View style={styles.timelineRow}>
                      <Text style={styles.timelineText}>
                        Contacts notified — {selectedIncident.contactsNotified} contacts
                      </Text>
                    </View>
                    <View style={styles.timelineRow}>
                      <Text style={styles.timelineText}>
                        Volunteers alerted — {selectedIncident.volunteersAlerted} responders
                      </Text>
                    </View>
                    <View style={{ marginBottom: 0 }}>
                      <Text style={styles.timelineText}>Incident resolved</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>AI Analysis</Text>
                <View style={styles.quoteBox}>
                  <Text style={styles.quoteText}>"{selectedIncident.transcript}"</Text>
                </View>

                <Text style={styles.sectionTitle} />
                <Text style={{ marginTop: 10, color: colors.textSecondary, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, fontSize: 13 }}>
                  Emotion Score
                </Text>
                <View style={styles.scoreBar}>
                  <View
                    style={[
                      styles.scoreFill,
                      { width: `${Math.round((selectedIncident.emotionScore || 0) * 100)}%`, backgroundColor: colors.riskMedium },
                    ]}
                  />
                </View>

                <Text style={{ marginTop: 14, color: colors.textSecondary, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, fontSize: 13 }}>
                  Risk Score
                </Text>
                <View style={styles.scoreBar}>
                  <View
                    style={[
                      styles.scoreFill,
                      { width: `${Math.round((selectedIncident.riskScore || 0) * 100)}%`, backgroundColor: colors.riskHigh },
                    ]}
                  />
                </View>

                <TouchableOpacity activeOpacity={0.8} style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeBtnText}>Close Report</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

