import gsap from "gsap";
import type { WebGLRenderer } from "three";

const lensShader = `
  uniform sampler2D uScene;
  uniform vec2 uAspect;
  uniform vec2 uCenter;
  uniform float uProgress;
  uniform float uRadius;
  uniform float uLens;
  uniform float uReach;
  uniform float uOrbit;
  uniform float uWave;
  uniform float uAberration;
  uniform float uBreath;
  uniform float uTime;
  varying vec2 vUv;

  vec2 rotate2d(vec2 value, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c) * value;
  }

  float lobes(float angle) {
    return sin(angle * 3.0 + uTime * 0.7) * 0.6
      + sin(angle * 5.0 - uTime * 0.45) * 0.4;
  }

  float pull(float imageRadius, float einsteinRadius, float envelope) {
    return envelope * einsteinRadius * einsteinRadius / max(imageRadius, 0.001);
  }

  vec4 sampleScene(vec2 direction, float radius) {
    vec2 uv = direction * radius * uAspect.x / uAspect + uCenter;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      return vec4(0.0, 0.0, 0.0, 1.0);
    }
    return texture2D(uScene, uv);
  }

  void main() {
    vec2 point = (vUv - uCenter) * uAspect;
    float imageRadius = length(point) / uAspect.x;
    vec2 direction = length(point) > 0.00001 ? normalize(point) : vec2(1.0, 0.0);
    float angle = atan(point.y, point.x);
    float openingWave = sin(3.14159265 * clamp(uProgress, 0.0, 1.0));
    float horizon = uProgress * uRadius * (1.0 + uBreath * sin(uTime * 1.6));
    horizon += lobes(angle) * uWave * openingWave;
    float einsteinRadius = horizon * uLens;
    float envelope = 1.0 - smoothstep(horizon, horizon + uReach, imageRadius);
    float deflection = pull(imageRadius, einsteinRadius, envelope);
    vec2 draggedDirection = rotate2d(
      direction,
      deflection * uOrbit * min(uTime, 15.0)
    );
    float split = einsteinRadius * uAberration;

    vec4 red = sampleScene(
      draggedDirection,
      imageRadius - pull(imageRadius, einsteinRadius + split, envelope)
    );
    vec4 green = sampleScene(draggedDirection, imageRadius - deflection);
    vec4 blue = sampleScene(
      draggedDirection,
      imageRadius - pull(imageRadius, max(einsteinRadius - split, 0.0), envelope)
    );
    vec3 color = vec3(red.r, green.g, blue.b);

    float criticalWidth = max(0.0025, horizon * 0.018);
    float critical = exp(
      -pow((imageRadius - einsteinRadius) / criticalWidth, 2.0)
    );
    float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color += color * critical * (0.18 + luminance * 0.22) * uProgress;

    float edgeWidth = max(fwidth(imageRadius) * 1.5, 0.0001);
    float inside = 1.0 - smoothstep(-edgeWidth, edgeWidth, imageRadius - horizon);
    color = mix(color, vec3(0.0), inside);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const gridShader = `
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uCell;
  void main() {
    vec2 px = vUv * uResolution;
    vec2 grid = abs(fract(px / max(uCell, 1.0)) - 0.5);
    float line = min(grid.x, grid.y);
    float width = fwidth(px.x / max(uCell, 1.0));
    float mask = 1.0 - smoothstep(0.0, width * 1.35, line);
    float fade = smoothstep(0.82, 0.05, vUv.y);
    gl_FragColor = vec4(vec3(1.0), mask * fade * 0.22);
  }
`;

export function createBlackHole(
  THREE: typeof import("three"),
  renderer: WebGLRenderer,
) {
  const lensScene = new THREE.Scene();
  const lensCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const resolution = new THREE.Vector2(1, 1);
  const state = {
    progress: 0,
    open: false,
    time: 0,
    last: performance.now(),
  };
  let tween: gsap.core.Tween | null = null;

  const target = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: true,
    stencilBuffer: false,
  });
  target.texture.colorSpace = THREE.NoColorSpace;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uScene: { value: target.texture },
      uAspect: { value: new THREE.Vector2(1, 1) },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uProgress: { value: 0 },
      uRadius: { value: 0.2 },
      uLens: { value: 1.5 },
      uReach: { value: 0.09 },
      uOrbit: { value: 0.3 },
      uWave: { value: 0.05 },
      uAberration: { value: 0.004 },
      uBreath: { value: 0.015 },
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: lensShader,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  lensScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  const gridMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uResolution: { value: resolution },
      uCell: { value: 80 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: gridShader,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), gridMaterial);
  grid.frustumCulled = false;
  grid.renderOrder = -2;
  grid.position.z = -30;
  grid.visible = false;

  const resize = () => {
    const drawing = renderer.getDrawingBufferSize(resolution);
    if (drawing.x < 2 || drawing.y < 2) return;
    target.setSize(drawing.x, drawing.y);
    const width = renderer.domElement.clientWidth || window.innerWidth;
    const height = renderer.domElement.clientHeight || window.innerHeight;
    material.uniforms.uAspect.value.set(width / Math.max(height, 1), 1);
    const cell = (width < 650 ? 10 : width / 150) * 8;
    gridMaterial.uniforms.uCell.value = cell;
    grid.scale.set(width, height, 1);
  };

  const render = (
    scene: import("three").Scene,
    camera: import("three").Camera,
  ) => {
    const open =
      document.documentElement.dataset.panel === "profile" &&
      Boolean(document.querySelector("[data-ribbon]"));
    if (open !== state.open) {
      state.open = open;
      tween?.kill();
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      tween = gsap.to(state, {
        progress: open ? 1 : 0,
        duration: reduced ? 0 : 0.9,
        ease: "power3.inOut",
        overwrite: true,
      });
      if (open) {
        state.time = 0;
        state.last = performance.now();
      }
    }

    document.documentElement.classList.toggle("lens", state.progress > 0.001);
    if (state.progress <= 0.001) {
      grid.visible = false;
      return false;
    }

    resize();
    if (!grid.parent) scene.add(grid);
    grid.visible = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const now = performance.now();
    if (!reduced) state.time += Math.min(0.05, (now - state.last) / 1000);
    state.last = now;
    const canvasRect = renderer.domElement.getBoundingClientRect();
    const profile = document.querySelector<HTMLElement>(
      '[role="dialog"][aria-label="Profile"]',
    );
    const profileRect = profile?.getBoundingClientRect();
    if (profileRect && profileRect.width > 1) {
      material.uniforms.uCenter.value.set(
        (profileRect.left + profileRect.width / 2 - canvasRect.left) /
          canvasRect.width,
        1 -
          (profileRect.top + profileRect.height / 2 - canvasRect.top) /
            canvasRect.height,
      );
      material.uniforms.uRadius.value =
        profileRect.width / 2 / canvasRect.width;
    }
    material.uniforms.uProgress.value = state.progress;
    material.uniforms.uTime.value = state.time;

    const previousTarget = renderer.getRenderTarget();
    const previousAlpha = renderer.getClearAlpha();
    renderer.setRenderTarget(target);
    renderer.setClearColor(0x000000, 1);
    renderer.clear(true, true, true);
    renderer.render(scene, camera);

    renderer.setRenderTarget(previousTarget);
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha(previousAlpha);
    renderer.clear(true, true, true);
    renderer.render(lensScene, lensCamera);
    grid.visible = false;
    return true;
  };

  const dispose = () => {
    tween?.kill();
    document.documentElement.classList.remove("lens");
    grid.geometry.dispose();
    gridMaterial.dispose();
    material.dispose();
    target.dispose();
    grid.removeFromParent();
  };

  return { render, dispose, grid };
}
