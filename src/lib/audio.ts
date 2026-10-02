// Zero-dependency Web Audio API synthesizer for sci-fi sound effects.
// Lazily created on first user interaction; automatically checks store mute state.
import { useMissionStore } from "../stores/mission-store";

let ctx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      ctx = new AudioCtx();
    }
  }
  if (ctx && ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

function isMuted(): boolean {
  return useMissionStore.getState().muted;
}

export const sfx = {
  click() {
    if (isMuted()) return;
    const ac = getAudioContext();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ac.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.05);
  },

  blip() {
    if (isMuted()) return;
    const ac = getAudioContext();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, ac.currentTime);
    osc.frequency.setValueAtTime(1600, ac.currentTime + 0.04);
    gain.gain.setValueAtTime(0.07, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.1);
  },

  success() {
    if (isMuted()) return;
    const ac = getAudioContext();
    if (!ac) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ac.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.09, ac.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime + i * 0.08);
      osc.stop(ac.currentTime + i * 0.08 + 0.25);
    });
  },

  alert() {
    if (isMuted()) return;
    const ac = getAudioContext();
    if (!ac) return;
    [0, 0.18].forEach((offset) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(680, ac.currentTime + offset);
      osc.frequency.linearRampToValueAtTime(440, ac.currentTime + offset + 0.12);
      gain.gain.setValueAtTime(0.12, ac.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + offset + 0.14);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime + offset);
      osc.stop(ac.currentTime + offset + 0.14);
    });
  },

  thrust() {
    if (isMuted()) return;
    const ac = getAudioContext();
    if (!ac) return;
    // White noise buffer for engine rumble
    const bufferSize = ac.sampleRate * 0.4;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.4);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.15, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    noise.start();
    noise.stop(ac.currentTime + 0.4);
  },

  countdown() {
    if (isMuted()) return;
    const ac = getAudioContext();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, ac.currentTime);
    gain.gain.setValueAtTime(0.1, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.08);
  },

  rumble(duration = 1.2) {
    if (isMuted()) return;
    const ac = getAudioContext();
    if (!ac) return;
    const bufferSize = ac.sampleRate * duration;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, ac.currentTime);
    filter.frequency.linearRampToValueAtTime(80, ac.currentTime + duration);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.2, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + duration);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    noise.start();
    noise.stop(ac.currentTime + duration);
  },

  staging() {
    if (isMuted()) return;
    const ac = getAudioContext();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ac.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.25);
  },

  beacon() {
    if (isMuted()) return;
    const ac = getAudioContext();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1760, ac.currentTime); // A6
    gain.gain.setValueAtTime(0.12, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.15);
  },

  touchdown() {
    if (isMuted()) return;
    const ac = getAudioContext();
    if (!ac) return;
    [440, 554.37, 659.25].forEach((freq, idx) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ac.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.1, ac.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + idx * 0.1 + 0.5);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime + idx * 0.1);
      osc.stop(ac.currentTime + idx * 0.1 + 0.5);
    });
  },
};
