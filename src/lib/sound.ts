const storageKey = "sound";
const clips = {
  focus: "/sounds/project-focus.mp3",
  enter: "/sounds/case-study.mp3",
  bed: "/sounds/black-hole.mp3",
  hover: "/sounds/hover.wav",
} as const;

type ClipName = keyof typeof clips;

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let noiseReady = false;
const clipFiles = new Map<ClipName, Promise<ArrayBuffer>>();
const clipBuffers = new Map<ClipName, AudioBuffer>();
let bedOn = false;
let bedSource: AudioBufferSourceNode | null = null;
let bedGain: GainNode | null = null;
let bedToken = 0;
let enabled = true;
let reduced = false;
const listeners = new Set<(on: boolean) => void>();

export function soundIsOn() {
  return enabled;
}

export function subscribeSound(listener: (on: boolean) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function startSound() {
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stored = window.localStorage.getItem(storageKey);
  enabled = stored === "on" ? true : stored === "off" ? false : !reduced;
  listeners.forEach((listener) => listener(enabled));
  void Promise.all(Object.keys(clips).map((name) => loadClip(name as ClipName))).catch(() => undefined);
  const unlock = () => {
    void running();
  };
  window.addEventListener("pointerdown", unlock, { capture: true });
  return () => window.removeEventListener("pointerdown", unlock, { capture: true });
}

export function setSound(on: boolean) {
  enabled = on;
  window.localStorage.setItem(storageKey, on ? "on" : "off");
  listeners.forEach((listener) => listener(on));
  if (!on) stopBed();
  else if (bedOn) void startBed();
  else if (on) void running();
}

export function setBed(on: boolean) {
  bedOn = on;
  if (on) void startBed();
  else stopBed();
}

export const sound = {
  focus() {
    if (!context || context.state !== "running") return;
    void play("focus");
  },
  hover() {
    if (!context || context.state !== "running") return;
    void play("hover");
  },
  ui() {
    void tone("ui");
  },
  open() {
    void play("enter");
  },
  close() {
    void tone("close");
  },
};

async function running() {
  if (!enabled) return null;
  return acquire();
}

async function acquire() {
  context ??= new AudioContext();
  if (context.state !== "running") await context.resume();
  return context.state === "running" ? context : null;
}

function staticNoise(ctx: AudioContext) {
  if (noise && noiseReady) return noise;
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
  noiseReady = true;
  return noise;
}

function burst(ctx: AudioContext, peak: number, attack: number, release: number, at = ctx.currentTime) {
  const gain = ctx.createGain();
  const now = at;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + release);
  gain.connect(ctx.destination);
  return gain;
}

function stopBed() {
  bedToken += 1;
  const source = bedSource;
  const gain = bedGain;
  bedSource = null;
  bedGain = null;
  if (!source || !context) return;
  const now = context.currentTime;
  if (gain) {
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.2);
  }
  source.stop(now + 0.22);
}

async function startBed() {
  if (!bedOn || !enabled || bedSource) return;
  const token = ++bedToken;
  const ctx = await acquire();
  if (token !== bedToken || !bedOn || !enabled || !ctx || bedSource) return;
  let buffer = clipBuffers.get("bed");
  if (!buffer) {
    const bytes = await loadClip("bed");
    if (token !== bedToken || !bedOn || !enabled) return;
    buffer = await ctx.decodeAudioData(bytes.slice(0));
    clipBuffers.set("bed", buffer);
  }
  if (token !== bedToken || !bedOn || !enabled || bedSource) return;
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(1, now + 0.25);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  bedSource = source;
  bedGain = gain;
}

function loadClip(name: ClipName) {
  let pending = clipFiles.get(name);
  if (!pending) {
    const url = clips[name];
    pending = fetch(url).then((response) => {
      if (!response.ok) throw new Error(url);
      return response.arrayBuffer();
    });
    clipFiles.set(name, pending);
  }
  return pending;
}

async function play(name: ClipName, delay = 0) {
  if (!enabled) return;
  const ctx = await acquire();
  if (!ctx || !enabled) return;
  let buffer = clipBuffers.get(name);
  if (!buffer) {
    const bytes = await loadClip(name);
    buffer = await ctx.decodeAudioData(bytes.slice(0));
    clipBuffers.set(name, buffer);
  }
  if (!enabled) return;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(ctx.currentTime + delay);
}

async function tone(kind: "ui" | "close") {
  if (!enabled) return;
  const ctx = await acquire();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (kind === "ui") {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(294, now);
    osc.frequency.exponentialRampToValueAtTime(294 * 1.08, now + 0.1);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    const gain = burst(ctx, 0.035, 0.012, 0.06, now);
    osc.connect(filter);
    filter.connect(gain);
    osc.start(now);
    osc.stop(now + 0.2);
    return;
  }

  const body = ctx.createOscillator();
  body.type = "sine";
  body.frequency.setValueAtTime(240, now);
  body.frequency.exponentialRampToValueAtTime(160, now + 0.24);
  const bodyGain = burst(ctx, 0.04, 0.03, 0.22);
  body.connect(bodyGain);
  body.start();
  body.stop(now + 0.32);

  const source = ctx.createBufferSource();
  source.buffer = staticNoise(ctx);
  const sweep = ctx.createBiquadFilter();
  sweep.type = "lowpass";
  sweep.frequency.setValueAtTime(520, now);
  sweep.frequency.exponentialRampToValueAtTime(900, now + 0.12);
  sweep.frequency.exponentialRampToValueAtTime(300, now + 0.26);
  const gain = burst(ctx, 0.045, 0.04, 0.2);
  source.connect(sweep);
  sweep.connect(gain);
  source.start();
  source.stop(now + 0.32);
}
