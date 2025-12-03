import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as TWEEN from "@tweenjs/tween.js";

let scene, camera, renderer, controls;
let cubes = [];
let group;

let mode = 0;

init();
createModularCube();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020202);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(8, 8, 8);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);

  const light = new THREE.PointLight(0xffffff, 1.1);
  light.position.set(10, 10, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  group = new THREE.Group();
  scene.add(group);

  window.addEventListener("resize", onResize);

  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "a") toggleMode();
    if (e.key.toLowerCase() === "s") toggleSpiral();
    if (e.key.toLowerCase() === "d") toggleWave();
    if (e.key.toLowerCase() === "f") toggleRealDNA();
    if (e.key.toLowerCase() === "g") toggleCartoonDNA();
  });
}

function createModularCube() {
  const geo = new THREE.BoxGeometry(0.9, 0.9, 0.9);

  let index = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const color = new THREE.Color(`hsl(${index * 12}, 80%, 60%)`);
        const mat = new THREE.MeshStandardMaterial({ color });

        const cube = new THREE.Mesh(geo, mat);
        cube.position.set(x, y, z);

        cube.userData.home = cube.position.clone();

        cubes.push(cube);
        group.add(cube);

        index++;
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() * 0.001;

  group.rotation.y += 0.002;

  cubes.forEach((c, i) => {
    const s = 1 + Math.sin(t * 2 + i) * 0.07;
    c.scale.set(s, s, s);

    const hue = (t * 20 + i * 5) % 360;
    c.material.color.setHSL(hue / 360, 0.7, 0.5);
  });

  if (mode === 2) {
    cubes.forEach((c, i) => {
      c.position.y += Math.sin(t * 2 + i) * 0.005;
    });
  }

  if (mode === 4) {
    cubes.forEach((c, i) => {
      c.position.y += Math.sin(t + i * 0.3) * 0.02;
      c.position.z += Math.cos(t + i * 0.15) * 0.02;
    });
  }

  if (mode === 7) {
    group.rotation.y += 0.01;
    group.rotation.x = Math.sin(t) * 0.1;

    cubes.forEach((c, i) => {
      c.rotation.y += 0.03;
      c.position.x += Math.sin(t + i * 0.3) * 0.008;
      c.position.z += Math.cos(t + i * 0.3) * 0.008;
      c.position.y += Math.sin(t * 2 + i) * 0.004;
    });
  }

  if (mode === 8) {
    group.rotation.y += 0.012;

    cubes.forEach((c, i) => {
      c.position.x += Math.sin(t + i * 0.15) * 0.008;
      c.position.y += Math.cos(t * 1.2 + i) * 0.008;
    });
  }

  TWEEN.update();
  controls.update();
  renderer.render(scene, camera);
}

function toggleMode() {
  mode = (mode + 1) % 2;

  if (mode === 0) {
    cubes.forEach((c) => {
      new TWEEN.Tween(c.position)
        .to(c.userData.home, 900)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    });
  } else if (mode === 1) {
    cubes.forEach((c, i) => {
      const phi = Math.acos(2 * (i / cubes.length) - 1);
      const theta = Math.sqrt(cubes.length * Math.PI) * phi;
      const r = 3;

      const target = {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta),
      };

      new TWEEN.Tween(c.position)
        .to(target, 1200)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    });
  }
}

function toggleSpiral() {
  mode = 2 - mode;

  if (mode !== 2) {
    cubes.forEach((c) => {
      new TWEEN.Tween(c.position)
        .to(c.userData.home, 800)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    });
    return;
  }

  cubes.forEach((c, i) => {
    const a = i * 0.4;
    const r = 0.6 * i;

    const target = {
      x: Math.cos(a) * r * 0.2,
      y: i * 0.15 - 2,
      z: Math.sin(a) * r * 0.2,
    };

    new TWEEN.Tween(c.position)
      .to(target, 1400)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  });
}

function toggleWave() {
  mode = mode === 4 ? 0 : 4;

  if (mode === 0) {
    cubes.forEach((c) => {
      new TWEEN.Tween(c.position)
        .to(c.userData.home, 900)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    });
    return;
  }

  cubes.forEach((c, i) => {
    const step = 0.4;
    const freq = 0.6;
    const amp = 1.2;

    const target = {
      x: (i - 13) * step,
      y: Math.sin(i * freq) * amp,
      z: Math.cos(i * freq * 0.7) * amp * 0.5,
    };

    new TWEEN.Tween(c.position)
      .to(target, 1500)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  });
}

function toggleRealDNA() {
  mode = mode === 7 ? 0 : 7;

  if (mode === 0) {
    cubes.forEach((c) => {
      new TWEEN.Tween(c.position)
        .to(c.userData.home, 900)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    });
    return;
  }

  cubes.forEach((c, i) => {
    const helixIndex = i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2;

    const t = i * 0.35;
    const height = (i - 13) * 0.18;
    const radius = 1.6;

    let target = { x: 0, y: height, z: 0 };

    if (helixIndex === 0) {
      target.x = Math.cos(t) * radius;
      target.z = Math.sin(t) * radius;
      c.material.color.set(0x00b4ff);
    }

    if (helixIndex === 1) {
      target.x = Math.cos(t + Math.PI) * radius;
      target.z = Math.sin(t + Math.PI) * radius;
      c.material.color.set(0xff3a5c);
    }

    if (helixIndex === 2) {
      target.x = 0;
      target.z = 0;
      c.material.color.set(0xffff99);
    }

    new TWEEN.Tween(c.position)
      .to(target, 1500)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  });
}

function toggleCartoonDNA() {
  mode = mode === 8 ? 0 : 8;

  if (mode === 0) {
    cubes.forEach((c) => {
      new TWEEN.Tween(c.position)
        .to(c.userData.home, 900)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    });
    return;
  }

  let blueIndex = 0;
  let redIndex = 0;
  const step = 0.25;
  const k = 0.5;

  cubes.forEach((c, i) => {
    const type = i % 2 === 0 ? "blue" : "red";

    let t = (type === "blue" ? blueIndex++ : redIndex++) * k;
    let h = type === "blue" ? 0 : 0.3;

    let target = {
      x: type === "blue" ? Math.sin(t) : -Math.sin(t),
      y: Math.sin(t * 2) * 0.3 + h,
      z: i * step - 3,
    };

    if (type === "blue") c.material.color.set(0x32a8ff);
    else c.material.color.set(0xff4a5c);

    new TWEEN.Tween(c.position)
      .to(target, 1200)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  });
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
