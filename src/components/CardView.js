import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';

export default function CardView({
  children,
  style,
  onPress,
  elevation = 'md',
}) {
  const { colors } = useTheme();

  const { shadowStyle } = useMemo(() => {
    if (elevation === 'none') {
      return { shadowStyle: {} };
    }
    if (elevation === 'sm') {
      return {
        shadowStyle: {
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        },
      };
    }
    if (elevation === 'lg') {
      return {
        shadowStyle: {
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        },
      };
    }
    return {
      shadowStyle: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    };
  }, [elevation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          ...shadowStyle,
        },
        clickable: {
          ...shadowStyle,
        },
      }),
    [colors, shadowStyle]
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={[styles.base, style]}>{children}</View>
      </TouchableOpacity>
    );
  }

  return <View style={[styles.base, style]}>{children}</View>;
}

