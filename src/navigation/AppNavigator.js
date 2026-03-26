import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import MainTabs from './MainTabs';
import SOSActiveScreen from '../screens/SOSActiveScreen';
import SafeRouteScreen from '../screens/SafeRouteScreen';
import IncidentHistoryScreen from '../screens/IncidentHistoryScreen';

import { ThemeProvider } from '../context/ThemeContext';
import { SOSProvider } from '../context/SOSContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <ThemeProvider>
      <SOSProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SOSActive"
              component={SOSActiveScreen}
              options={{ headerShown: false, presentation: 'modal' }}
            />
            <Stack.Screen
              name="SafeRoute"
              component={SafeRouteScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="IncidentHistory"
              component={IncidentHistoryScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SOSProvider>
    </ThemeProvider>
  );
}

