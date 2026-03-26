import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';

export default function SOSButton({ onLongPress, isActive, size = 180 }) {
  const { colors } = useTheme();

  const btnColor = isActive ? colors.emergency : colors.primary;

  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(isActive ? 0.6 : 0.6)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(1)).current;
  const glowScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseSpeed = isActive ? 800 : 1600;

    // Reset before starting loops.
    ring1Scale.setValue(1);
    ring1Opacity.setValue(0.6);
    ring2Scale.setValue(1);
    ring2Opacity.setValue(1);

    const ring1Loop = Animated.loop(
      Animated.parallel([
        Animated.timing(ring1Scale, {
          toValue: 1.45,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(ring1Opacity, {
          toValue: 0,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
      ])
    );

    const ring2Loop = Animated.loop(
      Animated.parallel([
        Animated.timing(ring2Scale, {
          toValue: 1.6,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(ring2Opacity, {
          toValue: 0,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
      ])
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowScale, {
          toValue: 1.04,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    ring1Loop.start();

    const delay = pulseSpeed * 0.3;
    const ring2Timeout = setTimeout(() => ring2Loop.start(), delay);
    glowLoop.start();

    return () => {
      clearTimeout(ring2Timeout);
      ring1Loop.stop();
      ring2Loop.stop();
      glowLoop.stop();
    };
  }, [isActive, glowScale, ring1Opacity, ring1Scale, ring2Opacity, ring2Scale]);

  const ring1Diameter = size * 1.35;
  const ring2Diameter = size * 1.6;
  const glowDiameter = size * 1.1;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          alignItems: 'center',
          justifyContent: 'center',
          width: ring2Diameter,
          height: ring2Diameter + 22,
        },
        stack: {
          position: 'relative',
          width: ring2Diameter,
          height: ring2Diameter,
          alignItems: 'center',
          justifyContent: 'center',
        },
        ring1: {
          position: 'absolute',
          width: ring1Diameter,
          height: ring1Diameter,
          borderRadius: ring1Diameter / 2,
          borderWidth: 2,
          borderColor: btnColor,
        },
        ring2: {
          position: 'absolute',
          width: ring2Diameter,
          height: ring2Diameter,
          borderRadius: ring2Diameter / 2,
          borderWidth: 2,
          borderColor: btnColor,
        },
        glow: {
          position: 'absolute',
          width: glowDiameter,
          height: glowDiameter,
          borderRadius: glowDiameter / 2,
          backgroundColor: btnColor,
          opacity: 0.18,
        },
        buttonShadow: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          elevation: 16,
        },
        sosButton: {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: btnColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        sosText: {
          color: colors.textInverse,
          fontSize: 36,
          fontWeight: '800',
          letterSpacing: 4,
          lineHeight: 40,
        },
        activeText: {
          marginTop: 2,
          color: colors.textInverse,
          opacity: 0.85,
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 3,
        },
        hintText: {
          position: 'absolute',
          bottom: -4,
          color: colors.textSecondary,
          fontSize: 12,
          fontWeight: '500',
        },
      }),
    [btnColor, colors.primary, colors.textInverse, colors.textSecondary, glowDiameter, ring1Diameter, ring2Diameter, size]
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.stack}>
        <Animated.View
          style={[
            styles.ring2,
            {
              opacity: ring2Opacity,
              transform: [{ scale: ring2Scale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ring1,
            {
              opacity: ring1Opacity,
              transform: [{ scale: ring1Scale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.glow,
            {
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <TouchableOpacity
          delayLongPress={800}
          activeOpacity={0.8}
          accessibilityRole="button"
          onLongPress={onLongPress}
        >
          <View style={[styles.buttonShadow, styles.sosButton]}>
            <Text style={styles.sosText}>SOS</Text>
            {isActive ? <Text style={styles.activeText}>ACTIVE</Text> : null}
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.hintText}>
        {isActive ? 'Double-tap Cancel to deactivate' : 'Hold 1s to activate'}
      </Text>
    </View>
  );
}

