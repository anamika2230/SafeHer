import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTheme } from '../context/ThemeContext';
import { fontFamily, fontWeight } from '../theme/typography';

export default function AppHeader({
  title,
  showBack,
  onBack,
  showThemeToggle,
  rightComponent,
  navigation, // kept for API compatibility
  transparent = false,
}) {
  const { colors, isDark, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: transparent ? 'transparent' : colors.headerBg,
      borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    left: {
      width: 44,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    right: {
      width: 44,
      alignItems: 'flex-end',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    circleButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: colors.text,
      fontSize: 17,
      fontFamily: fontFamily.semibold,
      fontWeight: fontWeight.semibold,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity activeOpacity={0.8} onPress={onBack}>
            <View style={styles.circleButton}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      <View style={styles.right}>
        {showThemeToggle ? (
          <TouchableOpacity activeOpacity={0.8} onPress={toggleTheme}>
            <View style={styles.circleButton}>
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={20}
                color={colors.text}
              />
            </View>
          </TouchableOpacity>
        ) : null}
        {rightComponent ? <View style={{ marginLeft: 8 }}>{rightComponent}</View> : null}
      </View>
    </View>
  );
}

