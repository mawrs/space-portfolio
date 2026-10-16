import gsap from "gsap";
import type { WebGLRenderer } from "three";

const lensShader = `
  varying vec2 vUv;
  uniform sampler2D uScene;
  uniform vec2 uResolution;
  uniform float uStrength;
  uniform float uInner;
  uniform float uRing;
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 plain = texture2D(uScene, uv).rgb;
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
    float r = length(p);
    vec2 dir = p / max(r, 0.0001);
    float inner = uInner / uResolution.y;
    float ring = uRing / uResolution.y;
    float reach = smoothstep(ring * 1.48, ring * 1.04, r);
    float suck = reach * ring * 0.42 * uStrength;
    float smear = sin(atan(p.y, p.x) * 2.0) * reach * ring * 0.1 * uStrength;
    vec2 bent = p - dir * suck + vec2(-dir.y, dir.x) * smear;
    float pinch = smoothstep(ring * 1.28, ring * 1.02, r) * uStrength;
    float bentLen = length(bent);
    vec2 bentDir = bent / max(bentLen, 0.0001);
    bent = mix(bent, bentDir * max(bentLen, ring * 1.04), pinch);
    vec2 sampleUv = bent * vec2(uResolution.y / uResolution.x, 1.0) + 0.5;
    float chroma = reach * 0.018 * uStrength;
    vec3 color = vec3(
      texture2D(uScene, sampleUv + dir * chroma).r,
      texture2D(uScene, sampleUv).g,
      texture2D(uScene, sampleUv - dir * chroma).b
    );
    color *= mix(1.0, 0.55, smoothstep(ring * 1.7, ring, r) * uStrength);
    color *= smoothstep(inner * 0.9, inner * 1.08, r);
    gl_FragColor = vec4(mix(plain, color, uStrength), 1.0);
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

const glassShader = `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform sampler2D uScene;
  uniform vec2 uResolution;
  uniform float uStrength;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vView);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.4);
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 offset = normal.xy * 0.045;
    float chroma = 0.006 + fresnel * 0.02;
    vec3 refracted = vec3(
      texture2D(uScene, uv + offset + vec2(chroma, 0.0)).r,
      texture2D(uScene, uv + offset * 0.6).g,
      texture2D(uScene, uv + offset - vec2(chroma, 0.0)).b
    );
    vec3 film = 0.5 + 0.5 * cos(vec3(0.0, 1.7, 3.4) + fresnel * 8.0 + normal.x * 5.0);
    vec3 color = refracted * 0.62 + film * fresnel * 1.15 + vec3(1.0) * pow(fresnel, 3.0) * 0.85;
    color *= mix(0.35, 1.0, smoothstep(-0.2, 0.85, normal.z));
    gl_FragColor = vec4(color, uStrength);
  }
`;

type AlpacaSlot = {
  group: import("three").Group;
  angle: number;
  scale: number;
  depth: number;
};

export function createBlackHole(THREE: typeof import("three"), renderer: WebGLRenderer) {
  const sceneObjects = new THREE.Scene();
  const lensScene = new THREE.Scene();
  const lensCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const resolution = new THREE.Vector2(1, 1);
  const state = { strength: 0, open: false, built: 0 };
  let tween: gsap.core.Tween | null = null;

  const target = new THREE.WebGLRenderTarget(1, 1);
  target.texture.colorSpace = THREE.SRGBColorSpace;

  const grid = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      uniforms: {
        uResolution: { value: resolution },
        uCell: { value: 80 },
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: gridShader,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  grid.frustumCulled = false;
  grid.renderOrder = -2;
  grid.position.z = -30;
  grid.visible = false;

  const lensMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uScene: { value: target.texture },
      uResolution: { value: resolution },
      uStrength: { value: 0 },
      uInner: { value: 200 },
      uRing: { value: 280 },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: lensShader,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  lensScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lensMaterial));

  const glassMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uScene: { value: target.texture },
      uResolution: { value: resolution },
      uStrength: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: glassShader,
    transparent: true,
    depthWrite: true,
    toneMapped: false,
  });
  const voidDisc = new THREE.Mesh(
    new THREE.CircleGeometry(1, 96),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
  );
  voidDisc.position.z = 6;
  voidDisc.frustumCulled = false;
  sceneObjects.add(voidDisc);
  const torus = new THREE.Mesh(new THREE.TorusGeometry(280, 56, 64, 180), glassMaterial);
  torus.frustumCulled = false;
  sceneObjects.add(torus);

  const alpacaMaterial = new THREE.MeshStandardMaterial({
    color: 0x141414,
    roughness: 0.38,
    metalness: 0.12,
  });
  const alpacas = placeAlpacas(THREE, alpacaMaterial);
  alpacas.forEach((slot) => sceneObjects.add(slot.group));
  sceneObjects.add(new THREE.AmbientLight(0xffffff, 0.45));
  const key = new THREE.DirectionalLight(0xfff4e8, 2.4);
  key.position.set(180, 260, 700);
  sceneObjects.add(key);
  const rim = new THREE.DirectionalLight(0x9ecbff, 1.6);
  rim.position.set(-260, -80, 420);
  sceneObjects.add(rim);

  const resize = () => {
    const drawing = renderer.getDrawingBufferSize(resolution);
    if (drawing.x < 2 || drawing.y < 2) return;
    target.setSize(drawing.x, drawing.y);
    const cssHeight = renderer.domElement.clientHeight || window.innerHeight;
    const cssWidth = renderer.domElement.clientWidth || window.innerWidth;
    const major = Math.min(cssWidth, cssHeight) * 0.33;
    const tube = major * 0.24;
    const pixels = drawing.y / Math.max(cssHeight, 1);
    const hole = major - tube;
    lensMaterial.uniforms.uRing.value = major * pixels;
    lensMaterial.uniforms.uInner.value = hole * pixels;
    voidDisc.scale.setScalar(hole);
    if (Math.abs(major - state.built) > 2) {
      torus.geometry.dispose();
      torus.geometry = new THREE.TorusGeometry(major, tube, 64, 180);
      state.built = major;
    }
    const cell = (cssWidth < 650 ? 10 : cssWidth / 150) * 8;
    (grid.material as import("three").ShaderMaterial).uniforms.uCell.value = cell;
    grid.scale.set(cssWidth, cssHeight, 1);
  };

  const render = (scene: import("three").Scene, camera: import("three").Camera) => {
    const open = document.documentElement.dataset.panel === "profile" && Boolean(document.querySelector("[data-ribbon]"));
    if (open !== state.open) {
      state.open = open;
      tween?.kill();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      tween = gsap.to(state, {
        strength: open ? 1 : 0,
        duration: reduced ? 0 : 0.9,
        ease: "power3.inOut",
        overwrite: true,
      });
    }
    document.documentElement.classList.toggle("lens", state.strength > 0.01);
    if (state.strength <= 0.001) {
      grid.visible = false;
      return false;
    }
    resize();
    if (!grid.parent) scene.add(grid);
    grid.visible = true;
    lensMaterial.uniforms.uStrength.value = state.strength;
    glassMaterial.uniforms.uStrength.value = state.strength;
    torus.scale.setScalar(0.86 + 0.14 * state.strength);
    const major = state.built || lensMaterial.uniforms.uRing.value;
    const time = performance.now();
    alpacas.forEach((slot) => {
      const angle = slot.angle + time * 0.00005;
      const orbit = major * 0.74;
      slot.group.position.set(Math.cos(angle) * orbit, Math.sin(angle) * orbit * 0.86, slot.depth);
      slot.group.scale.setScalar(slot.scale * (0.9 + 0.1 * state.strength));
      slot.group.rotation.y = -angle + Math.PI;
    });

    const previous = renderer.getRenderTarget();
    const clear = renderer.getClearAlpha();
    renderer.setRenderTarget(target);
    renderer.setClearColor(0x000000, 1);
    renderer.clear(true, true, true);
    renderer.render(scene, camera);
    renderer.setRenderTarget(previous);
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha(clear);
    renderer.clear(true, true, true);
    renderer.render(lensScene, lensCamera);
    renderer.clearDepth();
    renderer.autoClear = false;
    renderer.render(sceneObjects, camera);
    renderer.autoClear = true;
    grid.visible = false;
    return true;
  };

  const dispose = () => {
    tween?.kill();
    document.documentElement.classList.remove("lens");
    grid.geometry.dispose();
    (grid.material as import("three").Material).dispose();
    torus.geometry.dispose();
    glassMaterial.dispose();
    lensMaterial.dispose();
    alpacaMaterial.dispose();
    target.dispose();
    grid.removeFromParent();
  };

  return { render, dispose, grid };
}

function placeAlpacas(THREE: typeof import("three"), material: import("three").Material): AlpacaSlot[] {
  const layout = [
    { angle: -0.2, scale: 78, depth: 36 },
    { angle: 0.7, scale: 52, depth: 18 },
    { angle: 1.55, scale: 96, depth: 70 },
    { angle: 2.45, scale: 64, depth: 28 },
    { angle: 3.5, scale: 118, depth: 90 },
    { angle: 4.55, scale: 84, depth: 48 },
    { angle: 5.4, scale: 58, depth: 22 },
  ];
  return layout.map((slot) => ({
    ...slot,
    group: createAlpaca(THREE, material),
  }));
}

function createAlpaca(THREE: typeof import("three"), material: import("three").Material) {
  const group = new THREE.Group();
  const sphere = new THREE.SphereGeometry(1, 18, 14);
  const leg = new THREE.CylinderGeometry(0.11, 0.13, 1, 8);
  const part = (geometry: import("three").BufferGeometry, x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    mesh.frustumCulled = false;
    group.add(mesh);
  };
  part(sphere, 0, 0.2, 0, 0.62, 0.4, 0.34);
  part(sphere, 0.08, 0.62, 0.22, 0.16, 0.32, 0.16);
  part(sphere, 0.1, 1.02, 0.36, 0.24, 0.22, 0.28);
  part(sphere, 0.0, 1.24, 0.3, 0.06, 0.16, 0.05);
  part(sphere, 0.2, 1.24, 0.3, 0.06, 0.16, 0.05);
  part(sphere, 0.12, 0.94, 0.58, 0.1, 0.08, 0.14);
  part(leg, -0.24, -0.28, 0.12, 1, 0.72, 1);
  part(leg, 0.2, -0.28, 0.12, 1, 0.72, 1);
  part(leg, -0.22, -0.24, -0.16, 1, 0.64, 1);
  part(leg, 0.18, -0.24, -0.16, 1, 0.64, 1);
  return group;
}
