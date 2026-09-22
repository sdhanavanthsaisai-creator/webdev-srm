/* ═══════════════════════════════════════════════════════════════════════════
   ClubCraft 3D layer — the ring of workshop plates
   ES module; three.js r160 is vendored locally (public/vendor/three) so the
   demo never depends on unpkg. Falls back gracefully (body.no3d) on any error.
   ═══════════════════════════════════════════════════════════════════════════ */
import * as THREE from '/vendor/three/three.module.js';
import { EffectComposer } from '/vendor/three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from '/vendor/three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '/vendor/three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from '/vendor/three/addons/postprocessing/OutputPass.js';

try {

// wait for the data layer: the ring sizes itself from the final WORKSHOPS list
if (window.CC && window.CC.ready) await window.CC.ready;
const { WORKSHOPS } = window.CC;
const isReg = (id) => window.CC.isReg(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const N = WORKSHOPS.length, STEP = (Math.PI * 2) / N, R = 5.2;

/* ---- renderer / scene ---- */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0f17);
scene.fog = new THREE.Fog(0x0d0f17, 11, 30);
const camera = new THREE.PerspectiveCamera(40, 1, .1, 80);

/* ---- lights: warm workshop key, faint cool rim, ember core ---- */
scene.add(new THREE.HemisphereLight(0x8a7a5e, 0x0b0906, .9));
const key = new THREE.DirectionalLight(0xffdfb0, 1.7); key.position.set(6, 10, 7); scene.add(key);
const rim = new THREE.DirectionalLight(0x6f7ea0, .5); rim.position.set(-7, 6, -6); scene.add(rim);
const core = new THREE.PointLight(0xff6a3d, 14, 22, 2); core.position.set(0, 2.2, 0); scene.add(core);

/* ---- floor + stage markings ---- */
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(34, 64),
  new THREE.MeshStandardMaterial({ color: 0x141009, roughness: .92, metalness: .18 })
);
floor.rotation.x = -Math.PI / 2; scene.add(floor);

const grid = new THREE.PolarGridHelper(9.5, 12, 5, 64, 0x241C11, 0x1B150C);
grid.material.transparent = true; grid.material.opacity = .55; grid.position.y = .01; scene.add(grid);

const accent = new THREE.Mesh(
  new THREE.RingGeometry(5.42, 5.5, 128),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(1.7, .72, .36), transparent: true, opacity: .5, side: THREE.DoubleSide })
);
accent.rotation.x = -Math.PI / 2; accent.position.y = .02; scene.add(accent);

const hairRing = new THREE.Mesh(
  new THREE.RingGeometry(7.6, 7.615, 128),
  new THREE.MeshBasicMaterial({ color: 0x574C3A, transparent: true, opacity: .3, side: THREE.DoubleSide })
);
hairRing.rotation.x = -Math.PI / 2; hairRing.position.y = .02; scene.add(hairRing);

/* ---- panel textures: each plate is a typeset canvas ---- */
function wrapText(c, text, maxW) {
  const out = []; let line = '';
  for (const word of String(text).split(' ')) {
    const t = line ? line + ' ' + word : word;
    if (c.measureText(t).width > maxW && line) { out.push(line); line = word; } else line = t;
  }
  if (line) out.push(line);
  return out;
}
function seg(c, x1, y1, x2, y2) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }

function drawPanel(i, reg) {
  const w = WORKSHOPS[i];
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 672;
  const c = cv.getContext('2d');
  c.fillStyle = '#151109'; c.fillRect(0, 0, 512, 672);
  c.fillStyle = 'rgba(240,233,220,0.03)';
  for (let k = 0; k < 70; k++) c.fillRect(Math.random() * 512, Math.random() * 672, 1.4, 1.4);
  c.strokeStyle = 'rgba(240,233,220,0.16)'; c.lineWidth = 1.5;
  c.strokeRect(16.5, 16.5, 479, 639);
  c.strokeStyle = 'rgba(255,106,61,0.9)'; c.lineWidth = 2;
  [[16, 16, 1, 1], [495, 16, -1, 1], [16, 655, 1, -1], [495, 655, -1, -1]].forEach(([x, y, dx, dy]) => {
    c.beginPath(); c.moveTo(x + dx * 18, y); c.lineTo(x, y); c.lineTo(x, y + dy * 18); c.stroke();
  });
  c.font = '500 21px "JetBrains Mono", monospace'; c.fillStyle = '#A2957F'; c.textAlign = 'left';
  c.fillText('WS·' + w.n, 38, 60);
  const sd = new Date(w.starts_at).toLocaleDateString(undefined, { month: 'short', day: '2-digit' }).toUpperCase();
  c.textAlign = 'right'; c.fillText(sd, 474, 60); c.textAlign = 'left';
  c.strokeStyle = 'rgba(240,233,220,0.14)'; c.lineWidth = 1; seg(c, 38, 84, 474, 84);

  c.font = '600 42px Fraunces, Georgia, serif'; c.fillStyle = '#F0EADC';
  let y = 146;
  wrapText(c, w.title, 436).slice(0, 4).forEach((l) => { c.fillText(l, 38, y); y += 50; });

  y += 18;
  c.font = '500 21px "JetBrains Mono", monospace'; c.fillStyle = '#EFE7D8';
  c.fillText(String(w.speaker).toUpperCase(), 38, y);
  y += 30;
  c.font = '400 18px "JetBrains Mono", monospace'; c.fillStyle = '#A2957F';
  c.fillText(String(w.role).toUpperCase(), 38, y);

  seg(c, 38, 548, 474, 548);
  c.save(); c.translate(46, 584); c.rotate(Math.PI / 4); c.fillStyle = '#FF6A3D'; c.fillRect(-4, -4, 8, 8); c.restore();
  c.font = '400 19px "JetBrains Mono", monospace'; c.fillStyle = '#CFC4B0';
  c.fillText(String(w.location).toUpperCase(), 66, 591);
  const tm = new Date(w.starts_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  c.fillStyle = '#A2957F'; c.fillText(tm.toUpperCase() + ' · ' + String(w.dur).toUpperCase(), 66, 618);
  seg(c, 38, 634, 474, 634);

  if (reg) {
    c.fillStyle = '#FF6A3D'; c.beginPath(); c.arc(46, 649, 5, 0, Math.PI * 2); c.fill();
    c.font = '500 19px "JetBrains Mono", monospace'; c.fillText('SEAT CLAIMED', 66, 656);
  } else {
    c.fillStyle = '#8F8471'; c.font = '400 19px "JetBrains Mono", monospace';
    c.fillText('TAP TO OPEN', 38, 656);
    c.strokeStyle = '#8F8471'; c.lineWidth = 2;
    seg(c, 448, 649, 468, 649);
    seg(c, 460, 642, 468, 649);
    seg(c, 460, 656, 468, 649);
  }
  return cv;
}

/* ---- build the ring of plates ---- */
const ring = new THREE.Group(); scene.add(ring);
const faces = [];
const panels = WORKSHOPS.map((w, i) => {
  const th = i * STEP;
  const g = new THREE.Group();
  const slot = new THREE.Vector3(R * Math.sin(th), 1.72 + Math.sin(i * 2.4) * .14, R * Math.cos(th));
  const scatter = new THREE.Vector3((Math.random() - .5) * 26, 1.5 + Math.random() * 7, -8 - Math.random() * 12);
  g.position.copy(reduced ? slot : scatter);
  g.rotation.y = th;

  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 3.25, .05),
    new THREE.MeshStandardMaterial({ color: 0x1E1811, roughness: .35, metalness: .5 })
  );
  backing.position.z = -.04;

  const faceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 3.05), faceMat);
  face.position.z = .004; face.userData.i = i;

  const overlay = new THREE.Mesh(
    new THREE.PlaneGeometry(2.35, 3.05),
    new THREE.MeshBasicMaterial({ color: 0xFF6A3D, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  overlay.position.z = .012;

  const hanger = new THREE.Mesh(
    new THREE.PlaneGeometry(.012, .85),
    new THREE.MeshBasicMaterial({ color: 0x2E2718, transparent: true, opacity: .6 })
  );
  hanger.position.set(0, 1.525 + .42, -.03);

  const body = new THREE.Group();
  body.add(backing, face, overlay, hanger);
  g.add(body); ring.add(g);

  faces.push(face);
  return { g, body, face, faceMat, overlay, slot, scatter, th,
           baseY: slot.y, phase: i * 1.13, sry: (Math.random() - .5) * 4,
           lift: 0, dim: 1, glow: 0, sc: 1,
           t0: performance.now() + 500 + i * 110, done: reduced };
});

function applyTex(i) {
  const p = panels[i];
  const tex = new THREE.CanvasTexture(drawPanel(i, isReg(WORKSHOPS[i].id)));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  if (p.faceMat.map) p.faceMat.map.dispose();
  p.faceMat.map = tex; p.faceMat.needsUpdate = true;
}
panels.forEach((_, i) => applyTex(i));
Promise.all([
  document.fonts.load('600 42px Fraunces'),
  document.fonts.load('500 21px "JetBrains Mono"')
]).catch(() => {}).then(() => panels.forEach((_, i) => applyTex(i)));
window.addEventListener('cc:seats', (e) => applyTex(e.detail.index));

/* ---- embers: soft round sparks, GPU-drifted, HDR for bloom ---- */
const EN = 240;
const ePos = new Float32Array(EN * 3), eSeed = new Float32Array(EN), eSize = new Float32Array(EN);
for (let k = 0; k < EN; k++) {
  const a = Math.random() * Math.PI * 2, r = 2 + Math.random() * 9;
  ePos[k * 3] = Math.cos(a) * r; ePos[k * 3 + 1] = Math.random() * 10; ePos[k * 3 + 2] = Math.sin(a) * r;
  eSeed[k] = Math.random(); eSize[k] = 9 + Math.random() * 16;
}
const eGeo = new THREE.BufferGeometry();
eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
eGeo.setAttribute('aSeed', new THREE.BufferAttribute(eSeed, 1));
eGeo.setAttribute('aSize', new THREE.BufferAttribute(eSize, 1));
const eMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { uTime: { value: 0 }, uPR: { value: 1 } },
  vertexShader: `
    attribute float aSeed; attribute float aSize;
    uniform float uTime, uPR; varying float vSeed;
    void main(){
      vSeed = aSeed;
      vec3 p = position;
      p.y = -2.0 + mod(p.y + uTime*(0.25 + aSeed*0.55), 10.0);
      p.x += sin(uTime*0.4 + aSeed*40.0)*0.35;
      p.z += cos(uTime*0.33 + aSeed*70.0)*0.35;
      vec4 mv = modelViewMatrix*vec4(p,1.0);
      gl_PointSize = aSize*uPR*(140.0/-mv.z);
      gl_Position = projectionMatrix*mv;
    }`,
  fragmentShader: `
    uniform float uTime; varying float vSeed;
    void main(){
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.08, d);
      float fl = 0.5 + 0.5*sin(uTime*(1.5 + vSeed*3.0) + vSeed*50.0);
      vec3 col = mix(vec3(2.1,0.85,0.45), vec3(1.2,0.55,0.30), fract(vSeed*7.0));
      gl_FragColor = vec4(col*(0.5 + 0.9*fl), a*(0.22 + 0.5*fl));
      if (gl_FragColor.a < 0.01) discard;
    }`
});
const embers = new THREE.Points(eGeo, eMat);
embers.frustumCulled = false; scene.add(embers);

/* ---- post: bloom only on true HDR (sparks, floor marking) ---- */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .65, .45, .92);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ---- scroll choreography: camera keyframes per section ---- */
let gx = 1.55, baseZ = 14.6, anchors = [];
const keys = () => [
  { sel: '#hero',      c: [0, 2.7, baseZ],     l: [gx - 2.3, .9, 0] },
  { sel: '#floor',     c: [0, 3.0, baseZ - 1], l: [gx - 1.4, .7, 0] },
  { sel: '#interlude', c: [0, 3.3, baseZ - 4.6], l: [gx, .45, 0] },
  { sel: '#method',    c: [0, 2.5, baseZ - .8], l: [gx - 1.2, .8, 0] },
  { sel: '#blueprint', c: [0, 2.9, baseZ],     l: [gx - 1.5, .7, 0] },
  { sel: '#enter',     c: [0, 2.1, baseZ - .2], l: [gx - 1.7, .95, 0] }
];
function computeAnchors() {
  anchors = keys().map((k) => {
    const el = document.querySelector(k.sel);
    return { top: el ? el.offsetTop : 0, c: k.c, l: k.l };
  });
}
const lerpA = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const camPos = new THREE.Vector3(0, 2.7, baseZ), lookCur = new THREE.Vector3(gx - 2.3, .9, 0);

/* ---- interaction state ---- */
let rot = -.4, targetRot = -.4, vel = 0, dragging = false, moved = 0, px = 0;
let hoverI = null, uiHover = null, selected = -1, overStage = false, lastLab = null;
const stage = document.getElementById('stage');
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();

function raycast(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(faces, false)[0];
  hoverI = hit ? hit.object.userData.i : null;
}
function setLab() {
  const lab = hoverI !== null ? 'OPEN' : (overStage && !dragging ? 'DRAG' : '');
  if (lab !== lastLab) { lastLab = lab; window.dispatchEvent(new CustomEvent('cc:cursor', { detail: lab })); }
}
stage.addEventListener('pointerenter', () => overStage = true);
stage.addEventListener('pointerleave', () => { overStage = false; hoverI = null; setLab(); });
stage.addEventListener('pointerdown', (e) => {
  if (selected >= 0) return;
  dragging = true; moved = 0; px = e.clientX; vel = 0;
  stage.setPointerCapture(e.pointerId);
});
stage.addEventListener('pointermove', (e) => {
  if (dragging) {
    const dx = e.clientX - px; px = e.clientX; moved += Math.abs(dx);
    targetRot += dx * .0048; vel = dx * .0048;
  } else { raycast(e); setLab(); }
});
stage.addEventListener('pointerup', (e) => {
  if (!dragging) return;
  dragging = false;
  if (moved < 8) { raycast(e); if (hoverI !== null) window.dispatchEvent(new CustomEvent('cc:open', { detail: { i: hoverI } })); }
});
stage.addEventListener('pointercancel', () => dragging = false);

let lastY = scrollY;
addEventListener('scroll', () => { targetRot += (scrollY - lastY) * .00028; lastY = scrollY; }, { passive: true });
window.addEventListener('cc:hover', (e) => uiHover = e.detail);
window.addEventListener('cc:detail', (e) => {
  selected = e.detail.i;
  if (selected >= 0) {
    const want = -selected * STEP;
    let d = (want - rot) % (Math.PI * 2);
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    targetRot = rot + d;
  }
});

/* ---- parallax ---- */
let mnx = 0, mny = 0, parX = 0, parY = 0;
addEventListener('mousemove', (e) => {
  mnx = (e.clientX / innerWidth - .5) * 2; mny = (e.clientY / innerHeight - .5) * 2;
});

/* ---- resize ---- */
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h); composer.setSize(w, h);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  const mob = w < 760;
  gx = mob ? 0 : 1.55; baseZ = mob ? 18.6 : 14.6;
  eMat.uniforms.uPR.value = renderer.getPixelRatio();
  computeAnchors();
}
addEventListener('resize', resize);
resize();
setTimeout(resize, 400);
(document.fonts && document.fonts.ready || Promise.resolve()).then(() => setTimeout(resize, 100));

/* ---- frame loop ---- */
let last = performance.now();
function tick(now) {
  requestAnimationFrame(tick);
  const dt = Math.min(50, now - last); last = now;
  const t = now / 1000, dn = Math.min(2.2, dt / 16.66);
  let introDone = true;

  panels.forEach((p, i) => {
    if (!p.done) {
      const e = 1 - Math.pow(1 - Math.max(0, Math.min(1, (now - p.t0) / 1200)), 3);
      if (e < 1) introDone = false;
      p.g.position.lerpVectors(p.scatter, p.slot, e);
      p.body.rotation.y = p.sry * (1 - e);
      if (e >= 1) p.done = true;
    } else {
      const bob = reduced ? 0 : Math.sin(t * .7 + p.phase) * .075;
      p.g.position.set(p.slot.x, p.baseY + bob + p.lift, p.slot.z);
      p.body.rotation.y = reduced ? 0 : Math.sin(t * .5 + p.phase) * .02;
    }
    const tgtLift = (i === uiHover || i === hoverI) ? .28 : (i === selected ? .12 : 0);
    p.lift += (tgtLift - p.lift) * .12 * dn;
    const tgtDim = (selected >= 0 && selected !== i) ? .42 : 1;
    p.dim += (tgtDim - p.dim) * .1 * dn;
    p.faceMat.color.setScalar(p.dim);
    const tgtGlow = i === selected ? .12 : (i === uiHover || i === hoverI ? .09 : 0);
    p.glow += (tgtGlow - p.glow) * .14 * dn;
    p.overlay.material.opacity = p.glow;
    const tgtSc = i === selected ? 1.07 : 1;
    p.sc += (tgtSc - p.sc) * .12 * dn;
    p.g.scale.setScalar(p.sc);
  });

  if (!dragging) {
    vel *= .94;
    if (Math.abs(vel) > .0004 && selected < 0) targetRot += vel * dn;
    const idle = selected < 0 && hoverI === null && uiHover === null && !dragging;
    if (idle && !reduced && introDone) targetRot += .0012 * dn;
  }
  rot += (targetRot - rot) * .08 * dn;
  ring.rotation.y = rot;
  eMat.uniforms.uTime.value = t;

  // camera along section keyframes
  let y = scrollY, a = anchors[0], b = anchors[0], tt = 0;
  for (let i = 0; i < anchors.length - 1; i++) {
    if (y >= anchors[i].top) { a = anchors[i]; b = anchors[i + 1]; tt = (y - a.top) / Math.max(1, b.top - a.top); }
  }
  tt = Math.max(0, Math.min(1, tt)); tt = tt * tt * (3 - 2 * tt);
  const tp = lerpA(a.c, b.c, tt), tl = lerpA(a.l, b.l, tt);
  camPos.lerp(new THREE.Vector3(...tp), .07 * dn);
  lookCur.lerp(new THREE.Vector3(...tl), .07 * dn);
  if (!reduced) { parX += (mnx - parX) * .05 * dn; parY += (mny - parY) * .05 * dn; }
  camera.position.set(camPos.x + parX * .7, camPos.y - parY * .45, camPos.z);
  camera.lookAt(lookCur);

  composer.render();
}
requestAnimationFrame(tick);

} catch (err) {
  document.body.classList.add('no3d');
}
