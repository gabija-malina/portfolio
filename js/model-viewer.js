import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.querySelectorAll('.wireframe-viewer').forEach((viewer) => {
  const stage = viewer.querySelector('.wireframe-viewer__stage');
  const status = viewer.querySelector('.wireframe-viewer__status');
  const modeButtons = viewer.querySelectorAll('[data-view-mode]');
  const resetButton = viewer.querySelector('[data-view-reset]');
  const modelUrl = viewer.dataset.model;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 10000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  stage.appendChild(renderer.domElement);

  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('aria-label', '3D model. Drag to rotate and scroll to zoom.');

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.screenSpacePanning = true;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x45413d, 2.4));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.3);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);

  let model;
  let currentMode = 'wireframe';
  let initialCameraPosition = new THREE.Vector3(2, 1.5, 2.5);
  let initialTarget = new THREE.Vector3();

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x202c88,
    wireframe: true,
    side: THREE.DoubleSide
  });

  function setMode(mode) {
    currentMode = mode;
    if (model) {
      model.traverse((object) => {
        if (!object.isMesh) return;
        object.material = mode === 'wireframe' ? wireMaterial : object.userData.originalMaterial;
      });
    }

    modeButtons.forEach((button) => {
      const active = button.dataset.viewMode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function resetView() {
    camera.position.copy(initialCameraPosition);
    controls.target.copy(initialTarget);
    controls.update();
  }

  function frameModel(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const distance = maxDimension / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)));

    controls.target.copy(center);
    camera.position.set(
      center.x + distance * 0.72,
      center.y + distance * 0.45,
      center.z + distance * 0.92
    );
    camera.near = Math.max(maxDimension / 1000, 0.01);
    camera.far = maxDimension * 100;
    camera.updateProjectionMatrix();

    controls.minDistance = maxDimension * 0.08;
    controls.maxDistance = maxDimension * 8;
    initialCameraPosition = camera.position.clone();
    initialTarget = controls.target.clone();
    controls.update();
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.viewMode));
  });
  resetButton.addEventListener('click', resetView);

  const loader = new GLTFLoader();
  loader.load(
    modelUrl,
    (gltf) => {
      model = gltf.scene;
      model.traverse((object) => {
        if (!object.isMesh) return;
        object.userData.originalMaterial = object.material;
      });
      scene.add(model);
      frameModel(model);
      setMode(currentMode);
      status.textContent = 'Model loaded';
      status.classList.add('is-hidden');
    },
    (event) => {
      if (!event.total) return;
      const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
      status.textContent = `Loading 3D model… ${percent}%`;
    },
    () => {
      status.textContent = 'The 3D model could not be loaded.';
      status.classList.remove('is-hidden');
    }
  );

  const resizeObserver = new ResizeObserver(() => {
    const width = Math.max(stage.clientWidth, 1);
    const height = Math.max(stage.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  });
  resizeObserver.observe(stage);

  function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
