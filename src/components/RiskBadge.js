import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';

export default function RiskBadge({ level = 'LOW', size = 'md' }) {
  const { colors } = useTheme();

  const pulseScale = useRef(new Animated.Value(1)).current;
  const [shouldPulse, setShouldPulse] = useState(level === 'HIGH');

  useEffect(() => {
    if (level === 'HIGH') {
      setShouldPulse(true);
      pulseScale.setValue(1);
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.05,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }

    setShouldPulse(false);
    pulseScale.stopAnimation();
    pulseScale.setValue(1);
    return undefined;
  }, [level, pulseScale]);

  const config =
    level === 'MEDIUM'
      ? {
          bg: colors.riskMediumBg,
          text: colors.riskMedium,
          label: 'MEDIUM RISK',
          icon: '⚠',
        }
      : level === 'HIGH'
        ? {
            bg: colors.riskHighBg,
            text: colors.riskHigh,
            label: 'HIGH RISK',
            icon: '!',
          }
        : {
            bg: colors.riskLowBg,
            text: colors.riskLow,
            label: 'LOW RISK',
            icon: '✓',
          };

  const sizeMap =
    size === 'lg'
      ? { fontSize: 14, paddingH: 16, paddingV: 7 }
      : size === 'sm'
        ? { fontSize: 10, paddingH: 8, paddingV: 3 }
        : { fontSize: 12, paddingH: 12, paddingV: 5 };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 999,
      paddingHorizontal: sizeMap.paddingH,
      paddingVertical: sizeMap.paddingV,
      backgroundColor: config.bg,
      transform: shouldPulse ? [{ scale: pulseScale }] : undefined,
    },
    icon: {
      color: config.text,
      fontSize: sizeMap.fontSize,
      marginRight: 4,
      fontWeight: '700',
    },
    label: {
      color: config.text,
      fontSize: sizeMap.fontSize,
      fontWeight: '700',
    },
  });

  return (
    <Animated.View style={styles.container}>
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={styles.label}>{config.label}</Text>
    </Animated.View>
  );
}

