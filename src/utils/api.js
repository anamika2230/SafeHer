const CONFIG = {
  BASE_URL: 'http://localhost:8000', // TODO: Replace with your ngrok/production URL
  USE_MOCK: true, // TODO: Set to false when backend is live
  TIMEOUT_MS: 10000,
};

export const getConfig = () => CONFIG;

export const setBaseURL = (url) => {
  CONFIG.BASE_URL = url;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

export async function analyzeDistress(audioUri, context = {}) {
  if (CONFIG.USE_MOCK === true) {
    return analyzeMock();
  }

  const form = new FormData();
  if (audioUri) {
    form.append('audio', {
      uri: audioUri,
      name: 'distress-audio.m4a',
      type: 'audio/m4a',
    });
  }
  form.append('context', JSON.stringify(context));

  const res = await withTimeout(
    fetch(`${CONFIG.BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: form,
    }),
    CONFIG.TIMEOUT_MS
  );

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  const json = await res.json();
  return json;
}

export async function analyzeMock() {
  await sleep(1200);
  return {
    riskScore: 0.94,
    riskLevel: 'HIGH',
    escalate: true,
    reason: 'Distress keywords + fear pattern detected at night in low-visibility area.',
    transcript: 'Detected: "help me, please stop" — elevated vocal stress markers.',
    emotionScore: 0.91,
  };
}

const empatheticResponses = [
  "I hear you. You're safe now. Take a slow breath — I'm right here with you. 💙",
  'What you\'re feeling right now is completely valid. Would you like to try a short breathing exercise together?',
  "You were incredibly brave today. Is there someone from your trusted contacts you'd like me to reach?",
  "It's okay to feel shaken. Your feelings matter. Can you tell me a little more about how you're doing?",
  "You did the right thing. Your safety is what matters most. I'm here — take all the time you need. 🌸",
  'Remember: you are not alone. Over 2,400 SafeHer users are in this network for each other.',
];

let responseIndex = 0;

export async function sendChatMessage(message, history = []) {
  const ms = 800 + Math.floor(Math.random() * 600);
  await sleep(ms);

  // Rotate through empathetic messages (simple deterministic behavior across calls).
  responseIndex = (responseIndex + 1) % empatheticResponses.length;
  return { message: empatheticResponses[responseIndex] };
}

