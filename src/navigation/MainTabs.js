import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import VolunteerListScreen from '../screens/VolunteerListScreen';
import SupportScreen from '../screens/SupportScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { useTheme } from '../context/ThemeContext';
import { useSOS } from '../context/SOSContext';
import { fontFamily } from '../theme/typography';

const Tab = createBottomTabNavigator();

function TabIconWithSOSDot({ name, focused, sosActive, colors }) {
  return (
    <View style={styles.iconWrap}>
      <Ionicons name={name} size={24} color={focused ? colors.primary : colors.textSecondary} />
      {sosActive ? <View style={[styles.dot, { backgroundColor: colors.primary }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 999,
  },
});

export default function MainTabs() {
  const { colors } = useTheme();
  const { sosActive } = useSOS();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: fontFamily.regular,
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home" size={24} color={focused ? colors.primary : colors.textSecondary} />
          ),
        }}
      />
      <Tab.Screen
        name="Tracking"
        component={LiveTrackingScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="location-outline"
              size={24}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Volunteers"
        component={VolunteerListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconWithSOSDot
              name="people"
              focused={focused}
              sosActive={sosActive === true}
              colors={colors}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Support"
        component={SupportScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="heart" size={24} color={focused ? colors.primary : colors.textSecondary} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person"
              size={24}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

