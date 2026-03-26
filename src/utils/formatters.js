export function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export function formatTime(timeString) {
  // Accepts "HH:mm" (24h).
  const [hhRaw, mmRaw] = String(timeString).split(':');
  const hh = Number(hhRaw);
  const mm = Number(mmRaw);
  const ampm = hh >= 12 ? 'PM' : 'AM';
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  const mmStr = String(mm).padStart(2, '0');
  return `${hour12}:${mmStr} ${ampm}`;
}

export function formatDistance(km) {
  const value = Number(km);
  if (Number.isNaN(value)) return '';
  if (value < 1) {
    const meters = Math.round(value * 1000);
    return `${meters} m away`;
  }
  const fixed = value.toFixed(1).replace(/\.0$/, '');
  return `${fixed} km away`;
}

export function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds)));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

export function formatRelativeTime(dateString) {
  const target = new Date(dateString);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffDays = Math.round((startOfTarget - startOfToday) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return 'Today';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  return formatDate(dateString);
}

export function formatRiskScore(score) {
  return Math.round(Number(score) * 100);
}

