"use client";

import { useEffect, useRef } from "react";
import { tokens } from "@/data/tokens";
import { flight, galleryMotion, lerpRect } from "@/lib/flight";
import { startFlight } from "@/lib/motion";
import { isMobile } from "@/lib/ribbon";
import { createBlackHole } from "./black-hole";
import styles from "./plane-stage.module.css";

const gravityGlsl = `
  float cardPin(vec2 uv) {
    vec2 q = uv * 2.0 - 1.0;
    return max((1.0 - q.x * q.x) * (1.0 - q.y * q.y), 0.0);
  }
  float cardGravity(vec2 uv, vec2 pointer, float aspect) {
    vec2 q = (uv - pointer) * vec2(max(aspect, 0.001), 1.0);
    return cardPin(uv) * exp(-dot(q, q) * 22.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  uniform float uHalf;
  uniform float uDepth;
  uniform float uCurve;
  uniform float uBend;
  uniform float uHover;
  uniform float uCardH;
  uniform float uAspect;
  uniform float uInteractive;
  uniform float uVelocity;
  uniform vec2 uPointer;
  ${gravityGlsl}
  void main() {
    vUv = uv;
    vec3 bent = position;
    float gravity = cardGravity(uv, uPointer, uAspect);
    vec2 pointerLocal = uPointer - 0.5;
    bent.xy += (pointerLocal - bent.xy) * uHover * uInteractive * gravity * 0.16;
    bent.z -= uHover * uInteractive * 0.1 * uCardH * gravity;
    vec4 world = modelMatrix * vec4(bent, 1.0);
    float along = mix(world.x, world.y, 1.0 - uCurve);
    float n = along / max(uHalf, 0.0001) * 1.15 - 0.2;
    float gaussian = exp(-n * n);
    float sine = sin(3.14159265 * n);
    float bowl = 1.0 - n * n;
    float shape = mix(bowl, sine, uCurve) * gaussian;
    float speed = min(abs(uVelocity), 1.0);
    float slope = mix(
      -2.0 * n * (1.0 + (1.0 - n * n)),
      3.14159265 * cos(3.14159265 * n) - 2.0 * n * sine,
      uCurve
    ) * gaussian;
    float roll = -0.16 * slope / 3.14159265 * uCurve * uBend * (1.0 + speed * 0.7);
    float cy = world.y;
    float cz = world.z;
    float cs = cos(roll);
    float sn = sin(roll);
    world.y = cy * cs - cz * sn;
    world.z = cy * sn + cz * cs;
    float cardArc = sin(vUv.x * 3.14159265);
    float cardSide = vUv.x * 2.0 - 1.0;
    world.x += uVelocity * uCardH * 0.055 * cardArc * uBend;
    world.y += uVelocity * uCardH * 0.035 * cardSide * cardArc * uBend;
    world.z += -uDepth * shape * uBend * (1.0 + speed * 1.25);
    world.y += 0.03 * world.x * uCurve * uBend * (1.0 + speed * 0.55);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform sampler2D uOverlay;
  uniform vec2 uCover;
  uniform float uAspect;
  uniform float uRadius;
  uniform float uHover;
  uniform float uAlpha;
  uniform vec2 uPointer;
  uniform vec4 uClip;
  uniform float uClipRadius;
  uniform float uClipOn;
  ${gravityGlsl}
  void main() {
    if (uAlpha < 0.01) discard;
    float gravity = cardGravity(vUv, uPointer, uAspect);
    vec2 lensUv = vUv + (vUv - uPointer) * gravity * uHover * 0.16;
    vec2 uv = (lensUv - 0.5) * uCover + 0.5;
    vec4 media = texture2D(uMap, uv);
    vec4 overlay = texture2D(uOverlay, lensUv);
    vec3 color = mix(media.rgb, overlay.rgb, overlay.a);
    vec2 field = (vUv - uPointer) * vec2(uAspect, 1.0);
    float shade = dot(field, normalize(vec2(-0.3, 1.0))) * gravity * uHover;
    color *= 1.0 + clamp(shade * 0.65, -0.1, 0.1);
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    vec2 box = vec2(uAspect, 1.0) * 0.5;
    vec2 q = abs(p) - box + uRadius;
    float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
    if (dist > 0.0) discard;
    float alpha = uAlpha;
    if (uClipOn > 0.5) {
      vec2 clipPoint = abs(gl_FragCoord.xy - uClip.xy) - uClip.zw + uClipRadius;
      float clipDistance = length(max(clipPoint, 0.0))
        + min(max(clipPoint.x, clipPoint.y), 0.0)
        - uClipRadius;
      alpha *= 1.0 - smoothstep(-1.5, 1.5, clipDistance);
    }
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

function coverScale(mediaAspect: number, planeAspect: number) {
  if (mediaAspect > planeAspect) return { x: planeAspect / mediaAspect, y: 1 };
  return { x: 1, y: mediaAspect / planeAspect };
}

function visibleClip(element: HTMLElement, rect: DOMRect) {
  const clip = getComputedStyle(element).clipPath;
  const body = clip.match(/^inset\((.+?)(?:\s+round\s+.+)?\)$/)?.[1];
  if (!body) return rect;
  const values = body
    .trim()
    .split(/\s+/)
    .map((value) => Number.parseFloat(value));
  if (!values.length || values.some((value) => !Number.isFinite(value))) return rect;
  const [top, right = top, bottom = top, left = right] =
    values.length === 2
      ? [values[0], values[1], values[0], values[1]]
      : values.length === 3
        ? [values[0], values[1], values[2], values[1]]
        : values;
  return new DOMRect(
    rect.left + left,
    rect.top + top,
    Math.max(0, rect.width - left - right),
    Math.max(0, rect.height - top - bottom),
  );
}

function paintOverlay(title: string, aspect: number, fontFamily: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = Math.max(1, Math.round(1600 / aspect));
  const context = canvas.getContext("2d");
  if (!context) return canvas;
  context.clearRect(0, 0, canvas.width, canvas.height);
  const fade = context.createLinearGradient(0, canvas.height * 0.62, 0, canvas.height);
  fade.addColorStop(0, "rgba(0,0,0,0)");
  fade.addColorStop(1, "rgba(0,0,0,0.72)");
  context.fillStyle = fade;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fff";
  context.font = `500 ${Math.round(canvas.height * 0.07)}px ${fontFamily}`;
  context.textBaseline = "alphabetic";
  context.fillText(title, 56, canvas.height - 72);
  context.beginPath();
  context.arc(canvas.width - 84, canvas.height - 86, 30, 0, Math.PI * 2);
  context.fillStyle = "rgba(0,0,0,0.72)";
  context.fill();
  context.fillStyle = "#fff";
  context.font = `500 30px ${fontFamily}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("↗", canvas.width - 84, canvas.height - 84);
  return canvas;
}

export function PlaneStage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;
      document.documentElement.classList.add("gl");

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.style.pointerEvents = "none";
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 1, 8000);
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");
      const blank = document.createElement("canvas");
      blank.width = 2;
      blank.height = 2;
      const blankTexture = new THREE.CanvasTexture(blank);
      const shared = {
        uHalf: { value: 1 },
        uDepth: { value: 1 },
        uCurve: { value: 1 },
        uVelocity: { value: 0 },
        uClip: { value: new THREE.Vector4() },
        uClipRadius: { value: 0 },
      };
      const fontFamily = getComputedStyle(document.body).fontFamily;

      type Record = {
        mesh: InstanceType<typeof THREE.Mesh>;
        material: InstanceType<typeof THREE.ShaderMaterial>;
        role: string;
        aspect: { value: number };
        radius: { value: number };
        cardH: { value: number };
        bend: { value: number };
        hover: { value: number };
        alpha: { value: number };
        clipOn: { value: number };
        pointer: InstanceType<typeof THREE.Vector2>;
        cover: InstanceType<typeof THREE.Vector2>;
        enteredAt: number;
        reveal: number;
      };

      const blackHole = createBlackHole(THREE, renderer);
      const records = new Map<string, Record>();
      const pointer = { x: 0, y: 0, over: false, down: false };
      const drawingSize = new THREE.Vector2();

      const placePointer = (event: PointerEvent) => {
        const bounds = renderer.domElement.getBoundingClientRect();
        pointer.x = event.clientX - bounds.left;
        pointer.y = event.clientY - bounds.top;
        pointer.over = true;
        pointer.down = event.buttons !== 0;
      };
      window.addEventListener("pointermove", placePointer);
      window.addEventListener("pointerup", placePointer);
      window.addEventListener("pointerdown", placePointer);

      const resize = () => {
        const width = mount.clientWidth;
        const height = mount.clientHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        const distance = height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        camera.position.set(0, 0, distance);
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(mount);
      resize();

      const syncCover = (record: Record) => {
        const image = record.material.uniforms.uMap.value.image as
          | HTMLVideoElement
          | HTMLImageElement
          | HTMLCanvasElement
          | undefined;
        if (!image) return;
        const width =
          "videoWidth" in image ? image.videoWidth : "naturalWidth" in image ? image.naturalWidth : image.width;
        const height =
          "videoHeight" in image
            ? image.videoHeight
            : "naturalHeight" in image
              ? image.naturalHeight
              : image.height;
        if (!width || !height) return;
        const scale = coverScale(width / height, record.aspect.value || 1);
        record.cover.set(scale.x, scale.y);
      };

      const ensure = (key: string, node: HTMLElement, role: string) => {
        const existing = records.get(key);
        if (existing) return existing;
        const video = node.querySelector("video");
        const image = node.querySelector("img");
        let map: InstanceType<typeof THREE.Texture> | null = null;
        if (video) {
          map = new THREE.VideoTexture(video);
          video.play().catch(() => undefined);
        } else if (image?.src) {
          map = loader.load(image.currentSrc || image.src);
        }
        if (!map) return null;
        map.colorSpace = THREE.SRGBColorSpace;
        const title = node.dataset.title ?? "";
        const ratio = Number.parseFloat(node.dataset.aspect || "") || 16 / 9;
        const overlayCanvas = title ? paintOverlay(title, ratio, fontFamily) : blank;
        const overlay = new THREE.CanvasTexture(overlayCanvas);
        overlay.colorSpace = THREE.SRGBColorSpace;
        const cover = new THREE.Vector2(1, 1);
        const pointerUv = new THREE.Vector2(0.5, 0.5);
        const hover = { value: 0 };
        const alpha = { value: 1 };
        const bend = { value: role === "card" ? 1 : 0 };
        const aspect = { value: ratio };
        const radius = { value: 0.08 };
        const cardH = { value: 1 };
        const clipOn = { value: 0 };
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uMap: { value: map },
            uOverlay: { value: overlay },
            uCover: { value: cover },
            uHalf: shared.uHalf,
            uDepth: shared.uDepth,
            uCurve: shared.uCurve,
            uVelocity: shared.uVelocity,
            uBend: bend,
            uHover: hover,
            uInteractive: { value: role === "card" || role === "simple" ? 1 : 0 },
            uPointer: { value: pointerUv },
            uAspect: aspect,
            uRadius: radius,
            uCardH: cardH,
            uAlpha: alpha,
            uClip: shared.uClip,
            uClipRadius: shared.uClipRadius,
            uClipOn: clipOn,
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: role !== "related",
          toneMapped: false,
        });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 48, 24), material);
        mesh.frustumCulled = false;
        scene.add(mesh);
        const record: Record = {
          mesh,
          material,
          role,
          aspect,
          radius,
          cardH,
          bend,
          hover,
          alpha,
          clipOn,
          pointer: pointerUv,
          cover,
          enteredAt:
            performance.now() +
            (role === "simple" ? 250 + (Number(node.dataset.stackIndex) || 0) * 100 : 0),
          reveal: role === "simple" ? 0 : 1,
        };
        records.set(key, record);
        return record;
      };

      const place = (
        record: Record,
        pose: { x: number; y: number; w: number; h: number },
        bounds: DOMRect,
        bend: number,
        radiusPx: number,
      ) => {
        const width = Math.max(pose.w, 1);
        const height = Math.max(pose.h, 1);
        record.mesh.position.set(
          pose.x + width / 2 - bounds.left - bounds.width / 2,
          bounds.top + bounds.height / 2 - (pose.y + height / 2),
          roleDepth(record.role),
        );
        record.mesh.scale.set(width, height, 1);
        record.aspect.value = width / height;
        record.cardH.value = height;
        record.bend.value = bend;
        record.radius.value = radiusPx / height;
        syncCover(record);
      };

      let frame = 0;
      let last = performance.now();
      const render = () => {
        const now = performance.now();
        const step = Math.min(48, now - last);
        last = now;
        const bounds = renderer.domElement.getBoundingClientRect();
        const mobile = isMobile();
        const rem = mobile ? 10 : window.innerWidth / 150;
        const half = (mobile ? bounds.height : bounds.width) / 2;
        shared.uHalf.value = Math.max(half, 1);
        shared.uDepth.value = half * (mobile ? tokens.depthMobile : tokens.depth);
        shared.uCurve.value = mobile ? 0 : 1;
        shared.uVelocity.value = mobile
          ? 0
          : THREE.MathUtils.clamp(galleryMotion.visualVelocity / 1.8, -1, 1);
        const projectSheet = document.querySelector<HTMLElement>("[data-project-sheet]");
        const sheetRect = projectSheet?.getBoundingClientRect();
        const clipRect = projectSheet && sheetRect ? visibleClip(projectSheet, sheetRect) : null;
        if (projectSheet && sheetRect && sheetRect.width > 1 && bounds.width > 1 && bounds.height > 1) {
          const drawing = renderer.getDrawingBufferSize(drawingSize);
          const scaleX = drawing.x / bounds.width;
          const scaleY = drawing.y / bounds.height;
          const visible = clipRect ?? sheetRect;
          shared.uClip.value.set(
            (visible.left - bounds.left + visible.width / 2) * scaleX,
            (bounds.bottom - visible.top - visible.height / 2) * scaleY,
            visible.width * scaleX * 0.5,
            visible.height * scaleY * 0.5,
          );
          shared.uClipRadius.value =
            (Number.parseFloat(getComputedStyle(projectSheet).borderTopLeftRadius) || 0) *
            scaleY;
        }

        if (flight.mode !== "idle") {
          if (!flight.started) {
            const started = startFlight();
            if (!started) {
              flight.wait += step;
              if (flight.wait > 1600) {
                flight.mode = "idle";
                flight.progress.value = 1;
              }
            }
          } else if (flight.progress.value >= 1) {
            flight.mode = "idle";
          }
        }

        const live = new Set<string>();
        const nodes = [
          ...document.querySelectorAll<HTMLElement>("[data-gl='card'], [data-gl='simple'], [data-gl='related']"),
        ];
        let hot: Record | null = null;

        nodes.forEach((node) => {
          const role = node.dataset.gl ?? "simple";
          const id = node.dataset.id;
          if (!id) return;
          const key = `${role}:${id}`;
          const rect = node.getBoundingClientRect();
          if (rect.width < 2 || rect.height < 2) return;
          const record = ensure(key, node, role);
          if (!record) return;
          record.clipOn.value = role === "simple" && sheetRect ? 1 : 0;
          live.add(key);
          const current = { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
          let pose = current;
          let bend = role === "card" && !mobile ? 1 : 0;
          if (
            flight.mode === "return" &&
            role === "card" &&
            id === flight.id &&
            flight.from
          ) {
            const amount = flight.progress.value;
            pose = lerpRect(flight.from, current, amount);
            bend = amount * (mobile ? 0 : 1);
            record.alpha.value = 1;
          } else if (role === "simple") {
            const progress = THREE.MathUtils.clamp((now - record.enteredAt) / 1250, 0, 1);
            record.reveal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            pose = {
              ...current,
              y: current.y + (1 - record.reveal) * (sheetRect?.height ?? bounds.height) * 0.5,
            };
            record.alpha.value = record.reveal;
          } else if (role === "related") {
            const opacity = Number.parseFloat(getComputedStyle(node).opacity);
            record.alpha.value = Number.isFinite(opacity) ? opacity : 0.3;
          } else {
            record.alpha.value = 1;
          }
          const radius = Number.parseFloat(getComputedStyle(node).borderTopLeftRadius) || rem * 1.2;
          place(record, pose, bounds, bend, radius);

          if (
            (role === "card" || role === "simple") &&
            record.alpha.value > 0.4 &&
            flight.mode === "idle" &&
            !pointer.down
          ) {
            const localX = pointer.x - (pose.x - bounds.left);
            const localY = pointer.y - (pose.y - bounds.top);
            if (localX >= 0 && localY >= 0 && localX <= pose.w && localY <= pose.h) {
              hot = record;
              record.pointer.set(localX / pose.w, 1 - localY / pose.h);
            }
          }
        });

        records.forEach((record, key) => {
          if (live.has(key)) return;
          scene.remove(record.mesh);
          record.mesh.geometry.dispose();
          const map = record.material.uniforms.uMap.value as { dispose?: () => void };
          map.dispose?.();
          const overlay = record.material.uniforms.uOverlay.value as { dispose?: () => void };
          if (overlay !== blankTexture) overlay.dispose?.();
          record.material.dispose();
          records.delete(key);
        });

        records.forEach((record) => {
          const target = record === hot ? 1 : 0;
          const tau = target > record.hover.value ? 70 : 140;
          record.hover.value += (target - record.hover.value) * (1 - Math.exp(-step / tau));
        });

        if (!blackHole.render(scene, camera)) renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      render();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("pointermove", placePointer);
        window.removeEventListener("pointerup", placePointer);
        window.removeEventListener("pointerdown", placePointer);
        records.forEach((record) => {
          record.mesh.geometry.dispose();
          record.material.dispose();
        });
        blankTexture.dispose();
        blackHole.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        document.documentElement.classList.remove("gl");
      };
      if (disposed) cleanup();
    };

    void start();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={mountRef} className={styles.stage} />;
}

function roleDepth(role: string) {
  if (role === "related") return 2;
  if (role === "simple") return 1;
  return 0;
}
