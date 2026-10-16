import gsap from "gsap";

export type Rect = { x: number; y: number; w: number; h: number };

export const galleryMotion = {
  offset: 0,
  velocity: 0,
};

export const flight = {
  id: "",
  mode: "idle" as "idle" | "open" | "return",
  from: null as Rect | null,
  frame: null as HTMLCanvasElement | null,
  applied: false,
  started: false,
  wait: 0,
  progress: { value: 1 },
};

export function snapshot(element: HTMLElement | null) {
  const video = element?.querySelector("video");
  if (!video || !video.videoWidth) return null;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d")?.drawImage(video, 0, 0);
  return canvas;
}

export function rectOf(rect: DOMRect): Rect {
  return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
}

export function lerpRect(from: Rect, to: Rect, amount: number): Rect {
  return {
    x: from.x + (to.x - from.x) * amount,
    y: from.y + (to.y - from.y) * amount,
    w: from.w + (to.w - from.w) * amount,
    h: from.h + (to.h - from.h) * amount,
  };
}

function reduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function arm(id: string, from: Rect, mode: "open" | "return", frame: HTMLCanvasElement | null) {
  gsap.killTweensOf(flight.progress);
  flight.id = id;
  flight.from = from;
  flight.frame = frame;
  flight.applied = false;
  flight.wait = 0;
  if (reduced()) {
    flight.mode = "idle";
    flight.started = true;
    flight.progress.value = 1;
    return;
  }
  flight.mode = mode;
  flight.started = false;
  flight.progress.value = 0;
}

export function beginFlight(id: string, from: DOMRect, frame: HTMLCanvasElement | null) {
  arm(id, rectOf(from), "open", frame);
}

export function beginReturn(id: string, from: DOMRect) {
  arm(id, rectOf(from), "return", null);
}
