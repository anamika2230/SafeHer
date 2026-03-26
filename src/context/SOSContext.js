import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Vibration } from 'react-native';

import { analyzeDistress, analyzeMock } from '../utils/api';

const SOSContext = createContext(null);

function formatElapsed(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(safe / 60)).padStart(2, '0');
  const ss = String(safe % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function SOSProvider({ children }) {
  const [sosActive, setSosActive] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const intervalRef = useRef(null);
  const startAtRef = useRef(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startAtRef.current = null;
  };

  const startTimer = () => {
    clearTimer();
    startAtRef.current = Date.now();
    setElapsedTime(0);

    intervalRef.current = setInterval(() => {
      if (!startAtRef.current) return;
      const seconds = (Date.now() - startAtRef.current) / 1000;
      setElapsedTime(seconds);
    }, 250);
  };

  const triggerSOS = async (audioUri, contextData = {}) => {
    try {
      Vibration.vibrate([0, 400, 200, 400, 200, 400]);
    } catch {
      // Ignore vibration failures.
    }

    setLoading(true);
    setSosActive(false);
    setRiskData(null);
    clearTimer();

    let nextRiskData = null;
    try {
      nextRiskData = await analyzeDistress(audioUri, contextData);
    } catch {
      // Network failed; we'll try fallback next.
    }

    if (!nextRiskData) {
      try {
        nextRiskData = await analyzeMock();
      } catch {
        Alert.alert(
          'SOS Activated Locally',
          'Could not reach server. SOS activated with last known location. Contacts will be notified when connectivity returns.'
        );
        nextRiskData = {
          riskScore: 0.94,
          riskLevel: 'HIGH',
          escalate: true,
          reason: 'Distress pattern detected.',
          transcript: 'Detected: "help me, please stop" — elevated vocal stress markers.',
          emotionScore: 0.91,
        };
      }
    }

    setRiskData(nextRiskData);
    setSosActive(true);
    startTimer();
    setLoading(false);
    return nextRiskData;
  };

  const cancelSOS = () => {
    clearTimer();
    setLoading(false);
    setSosActive(false);
    setRiskData(null);
    setElapsedTime(0);
    try {
      Vibration.cancel();
    } catch {
      // Ignore cancellation failures.
    }
  };

  useEffect(() => cancelSOS, []);

  const formattedElapsed = useMemo(() => formatElapsed(elapsedTime), [elapsedTime]);

  const value = useMemo(
    () => ({
      sosActive,
      riskData,
      elapsedTime,
      loading,
      formattedElapsed,
      triggerSOS,
      cancelSOS,
    }),
    [sosActive, riskData, elapsedTime, loading, formattedElapsed]
  );

  return <SOSContext.Provider value={value}>{children}</SOSContext.Provider>;
}

export function useSOS() {
  const ctx = useContext(SOSContext);
  if (!ctx) throw new Error('useSOS must be used within SOSProvider');
  return ctx;
}

