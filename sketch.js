let video;
let handLandmarker;
let aprilTagDetector;
let placardScanCanvas;
let placardScanContext;
let birdAssets = [];
let mammalAssets = [];
let insectAssets = [];
let reptileAssets = [];
let backgroundLayers = [];
let staticSceneProps = [];
let nightSceneAnimals = [];
let animalPresetData;
let naturePresetData;
let naturePresetByName = {};
let ambientSound;
let ambientSoundStarted = false;
let ambientTargetVolume = 0;
let ambientCurrentVolume = 0;
let nightAmbientSound;
let nightAmbientStarted = false;
let nightAmbientCurrentVolume = 0;

let hands = [];
let placardDetections = [];

let activeLayers = [];
let sparkleBursts = [];
let lastSceneActivity = 0;
let sceneEmptySince = 0;
let nightSceneCountersActive = true;
let nightAmount = 1;

let lastTrigger = 0;
let lastCategoryShortcut = 0;
let lastPlacardScan = 0;
let heldPlacardId = null;
let lastPlacardSeen = 0;
let placardDetectionBusy = false;
let aprilTagReady = false;
let placardStatus = "AprilTag: starting";
let lastDetectedPlacardLabel = "none";

const interactionMode = "apriltag";

const sceneSize = {
  width: 9600,
  height: 1080
};

const paperTextureSettings = {
  alpha: 96,
  fiberAlpha: 76,
  textureAlpha: 185,
  width: 2667,
  height: 300
};

const cloudSettings = {
  speed: 7
};

const leafWindSettings = {
  afterLayer: 7,
  interval: 30000,
  duration: 15000,
  travel: sceneSize.width * 0.28,
  startX: sceneSize.width + 120,
  spreadX: 1750,
  colors: [
    [117, 116, 58],
    [92, 128, 75],
    [151, 126, 62],
    [76, 101, 61]
  ],
  leaves: [
    { offset: 0.00, y: 170, size: 36, drift: 38, phase: 0.2, color: 0 },
    { offset: 0.04, y: 286, size: 28, drift: 32, phase: 1.6, color: 1 },
    { offset: 0.08, y: 438, size: 34, drift: 42, phase: 2.3, color: 2 },
    { offset: 0.12, y: 602, size: 24, drift: 36, phase: 0.9, color: 3 },
    { offset: 0.16, y: 760, size: 36, drift: 44, phase: 3.1, color: 0 },
    { offset: 0.21, y: 360, size: 26, drift: 34, phase: 2.0, color: 1 },
    { offset: 0.25, y: 890, size: 32, drift: 40, phase: 0.5, color: 2 },
    { offset: 0.30, y: 510, size: 40, drift: 38, phase: 2.8, color: 3 },
    { offset: 0.34, y: 694, size: 27, drift: 36, phase: 1.2, color: 0 },
    { offset: 0.39, y: 234, size: 31, drift: 32, phase: 3.5, color: 1 },
    { offset: 0.43, y: 826, size: 25, drift: 42, phase: 0.7, color: 2 },
    { offset: 0.48, y: 466, size: 35, drift: 34, phase: 2.5, color: 3 },
    { offset: 0.52, y: 146, size: 26, drift: 30, phase: 1.0, color: 1 },
    { offset: 0.57, y: 338, size: 38, drift: 40, phase: 2.9, color: 0 },
    { offset: 0.61, y: 554, size: 29, drift: 44, phase: 0.4, color: 2 },
    { offset: 0.66, y: 706, size: 33, drift: 42, phase: 3.7, color: 3 },
    { offset: 0.70, y: 928, size: 24, drift: 34, phase: 1.8, color: 0 },
    { offset: 0.75, y: 258, size: 35, drift: 38, phase: 2.2, color: 2 },
    { offset: 0.79, y: 630, size: 30, drift: 44, phase: 0.1, color: 1 },
    { offset: 0.84, y: 804, size: 39, drift: 40, phase: 3.0, color: 3 },
    { offset: 0.88, y: 410, size: 24, drift: 32, phase: 1.4, color: 0 },
    { offset: 0.93, y: 968, size: 31, drift: 42, phase: 2.6, color: 2 }
  ]
};

const rustlePatchSettings = {
  afterLayer: 7,
  x: 1116,
  y: 720,
  interval: 45000,
  duration: 15000,
  width: 315,
  height: 95,
  densityMultiplier: 5,
  sizeScale: 1.15,
  colors: [
    [55, 93, 45],
    [77, 112, 54],
    [122, 103, 49],
    [50, 75, 43]
  ],
  blades: [
    { x: -126, y: 28, length: 82, size: 18, phase: 0.2, color: 0 },
    { x: -102, y: -18, length: 104, size: 16, phase: 1.1, color: 1 },
    { x: -78, y: 14, length: 76, size: 20, phase: 2.0, color: 2 },
    { x: -51, y: -36, length: 112, size: 15, phase: 2.8, color: 0 },
    { x: -22, y: 34, length: 88, size: 18, phase: 0.7, color: 3 },
    { x: 8, y: -24, length: 100, size: 17, phase: 1.8, color: 1 },
    { x: 39, y: 20, length: 80, size: 20, phase: 3.2, color: 2 },
    { x: 70, y: -12, length: 96, size: 16, phase: 0.4, color: 0 },
    { x: 101, y: 30, length: 72, size: 18, phase: 2.5, color: 3 },
    { x: 128, y: -32, length: 108, size: 15, phase: 1.4, color: 1 },
    { x: -142, y: -6, length: 68, size: 15, phase: 3.4, color: 3 },
    { x: 144, y: 8, length: 74, size: 16, phase: 2.2, color: 2 }
  ]
};

const ambientSoundSettings = {
  path: "assets/audio/morning-birds-eumundi.mp3",
  minVolume: 0.06,
  maxVolume: 0.34,
  fullSceneAnimalCount: 12,
  smoothing: 0.025
};

const nightAmbientSoundSettings = {
  path: "assets/audio/boobook-owl-calls-roisin-gleeson.m4a",
  maxVolume: 0.42,
  smoothing: 0.045
};

const animalGlowSettings = {
  color: [255, 239, 174],
  accentColor: [135, 232, 255],
  baseAlpha: 34,
  pulseAlpha: 69,
  pulseDuration: 1800,
  fadeDuration: 5000,
  scale: 0.825,
  blur: 16
};

const animalMotionSettings = {
  amountMultiplier: 1.25,
  speedMultiplier: 1.08
};

const nightSceneSettings = {
  inactivityDelay: 45000,
  fadeSpeed: 0.012,
  skyColor: [5, 12, 34],
  backgroundColor: [8, 18, 38],
  foregroundShadow: [0, 0, 0],
  skyAlpha: 205,
  backgroundAlpha: 72,
  foregroundAlpha: 14
};

const starSettings = {
  color: [255, 248, 216],
  alpha: 221,
  twinkleAlpha: 111,
  twinkleSpeed: 0.00072,
  points: [
    { x: 558, y: 74, size: 20, phase: 0.2 },
    { x: 1877, y: 159, size: 16, phase: 1.7 },
    { x: 2459, y: 65, size: 18, phase: 2.9 },
    { x: 3641, y: 150, size: 16, phase: 2.4 },
    { x: 4053, y: 74, size: 20, phase: 0.8 },
    { x: 4861, y: 131, size: 18, phase: 1.1 },
    { x: 5651, y: 84, size: 16, phase: 3.1 },
    { x: 7576, y: 136, size: 18, phase: 1.2 },
    { x: 8054, y: 55, size: 20, phase: 3.6 },
    { x: 8394, y: 159, size: 16, phase: 2.8 },
    { x: 9056, y: 51, size: 20, phase: 0.5 }
  ]
};

const moonSettings = {
  x: 2918,
  y: 121,
  size: 233,
  color: [246, 239, 206],
  glowColor: [246, 239, 206],
  glowSize: 1.96,
  glowAlpha: 55
};

const rareAnimalSettings = {
  lifespan: 15000,
  sparkleDuration: 2200,
  sparkleCount: 34,
  sparkleSize: [5, 15],
  sparkleRadius: [12, 72],
  sparkleColors: [
    [255, 245, 176],
    [255, 255, 255],
    [135, 232, 255],
    [255, 184, 221]
  ]
};

const natureMotionDefaults = {
  shake: { x: 18, y: 8, speed: 3.2 },
  pulse: { x: 0, y: 0, speed: 1.25 },
  sway: { x: 20, y: 0, speed: 0.95 },
  "fall from top to bottom": { x: 18, y: 520, speed: 0.8 },
  "move from right to left": { x: -260, y: 0, speed: 1 },
  "move from left to right": { x: 260, y: 0, speed: 1 }
};

const rarityWeights = {
  normal: 1,
  rare: 0.12
};

const placardSettings = {
  scanWidth: 480,
  scanInterval: 180,
  triggerCooldown: 2200,
  holdResetDelay: 900,
  tagPhysicalSizeMetres: 0.16
};

const categoryShortcutCooldown = 1200;

const placardDefinitions = {
  0: { label: "birds", getAssets: () => birdAssets },
  1: { label: "mammals", getAssets: () => mammalAssets },
  2: { label: "insects", getAssets: () => insectAssets },
  3: { label: "reptiles", getAssets: () => reptileAssets },
  4: { label: "mystery", getAssets: getMysteryCategory }
};

const categoryAssetLists = [
  { label: "birds", assets: () => birdAssets },
  { label: "mammals", assets: () => mammalAssets },
  { label: "insects", assets: () => insectAssets },
  { label: "reptiles", assets: () => reptileAssets }
];

const backgroundLayerSettings = [
  { index: 1, name: "sky", path: "assets/BACKGROUND/fullwidth/200ppi/1-Sky.png" },
  { index: 2, name: "clouds", path: "assets/BACKGROUND/fullwidth/200ppi/2-Clouds.png", moving: true },
  { index: 3, name: "sunset", path: "assets/BACKGROUND/fullwidth/200ppi/3-Sunset.png" },
  { index: 4, name: "seaAndTrees", path: "assets/BACKGROUND/fullwidth/200ppi/4-sea and trees.png" },
  { index: 5, name: "glasshouseBackground", path: "assets/BACKGROUND/fullwidth/200ppi/5-glasshouse background.png" },
  { index: 6, name: "leftMountains", path: "assets/BACKGROUND/fullwidth/200ppi/6-left mountains background.png" },
  { index: 7, name: "rightMountains", path: "assets/BACKGROUND/fullwidth/200ppi/7-right mountains background.png" },
  { index: 8, name: "rightHillFront", path: "assets/BACKGROUND/fullwidth/200ppi/8-right hill front.png" },
  { index: 9, name: "treesAndRocksRight", path: "assets/BACKGROUND/fullwidth/200ppi/9-trees and rocks right.png" },
  { index: 10, name: "treesForeground", path: "assets/BACKGROUND/fullwidth/200ppi/10-trees foreground.png", foreground: true },
  { index: 11, name: "rocksStream", path: "assets/BACKGROUND/fullwidth/200ppi/11-rocks stream.png", foreground: true },
  { index: 12, name: "treesLeft", path: "assets/BACKGROUND/fullwidth/200ppi/12-trees left.png", foreground: true },
  { index: 13, name: "treeLeft", path: "assets/BACKGROUND/fullwidth/200ppi/13-Tree left.png", foreground: true }
];

const staticScenePropSettings = [
  {
    name: "tallySign",
    path: "assets/png/tally sign/1x/Sign.png",
    x: 3665,
    y: 832,
    width: 456,
    height: 473,
    nightTint: [178, 188, 210]
  }
];

const nightSceneAnimalSettings = [
  {
    name: "boobookOwl",
    category: "birds",
    path: "assets/png/1x/boobook-owl.png",
    x: 3494,
    y: 570,
    glow: {
      color: [255, 232, 166],
      alpha: 92,
      scale: 1.09,
      blurScale: 0.2
    }
  }
];

const categoryTallySettings = [
  { category: "birds", x: 3491, y: 738 },
  { category: "mammals", x: 3577, y: 738 },
  { category: "insects", x: 3658, y: 738 },
  { category: "reptiles", x: 3748, y: 738 },
  { category: "rare", x: 3844, y: 738 }
];

const defaultLayerSettings = {
  fadeIn: 600,
  fadeOut: null,
  lifespan: null,
  rotation: [-0.3, 0.3],
  size: [120, 320],
  x: [0.1, 0.9],
  y: [0.1, 0.9]
};

function makeImageAsset(settings) {
  return {
    ...defaultLayerSettings,
    ...settings,
    type: "image",
    path: settings.frames[0],
    frames: settings.frames.map((path) => loadImage(path))
  };
}

function makeVideoAsset(settings) {
  return {
    ...defaultLayerSettings,
    fadeIn: 250,
    fadeOut: null,
    scaleMode: "cover",
    ...settings,
    type: "video",
    renderBehindLayer: settings.renderBehindLayer ?? getRenderLayerFromPath(settings.path),
    video: null,
    videoWidth: null,
    videoHeight: null,
    duration: null
  };
}

function getRenderLayerFromPath(path) {
  const filename = path.split("/").pop();
  const match = filename.match(/^(\d{1,2})-/);

  if (!match) return null;

  return Number(match[1]);
}

function setupVideoAssets() {
  const assets = getAllVideoAssets();

  for (const asset of assets) {
    if (asset.type !== "video") continue;

    asset.video = createVideo(asset.path, () => {
      asset.video.hide();
    });

    asset.video.hide();
    asset.video.volume(0);
    asset.video.elt.muted = true;
    asset.video.elt.playsInline = true;
    asset.video.elt.preload = "auto";

    asset.video.elt.addEventListener("loadedmetadata", () => {
      asset.videoWidth = asset.video.elt.videoWidth;
      asset.videoHeight = asset.video.elt.videoHeight;

      if (Number.isFinite(asset.video.elt.duration) && asset.video.elt.duration > 0) {
        asset.duration = asset.video.elt.duration * 1000;
      }
    });
  }
}

function getAllVideoAssets() {
  const assets = [
    ...birdAssets,
    ...mammalAssets,
    ...insectAssets,
    ...reptileAssets
  ];

  for (const asset of [...assets]) {
    if (asset.companion) {
      assets.push(asset.companion);
    }
  }

  return assets;
}

async function setupHandTracking() {

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );

  handLandmarker = await HandLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
      },

      runningMode: "VIDEO",

      numHands: 2
    }
  );

  console.log("tracking ready");
}

async function setupAprilTagTracking() {
  if (!window.Comlink) {
    console.warn("AprilTag setup skipped: Comlink was not loaded.");
    placardStatus = "AprilTag: Comlink failed";
    return;
  }

  placardStatus = "AprilTag: loading detector";

  placardScanCanvas = document.createElement("canvas");
  placardScanContext = placardScanCanvas.getContext("2d", { willReadFrequently: true });

  const Apriltag = window.Comlink.wrap(
    new Worker("assets/vendor/apriltag/apriltag.js")
  );

  let markReady;
  const ready = new Promise((resolve) => {
    markReady = resolve;
  });

  aprilTagDetector = await new Apriltag(window.Comlink.proxy(markReady));
  await ready;

  await aprilTagDetector.set_return_pose(0);
  await aprilTagDetector.set_return_solutions(0);
  await aprilTagDetector.set_max_detections(5);

  for (const tagId of Object.keys(placardDefinitions)) {
    await aprilTagDetector.set_tag_size(Number(tagId), placardSettings.tagPhysicalSizeMetres);
  }

  aprilTagReady = true;
  placardStatus = "AprilTag: ready";
  console.log("AprilTag placards ready");
}

function preload() {
  //background
  backgroundLayers = backgroundLayerSettings.map((layer) => ({
    ...layer,
    img: loadImage(layer.path)
  }));
  staticSceneProps = staticScenePropSettings.map((prop) => ({
    ...prop,
    img: loadImage(prop.path)
  }));
  nightSceneAnimals = nightSceneAnimalSettings.map((animal) => ({
    ...animal,
    img: loadImage(animal.path)
  }));

  animalPresetData = loadJSON("assets/animals/animation-presets.json");
  naturePresetData = loadJSON("assets/animals/nature-presets.json");
}

function setupAnimalAssets(data) {
  setupNaturePresetMap(naturePresetData || []);

  const categories = {
    birds: birdAssets,
    mammals: mammalAssets,
    insects: insectAssets,
    reptiles: reptileAssets
  };

  for (const [categoryName, categoryAssets] of Object.entries(categories)) {
    categoryAssets.length = 0;

    for (const preset of data[categoryName] || []) {
      categoryAssets.push(makeImageAssetFromPreset(preset));
    }
  }
}

function setupNaturePresetMap(data) {
  naturePresetByName = {};

  for (const preset of Object.values(data || {})) {
    naturePresetByName[preset.name] = preset;
  }
}

function makeImageAssetFromPreset(preset) {
  return makeImageAsset({
    name: preset.name,
    frames: [preset.image],
    rarity: preset.rarity,
    x: preset.x,
    y: preset.y,
    size: preset.size,
    lifespan: preset.duration,
    fadeIn: 350,
    fadeOut: min(1800, preset.duration * 0.22),
    rotation: preset.rotation || [0, 0],
    renderBehindLayer: preset.renderBehindLayer ?? null,
    motion: preset.motion,
    motionAmountX: preset.motionAmountX || 0,
    motionAmountY: preset.motionAmountY || 0,
    motionSpeed: preset.motionSpeed || 1,
    companion: makeNatureCompanionForPreset(preset)
  });
}

function makeNatureCompanionForPreset(preset) {
  const effect = getNaturePresetForAnimal(preset);

  if (!effect) return null;
  const motionDefaults = natureMotionDefaults[effect.motion] || natureMotionDefaults.sway;

  return makeImageAsset({
    name: `${preset.name}-nature`,
    frames: [effect.image],
    rarity: preset.rarity,
    x: effect.x,
    y: effect.y,
    size: (effect.sourceWidth || effect.size) * (effect.scale || 1),
    anchorToParent: effect.anchorToParent || false,
    offsetX: effect.offsetX || 0,
    offsetY: effect.offsetY || 0,
    useOwnSizeWhenAnchored: true,
    lifespan: effect.duration,
    fadeIn: 450,
    fadeOut: min(1800, effect.duration * 0.22),
    rotation: [0, 0],
    renderBehindLayer: effect.renderBehindLayer ?? null,
    motion: effect.motion,
    motionAmountX: motionDefaults.x,
    motionAmountY: motionDefaults.y,
    motionSpeed: motionDefaults.speed,
    preserveAspectRatio: true,
    noGlow: true
  });
}

function getNaturePresetForAnimal(preset) {
  if (preset.name === "curlew2") {
    return naturePresetByName.curlew;
  }

  if (preset.name === "frittilary2") {
    return naturePresetByName.frittilary;
  }

  if (preset.name === "spottedquoll") {
    return naturePresetByName.quoll;
  }

  if (preset.name === "black-cockatoo" || preset.name === "black-cockatoo-flying") {
    return naturePresetByName.cockatoo;
  }

  return naturePresetByName[preset.name] || null;
}

async function setup() {

  createCanvas(windowWidth, windowHeight);
  setupInteractionKeyboard();
  setupAnimalAssets(animalPresetData || {});

  applyPaperTreatmentToLayers();

  video = createCapture(VIDEO);

  video.size(640, 480);

  video.hide();

  if (interactionMode === "hands") {
    await setupHandTracking();
  }

  if (interactionMode === "apriltag") {
    await setupAprilTagTracking();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {

  background(0);
  cleanupExpiredLayers();
  updateAmbientSoundVolume();
  updateNightAmbientSoundVolume();
  updateNightState();

  push();

  applySceneTransform();

  drawSceneLayers();
  drawSparkleBursts();

  //image(video, 0, 0, 640, 480);

  if (interactionMode === "hands") {
    detectHands();

    //drawLandmarks();

    checkGesture();
  }

  if (interactionMode === "apriltag") {
    updatePlacardDetection();
  }

  pop();
}

function applySceneTransform() {
  const viewport = getSceneViewport();

  translate(viewport.x, viewport.y);
  scale(viewport.scale);
}

function getSceneViewport() {
  const scale = min(width / sceneSize.width, height / sceneSize.height);

  return {
    scale,
    x: (width - sceneSize.width * scale) / 2,
    y: (height - sceneSize.height * scale) / 2,
    width: sceneSize.width * scale,
    height: sceneSize.height * scale
  };
}

function screenToScene(screenX, screenY) {
  const viewport = getSceneViewport();

  return {
    x: (screenX - viewport.x) / viewport.scale,
    y: (screenY - viewport.y) / viewport.scale
  };
}

function isInsideScene(screenX, screenY) {
  const viewport = getSceneViewport();

  return (
    screenX >= viewport.x &&
    screenX <= viewport.x + viewport.width &&
    screenY >= viewport.y &&
    screenY <= viewport.y + viewport.height
  );
}

function drawBackground() {
  for (const layer of backgroundLayers) {
    if (layer.foreground) {
      continue;
    }

    if (layer.moving) {
      drawMovingLayer(layer);
    } else {
      drawBackgroundLayer(layer);
    }
  }
}

function drawSceneLayers() {
  for (const layer of backgroundLayers) {
    renderLayersBeforeBackgroundLayer(layer.index);

    const layerVisibility = getNightLayerVisibility(layer);

    if (layerVisibility > 0.01) {
      push();
      tint(255, 255 * layerVisibility);

      if (layer.moving) {
        drawMovingLayer(layer);
      } else {
        drawBackgroundLayer(layer);
      }

      noTint();
      pop();
    }

    if (!isHiddenAtNight(layer)) {
      drawNightLayerOverlay(layer);
    }

    if (layer.index === 3) {
      drawNightSkyEffects();
    }

    if (layer.index === leafWindSettings.afterLayer) {
      drawDayLeafWind();
    }

    if (layer.index === rustlePatchSettings.afterLayer) {
      drawDayRustlePatch();
    }
  }

  drawStaticSceneProps();
  renderFrontLayers();
  drawNightForegroundShadow();
}

function drawNightSkyEffects() {
  drawNightStars();
  drawNightMoon();
}

function getNightLayerVisibility(layer) {
  return isHiddenAtNight(layer) ? 1 - nightAmount : 1;
}

function isHiddenAtNight(layer) {
  return layer.index === 2 || layer.index === 3;
}

function drawStaticSceneProps() {
  for (const prop of staticSceneProps) {
    imageMode(CENTER);
    applyPropNightTint(prop);
    image(prop.img, prop.x, prop.y, prop.width, prop.height);
    noTint();
  }

  drawNightSceneAnimals();
  drawCategoryTallies();
}

function drawNightSceneAnimals() {
  if (!nightSceneAnimalsAreVisible()) return;

  for (const animal of nightSceneAnimals) {
    const drawWidth = animal.width || animal.img.width;
    const drawHeight = animal.height || animal.img.height;
    const alpha = 255 * nightAmount;

    imageMode(CENTER);

    if (animal.glow) {
      drawNightSceneAnimalGlow(animal, drawWidth, drawHeight);
    }

    tint(255, alpha);
    image(animal.img, animal.x, animal.y, drawWidth, drawHeight);
    noTint();
  }
}

function drawNightSceneAnimalGlow(animal, width, height) {
  const glow = animal.glow;
  const glowAlpha = glow.alpha * nightAmount;
  const glowWidth = width * glow.scale;
  const glowHeight = height * glow.scale;

  push();
  noStroke();
  drawingContext.shadowColor = `rgba(${glow.color[0]}, ${glow.color[1]}, ${glow.color[2]}, ${glowAlpha / 255})`;
  drawingContext.shadowBlur = max(width, height) * 0.22 * (glow.blurScale || 1);
  fill(glow.color[0], glow.color[1], glow.color[2], glowAlpha * 0.32);
  ellipse(animal.x, animal.y, glowWidth, glowHeight);
  drawingContext.shadowColor = "rgba(0, 0, 0, 0)";
  drawingContext.shadowBlur = 0;
  pop();
}

function applyPropNightTint(prop) {
  if (!prop.nightTint || nightAmount < 0.01) {
    noTint();
    return;
  }

  tint(
    lerp(255, prop.nightTint[0], nightAmount),
    lerp(255, prop.nightTint[1], nightAmount),
    lerp(255, prop.nightTint[2], nightAmount),
    255
  );
}

function updateNightState() {
  const activeAnimalCount = getActiveAnimalLayerCount();

  if (activeAnimalCount > 0) {
    sceneEmptySince = 0;
  } else if (sceneEmptySince === 0 && lastSceneActivity > 0) {
    sceneEmptySince = millis();
  }

  const sceneIsInactive = lastSceneActivity === 0 ||
    (sceneEmptySince > 0 && millis() - sceneEmptySince > nightSceneSettings.inactivityDelay);
  const targetNightAmount = sceneIsInactive ? 1 : 0;

  if (sceneIsInactive) {
    nightSceneCountersActive = true;
  }

  nightAmount = lerp(nightAmount, targetNightAmount, nightSceneSettings.fadeSpeed);
}

function getActiveAnimalLayerCount() {
  return activeLayers.filter((layer) => !layer.parentAsset).length;
}

function markSceneActivity() {
  lastSceneActivity = millis();
  nightSceneCountersActive = false;
}

function drawNightLayerOverlay(layer) {
  if (nightAmount < 0.01) return;

  const alpha = (layer.index <= 3
    ? nightSceneSettings.skyAlpha
    : nightSceneSettings.backgroundAlpha) * nightAmount;

  push();
  noStroke();
  blendMode(MULTIPLY);

  if (layer.index <= 3 || !layer.nightOverlay) {
    fill(...nightSceneSettings.skyColor, alpha);
    rect(0, 0, sceneSize.width, sceneSize.height);
  } else {
    tint(255, alpha);
    image(layer.nightOverlay, 0, 0, sceneSize.width, sceneSize.height);
    noTint();
  }

  blendMode(BLEND);
  pop();
}

function drawNightForegroundShadow() {
  return;
}

function drawNightStars() {
  const skyEffectAmount = getNightSkyEffectAmount();

  if (skyEffectAmount < 0.01) return;

  push();
  noStroke();

  for (const star of starSettings.points) {
    const twinkle = (sin(millis() * starSettings.twinkleSpeed + star.phase) + 1) * 0.5;
    const alpha = (starSettings.alpha + starSettings.twinkleAlpha * twinkle) * skyEffectAmount;
    const glowScale = 2.6 + twinkle * 1.25;

    fill(...starSettings.color, alpha);
    ellipse(star.x, star.y, star.size);

    fill(...starSettings.color, alpha * 0.224);
    ellipse(star.x, star.y, star.size * glowScale);
  }

  pop();
}

function drawNightMoon() {
  const skyEffectAmount = getNightSkyEffectAmount();

  if (skyEffectAmount < 0.01) return;

  const moonAlpha = 255 * skyEffectAmount;
  const glowAlpha = moonSettings.glowAlpha * skyEffectAmount;

  push();
  noStroke();
  drawingContext.shadowColor = `rgba(${moonSettings.glowColor[0]}, ${moonSettings.glowColor[1]}, ${moonSettings.glowColor[2]}, ${glowAlpha / 255})`;
  drawingContext.shadowBlur = moonSettings.size * 0.196;
  fill(...moonSettings.glowColor, glowAlpha);
  ellipse(moonSettings.x, moonSettings.y, moonSettings.size * moonSettings.glowSize);

  drawingContext.shadowBlur = 0;
  fill(...moonSettings.color, moonAlpha);
  ellipse(moonSettings.x, moonSettings.y, moonSettings.size);

  drawingContext.shadowColor = "rgba(0, 0, 0, 0)";
  pop();
}

function getNightSkyEffectAmount() {
  return constrain(map(nightAmount, 0.5, 1, 0, 1), 0, 1);
}

function drawDayLeafWind() {
  const daylightAmount = 1 - nightAmount;

  if (daylightAmount < 0.02 || lastSceneActivity === 0) return;

  const elapsed = (millis() - lastSceneActivity) % leafWindSettings.interval;

  if (elapsed > leafWindSettings.duration) return;

  const progress = elapsed / leafWindSettings.duration;
  const fadeIn = constrain(progress / 0.16, 0, 1);
  const fadeOut = constrain((1 - progress) / 0.22, 0, 1);
  const alphaScale = daylightAmount * min(fadeIn, fadeOut);

  push();
  noStroke();

  for (const leaf of leafWindSettings.leaves) {
    const x = leafWindSettings.startX - leaf.offset * leafWindSettings.spreadX - progress * leafWindSettings.travel;
    const y = leaf.y + sin(progress * TWO_PI * 0.65 + leaf.phase) * leaf.drift;
    const rotation = -0.7 + sin(progress * TWO_PI * 0.85 + leaf.phase) * 0.6;
    const color = leafWindSettings.colors[leaf.color];

    if (x < -100 || x > sceneSize.width + 220) continue;

    drawWindLeaf(x, y, leaf.size, rotation, color, 165 * alphaScale);
  }

  pop();
}

function drawWindLeaf(x, y, size, rotation, color, alpha) {
  push();
  translate(x, y);
  rotate(rotation);
  fill(color[0], color[1], color[2], alpha);
  ellipse(0, 0, size * 1.5, size * 0.72);
  stroke(58, 67, 38, alpha * 0.42);
  strokeWeight(max(1, size * 0.045));
  line(-size * 0.55, 0, size * 0.55, 0);
  noStroke();
  pop();
}

function drawDayRustlePatch() {
  const daylightAmount = 1 - nightAmount;

  if (daylightAmount < 0.02) return;

  const rustleStart = lastSceneActivity || 0;
  const elapsed = (millis() - rustleStart) % rustlePatchSettings.interval;

  if (elapsed > rustlePatchSettings.duration) return;

  const progress = elapsed / rustlePatchSettings.duration;
  const fadeIn = constrain(progress / 0.12, 0, 1);
  const fadeOut = constrain((1 - progress) / 0.18, 0, 1);
  const alphaScale = daylightAmount * min(fadeIn, fadeOut);
  const sway = sin(progress * TWO_PI * 6.2) * 0.5 + sin(progress * TWO_PI * 3.4) * 0.5;

  push();
  translate(rustlePatchSettings.x, rustlePatchSettings.y);

  for (let i = 0; i < rustlePatchSettings.blades.length; i++) {
    const blade = rustlePatchSettings.blades[i];

    for (let copy = 0; copy < rustlePatchSettings.densityMultiplier; copy++) {
      const copyPhase = blade.phase + copy * 1.37 + i * 0.23;
      const spreadRatio = copy / max(1, rustlePatchSettings.densityMultiplier - 1) - 0.5;
      const xJitter = spreadRatio * rustlePatchSettings.width * 0.18 + sin(copyPhase * 2.1) * 10;
      const yJitter = cos(copyPhase * 1.7) * 16;
      const length = blade.length * rustlePatchSettings.sizeScale * (0.82 + (copy % 3) * 0.09);
      const size = blade.size * rustlePatchSettings.sizeScale * (0.7 + (copy % 4) * 0.08);
      const color = rustlePatchSettings.colors[(blade.color + copy) % rustlePatchSettings.colors.length];
      const localSway = sway + sin(progress * TWO_PI * 4.5 + copyPhase) * 0.35;
      const bend = localSway * (11 + copy * 1.7);
      const alpha = 150 * alphaScale;

      drawRustleBlade(blade.x * 1.5 + xJitter, blade.y + yJitter, length, size, bend, color, alpha);
    }
  }

  pop();
}

function drawRustleBlade(x, y, length, size, bend, color, alpha) {
  push();
  translate(x, y);
  noFill();

  const segments = 7;

  for (let i = 0; i < segments; i++) {
    const t1 = i / segments;
    const t2 = (i + 1) / segments;
    const p1 = getRustleBladePoint(t1, length, bend);
    const p2 = getRustleBladePoint(t2, length, bend);
    const taper = 1 - t1;

    stroke(color[0], color[1], color[2], alpha * (0.55 + taper * 0.45));
    strokeWeight(max(0.45, size * (0.22 * taper + 0.035)));
    line(p1.x, p1.y, p2.x, p2.y);
  }

  pop();
}

function getRustleBladePoint(t, length, bend) {
  return {
    x: bend * sin(t * HALF_PI) * (0.36 + t * 0.42),
    y: -length * t
  };
}

function drawCategoryTallies() {
  for (const tally of categoryTallySettings) {
    drawTallyNumber(tally.x, tally.y, getActiveCategoryCount(tally.category));
  }
}

function getActiveCategoryCount(category) {
  const nightSceneCount = getNightSceneCategoryCount(category);

  if (category === "rare") {
    return activeLayers.filter((layer) => isRareLayer(layer) && !layer.parentAsset).length + nightSceneCount;
  }

  return activeLayers.filter((layer) => layer.category === category && !layer.parentAsset).length + nightSceneCount;
}

function getNightSceneCategoryCount(category) {
  if (!nightSceneCountersActive || !nightSceneAnimalsAreVisible()) return 0;

  return nightSceneAnimals.filter((animal) => animal.category === category).length;
}

function nightSceneAnimalsAreVisible() {
  return nightAmount >= 0.01;
}

function drawTallyNumber(x, y, count) {
  push();
  textAlign(CENTER, CENTER);
  textFont("monospace");
  textStyle(BOLD);
  textSize(54);
  stroke(255, 246, 218, 210);
  strokeWeight(8);
  fill(35, 29, 24, 240);
  text(count, x, y);
  pop();
}

function drawForeground() {
  for (const layer of backgroundLayers) {
    if (layer.foreground) {
      drawBackgroundLayer(layer);
    }
  }
}

function drawMovingLayer(layer) {
  const offset = (millis() / 1000 * cloudSettings.speed) % sceneSize.width;

  drawBackgroundLayer(layer, offset, 0);
  drawBackgroundLayer(layer, offset - sceneSize.width, 0);
}

function drawBackgroundLayer(layer, offsetX = 0, offsetY = 0) {
  if (layer.index >= 4) {
    drawingContext.shadowColor = "rgba(28, 22, 16, 0.34)";
    drawingContext.shadowBlur = 26;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 12;
  }

  image(layer.renderImg || layer.img, offsetX, offsetY, sceneSize.width, sceneSize.height);

  drawingContext.shadowColor = "rgba(0, 0, 0, 0)";
  drawingContext.shadowBlur = 0;
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
}

function applyPaperTreatmentToLayers() {
  for (const layer of backgroundLayers) {
    layer.renderImg = createPaperLayerImage(layer);
    layer.nightOverlay = createNightLayerOverlay(layer);
  }
}

function createNightLayerOverlay(layer) {
  if (layer.index <= 3) return null;

  const overlay = createGraphics(paperTextureSettings.width, paperTextureSettings.height);

  overlay.canvas.style.display = "none";
  overlay.clear();
  overlay.noStroke();
  overlay.background(...nightSceneSettings.backgroundColor, 255);
  overlay.drawingContext.save();
  overlay.drawingContext.globalCompositeOperation = "destination-in";
  overlay.image(layer.renderImg || layer.img, 0, 0, overlay.width, overlay.height);
  overlay.drawingContext.restore();

  return overlay;
}

function createPaperLayerImage(layer) {
  const treated = createGraphics(paperTextureSettings.width, paperTextureSettings.height);
  const texture = createPaperTexture(layer.index);

  treated.canvas.style.display = "none";
  treated.clear();
  treated.image(layer.img, 0, 0, treated.width, treated.height);

  treated.drawingContext.save();
  treated.drawingContext.globalCompositeOperation = "multiply";
  treated.tint(255, paperTextureSettings.textureAlpha);
  treated.image(texture, 0, 0, treated.width, treated.height);
  treated.noTint();
  treated.drawingContext.globalCompositeOperation = "destination-in";
  treated.image(layer.img, 0, 0, treated.width, treated.height);
  treated.drawingContext.restore();

  texture.remove();

  return treated;
}

function createPaperTexture(layerIndex = 1) {
  const texture = createGraphics(paperTextureSettings.width, paperTextureSettings.height);

  texture.canvas.style.display = "none";
  randomSeed(layerIndex * 9973);
  texture.clear();
  texture.noStroke();

  const warmth = random(-8, 12);

  texture.background(244 + warmth, 236 + warmth, 214 + warmth, 16);

  for (let i = 0; i < 36000; i++) {
    const shade = random(165, 255);
    const alpha = random(10, paperTextureSettings.alpha);

    texture.fill(shade, shade - random(0, 10), shade - random(8, 28), alpha);
    texture.circle(
      random(texture.width),
      random(texture.height),
      random(0.8, 3.2)
    );
  }

  texture.strokeWeight(1.1);

  for (let i = 0; i < 950; i++) {
    const y = random(texture.height);
    const x = random(texture.width);
    const length = random(34, 180);
    const shade = random(145, 235);

    texture.stroke(shade, shade - random(0, 12), shade - random(10, 34), random(10, paperTextureSettings.fiberAlpha));
    texture.line(x, y, x + length, y + random(-4.5, 4.5));
  }

  randomSeed();

  return texture;
}

function detectHands() {

  if (!handLandmarker) return;

  const now = performance.now();

  const results = handLandmarker.detectForVideo(
    video.elt,
    now
  );

  hands = results.landmarks || [];
}

function drawLandmarks() {

  fill(0, 255, 0);

  noStroke();

  for (let hand of hands) {

    for (let point of hand) {

      let x = point.x * 640;
      let y = point.y * 480;

      circle(x, y, 10);
    }
  }
}

function checkGesture() {

  if (hands.length === 0) return;

  if (millis() - lastTrigger < 2000) return;

  const hand = hands[0];

  const thumb = hand[4];
  const index = hand[8];
  const middle = hand[12];
  const ring = hand[16];
  const pinky = hand[20];

  // distances

  let thumbIndex = dist(
    thumb.x,
    thumb.y,
    index.x,
    index.y
  );

  let indexMiddle = dist(
    index.x,
    index.y,
    middle.x,
    middle.y
  );

  let thumbPinky = dist(
    thumb.x,
    thumb.y,
    pinky.x,
    pinky.y
  );
console.log({
  thumbIndex,
  indexMiddle,
  thumbPinky
});

// =====================
// INSECTS
// open hand
// =====================

if (thumbPinky > 0.28) {

  spawnFromCategory(insectAssets, "insects");

  console.log("INSECT");

  lastTrigger = millis();

  return;
}

// =====================
// MAMMALS
// peace sign
// =====================

if (indexMiddle > 0.07) {

  spawnFromCategory(mammalAssets, "mammals");

  console.log("MAMMAL");

  lastTrigger = millis();

  return;
}

// =====================
// BIRDS
// loose pinch
// =====================

if (
  thumbIndex > 0.06 &&
  thumbIndex < 0.14
) {

  spawnFromCategory(birdAssets, "birds");

  console.log("BIRD");

  lastTrigger = millis();

  return;
}

// =====================
// REPTILES
// tight pinch
// =====================

if (thumbIndex < 0.04) {

  spawnFromCategory(reptileAssets, "reptiles");

  console.log("REPTILE");

  lastTrigger = millis();

  return;
}
}

function updatePlacardDetection() {
  if (!aprilTagReady) {
    placardStatus = "AprilTag: detector not ready";
    return;
  }

  if (!video?.elt?.videoWidth) {
    placardStatus = "AprilTag: waiting for camera";
    return;
  }

  if (placardDetectionBusy) return;

  const now = millis();

  if (now - lastPlacardScan < placardSettings.scanInterval) return;

  lastPlacardScan = now;
  placardDetectionBusy = true;

  const sourceWidth = video.elt.videoWidth;
  const sourceHeight = video.elt.videoHeight;
  const scanWidth = placardSettings.scanWidth;
  const scanHeight = Math.round((sourceHeight / sourceWidth) * scanWidth);

  placardScanCanvas.width = scanWidth;
  placardScanCanvas.height = scanHeight;
  placardScanContext.drawImage(video.elt, 0, 0, scanWidth, scanHeight);

  const imageData = placardScanContext.getImageData(0, 0, scanWidth, scanHeight);
  const pixels = imageData.data;
  const grayscalePixels = new Uint8Array(scanWidth * scanHeight);

  for (let i = 0, j = 0; i < pixels.length; i += 4, j++) {
    grayscalePixels[j] = Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
  }

  aprilTagDetector.detect(grayscalePixels, scanWidth, scanHeight)
    .then((detections) => {
      placardDetections = Array.isArray(detections) ? detections : [];
      placardStatus = placardDetections.length > 0
        ? `AprilTag: saw ${placardDetections.map((detection) => detection.id).join(", ")}`
        : "AprilTag: scanning";
      checkPlacards();
    })
    .catch((error) => {
      console.warn("AprilTag detection failed", error);
      placardStatus = "AprilTag: detection error";
    })
    .finally(() => {
      placardDetectionBusy = false;
    });
}

function checkPlacards() {
  const placard = getStrongestKnownPlacard();
  const now = millis();

  if (!placard) {
    if (now - lastPlacardSeen > placardSettings.holdResetDelay) {
      heldPlacardId = null;
      lastDetectedPlacardLabel = "none";
    }

    return;
  }

  const tagId = Number(placard.id);
  const definition = placardDefinitions[tagId];

  lastPlacardSeen = now;
  lastDetectedPlacardLabel = `${definition?.label || "unknown"} (${tagId})`;

  if (!definition) return;
  if (tagId === heldPlacardId) return;
  if (now - lastTrigger < placardSettings.triggerCooldown) {
    placardStatus = `AprilTag: ${definition.label} cooldown`;
    return;
  }

  const didSpawn = spawnFromCategory(definition.getAssets(), definition.label);

  if (!didSpawn) {
    lastTrigger = now;
    placardStatus = `AprilTag: ${definition.label} no available asset`;
    return;
  }

  heldPlacardId = tagId;
  lastTrigger = now;
  placardStatus = `AprilTag: triggered ${definition.label}`;

  console.log(`PLACARD: ${definition.label}`);
}

function getStrongestKnownPlacard() {
  let strongest = null;
  let strongestArea = 0;

  for (const detection of placardDetections) {
    if (!placardDefinitions[detection.id] || !detection.corners) continue;

    const area = getPlacardArea(detection.corners);

    if (area > strongestArea) {
      strongest = detection;
      strongestArea = area;
    }
  }

  return strongest;
}

function getPlacardArea(corners) {
  let area = 0;

  for (let i = 0; i < corners.length; i++) {
    const current = corners[i];
    const next = corners[(i + 1) % corners.length];

    area += current.x * next.y - next.x * current.y;
  }

  return Math.abs(area / 2);
}

function getMysteryCategory() {
  return categoryAssetLists.flatMap((category) => (
    category.assets()
      .filter((asset) => asset.rarity === "rare")
      .map((asset) => ({
        ...asset,
        categoryLabel: category.label
      }))
  ));
}


function spawnFromCategory(categoryArray, categoryLabel = "category") {
  startAmbientSound();
  markSceneActivity();

  if (!categoryArray || categoryArray.length === 0) {
    console.log(`No ${categoryLabel} animals are loaded yet.`);
    placardStatus = `Trigger: ${categoryLabel} not loaded`;
    return false;
  }

  let asset = chooseAvailableAsset(categoryArray);

  if (!asset) {
    const activeCount = categoryArray.filter((categoryAsset) => !isAssetAvailable(categoryAsset)).length;
    console.log(`All ${categoryLabel} animals are already active (${activeCount}/${categoryArray.length}). Wait for one to fade out.`);
    placardStatus = `Trigger: all ${categoryLabel} active; wait for fade`;
    return false;
  }

  const assetCategoryLabel = asset.categoryLabel || categoryLabel;

  const spawnedLayer = spawnAsset(asset, null, null, assetCategoryLabel);
  console.log(`Spawned ${assetCategoryLabel}: ${asset.name || asset.path}`);

  if (asset.companion) {
    spawnAsset(asset.companion, asset, spawnedLayer, assetCategoryLabel);
  }

  return true;
}

function spawnAsset(asset, parentAsset = null, parentLayer = null, categoryLabel = null) {
  startAssetVideo(asset);

  const renderBehindLayer = asset.renderBehindLayer ?? parentAsset?.renderBehindLayer;
  const anchored = asset.anchorToParent && parentLayer;
  const layerSize = anchored
    ? (asset.useOwnSizeWhenAnchored ? pickLayerValue(asset.size) : parentLayer.size * (asset.sizeMultiplier || 1))
    : pickLayerValue(asset.size);
  const layer = {
    asset,
    parentAsset,

    sequenceAsset: parentAsset || asset,
    sequenceKey: getAssetSequenceKey(parentAsset || asset),
    assetKey: getAssetSequenceKey(asset),

    x: anchored
      ? constrain(parentLayer.x + (asset.offsetX || 0), 0, sceneSize.width)
      : pickLayerValue(asset.x, sceneSize.width),

    y: anchored
      ? constrain(parentLayer.y + (asset.offsetY || 0), 0, sceneSize.height)
      : pickLayerValue(asset.y, sceneSize.height),

    size: layerSize,

    rotation: anchored && asset.inheritRotation !== true
      ? 0
      : pickLayerValue(asset.rotation),

    renderBehindLayer,
    category: categoryLabel,

    birth: millis()
  };

  activeLayers.push(layer);

  return layer;
}

function getAssetSpawnLifespan(asset, parentAsset = null) {
  const assetLifespan = asset.lifespan || getVideoDuration(asset) || 9000;
  const isRare = asset.rarity === "rare" || parentAsset?.rarity === "rare";

  if (isRare) {
    return min(assetLifespan, rareAnimalSettings.lifespan);
  }

  return assetLifespan;
}

function getVideoDuration(asset) {
  const duration = asset.duration || asset.video?.elt?.duration;

  if (Number.isFinite(duration) && duration > 0) {
    return duration * (duration > 1000 ? 1 : 1000);
  }

  return null;
}

function chooseAsset(categoryArray) {
  const totalWeight = categoryArray.reduce((sum, asset) => sum + getAssetWeight(asset), 0);
  let roll = random(totalWeight);

  for (const asset of categoryArray) {
    roll -= getAssetWeight(asset);

    if (roll <= 0) {
      return asset;
    }
  }

  return categoryArray[categoryArray.length - 1];
}

function chooseAvailableAsset(categoryArray) {
  const availableAssets = categoryArray.filter((asset) => isAssetAvailable(asset));

  if (availableAssets.length === 0) {
    return null;
  }

  return chooseAsset(availableAssets);
}

function isAssetAvailable(asset) {
  if (isAssetSequenceActive(asset)) return false;
  if (asset.companion && isAssetActive(asset.companion)) return false;

  return true;
}

function isAssetSequenceActive(asset) {
  const sequenceKey = getAssetSequenceKey(asset);

  return activeLayers.some((layer) => layer.sequenceKey === sequenceKey);
}

function isAssetActive(asset) {
  const assetKey = getAssetSequenceKey(asset);

  return activeLayers.some((layer) => layer.assetKey === assetKey);
}

function getAssetSequenceKey(asset) {
  return asset.sequenceKey || asset.path || asset.name;
}

function getAssetWeight(asset) {
  if (asset.weight) return asset.weight;
  return rarityWeights[asset.rarity] || rarityWeights.normal;
}

function startAssetVideo(asset) {
  if (asset.type !== "video" || !asset.video) return;

  asset.video.stop();
  asset.video.time(0);
  asset.video.play();
}

function startAmbientSound() {
  if (!ambientSound) {
    ambientSound = new Audio(ambientSoundSettings.path);
    ambientSound.loop = true;
    ambientSound.volume = ambientSoundSettings.minVolume;
    ambientSound.preload = "auto";
    ambientCurrentVolume = ambientSoundSettings.minVolume;
  }

  if (!nightAmbientSound) {
    nightAmbientSound = new Audio(nightAmbientSoundSettings.path);
    nightAmbientSound.loop = true;
    nightAmbientSound.volume = 0;
    nightAmbientSound.preload = "auto";
    nightAmbientCurrentVolume = 0;
  }

  if (typeof userStartAudio === "function") {
    userStartAudio();
  }

  if (!ambientSoundStarted) {
    ambientSound.play()
      .then(() => {
        ambientSoundStarted = true;
      })
      .catch((error) => {
        console.warn("Ambient audio could not start yet", error);
      });
  }

  if (!nightAmbientStarted) {
    nightAmbientSound.play()
      .then(() => {
        nightAmbientStarted = true;
      })
      .catch((error) => {
        console.warn("Night ambience could not start yet", error);
      });
  }
}

function updateNightAmbientSoundVolume() {
  if (!nightAmbientSound) return;

  const targetVolume = nightAmbientSoundSettings.maxVolume * nightAmount;

  nightAmbientCurrentVolume = lerp(
    nightAmbientCurrentVolume,
    targetVolume,
    nightAmbientSoundSettings.smoothing
  );
  nightAmbientSound.volume = constrain(nightAmbientCurrentVolume, 0, nightAmbientSoundSettings.maxVolume);
}

function updateAmbientSoundVolume() {
  if (!ambientSound) return;

  const activeAnimalCount = activeLayers.filter((layer) => !layer.parentAsset).length;
  const fullness = constrain(activeAnimalCount / ambientSoundSettings.fullSceneAnimalCount, 0, 1);
  const daylightAmount = 1 - nightAmount;

  ambientTargetVolume = daylightAmount * lerp(
    ambientSoundSettings.minVolume,
    ambientSoundSettings.maxVolume,
    fullness
  );
  ambientCurrentVolume = lerp(
    ambientCurrentVolume,
    ambientTargetVolume,
    ambientSoundSettings.smoothing
  );
  ambientSound.volume = constrain(ambientCurrentVolume, 0, 1);
}

function setupInteractionKeyboard() {
  if (window.__interactionKeyboardReady) return;

  window.__interactionKeyboardReady = true;
  window.addEventListener("pointerdown", startAmbientSound);
  window.addEventListener("touchstart", startAmbientSound);
  window.addEventListener("keydown", (event) => {
    if (handleKeyboardShortcut(event.key, event.repeat)) {
      event.preventDefault();
    }
  });
}

function handleKeyboardShortcut(shortcutKey, isRepeat = false) {
  startAmbientSound();
  return handleCategoryShortcut(shortcutKey, isRepeat);
}

function keyPressed() {
  if (window.__interactionKeyboardReady) return;
  handleKeyboardShortcut(key);
}

function handleCategoryShortcut(shortcutKey, isRepeat = false) {
  const normalizedKey = shortcutKey.toLowerCase();

  if (!["b", "m", "i", "r", "?", "/"].includes(normalizedKey)) return false;
  if (isRepeat) return true;

  const now = millis();

  if (now - lastCategoryShortcut < categoryShortcutCooldown) {
    return true;
  }

  lastCategoryShortcut = now;

  if (normalizedKey === "b") {
    spawnFromCategory(birdAssets, "birds");
    return true;
  }

  if (normalizedKey === "m") {
    spawnFromCategory(mammalAssets, "mammals");
    return true;
  }

  if (normalizedKey === "i") {
    spawnFromCategory(insectAssets, "insects");
    return true;
  }

  if (normalizedKey === "r") {
    spawnFromCategory(reptileAssets, "reptiles");
    return true;
  }

  spawnFromCategory(getMysteryCategory(), "mystery");
  return true;
}

function mousePressed() {
  startAmbientSound();
}

function pickLayerValue(value, scale = 1) {
  if (Array.isArray(value)) {
    return random(value[0], value[1]) * scale;
  }

  if (scale !== 1 && Math.abs(value) > 1) {
    return value;
  }

  return value * scale;
}

function getLayerImage(layer, age) {
  if (layer.asset.type === "video") {
    return layer.asset.video;
  }

  const frames = layer.asset.frames;

  if (frames.length === 1) {
    return frames[0];
  }

  const frameDuration = layer.asset.frameDuration || 120;
  const frameIndex = floor(age / frameDuration) % frames.length;

  return frames[frameIndex];
}

function getLayerAlpha(layer, age) {
  const lifespan = getLayerLifespan(layer);
  const fadeIn = layer.asset.fadeIn;
  const fadeOut = getLayerFadeOut(layer, lifespan);

  if (age < fadeIn) {
    return map(age, 0, fadeIn, 0, 255, true);
  }

  if (age > lifespan - fadeOut) {
    return map(age, lifespan - fadeOut, lifespan, 255, 0, true);
  }

  return 255;
}

function getLayerFadeOut(layer, lifespan) {
  if (isRareLayer(layer)) {
    return 0;
  }

  if (layer.asset.fadeOut) {
    return layer.asset.fadeOut;
  }

  if (layer.asset.type === "video") {
    return constrain(lifespan * 0.18, 900, 2200);
  }

  return 2500;
}

function isRareLayer(layer) {
  return layer.asset.rarity === "rare" || layer.parentAsset?.rarity === "rare";
}

function spawnSparkleBurst(layer) {
  const progress = 1;
  const motion = getLayerMotion(layer.asset, progress);
  const motionScale = getLayerScale(layer.asset, progress);
  const centerX = layer.x + motion.x;
  const centerY = layer.y + motion.y;
  const particles = [];

  for (let i = 0; i < rareAnimalSettings.sparkleCount; i++) {
    particles.push({
      angle: random(TWO_PI),
      distance: random(rareAnimalSettings.sparkleRadius[0], rareAnimalSettings.sparkleRadius[1]) * motionScale,
      size: random(rareAnimalSettings.sparkleSize[0], rareAnimalSettings.sparkleSize[1]),
      delay: random(0, 520),
      twinkleSpeed: random(2.5, 5.5),
      color: random(rareAnimalSettings.sparkleColors)
    });
  }

  sparkleBursts.push({
    x: centerX,
    y: centerY,
    birth: millis(),
    duration: rareAnimalSettings.sparkleDuration,
    particles
  });
}

function drawSparkleBursts() {
  for (let i = sparkleBursts.length - 1; i >= 0; i--) {
    const burst = sparkleBursts[i];
    const age = millis() - burst.birth;

    if (age > burst.duration) {
      sparkleBursts.splice(i, 1);
      continue;
    }

    drawSparkleBurst(burst, age);
  }
}

function drawSparkleBurst(burst, age) {
  push();
  blendMode(SCREEN);
  noStroke();

  for (const particle of burst.particles) {
    const particleAge = age - particle.delay;

    if (particleAge < 0) continue;

    const progress = constrain(particleAge / (burst.duration - particle.delay), 0, 1);
    const eased = easeOutCubic(progress);
    const twinkle = 0.6 + sin(progress * TWO_PI * particle.twinkleSpeed) * 0.4;
    const alpha = 210 * (1 - easeInOutSine(progress)) * twinkle;
    const distance = particle.distance * eased;
    const x = burst.x + cos(particle.angle) * distance;
    const y = burst.y + sin(particle.angle) * distance - progress * 28;
    const size = particle.size * (1 - progress * 0.55);

    fill(...particle.color, alpha);
    drawSparkle(x, y, size);
  }

  pop();
}

function drawSparkle(x, y, size) {
  push();
  translate(x, y);
  rotate(PI / 4);
  rectMode(CENTER);
  rect(0, 0, size * 0.28, size);
  rect(0, 0, size, size * 0.28);
  pop();
}

function renderLayersBeforeBackgroundLayer(backgroundLayerIndex) {
  renderLayers((layer) => layer.renderBehindLayer === backgroundLayerIndex);
}

function renderFrontLayers() {
  renderLayers((layer) => !layer.renderBehindLayer);
}

function cleanupExpiredLayers() {
  for (let i = activeLayers.length - 1; i >= 0; i--) {
    const layer = activeLayers[i];
    const age = millis() - layer.birth;
    const lifespan = getLayerLifespan(layer);

    if (age > lifespan) {
      expireLayerAt(i);
    }
  }
}

function expireLayerAt(index) {
  const layer = activeLayers[index];

  if (!layer) return;

  if (layer.asset.type === "video" && layer.asset.video) {
    layer.asset.video.stop();
  }

  if (isRareLayer(layer) && !layer.parentAsset) {
    spawnSparkleBurst(layer);
  }

  activeLayers.splice(index, 1);
}

function renderLayers(shouldRenderLayer) {

  for (let i = activeLayers.length - 1; i >= 0; i--) {

    const layer = activeLayers[i];

    let age = millis() - layer.birth;

    const lifespan = getLayerLifespan(layer);
    let alpha = getLayerAlpha(layer, age);

    if (age > lifespan) {
      expireLayerAt(i);
      continue;
    }

    if (!shouldRenderLayer(layer)) {
      continue;
    }

    push();

    tint(255, alpha);

    if (layer.asset.type === "video") {
      drawVideoLayer(layer, alpha);
      pop();
      noTint();
      continue;
    }

    const progress = getLayerProgress(layer, age);
    const motion = getLayerMotion(layer.asset, progress);
    const motionScale = getLayerScale(layer.asset, progress);

    translate(layer.x + motion.x, layer.y + motion.y);

    rotate(layer.rotation);

    imageMode(CENTER);
    drawLayerGlow(layer, age, alpha, motionScale);
    const drawSize = getLayerDrawSize(layer, motionScale);

    image(
      getLayerImage(layer, age),
      0,
      0,
      drawSize.width,
      drawSize.height
    );

    pop();

    noTint();

  }
}

function getLayerLifespan(layer) {
  return getAssetSpawnLifespan(layer.asset, layer.parentAsset);
}

function drawVideoLayer(layer, alpha) {
  const videoLayer = layer.asset.video;

  if (!videoLayer || videoLayer.elt.readyState < 2) return;

  const videoWidth = layer.asset.videoWidth || videoLayer.elt.videoWidth || 1;
  const videoHeight = layer.asset.videoHeight || videoLayer.elt.videoHeight || 1;
  const aspectRatio = videoWidth / videoHeight;
  const drawWidth = layer.size;
  const drawHeight = drawWidth / aspectRatio;

  push();
  translate(layer.x, layer.y);
  rotate(layer.rotation);
  imageMode(CENTER);
  tint(255, alpha);
  image(videoLayer, 0, 0, drawWidth, drawHeight);
  pop();
}

function drawLayerGlow(layer, age, alpha, motionScale) {
  if (layer.asset.type !== "image") return;
  if (layer.asset.noGlow) return;
  if (age > animalGlowSettings.fadeDuration) return;

  const pulseProgress = constrain(age / animalGlowSettings.pulseDuration, 0, 1);
  const pulse = 1 - easeOutCubic(pulseProgress);
  const fadeProgress = constrain(age / animalGlowSettings.fadeDuration, 0, 1);
  const fade = 1 - easeInOutSine(fadeProgress);
  const glowAlpha = min(
    210,
    (animalGlowSettings.baseAlpha + animalGlowSettings.pulseAlpha * pulse) * fade * (alpha / 255)
  );
  const glowSize = layer.size * motionScale * (animalGlowSettings.scale + pulse * 0.55);
  const accentSize = glowSize * 0.58;

  push();
  noStroke();
  blendMode(SCREEN);
  drawingContext.filter = `blur(${animalGlowSettings.blur}px)`;
  fill(...animalGlowSettings.color, glowAlpha);
  ellipse(0, 0, glowSize * 1.2, glowSize * 0.82);
  fill(...animalGlowSettings.accentColor, glowAlpha * 0.5);
  ellipse(0, 0, accentSize, accentSize * 0.7);
  drawingContext.filter = "none";
  blendMode(BLEND);

  fill(...animalGlowSettings.color, glowAlpha * 0.28);
  ellipse(0, 0, glowSize * 0.95, glowSize * 0.62);
  pop();
}

function getLayerDrawSize(layer, motionScale) {
  const width = layer.size * motionScale;

  if (!layer.asset.preserveAspectRatio) {
    return { width, height: width };
  }

  const img = layer.asset.frames?.[0];
  const imageWidth = img?.width || 1;
  const imageHeight = img?.height || 1;

  return {
    width,
    height: width * (imageHeight / imageWidth)
  };
}

function getLayerProgress(layer, age) {
  return constrain(age / getLayerLifespan(layer), 0, 1);
}

function getLayerMotion(asset, progress) {
  if (!asset.motion) {
    return { x: 0, y: 0 };
  }

  const amountX = (asset.motionAmountX ?? asset.motion.x ?? 0) * animalMotionSettings.amountMultiplier;
  const amountY = (asset.motionAmountY ?? asset.motion.y ?? 0) * animalMotionSettings.amountMultiplier;
  const speed = (asset.motionSpeed || 1) * animalMotionSettings.speedMultiplier;
  const motionType = typeof asset.motion === "string" ? asset.motion : "drift";

  if (motionType === "fly") {
    const easedProgress = easeInOutSine(progress);
    const wingBob = sin(progress * TWO_PI * speed * 3) * (abs(amountY) * 0.18 + 10);

    return {
      x: amountX * easedProgress,
      y: amountY * easedProgress + wingBob
    };
  }

  if (motionType === "bob") {
    return { x: 0, y: sin(progress * TWO_PI * speed) * amountY };
  }

  if (motionType === "sway") {
    return { x: sin(progress * TWO_PI * speed) * amountX, y: 0 };
  }

  if (motionType === "shake") {
    return {
      x: sin(progress * TWO_PI * speed * 2.3) * amountX,
      y: sin(progress * TWO_PI * speed * 3.1) * amountY
    };
  }

  if (motionType === "pulse") {
    return {
      x: sin(progress * TWO_PI * speed * 0.5) * amountX,
      y: sin(progress * TWO_PI * speed * 0.5) * amountY
    };
  }

  if (motionType === "fall from top to bottom") {
    return {
      x: sin(progress * TWO_PI * speed) * amountX,
      y: amountY * easeInOutSine(progress)
    };
  }

  if (motionType === "move from right to left" || motionType === "move from left to right") {
    return {
      x: amountX * easeInOutSine(progress),
      y: sin(progress * TWO_PI * speed) * amountY
    };
  }

  if (motionType === "flutter") {
    return {
      x: sin(progress * TWO_PI * speed * 2.1) * amountX,
      y: sin(progress * TWO_PI * speed * 3.4) * amountY
    };
  }

  if (motionType === "hop") {
    const hop = abs(sin(progress * TWO_PI * speed));

    return {
      x: sin(progress * TWO_PI * speed * 0.5) * amountX,
      y: -hop * amountY
    };
  }

  if (motionType === "crawl") {
    return {
      x: sin(progress * TWO_PI * speed * 0.5) * amountX,
      y: sin(progress * TWO_PI * speed * 2) * amountY
    };
  }

  if (motionType === "breathe") {
    return {
      x: 0,
      y: sin(progress * TWO_PI * speed) * amountY * 0.25
    };
  }

  if (motionType === "drift") {
    const easedProgress = easeInOutSine(progress);

    return {
      x: amountX * easedProgress,
      y: amountY * easedProgress
    };
  }

  return { x: 0, y: 0 };
}

function getLayerScale(asset, progress) {
  if (asset.motion === "pulse") {
    const speed = (asset.motionSpeed || 1) * animalMotionSettings.speedMultiplier;

    return 1 + sin(progress * TWO_PI * speed) * 0.045 * animalMotionSettings.amountMultiplier;
  }

  if (asset.motion !== "breathe") {
    return 1;
  }

  const speed = (asset.motionSpeed || 1) * animalMotionSettings.speedMultiplier;

  return 1 + sin(progress * TWO_PI * speed) * 0.025 * animalMotionSettings.amountMultiplier;
}

function easeInOutSine(progress) {
  return -(cos(PI * progress) - 1) / 2;
}

function easeOutCubic(progress) {
  return 1 - pow(1 - progress, 3);
}
