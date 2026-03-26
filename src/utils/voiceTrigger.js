// src/utils/voiceTrigger.js

export const startListening = (onTrigger) => {
  console.log("🎤 Voice system ready (demo mode)");

  // Simulate voice trigger after 5 seconds
  setTimeout(() => {
    console.log("🎤 Simulated voice: help help help");
    onTrigger();
  }, 5000);
};