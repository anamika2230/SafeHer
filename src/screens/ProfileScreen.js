import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import CardView from '../components/CardView';
import { useTheme } from '../context/ThemeContext';
import { defaultTrustedContacts } from '../utils/sosHelper';
import { fontFamily, fontWeight } from '../theme/typography';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [contacts, setContacts] = useState(defaultTrustedContacts);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState('Medium');
  const [beVolunteer, setBeVolunteer] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: { flex: 1, backgroundColor: colors.background },
        content: { paddingBottom: 24 },
        avatarRow: { alignItems: 'center', marginTop: 18 },
        avatar: {
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        avatarText: { color: colors.textInverse, fontSize: 32, fontFamily: fontFamily.bold, fontWeight: fontWeight.bold },
        name: { marginTop: 14, fontSize: 22, fontFamily: fontFamily.bold, fontWeight: fontWeight.bold, color: colors.text },
        meta: { marginTop: 6, color: colors.textSecondary, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular, fontSize: 14, textAlign: 'center' },
        editBtn: {
          marginTop: 16,
          paddingVertical: 10,
          paddingHorizontal: 18,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        },
        editBtnText: { color: colors.primary, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },
        sectionTitleRow: { marginTop: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
        sectionTitle: { flex: 1, color: colors.text, fontSize: 16, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },
        addLink: { color: colors.primary, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },
        contactRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
        contactAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
        contactAvatarText: { color: colors.textInverse, fontSize: 14, fontFamily: fontFamily.bold, fontWeight: fontWeight.bold },
        contactInfo: { flex: 1, marginLeft: 12 },
        contactName: { color: colors.text, fontSize: 14, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },
        contactPhone: { marginTop: 4, color: colors.textSecondary, fontSize: 13, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular },
        removeBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
        settingsCard: { marginHorizontal: 16, marginTop: 18 },
        settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
        settingLeft: { flex: 1 },
        settingLabel: { color: colors.text, fontSize: 14, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },
        settingSub: { marginTop: 4, color: colors.textSecondary, fontSize: 12, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular },
        segmentedRow: { flexDirection: 'row', marginTop: 10 },
        segPill: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 36, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth },
        segText: { fontSize: 13, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium },
        volunteerCard: { marginHorizontal: 16, marginTop: 18 },
        emergencyCard: { marginHorizontal: 16, marginTop: 18, borderRadius: 16, padding: 16, backgroundColor: colors.emergencyBg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
        emergencyText: { color: colors.text, fontSize: 14, fontFamily: fontFamily.medium, fontWeight: fontWeight.medium, lineHeight: 20 },
        exportBtn: { marginTop: 14, backgroundColor: colors.primary, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
        exportBtnText: { color: colors.textInverse, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },
        logoutBtn: {
          marginTop: 24,
          marginHorizontal: 16,
          height: 52,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: colors.danger,
          alignItems: 'center',
          justifyContent: 'center',
        },
        logoutText: { color: colors.danger, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold },
        footer: { marginTop: 18, paddingHorizontal: 16, textAlign: 'center', color: colors.textTertiary, fontSize: 12, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular },
      }),
    [colors]
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>PR</Text>
          </View>
          <Text style={styles.name}>Priya Reddy</Text>
          <Text style={styles.meta}>priyaa.reddy@email.com</Text>
          <Text style={styles.meta}>+91-9876543210</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.editBtn}
            onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon.')}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Trusted contacts */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Trusted Contacts</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Alert.alert('Add Contact', 'Add flow coming soon.')}>
            <Text style={styles.addLink}>Add</Text>
          </TouchableOpacity>
        </View>

        {contacts.map((c) => (
          <CardView key={c.id} elevation="sm" style={{ marginHorizontal: 16, marginTop: 10, padding: 0 }}>
            <View style={styles.contactRow}>
              <View style={[styles.contactAvatar, { backgroundColor: c.color }]}>
                <Text style={styles.contactAvatarText}>{c.initials}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{c.name}</Text>
                <Text style={styles.contactPhone}>{c.phone}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setContacts((prev) => prev.filter((x) => x.id !== c.id))}
                style={styles.removeBtn}
              >
                <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </CardView>
        ))}

        {/* Settings */}
        <CardView elevation="md" style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? colors.primaryLight : colors.textInverse}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={pushEnabled ? colors.primaryLight : colors.textInverse}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Voice Trigger</Text>
              <Text style={styles.settingSub}>Say "Help me" to activate SOS</Text>
            </View>
            <Switch
              value={voiceEnabled}
              onValueChange={setVoiceEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={voiceEnabled ? colors.primaryLight : colors.textInverse}
            />
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.settingLabel}>Auto-SOS Sensitivity</Text>
            </View>

            <View style={styles.segmentedRow}>
              {['Low', 'Medium', 'High'].map((opt) => {
                const active = sensitivity === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.8}
                    onPress={() => setSensitivity(opt)}
                    style={[
                      styles.segPill,
                      {
                        backgroundColor: active ? colors.primary : colors.surface,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.segText, { color: active ? colors.textInverse : colors.textSecondary }]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </CardView>

        {/* Become a volunteer */}
        <CardView elevation="sm" style={styles.volunteerCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 16, fontFamily: fontFamily.semibold, fontWeight: fontWeight.semibold }}>
                Become a SafeHer Volunteer
              </Text>
              <Text style={{ marginTop: 6, color: colors.textSecondary, fontSize: 13, fontFamily: fontFamily.regular, fontWeight: fontWeight.regular }}>
                Help women in your area
              </Text>
            </View>
            <Switch
              value={beVolunteer}
              onValueChange={setBeVolunteer}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={beVolunteer ? colors.primaryLight : colors.textInverse}
            />
          </View>
        </CardView>

        {/* Emergency ID */}
        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyText}>
            Priya Reddy | Blood Group: B+ | Emergency Contact: +91-9876543210
          </Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.exportBtn} onPress={() => Alert.alert('Export', 'Emergency ID export coming soon.')}>
            <Text style={styles.exportBtnText}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity activeOpacity={0.8} style={styles.logoutBtn} onPress={() => Alert.alert('Logout', 'Logout flow coming soon.')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>SafeHer v1.0.0 • Made with ❤️ for every woman</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

