import { Vibration } from 'react-native';

export function triggerSOSVibration() {
  Vibration.vibrate([0, 400, 200, 400, 200, 400]);
}

export function cancelSOSVibration() {
  Vibration.cancel();
}

export function notifyContacts(contacts, location) {
  // Dummy implementation: log for now.
  // eslint-disable-next-line no-console
  console.log('notifyContacts', { contacts, location });
}

export function calculateElapsed(startTime) {
  const totalSeconds = Math.max(0, (Date.now() - startTime) / 1000);
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const ss = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function getRiskColor(level, colors) {
  if (level === 'LOW') return colors.riskLow;
  if (level === 'MEDIUM') return colors.riskMedium;
  return colors.riskHigh;
}

export function getRiskBgColor(level, colors) {
  if (level === 'LOW') return colors.riskLowBg;
  if (level === 'MEDIUM') return colors.riskMediumBg;
  return colors.riskHighBg;
}

export const defaultTrustedContacts = [
  {
    id: 1,
    name: 'Mom Ananya',
    phone: '+91-9876543210',
    initials: 'MA',
    color: '#E63946',
  },
  {
    id: 2,
    name: 'Sister Ritu',
    phone: '+91-8765432109',
    initials: 'SR',
    color: '#457B9D',
  },
  {
    id: 3,
    name: 'Friend Sneha',
    phone: '+91-7654321098',
    initials: 'FS',
    color: '#2D6A4F',
  },
];

