// ============================================================
// DON'T KICK KICKBOT — Punch-Out!! Style Rebuild
// ============================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const toggleSoundBtn = document.getElementById("toggleSound");

// ---- Constants ----

const W = 800;
const H = 500;

const MISS_TAUNTS = [
  "TRY AGAIN!",
  "TOO SLOW!",
  "YOU KICK LIKE A NOODLE.",
  "MISS ME?",
  "YOU'VE GOT WAFFLE FOOT",
  "NAH NAH BOO GOO!",
  "YUBBA HUB",
  "MY GRAMMA USED TO KICK FOR THE DOLPHINS!",
  "GIVE UP, YOUNG HAMSTER",
];

const SORE_LOSER_LINES = [
  "WINKY DOO!",
  "STOP THAT!",
  "THAT'S MY NUCKINS!",
  "NOT FAIR!",
  "RING A DING DING!",
  "SUPER HUPPA KICK!",
  "HACHY MACHY!",
  "CORN GRUBBER!",
  "RIGHT IN THE BISCUITS!",
];

const BOSSES = [
  { name: "KICKMASTER", hitsToAdvance: 5, speedBonus: 0.0, tint: "#ff3d6e" },
  { name: "SUPER KICK FACE", hitsToAdvance: 7, speedBonus: 0.1, tint: "#5effd8" },
  { name: "KICKY PANTZ", hitsToAdvance: 9, speedBonus: 0.2, tint: "#ffd84a" },
  { name: "DOOZY DIPPER", hitsToAdvance: 11, speedBonus: 0.3, tint: "#c6a7ff" },
  { name: "SHOE HEAD", hitsToAdvance: 13, speedBonus: 0.4, tint: "#ff8ad1" },
];

// Player ranks earned by defeating each boss (index 0 = beat boss 0, etc.)
const RANKS = [
  { title: "JR. KICKY WICK",              medal: "bronze" },
  { title: "SUBBOOTER",                   medal: "silver" },
  { title: "CAPT. O' KICK'N",              medal: "gold" },
  { title: "GRAND FOOTFRAPPER",           medal: "platinum" },
  { title: "ULTIMATE KICKLORD",           medal: "diamond" },
];

const CHARACTERS = [
  { key: "boots", name: "BOOTS", src: "assets/boots.png" },
  { key: "squash", name: "SQUASH", src: "assets/squash.png" },
  { key: "bonsoo", name: "BONSOO", src: "assets/bonsoo.png" },
  { key: "dropkickmary", name: "DROPKICK MARY", src: "assets/dropkickmary.png" },
];

// ---- Pixel Font ----

const FONT = {
  A: ["01110","10001","10001","11111","10001","10001","10001"],
  B: ["11110","10001","10001","11110","10001","10001","11110"],
  C: ["01110","10001","10000","10000","10000","10001","01110"],
  D: ["11110","10001","10001","10001","10001","10001","11110"],
  E: ["11111","10000","10000","11110","10000","10000","11111"],
  F: ["11111","10000","10000","11110","10000","10000","10000"],
  G: ["01110","10001","10000","10111","10001","10001","01110"],
  H: ["10001","10001","10001","11111","10001","10001","10001"],
  I: ["01110","00100","00100","00100","00100","00100","01110"],
  J: ["00001","00001","00001","00001","10001","10001","01110"],
  K: ["10001","10010","10100","11000","10100","10010","10001"],
  L: ["10000","10000","10000","10000","10000","10000","11111"],
  M: ["10001","11011","10101","10101","10001","10001","10001"],
  N: ["10001","11001","10101","10011","10001","10001","10001"],
  O: ["01110","10001","10001","10001","10001","10001","01110"],
  P: ["11110","10001","10001","11110","10000","10000","10000"],
  Q: ["01110","10001","10001","10001","10101","10010","01101"],
  R: ["11110","10001","10001","11110","10100","10010","10001"],
  S: ["01111","10000","10000","01110","00001","00001","11110"],
  T: ["11111","00100","00100","00100","00100","00100","00100"],
  U: ["10001","10001","10001","10001","10001","10001","01110"],
  V: ["10001","10001","10001","10001","10001","01010","00100"],
  W: ["10001","10001","10001","10101","10101","10101","01010"],
  X: ["10001","10001","01010","00100","01010","10001","10001"],
  Y: ["10001","10001","01010","00100","00100","00100","00100"],
  Z: ["11111","00001","00010","00100","01000","10000","11111"],
  0: ["01110","10001","10011","10101","11001","10001","01110"],
  1: ["00100","01100","00100","00100","00100","00100","01110"],
  2: ["01110","10001","00001","00010","00100","01000","11111"],
  3: ["11110","00001","00001","01110","00001","00001","11110"],
  4: ["00010","00110","01010","10010","11111","00010","00010"],
  5: ["11111","10000","10000","11110","00001","00001","11110"],
  6: ["01110","10000","10000","11110","10001","10001","01110"],
  7: ["11111","00001","00010","00100","01000","01000","01000"],
  8: ["01110","10001","10001","01110","10001","10001","01110"],
  9: ["01110","10001","10001","01111","00001","00001","01110"],
  "!": ["00100","00100","00100","00100","00100","00000","00100"],
  "?": ["01110","10001","00001","00010","00100","00000","00100"],
  ".": ["00000","00000","00000","00000","00000","01100","01100"],
  ":": ["00000","00100","00100","00000","00100","00100","00000"],
  "-": ["00000","00000","00000","11111","00000","00000","00000"],
  "+": ["00000","00100","00100","11111","00100","00100","00000"],
  "'": ["00100","00100","00000","00000","00000","00000","00000"],
  ",": ["00000","00000","00000","00000","00000","00100","01000"],
  "=": ["00000","00000","11111","00000","11111","00000","00000"],
  "/": ["00001","00010","00100","01000","10000","00000","00000"],
  " ": ["00000","00000","00000","00000","00000","00000","00000"],
};

function drawPixelText(text, x, y, scale, color) {
  const upper = text.toUpperCase();
  ctx.fillStyle = color;
  let cursorX = x;
  for (const ch of upper) {
    const glyph = FONT[ch] || FONT[" "];
    for (let row = 0; row < glyph.length; row++) {
      for (let col = 0; col < glyph[row].length; col++) {
        if (glyph[row][col] === "1") {
          ctx.fillRect(cursorX + col * scale, y + row * scale, scale, scale);
        }
      }
    }
    cursorX += (glyph[0].length + 1) * scale;
  }
}

function measurePixelText(text, scale) {
  const upper = text.toUpperCase();
  let w = 0;
  for (const ch of upper) {
    const glyph = FONT[ch] || FONT[" "];
    w += (glyph[0].length + 1) * scale;
  }
  w -= scale; // remove trailing gap
  const h = 7 * scale;
  return { width: w, height: h };
}

function drawPixelTextCentered(text, cx, y, scale, color) {
  const { width } = measurePixelText(text, scale);
  drawPixelText(text, cx - width / 2, y, scale, color);
}

function drawPixelTextCenteredMultiline(text, cx, y, scale, color) {
  const words = text.split(" ");
  if (words.length <= 1) {
    drawPixelTextCentered(text, cx, y, scale, color);
    return;
  }
  const lineHeight = scale * 6 + 4;
  for (let i = 0; i < words.length; i++) {
    drawPixelTextCentered(words[i], cx, y + i * lineHeight, scale, color);
  }
}

function drawPixelTextOutlined(text, x, y, scale, color, outlineColor) {
  const off = scale; // 1 font-pixel thick outline
  // 8 surrounding offsets (N, S, E, W + diagonals)
  for (let dx = -off; dx <= off; dx += off) {
    for (let dy = -off; dy <= off; dy += off) {
      if (dx === 0 && dy === 0) continue;
      drawPixelText(text, x + dx, y + dy, scale, outlineColor);
    }
  }
  drawPixelText(text, x, y, scale, color);
}

// ---- White Background Removal ----

function removeWhiteBackground(img) {
  try {
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const cx = c.getContext("2d");
    cx.drawImage(img, 0, 0);
    const imageData = cx.getImageData(0, 0, c.width, c.height);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      if (r > 230 && g > 230 && b > 230) {
        d[i + 3] = 0;
      } else if (r > 200 && g > 200 && b > 200) {
        const brightness = (r + g + b) / 3;
        const alpha = Math.max(0, Math.min(255, (230 - brightness) * (255 / 30)));
        d[i + 3] = Math.min(d[i + 3], Math.round(alpha));
      }
    }
    cx.putImageData(imageData, 0, 0);
    return c;
  } catch (e) {
    // file:// protocol causes tainted canvas — fall back to raw image
    return img;
  }
}

// ---- Asset Loading ----

const assets = {
  titleSplash: null,
  kickbot: null,
  scrondo: null,
  letsKick: null,
  grimaceSound: null,
  punchSound: null,
  wooshSound: null,
  gongSound: null,
  whipSound: null,
  ultraVoiceSound: null,
  ultraHarpSound: null,
  grimace02Sound: null,
  goldenBootMedal: null,
  logo: null,
  characters: [],
  loaded: false,
};

function loadAssets(callback) {
  let remaining = 14 + CHARACTERS.length; // title + kickbot + scrondo + letskick + goldenBootMedal + logo + grimace + grimace02 + punch + woosh + gong + whip + ultraVoice + ultraHarp + characters
  function done() {
    remaining--;
    if (remaining <= 0) {
      assets.loaded = true;
      callback();
    }
  }

  // Title splash (no white BG removal)
  const titleImg = new Image();
  titleImg.onload = () => { assets.titleSplash = titleImg; done(); };
  titleImg.onerror = done;
  titleImg.src = "assets/titlesplash.png";

  // Kickbot (PNGs already have transparent backgrounds)
  const kickbotImg = new Image();
  kickbotImg.onload = () => { assets.kickbot = kickbotImg; done(); };
  kickbotImg.onerror = done;
  kickbotImg.src = "assets/kickbot.png";

  // Magnificent Scrondo (award presenter)
  const scrondoImg = new Image();
  scrondoImg.onload = () => { assets.scrondo = scrondoImg; done(); };
  scrondoImg.onerror = done;
  scrondoImg.src = "assets/scrondo.png";

  // Let's Kick instruction splash
  const letsKickImg = new Image();
  letsKickImg.onload = () => { assets.letsKick = letsKickImg; done(); };
  letsKickImg.onerror = done;
  letsKickImg.src = "assets/letskick.png";

  // Logo (title screen)
  const logoImg = new Image();
  logoImg.onload = () => { assets.logo = logoImg; done(); };
  logoImg.onerror = done;
  logoImg.src = "assets/logo.png";

  // Golden Boot Medal (award screen)
  const medalImg = new Image();
  medalImg.onload = () => { assets.goldenBootMedal = medalImg; done(); };
  medalImg.onerror = done;
  medalImg.src = "assets/goldenbootmedal.png";

  // Sound effects
  const grimaceAudio = new Audio("assets/grimace.m4a");
  grimaceAudio.addEventListener("canplaythrough", () => { assets.grimaceSound = grimaceAudio; done(); }, { once: true });
  grimaceAudio.addEventListener("error", done, { once: true });
  grimaceAudio.load();

  const grimace02Audio = new Audio("assets/Kickbot grimace 02.wav");
  grimace02Audio.addEventListener("canplaythrough", () => { assets.grimace02Sound = grimace02Audio; done(); }, { once: true });
  grimace02Audio.addEventListener("error", done, { once: true });
  grimace02Audio.load();

  const punchAudio = new Audio("assets/punch.mp3");
  punchAudio.addEventListener("canplaythrough", () => { assets.punchSound = punchAudio; done(); }, { once: true });
  punchAudio.addEventListener("error", done, { once: true });
  punchAudio.load();

  const wooshAudio = new Audio("assets/woosh.mp3");
  wooshAudio.addEventListener("canplaythrough", () => { assets.wooshSound = wooshAudio; done(); }, { once: true });
  wooshAudio.addEventListener("error", done, { once: true });
  wooshAudio.load();

  const gongAudio = new Audio("assets/gong.mp3");
  gongAudio.addEventListener("canplaythrough", () => { assets.gongSound = gongAudio; done(); }, { once: true });
  gongAudio.addEventListener("error", done, { once: true });
  gongAudio.load();

  const whipAudio = new Audio("assets/whip.mp3");
  whipAudio.addEventListener("canplaythrough", () => { assets.whipSound = whipAudio; done(); }, { once: true });
  whipAudio.addEventListener("error", done, { once: true });
  whipAudio.load();

  const ultraVoiceAudio = new Audio("assets/ultra kick voice title.mp3");
  ultraVoiceAudio.addEventListener("canplaythrough", () => { assets.ultraVoiceSound = ultraVoiceAudio; done(); }, { once: true });
  ultraVoiceAudio.addEventListener("error", done, { once: true });
  ultraVoiceAudio.load();

  const ultraHarpAudio = new Audio("assets/ultra kick mouth harp.mp3");
  ultraHarpAudio.addEventListener("canplaythrough", () => { assets.ultraHarpSound = ultraHarpAudio; done(); }, { once: true });
  ultraHarpAudio.addEventListener("error", done, { once: true });
  ultraHarpAudio.load();

  // Character images (PNGs already have transparent backgrounds)
  CHARACTERS.forEach((char, i) => {
    const img = new Image();
    img.onload = () => { assets.characters[i] = img; done(); };
    img.onerror = done;
    img.src = char.src;
  });
}

// ---- Audio ----

let audioCtx = null;
let musicTimer = null;
let musicEnabled = true;

// Longer melody with a dramatic arc — builds tension, releases, repeats
// ---- Gameplay Music — 8-bit Wagner "Ride of the Valkyries" (B minor) ----
// Galloping triplet charge, warlike brass horn calls
const melodyBase = [
  // Phrase A — galloping Valkyrie charge
  247, 247, 294, 247, 294, 370, 370, 0,
  // Phrase B — horn call soaring upward
  370, 370, 440, 370, 440, 494, 494, 0,
  // Phrase C — "Ho-jo-to-ho!" battle cry peak
  494, 0, 440, 370, 440, 494, 587, 0,
  // Phrase D — thundering descent and reset
  494, 440, 370, 294, 247, 294, 370, 0,
];
let melodyIndex = 0;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function playBeep(freq, duration, type = "square", gain = 0.06) {
  if (!musicEnabled) return;
  ensureAudio();
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = 0.0001;
  osc.connect(g);
  g.connect(audioCtx.destination);
  const now = audioCtx.currentTime;
  g.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playSample(audioAsset, volume) {
  if (!musicEnabled || !audioAsset) return;
  const snd = audioAsset.cloneNode();
  snd.volume = volume;
  snd.play().catch(() => {});
}

function playKickSound(perfect) {
  // Punch hit sound, then grimace after a short delay
  playSample(assets.punchSound, perfect ? 1.0 : 0.8);
  setTimeout(() => playSample(assets.grimaceSound, 0.8), 200);
  // Bell ding on top
  playBeep(perfect ? 1320 : 1047, 0.4, "sine", perfect ? 0.15 : 0.1);
}

function playMissSound() {
  playSample(assets.wooshSound, 0.7);
}

function playLaughSound() {
  if (!musicEnabled) return;
  ensureAudio();
  playBeep(260, 0.12, "square", 0.06);
  setTimeout(() => playBeep(200, 0.14, "square", 0.06), 90);
}

function playWhoosh() {
  if (!musicEnabled) return;
  ensureAudio();
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sawtooth";
  const now = audioCtx.currentTime;
  osc.frequency.setValueAtTime(650, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc.connect(g);
  g.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

function startMusic() {
  if (!musicEnabled || musicTimer) return;
  ensureAudio();
  musicTimer = setInterval(() => {
    const freq = melodyBase[melodyIndex];
    const bossShift = 1 + game.bossIndex * 0.08;
    const volume = 0.03 + game.bossIndex * 0.005;
    const phraseIdx = Math.floor(melodyIndex / 8);

    if (freq > 0) {
      // Aggressive brass horn — square wave for battle energy
      playBeep(freq * bossShift, 0.16, "square", volume);
      // Octave bass for warlike weight
      playBeep(freq * bossShift * 0.5, 0.18, "triangle", volume * 0.6);
      // High harmony on phrases B and C (soaring horn calls)
      if (phraseIdx === 1 || phraseIdx === 2) {
        playBeep(freq * bossShift * 2, 0.10, "square", volume * 0.25);
      }
    }

    // Galloping percussion — triplet feel
    if (melodyIndex % 3 === 0) {
      playBeep(55, 0.06, "sine", 0.05);
    }

    melodyIndex = (melodyIndex + 1) % melodyBase.length;
  }, 160);
}

function stopMusic() {
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
}

// ---- Award Screen Music — 8-bit Mozart Horn Concerto No. 4, K.495 (Eb major) ----
// 3rd movement Rondo — bright, jaunty horn theme, celebratory
const fanfare = [
  // Phrase A — Rondo theme: the famous horn call
  311, 311, 311, 0, 233, 311, 392, 0,
  466, 392, 311, 0, 349, 392, 415, 0,
  // Phrase B — ascending answer, building joy
  466, 415, 392, 349, 311, 0, 0, 0,
  311, 349, 392, 415, 466, 523, 587, 0,
  // Phrase C — playful descent
  587, 523, 466, 415, 392, 349, 311, 0,
  392, 0, 466, 0, 311, 0, 0, 0,
  // Phrase D — triumphant wrap back to tonic
  311, 392, 466, 392, 311, 349, 392, 0,
  415, 392, 349, 311, 311, 0, 0, 0,
];
let fanfareIndex = 0;
let fanfareTimer = null;

function startFanfare() {
  if (!musicEnabled || fanfareTimer) return;
  ensureAudio();
  fanfareIndex = 0;
  fanfareTimer = setInterval(() => {
    const freq = fanfare[fanfareIndex];
    const phraseIdx = Math.floor(fanfareIndex / 16);

    if (freq > 0) {
      // Bright horn tone — triangle wave, warm and round
      playBeep(freq, 0.20, "triangle", 0.05);
      // Light bass accompaniment
      playBeep(freq * 0.5, 0.22, "sine", 0.025);
      // Sparkly octave shimmer on phrases B and D
      if (phraseIdx === 1 || phraseIdx === 3) {
        playBeep(freq * 2, 0.12, "square", 0.012);
      }
    }

    // Light tapping rhythm every 4 beats
    if (fanfareIndex % 4 === 0) {
      playBeep(80, 0.05, "sine", 0.03);
    }

    fanfareIndex = (fanfareIndex + 1) % fanfare.length;
  }, 170);
}

function stopFanfare() {
  if (fanfareTimer) { clearInterval(fanfareTimer); fanfareTimer = null; }
}

// ---- Title Screen Music — 8-bit Prokofiev "Dance of the Knights" (C minor) ----
// Heavy, menacing march — ominous staccato, dark and imposing
const titleMelody = [
  // Phrase A — the menacing march, heavy staccato
  262, 0, 262, 0, 262, 0, 262, 0,
  311, 294, 262, 233, 262, 0, 0, 0,
  // Phrase B — darker chromatic descent
  262, 0, 262, 0, 262, 0, 262, 0,
  415, 392, 349, 311, 262, 0, 0, 0,
  // Phrase C — rising threat
  392, 0, 392, 0, 415, 392, 349, 311,
  294, 262, 294, 311, 349, 0, 0, 0,
  // Phrase D — ominous resolution
  311, 0, 294, 0, 262, 0, 233, 0,
  262, 0, 0, 0, 262, 0, 0, 0,
];
let titleMelodyIdx = 0;
let titleMusicTimer = null;
let titleBeatCount = 0;

function startTitleMusic() {
  if (!musicEnabled || titleMusicTimer) return;
  ensureAudio();
  titleMelodyIdx = 0;
  titleBeatCount = 0;
  titleMusicTimer = setInterval(() => {
    const freq = titleMelody[titleMelodyIdx];

    if (freq > 0) {
      // Dark, heavy brass — short stabbing square wave
      playBeep(freq, 0.14, "square", 0.04);
      // Menacing bass octave below
      playBeep(freq * 0.5, 0.18, "triangle", 0.035);
      // Sub-bass rumble for weight
      playBeep(freq * 0.25, 0.20, "sine", 0.02);
    }

    // Heavy march drum — boom on every other beat
    if (titleBeatCount % 2 === 0) {
      playBeep(50, 0.10, "sine", 0.06);
    }

    titleBeatCount++;
    titleMelodyIdx = (titleMelodyIdx + 1) % titleMelody.length;
  }, 180);
}

function stopTitleMusic() {
  if (titleMusicTimer) { clearInterval(titleMusicTimer); titleMusicTimer = null; }
}

// ---- Character Select Music — 8-bit Wagner "Entry of the Gods into Valhalla" (D major) ----
// Majestic brass Valhalla leitmotif, stately and grand
const selectMelody = [
  // Phrase A — Valhalla motif: broad brass statement
  294, 294, 0, 220, 0, 294, 294, 0,
  330, 330, 370, 370, 392, 392, 0, 0,
  // Phrase B — majestic descent
  370, 370, 330, 330, 294, 294, 0, 0,
  247, 247, 220, 220, 294, 0, 0, 0,
  // Phrase C — ascending the rainbow bridge, building grandeur
  294, 0, 330, 370, 392, 0, 440, 494,
  587, 587, 0, 0, 494, 440, 392, 0,
  // Phrase D — noble resolution back to tonic
  440, 392, 370, 0, 330, 294, 0, 0,
  330, 294, 247, 220, 294, 0, 0, 0,
];
let selectMelodyIdx = 0;
let selectMusicTimer = null;
let selectBeatCount = 0;

function startSelectMusic() {
  if (!musicEnabled || selectMusicTimer) return;
  ensureAudio();
  selectMelodyIdx = 0;
  selectBeatCount = 0;
  selectMusicTimer = setInterval(() => {
    const freq = selectMelody[selectMelodyIdx];
    const phraseIdx = Math.floor(selectMelodyIdx / 16);

    if (freq > 0) {
      // Warm brass horn — triangle wave, sustained
      playBeep(freq, 0.30, "triangle", 0.05);
      // Deep tuba bass throughout for Wagnerian weight
      playBeep(freq * 0.5, 0.35, "triangle", 0.03);
      // 5th harmony on phrases B and D for richness
      if (phraseIdx === 1 || phraseIdx === 3) {
        playBeep(freq * 1.5, 0.20, "triangle", 0.02);
      }
      // Octave shimmer + sub-bass on phrase C (the grand ascent)
      if (phraseIdx === 2) {
        playBeep(freq * 2, 0.18, "square", 0.015);
        playBeep(freq * 0.25, 0.35, "sine", 0.025);
      }
    }

    // Timpani boom every 4 beats
    if (selectBeatCount % 4 === 0) {
      playBeep(65, 0.12, "sine", 0.07);
    }

    selectBeatCount++;
    selectMelodyIdx = (selectMelodyIdx + 1) % selectMelody.length;
  }, 220);
}

function stopSelectMusic() {
  if (selectMusicTimer) { clearInterval(selectMusicTimer); selectMusicTimer = null; }
}

// Stop all music helper
function stopAllMusic() {
  stopMusic();
  stopTitleMusic();
  stopSelectMusic();
  stopFanfare();
}

function speakLine(text) {
  if (!("speechSynthesis" in window) || !musicEnabled) return;
  const u = new SpeechSynthesisUtterance(text);
  u.pitch = 2.0;   // max spec pitch — squeaky chipmunk
  u.rate = 1.9;     // fast and frantic
  u.volume = 1.0;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// ---- Game State ----

const game = {
  screen: "title", // "title" | "select" | "game"
  selectedIndex: 0,
  score: 0,
  combo: 0,
  bossIndex: 0,
  hitsOnBoss: 0,

  // Timing bar
  barPos: 0.0,       // 0..1, position along bar
  barDir: 1,          // 1 = right, -1 = left
  baseSpeed: 0.6,     // full sweeps per second (0..1)
  speedFactor: 1,

  // Animation states
  kickbot: {
    state: "idle",    // "idle" | "hit" | "taunt"
    timer: 0,
    idleTime: 0,      // for idle bob
    recoilOffset: 0,   // backward offset on hit
    scaleBonus: 0,     // scale up on taunt
    flashAlpha: 0,     // white flash overlay
  },

  player: {
    state: "idle",    // "idle" | "ultraspin" | "windup" | "strike" | "recover" | "stumble"
    timer: 0,
    idleTime: 0,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,      // radians, for kick flip
    scaleX: 1,        // squash/stretch
    isUltraKick: false,
  },

  // Effects
  shake: 0,
  earthquakeTimer: 0,
  hitFlash: 0,        // screen-wide gold flash
  ultraFlash: 0,      // screen-wide white flash for ultra kick
  hitText: "",
  hitTextTimer: 0,
  hitTextX: 0,
  hitTextY: 0,

  // Taunt speech (only on kick attempts)
  tauntText: "",
  tauntTimer: 0,
  tauntInterval: 2800,
  tauntBubbleTimer: 0,

  // Boss banner
  banner: "",
  bannerTimer: 0,

  // Stars
  starsTimer: 0,
  starsAngle: 0,

  // Particles
  particles: [],

  // Title blink
  blinkTimer: 0,

  // Rank (earned by beating bosses)
  rankIndex: -1,  // -1 = no rank yet

  // Game timer (60 seconds then award screen)
  gameTime: 0,
  gameDuration: 60,
};

let lastTime = 0;

// ---- Input ----

// Unlock audio on first interaction and start title music
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  ensureAudio();
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().then(() => {
      if (game.screen === "title" && !titleMusicTimer && musicEnabled) startTitleMusic();
    });
  } else {
    if (game.screen === "title" && !titleMusicTimer && musicEnabled) startTitleMusic();
  }
}

document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });

window.addEventListener("keydown", (e) => {
  ensureAudio();
  if (game.screen === "title" && !titleMusicTimer && musicEnabled) startTitleMusic();

  if (e.code === "ArrowLeft") {
    if (game.screen === "select") {
      game.selectedIndex = (game.selectedIndex - 1 + CHARACTERS.length) % CHARACTERS.length;
      playSample(assets.whipSound, 0.7);
    }
    return;
  }
  if (e.code === "ArrowRight") {
    if (game.screen === "select") {
      game.selectedIndex = (game.selectedIndex + 1) % CHARACTERS.length;
      playSample(assets.whipSound, 0.7);
    }
    return;
  }

  if (e.code !== "Space") return;
  e.preventDefault();

  if (game.screen === "title") {
    ensureAudio();
    stopTitleMusic();
    startSelectMusic();
    game.screen = "select";
    return;
  }
  if (game.screen === "select") {
    playSample(assets.gongSound, 1.0);
    stopSelectMusic();
    game.screen = "instructions";
    game.blinkTimer = 0;
    return;
  }

  if (game.screen === "instructions") {
    game.screen = "game";
    game.gameTime = 0;
    startMusic();
    return;
  }

  if (game.screen === "award") {
    // Reset game for replay
    playSample(assets.grimace02Sound, 0.8);
    stopAllMusic();
    startSelectMusic();
    game.screen = "select";
    game.score = 0;
    game.combo = 0;
    game.bossIndex = 0;
    game.hitsOnBoss = 0;
    game.rankIndex = -1;
    game.gameTime = 0;
    game.speedFactor = 1;
    game.particles = [];
    game.kickbot.state = "idle";
    game.player.state = "idle";
    game.tauntBubbleTimer = 0;
    game.bannerTimer = 0;
    game.ultraFlash = 0;
    _tintCache = { tint: null, alpha: 0, canvas: null };
    return;
  }

  // Gameplay — attempt kick
  if (game.player.state !== "idle") return; // can't kick during animation

  if (e.shiftKey) {
    // ULTRA KICK — spin 3 times then deliver a devastating kick
    game.player.isUltraKick = true;
    game.player.state = "ultraspin";
    game.player.timer = 0;
    playSample(assets.ultraVoiceSound, 1.0);
  } else {
    // Regular kick
    game.player.isUltraKick = false;
    game.player.state = "windup";
    game.player.timer = 0;
  }
  // Kick check happens when strike lands (after windup)
});

toggleSoundBtn.addEventListener("click", () => {
  ensureAudio();
  // First click ever: just unlock audio and start music (don't toggle off)
  if (!audioUnlocked) {
    audioUnlocked = true;
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    if (game.screen === "title") startTitleMusic();
    else if (game.screen === "select") startSelectMusic();
    else if (game.screen === "game") startMusic();
    else if (game.screen === "award") startFanfare();
    return;
  }
  musicEnabled = !musicEnabled;
  toggleSoundBtn.textContent = `SOUND: ${musicEnabled ? "ON" : "OFF"}`;
  if (!musicEnabled) {
    stopAllMusic();
    window.speechSynthesis.cancel();
  } else {
    // Restart music for current screen
    if (game.screen === "title") startTitleMusic();
    else if (game.screen === "select") startSelectMusic();
    else if (game.screen === "game") startMusic();
    else if (game.screen === "award") startFanfare();
  }
});

// ---- Game Logic ----

function attemptKick() {
  // barPos is 0..1, target zone is centered at 0.5
  const hitZoneHalf = 0.12;    // outer hit zone
  const perfectZoneHalf = 0.05; // inner perfect zone
  const dist = Math.abs(game.barPos - 0.5);
  const hit = dist <= hitZoneHalf;
  const perfect = dist <= perfectZoneHalf;

  const ultra = game.player.isUltraKick;

  if (hit) {
    // Exponential scoring: base * 1.5^combo, doubled for ultra kick
    const base = perfect ? 250 : 150;
    const multiplier = ultra ? 2 : 1;
    const bonus = Math.floor(base * Math.pow(1.5, game.combo) * multiplier);
    game.score += bonus;
    game.combo++;
    // Speed ramps hard: 0.20 per combo + boss bonus — gets brutal fast
    game.speedFactor = 1 + game.combo * 0.20 + BOSSES[game.bossIndex].speedBonus;

    // Kickbot hit reaction
    game.kickbot.state = "hit";
    game.kickbot.timer = 0;
    game.kickbot.recoilOffset = 0;
    game.kickbot.flashAlpha = 1;

    game.starsTimer = ultra ? 3.0 : 1.5;

    if (ultra) {
      // ULTRA KICK — earthquake shake
      game.ultraFlash = 1.0;
      game.hitFlash = 0.25;
      game.shake = Math.max(game.shake, 20);
      game.earthquakeTimer = 1.0;
      spawnParticles(30, "#ffd84a");
      spawnParticles(20, "#ff3d6e");
      spawnParticles(15, "#ffffff");
      // Play grimace + mouth harp after short delays
      setTimeout(() => playSample(assets.grimace02Sound, 0.8), 200);
      setTimeout(() => playSample(assets.ultraHarpSound, 1.0), 300);
      // Count as 2 hits toward boss
      advanceBoss();
      advanceBoss();
    } else if (perfect) {
      game.hitFlash = 0.15;
      game.shake = Math.max(game.shake, 8);
      spawnParticles(18, "#ffd84a");
      spawnParticles(10, "#ff3d6e");
      advanceBoss();
    } else {
      game.shake = Math.max(game.shake, 4);
      spawnParticles(10, "#ffd84a");
      advanceBoss();
    }

    game.tauntText = SORE_LOSER_LINES[Math.floor(Math.random() * SORE_LOSER_LINES.length)];
    game.tauntBubbleTimer = 2.0;
    playKickSound(perfect);
    speakLine(game.tauntText);
  } else {
    // Miss
    game.combo = 0;
    game.speedFactor = 1 + BOSSES[game.bossIndex].speedBonus;

    game.kickbot.state = "taunt";
    game.kickbot.timer = 0;
    game.kickbot.scaleBonus = 0;

    game.player.state = "stumble";
    game.player.timer = 0;

    game.tauntText = MISS_TAUNTS[Math.floor(Math.random() * MISS_TAUNTS.length)];
    game.tauntBubbleTimer = 2.0;
    playMissSound();
    speakLine(game.tauntText);
  }
}

function advanceBoss() {
  game.hitsOnBoss++;
  if (game.hitsOnBoss >= BOSSES[game.bossIndex].hitsToAdvance) {
    // Earn rank for beating this boss
    game.rankIndex = Math.min(game.bossIndex, RANKS.length - 1);
    if (game.bossIndex < BOSSES.length - 1) {
      game.bossIndex++;
      game.hitsOnBoss = 0;
      game.banner = "LEVEL " + (game.bossIndex + 1) + ": " + BOSSES[game.bossIndex].name;
      game.bannerTimer = 3.0;
      game.tauntText = "NEXT BOT IN.";
      game.tauntBubbleTimer = 2.5;
      // Invalidate tint cache for new boss
      _tintCache = { tint: null, alpha: 0, canvas: null };
    } else {
      game.rankIndex = RANKS.length - 1;
      game.banner = "ULTIMATE KICKLORD!";
      game.bannerTimer = 3.0;
    }
  }
}

function spawnParticles(count, color) {
  const impactX = W / 2;
  const impactY = 240;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 120;
    const lifespan = 0.8 + Math.random() * 0.4;
    game.particles.push({
      x: impactX, y: impactY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: lifespan,
      maxLife: lifespan,
      color,
      star: false,
    });
  }
}

// ---- Tick / Update ----

function tick(dt) {
  // Game timer — after 60 seconds, show award screen
  game.gameTime += dt;
  if (game.gameTime >= game.gameDuration) {
    game.screen = "award";
    game.blinkTimer = 0;
    stopAllMusic();
    startFanfare();
    return;
  }

  // Timing bar sweep
  const speed = game.baseSpeed * game.speedFactor;
  game.barPos += game.barDir * speed * dt;
  if (game.barPos >= 1) { game.barPos = 1; game.barDir = -1; }
  else if (game.barPos <= 0) { game.barPos = 0; game.barDir = 1; }

  // Player animation state machine
  updatePlayerAnim(dt);

  // Kickbot animation state machine
  updateKickbotAnim(dt);

  // Timers
  // Earthquake keeps shake high for its duration
  if (game.earthquakeTimer > 0) {
    game.earthquakeTimer -= dt;
    game.shake = Math.max(game.shake, 14 * (game.earthquakeTimer / 1.0));
  }
  if (game.shake > 0) game.shake = Math.max(0, game.shake - dt * 20);
  if (game.hitFlash > 0) game.hitFlash -= dt;
  if (game.ultraFlash > 0) game.ultraFlash -= dt * 4;
  if (game.hitTextTimer > 0) game.hitTextTimer -= dt;
  if (game.bannerTimer > 0) game.bannerTimer -= dt;
  if (game.starsTimer > 0) game.starsTimer -= dt;
  if (game.tauntBubbleTimer > 0) game.tauntBubbleTimer -= dt;
  game.starsAngle += dt * 3;

  // No idle taunts — captions only appear on kick attempts

  // Particles
  game.particles = game.particles.filter(p => p.life > 0);
  for (const p of game.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 100 * dt; // gravity
    p.life -= dt;
  }

}

function updatePlayerAnim(dt) {
  const p = game.player;
  p.idleTime += dt;
  p.timer += dt;

  switch (p.state) {
    case "idle":
      p.offsetX = 0;
      p.offsetY = Math.sin(p.idleTime * 3) * 2;
      p.rotation = 0;
      p.scaleX = 1;
      break;

    case "ultraspin": {
      // Spin 3 full rotations over 0.6s, then transition to windup
      const spinDuration = 0.6;
      const spins = 3;
      const t = Math.min(p.timer / spinDuration, 1);
      p.rotation = t * spins * Math.PI * 2;
      // Bob up during spin
      p.offsetY = -20 * Math.sin(t * Math.PI);
      p.offsetX = 0;
      p.scaleX = 1;
      if (p.timer >= spinDuration) {
        p.state = "windup";
        p.timer = 0;
      }
      break;
    }

    case "windup": {
      // Crouch back — coil up, slight lean back
      const wt = Math.min(p.timer / 0.1, 1);
      p.offsetX = -25 * wt;
      p.offsetY = 8 * wt;
      p.rotation = -0.15 * wt;  // lean back
      p.scaleX = 1 - 0.1 * wt;  // slight squash
      if (p.timer >= 0.1) {
        p.state = "strike";
        p.timer = 0;
        attemptKick();
      }
      break;
    }

    case "strike": {
      // Phase 1 (0-0.08s): fast lunge forward toward kickbot
      // Phase 2 (0.08-0.18s): flip — sprite rotates forward as leg extends
      // Phase 3 (0.18-0.28s): hold at contact point
      const lungeEnd = 0.08;
      const flipEnd = 0.18;
      const holdEnd = 0.28;

      if (p.timer < lungeEnd) {
        // Explosive lunge forward and up
        const t = p.timer / lungeEnd;
        const ease = t * t; // accelerate into it
        p.offsetX = -25 + 140 * ease;
        p.offsetY = 8 - 60 * ease;
        p.rotation = -0.15 + 0.5 * ease;
        p.scaleX = 0.9 + 0.2 * ease; // stretch into kick
      } else if (p.timer < flipEnd) {
        // Quick flip rotation — foot comes around
        const t = (p.timer - lungeEnd) / (flipEnd - lungeEnd);
        p.offsetX = 115;
        p.offsetY = -52;
        p.rotation = 0.35 + 1.2 * t; // fast rotation ~70 degrees
        p.scaleX = 1.1;
      } else if (p.timer < holdEnd) {
        // Hold at impact — contact!
        p.offsetX = 115;
        p.offsetY = -52;
        p.rotation = 1.55; // ~89 degrees — foot extended
        p.scaleX = 1.1;
      } else {
        // Transition to recover
        p.state = "recover";
        p.timer = 0;
      }
      break;
    }

    case "recover": {
      // Bounce back to idle over 0.3s
      const t = Math.min(p.timer / 0.3, 1);
      const ease = 1 - Math.pow(1 - t, 2); // ease out
      p.offsetX = 115 * (1 - ease);
      p.offsetY = -52 * (1 - ease);
      p.rotation = 1.55 * (1 - ease);
      p.scaleX = 1.1 - 0.1 * ease;
      if (p.timer >= 0.3) {
        p.state = "idle";
        p.timer = 0;
        p.offsetX = 0;
        p.offsetY = 0;
        p.rotation = 0;
        p.scaleX = 1;
      }
      break;
    }

    case "stumble": {
      // Stumble backward with a slight wobble
      if (p.timer < 0.12) {
        const t = p.timer / 0.12;
        p.offsetX = -35 * t;
        p.offsetY = 15 * t;
        p.rotation = -0.3 * t;
      } else if (p.timer < 0.5) {
        const t = (p.timer - 0.12) / 0.38;
        const ease = 1 - Math.pow(1 - t, 2);
        p.offsetX = -35 * (1 - ease);
        p.offsetY = 15 * (1 - ease);
        p.rotation = -0.3 * (1 - ease) + Math.sin(t * 12) * 0.05 * (1 - ease); // wobble
      } else {
        p.state = "idle";
        p.timer = 0;
        p.offsetX = 0;
        p.offsetY = 0;
        p.rotation = 0;
        p.scaleX = 1;
      }
      break;
    }
      break;
  }
}

function updateKickbotAnim(dt) {
  const kb = game.kickbot;
  kb.idleTime += dt;
  kb.timer += dt;

  switch (kb.state) {
    case "idle":
      kb.recoilOffset = 0;
      kb.scaleBonus = 0;
      kb.flashAlpha = 0;
      break;
    case "hit":
      // Recoil backward, then return
      if (kb.timer < 0.1) {
        kb.recoilOffset = 30 * (kb.timer / 0.1);
        kb.flashAlpha = 1 - kb.timer / 0.1;
      } else if (kb.timer < 0.5) {
        const t = (kb.timer - 0.1) / 0.4;
        kb.recoilOffset = 30 * (1 - t);
        kb.flashAlpha = 0;
      } else {
        kb.state = "idle";
        kb.timer = 0;
        kb.recoilOffset = 0;
        kb.flashAlpha = 0;
      }
      break;
    case "taunt":
      // Lean forward + scale up
      if (kb.timer < 0.2) {
        const t = kb.timer / 0.2;
        kb.recoilOffset = -15 * t;
        kb.scaleBonus = 0.08 * t;
      } else if (kb.timer < 0.7) {
        kb.recoilOffset = -15;
        kb.scaleBonus = 0.08;
      } else if (kb.timer < 1.0) {
        const t = (kb.timer - 0.7) / 0.3;
        kb.recoilOffset = -15 * (1 - t);
        kb.scaleBonus = 0.08 * (1 - t);
      } else {
        kb.state = "idle";
        kb.timer = 0;
        kb.recoilOffset = 0;
        kb.scaleBonus = 0;
      }
      break;
  }
}

// ---- Rendering ----

function drawBackground() {
  // Dark stage
  ctx.fillStyle = "#0b1020";
  ctx.fillRect(0, 0, W, H);

  // Floor with perspective grid
  const floorY = 350;
  ctx.fillStyle = "#0f1628";
  ctx.fillRect(0, floorY, W, H - floorY);

  // Horizontal grid lines
  ctx.strokeStyle = "#1a2540";
  ctx.lineWidth = 1;
  for (let y = floorY; y < H; y += 18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Perspective vertical lines (converge to center-top)
  const vanishX = W / 2;
  const vanishY = 200;
  ctx.strokeStyle = "#151e35";
  for (let i = -6; i <= 6; i++) {
    const bottomX = vanishX + i * 80;
    ctx.beginPath();
    ctx.moveTo(vanishX + i * 10, floorY);
    ctx.lineTo(bottomX, H);
    ctx.stroke();
  }

  // Stage lighting — subtle top spotlight
  const grad = ctx.createRadialGradient(W / 2, 0, 50, W / 2, 0, 400);
  grad.addColorStop(0, "rgba(60, 80, 140, 0.08)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

// Title screen confetti particles (persistent across frames)
const titleConfetti = [];
for (let i = 0; i < 40; i++) {
  titleConfetti.push({
    x: Math.random() * 800,
    y: Math.random() * 500,
    vx: (Math.random() - 0.5) * 0.3,
    vy: 0.2 + Math.random() * 0.4,
    size: 2 + Math.random() * 3,
    color: ["#ffd84a", "#ff3d6e", "#5effd8", "#c6a7ff", "#ffffff"][Math.floor(Math.random() * 5)],
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 1 + Math.random() * 2,
  });
}

function drawTitleScreen() {
  const t = game.blinkTimer;

  // Dark background
  ctx.fillStyle = "#0a0818";
  ctx.fillRect(0, 0, W, H);

  // Rotating rays from center (like award screen but subtler)
  ctx.save();
  ctx.translate(W / 2, H / 2);
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + t * 0.15;
    const alpha = 0.018 + Math.sin(t * 1.2 + i) * 0.008;
    ctx.fillStyle = `rgba(100, 140, 220, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * 600, Math.sin(angle) * 600);
    ctx.lineTo(Math.cos(angle + 0.16) * 600, Math.sin(angle + 0.16) * 600);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Subtle scanline overlay
  ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 1);
  }

  // --- Confetti shower ---
  for (const c of titleConfetti) {
    c.x += c.vx + Math.sin(t * c.wobbleSpeed + c.wobble) * 0.3;
    c.y += c.vy;
    if (c.y > H + 5) { c.y = -5; c.x = Math.random() * W; }
    if (c.x > W + 5) c.x = -5;
    if (c.x < -5) c.x = W + 5;
    ctx.globalAlpha = 0.4 + Math.sin(t * 2 + c.wobble) * 0.15;
    ctx.fillStyle = c.color;
    ctx.fillRect(c.x, c.y, c.size, c.size * 0.6);
    ctx.globalAlpha = 1;
  }

  // --- Kickbot: large, upper-right, bobbing ---
  if (assets.kickbot) {
    const kbW = 280;
    const kbH = 340;
    const kbX = W - kbW - 20;
    const kbY = 30 + Math.sin(t * 1.8) * 6;
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.translate(kbX + kbW / 2, kbY + kbH / 2);
    ctx.rotate(Math.sin(t * 1.2) * 0.03);
    ctx.drawImage(assets.kickbot, -kbW / 2, -kbH / 2, kbW, kbH);
    ctx.restore();

    // Stars orbiting over kickbot's head
    ctx.fillStyle = "#ffd84a";
    const starCX = kbX + kbW / 2;
    const starCY = kbY + 20;
    for (let i = 0; i < 5; i++) {
      const angle = t * 3 + (i * Math.PI * 2) / 5;
      const sx = starCX + Math.cos(angle) * 55;
      const sy = starCY + Math.sin(angle) * 20;
      drawStar(sx, sy, 5, 3);
    }
  }

  // --- Title logo ---
  if (assets.logo) {
    const logoH = 190;
    const logoW = logoH * (assets.logo.naturalWidth / assets.logo.naturalHeight);
    const logoX = 20;
    const logoY = 30 + Math.sin(t * 2.5) * 2;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(assets.logo, logoX, logoY, logoW, logoH);
  }

  // --- Characters lined up along the bottom, each with idle animations ---
  const charY = 290;
  const charData = [
    { idx: 3, name: "DROPKICK MARY", w: 90, h: 130, x: 20,  bobSpeed: 2.2, bobAmp: 4, swayAmp: 0.04 },
    { idx: 2, name: "BONSOO",        w: 100, h: 140, x: 140, bobSpeed: 2.8, bobAmp: 5, swayAmp: 0.03 },
    { idx: 1, name: "SQUASH",        w: 80, h: 110,  x: 280, bobSpeed: 2.0, bobAmp: 3, swayAmp: 0.02 },
    { idx: 0, name: "BOOTS",         w: 90, h: 140,  x: 390, bobSpeed: 2.5, bobAmp: 3, swayAmp: 0.03 },
  ];

  for (const ch of charData) {
    const charCanvas = assets.characters[ch.idx];
    if (!charCanvas) continue;

    const cx = ch.x;
    const cy = charY + ch.h - ch.h + Math.sin(t * ch.bobSpeed + ch.idx) * ch.bobAmp;

    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.translate(cx + ch.w / 2, cy + ch.h);
    ctx.rotate(Math.sin(t * ch.bobSpeed * 0.7 + ch.idx * 2) * ch.swayAmp);
    ctx.drawImage(charCanvas, -ch.w / 2, -ch.h, ch.w, ch.h);
    ctx.restore();

    // Character name below
    drawPixelTextCenteredMultiline(ch.name, cx + ch.w / 2, charY + ch.h + 8, 2, "#9db2d8");
  }

  // --- Blinking "PRESS SPACE" at bottom ---
  if (Math.floor(t * 2.5) % 2 === 0) {
    drawPixelTextCentered("PRESS SPACE", W / 2, H - 28, 3, "#ffffff");
  }

  // --- Subtle pulsing glow behind the title ---
  const glowAlpha = 0.04 + Math.sin(t * 3) * 0.02;
  const glow = ctx.createRadialGradient(250, 100, 20, 250, 100, 300);
  glow.addColorStop(0, `rgba(32, 96, 204, ${glowAlpha})`);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
}

function drawSelectScreen() {
  drawBackground();
  drawPixelTextCentered("CHOOSE YOUR KICKER", W / 2, 30, 4, "#ffd84a");

  const portraitW = 120;
  const portraitH = 160;
  const gap = 30;
  const totalW = CHARACTERS.length * portraitW + (CHARACTERS.length - 1) * gap;
  const startX = (W - totalW) / 2;
  const portraitY = 100;

  for (let i = 0; i < CHARACTERS.length; i++) {
    const x = startX + i * (portraitW + gap);
    const charCanvas = assets.characters[i];

    if (charCanvas) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(charCanvas, x, portraitY, portraitW, portraitH);
    } else {
      ctx.fillStyle = "#1b2542";
      ctx.fillRect(x, portraitY, portraitW, portraitH);
    }

    // Selection highlight
    if (i === game.selectedIndex) {
      ctx.strokeStyle = "#ffd84a";
      ctx.lineWidth = 4;
      ctx.strokeRect(x - 6, portraitY - 6, portraitW + 12, portraitH + 12);
    }

    // Character name
    const nameColor = i === game.selectedIndex ? "#ffd84a" : "#9db2d8";
    drawPixelTextCenteredMultiline(CHARACTERS[i].name, x + portraitW / 2, portraitY + portraitH + 14, 2, nameColor);
  }

  drawPixelTextCentered("ARROWS TO MOVE", W / 2, H - 80, 3, "#ffffff");
  drawPixelTextCentered("SPACE TO LOCK IN", W / 2, H - 50, 3, "#ffd84a");
}

function drawKickbot() {
  const kb = game.kickbot;
  const boss = BOSSES[game.bossIndex];

  // Each boss is slightly bigger and more imposing
  const bossScale = 1 + game.bossIndex * 0.06;
  const baseW = 220 * bossScale;
  const baseH = 280 * bossScale;
  const scale = 1 + kb.scaleBonus;
  const drawW = baseW * scale;
  const drawH = baseH * scale;
  const drawX = W / 2 - drawW / 2;
  const drawY = 40 - game.bossIndex * 8 + kb.recoilOffset + Math.sin(kb.idleTime * 2.5) * 2;

  // Boss aura glow behind the sprite (bigger per boss tier)
  const auraRadius = 100 + game.bossIndex * 30;
  const auraPulse = 0.15 + Math.sin(kb.idleTime * 2) * 0.05;
  const auraGrad = ctx.createRadialGradient(
    W / 2, drawY + drawH * 0.4, 20,
    W / 2, drawY + drawH * 0.4, auraRadius
  );
  auraGrad.addColorStop(0, boss.tint + hexAlpha(auraPulse));
  auraGrad.addColorStop(1, boss.tint + "00");
  ctx.fillStyle = auraGrad;
  ctx.fillRect(drawX - 60, drawY - 40, drawW + 120, drawH + 80);

  if (assets.kickbot) {
    ctx.imageSmoothingEnabled = false;

    if (game.bossIndex > 0) {
      // Tint via offscreen canvas so source-atop doesn't affect main canvas
      const oc = getTintedKickbot(assets.kickbot, boss.tint, 0.12 + game.bossIndex * 0.04);
      ctx.drawImage(oc, drawX, drawY, drawW, drawH);
    } else {
      ctx.drawImage(assets.kickbot, drawX, drawY, drawW, drawH);
    }

    // White flash overlay on hit
    if (kb.flashAlpha > 0) {
      ctx.globalAlpha = kb.flashAlpha * 0.6;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(drawX, drawY, drawW, drawH);
      ctx.globalAlpha = 1;
    }
  } else {
    drawFallbackKickbot(drawX, drawY, drawW, drawH);
  }

  // Boss-specific accessories drawn on top
  drawBossAccessories(drawX, drawY, drawW, drawH, game.bossIndex);

  // Cross-eyes overlay during hit state
  if (kb.state === "hit") {
    drawCrossEyes(drawX, drawY, drawW, drawH);
  }

  // Stars orbiting head on hit
  if (game.starsTimer > 0) {
    drawOrbitingStars(W / 2, drawY + 30, 50);
  }

  // Speech bubble
  if (game.tauntBubbleTimer > 0) {
    drawSpeechBubble(game.tauntText, W / 2, drawY + drawH * 0.4);
  }
}

// Offscreen canvas cache for tinted kickbot
let _tintCache = { tint: null, alpha: 0, canvas: null };
function getTintedKickbot(img, tint, alpha) {
  if (_tintCache.tint === tint && _tintCache.alpha === alpha && _tintCache.canvas) {
    return _tintCache.canvas;
  }
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const oc = document.createElement("canvas");
  oc.width = w;
  oc.height = h;
  const ox = oc.getContext("2d");
  ox.drawImage(img, 0, 0);
  ox.globalAlpha = alpha;
  ox.globalCompositeOperation = "source-atop";
  ox.fillStyle = tint;
  ox.fillRect(0, 0, w, h);
  _tintCache = { tint, alpha, canvas: oc };
  return oc;
}

// Helper to convert 0..1 alpha to 2-char hex
function hexAlpha(a) {
  return Math.round(Math.min(1, Math.max(0, a)) * 255).toString(16).padStart(2, "0");
}

function drawBossAccessories(x, y, w, h, bossIdx) {
  const cx = x + w / 2;

  switch (bossIdx) {
    case 0:
      // KICKMASTER — clean, no extras (the rookie boss)
      break;

    case 1:
      // SUPER KICK FACE — no accessories
      break;

    case 2: {
      // KICKY PANTZ — angular shades
      const shadeY = y + h * 0.125;
      const shadeW = 18;
      const shadeH = 10;
      const gap = 6;
      // Left lens
      ctx.fillStyle = "#ffd84a";
      ctx.fillRect(cx - gap / 2 - shadeW, shadeY, shadeW, shadeH);
      // Right lens
      ctx.fillRect(cx + gap / 2, shadeY, shadeW, shadeH);
      // Bridge
      ctx.fillRect(cx - gap / 2, shadeY + 2, gap, 4);
      // Dark lens tint
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(cx - gap / 2 - shadeW + 2, shadeY + 2, shadeW - 4, shadeH - 4);
      ctx.fillRect(cx + gap / 2 + 2, shadeY + 2, shadeW - 4, shadeH - 4);
      break;
    }

    case 3: {
      // DOOZY DIPPER — mohawk spikes on top of head
      ctx.fillStyle = "#c6a7ff";
      for (let i = -2; i <= 2; i++) {
        const sx = cx + i * 14;
        const spikeH = 22 - Math.abs(i) * 4;
        ctx.fillRect(sx - 3, y - spikeH + 2, 6, spikeH);
      }
      break;
    }

    case 4: {
      // SHOE HEAD — evil crown + glowing eyes
      // Crown
      ctx.fillStyle = "#ff8ad1";
      const crownY = y - 8;
      const crownW = w * 0.4;
      const crownH = 22;
      // Crown base
      ctx.fillRect(cx - crownW / 2, crownY + crownH - 8, crownW, 8);
      // Crown points
      for (let i = 0; i < 5; i++) {
        const px = cx - crownW / 2 + i * (crownW / 4);
        ctx.beginPath();
        ctx.moveTo(px - 6, crownY + crownH - 8);
        ctx.lineTo(px, crownY);
        ctx.lineTo(px + 6, crownY + crownH - 8);
        ctx.closePath();
        ctx.fill();
      }
      // Crown jewels
      ctx.fillStyle = "#ffd84a";
      ctx.fillRect(cx - 3, crownY + crownH - 12, 6, 6);

      // Glowing red eyes
      const eyeY = y + h * 0.13;
      const eyeGlow = 0.6 + Math.sin(game.kickbot.idleTime * 5) * 0.3;
      ctx.globalAlpha = eyeGlow;
      ctx.fillStyle = "#ff2244";
      ctx.fillRect(cx - w * 0.1 - 5, eyeY, 10, 6);
      ctx.fillRect(cx + w * 0.1 - 5, eyeY, 10, 6);
      ctx.globalAlpha = 1;
      break;
    }
  }
}

function drawFallbackKickbot(x, y, w, h) {
  // Body
  ctx.fillStyle = "#8c8c8c";
  ctx.fillRect(x + w * 0.1, y + h * 0.15, w * 0.8, h * 0.75);

  // Head
  ctx.fillStyle = "#9a9a9a";
  ctx.fillRect(x + w * 0.2, y, w * 0.6, h * 0.35);

  // Ears
  ctx.fillStyle = "#9a9a9a";
  ctx.fillRect(x + w * 0.15, y - h * 0.08, w * 0.15, h * 0.25);
  ctx.fillRect(x + w * 0.7, y - h * 0.08, w * 0.15, h * 0.25);
  ctx.fillStyle = "#ff3d6e";
  ctx.fillRect(x + w * 0.18, y, w * 0.09, h * 0.12);
  ctx.fillRect(x + w * 0.73, y, w * 0.09, h * 0.12);

  // Belly
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(x + w * 0.25, y + h * 0.4, w * 0.5, h * 0.35);

  // Eyes
  ctx.fillStyle = "#000";
  ctx.fillRect(x + w * 0.3, y + h * 0.1, w * 0.12, h * 0.08);
  ctx.fillRect(x + w * 0.58, y + h * 0.1, w * 0.12, h * 0.08);
}

function drawCrossEyes(x, y, w, h) {
  // Draw X-shaped eyes on top of the sprite
  const eyeL_x = x + w * 0.33;
  const eyeR_x = x + w * 0.58;
  const eyeY = y + h * 0.14;
  const eyeSize = 14;

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  // Left eye X
  ctx.beginPath();
  ctx.moveTo(eyeL_x, eyeY);
  ctx.lineTo(eyeL_x + eyeSize, eyeY + eyeSize);
  ctx.moveTo(eyeL_x + eyeSize, eyeY);
  ctx.lineTo(eyeL_x, eyeY + eyeSize);
  ctx.stroke();
  // Right eye X
  ctx.beginPath();
  ctx.moveTo(eyeR_x, eyeY);
  ctx.lineTo(eyeR_x + eyeSize, eyeY + eyeSize);
  ctx.moveTo(eyeR_x + eyeSize, eyeY);
  ctx.lineTo(eyeR_x, eyeY + eyeSize);
  ctx.stroke();
}

function drawOrbitingStars(cx, cy, radius) {
  ctx.fillStyle = "#ffd84a";
  for (let i = 0; i < 5; i++) {
    const angle = game.starsAngle + (i * Math.PI * 2) / 5;
    const sx = cx + Math.cos(angle) * radius;
    const sy = cy + Math.sin(angle) * (radius * 0.4); // flattened orbit
    // Draw a small star shape
    drawStar(sx, sy, 5, 3);
  }
}

function drawStar(cx, cy, outerR, innerR) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function drawSpeechBubble(text, anchorX, anchorY) {
  const scale = 3;
  const { width, height } = measurePixelText(text, scale);
  const bubbleW = width + 24;
  const bubbleH = height + 20;
  const padding = 16;

  // Right side of screen, positioned in the open area beside Kickbot
  const bx = W - bubbleW - padding;
  const by = Math.max(anchorY, 180);

  // Rounded-ish bubble background
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.beginPath();
  ctx.moveTo(bx + 8, by);
  ctx.lineTo(bx + bubbleW - 8, by);
  ctx.quadraticCurveTo(bx + bubbleW, by, bx + bubbleW, by + 8);
  ctx.lineTo(bx + bubbleW, by + bubbleH - 8);
  ctx.quadraticCurveTo(bx + bubbleW, by + bubbleH, bx + bubbleW - 8, by + bubbleH);
  ctx.lineTo(bx + 8, by + bubbleH);
  ctx.quadraticCurveTo(bx, by + bubbleH, bx, by + bubbleH - 8);
  ctx.lineTo(bx, by + 8);
  ctx.quadraticCurveTo(bx, by, bx + 8, by);
  ctx.closePath();
  ctx.fill();

  // Border
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Tail pointing left toward Kickbot
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.beginPath();
  ctx.moveTo(bx, by + bubbleH * 0.35);
  ctx.lineTo(bx - 14, by + bubbleH * 0.45);
  ctx.lineTo(bx, by + bubbleH * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bx, by + bubbleH * 0.35);
  ctx.lineTo(bx - 14, by + bubbleH * 0.45);
  ctx.lineTo(bx, by + bubbleH * 0.55);
  ctx.stroke();

  // Text in dark color on white bubble
  drawPixelText(text, bx + 12, by + 10, scale, "#111111");
}

function drawPlayerCharacter() {
  const p = game.player;
  const charCanvas = assets.characters[game.selectedIndex];

  // Position: lower-center, slightly left — behind view
  const baseX = W / 2 - 100;
  const baseY = 300;
  const drawW = 140;
  const drawH = 160;
  const dx = baseX + p.offsetX;
  const dy = baseY + p.offsetY;

  if (charCanvas) {
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    // Pivot from the character's feet (bottom-center)
    ctx.translate(dx + drawW / 2, dy + drawH);
    ctx.rotate(p.rotation);
    ctx.scale(-1 * (p.scaleX || 1), 1); // mirror + squash/stretch
    ctx.drawImage(charCanvas, -drawW / 2, -drawH, drawW, drawH);
    ctx.restore();
  } else {
    ctx.fillStyle = "#3a5080";
    ctx.fillRect(dx, dy, drawW, drawH);
    ctx.fillStyle = "#5a80c0";
    ctx.fillRect(dx + 20, dy + 20, drawW - 40, drawH - 40);
  }
}

function drawTimingBar() {
  const barY = H - 40;
  const barH = 20;
  const barX = 100;
  const barW = W - 200;

  // Bar background
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(barX, barY, barW, barH);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barW, barH);

  // Hit zone (outer red)
  const hitZoneHalf = 0.12;
  const hitLeft = barX + (0.5 - hitZoneHalf) * barW;
  const hitW = hitZoneHalf * 2 * barW;
  ctx.fillStyle = "rgba(255, 61, 110, 0.35)";
  ctx.fillRect(hitLeft, barY, hitW, barH);

  // Perfect zone (inner gold)
  const perfectZoneHalf = 0.05;
  const perfLeft = barX + (0.5 - perfectZoneHalf) * barW;
  const perfW = perfectZoneHalf * 2 * barW;
  ctx.fillStyle = "rgba(255, 216, 74, 0.5)";
  ctx.fillRect(perfLeft, barY, perfW, barH);

  // Zone borders
  ctx.strokeStyle = "#ff3d6e";
  ctx.lineWidth = 2;
  ctx.strokeRect(hitLeft, barY, hitW, barH);
  ctx.strokeStyle = "#ffd84a";
  ctx.lineWidth = 2;
  ctx.strokeRect(perfLeft, barY, perfW, barH);

  // Cursor/marker
  const cursorX = barX + game.barPos * barW;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cursorX - 3, barY - 4, 6, barH + 8);
  ctx.fillStyle = "#ffd84a";
  ctx.fillRect(cursorX - 1, barY - 2, 2, barH + 4);
}

function drawHUD() {
  const boss = BOSSES[game.bossIndex];

  // Left side: Score, Combo, Speed
  drawPixelText("SCORE " + game.score, 16, 12, 3, "#f2f2f2");
  if (game.combo > 1) drawPixelText("COMBO " + game.combo, 16, 38, 2, "#9db2d8");
  drawPixelText("SPEED " + game.speedFactor.toFixed(1) + "X", 16, 56, 2, "#ffd84a");

  // Center: Level number only
  drawPixelTextCentered("LVL " + (game.bossIndex + 1), W / 2, 12, 3, boss.tint);

  // Right side: Boss HP bar with label
  drawPixelText("BOSS HP", W - 210, 8, 2, "#9db2d8");
  const hpBarW = 130;
  const hpBarH = 10;
  const hpBarX = W - 210;
  const hpBarY = 24;
  const hitsLeft = boss.hitsToAdvance - game.hitsOnBoss;
  const hpFraction = hitsLeft / boss.hitsToAdvance;

  ctx.fillStyle = "#1b2542";
  ctx.fillRect(hpBarX, hpBarY, hpBarW, hpBarH);
  ctx.fillStyle = hpFraction > 0.5 ? "#44cc66" : hpFraction > 0.25 ? "#ffd84a" : "#ff3d6e";
  ctx.fillRect(hpBarX, hpBarY, hpBarW * hpFraction, hpBarH);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.strokeRect(hpBarX, hpBarY, hpBarW, hpBarH);
  drawPixelText(hitsLeft + " LEFT", hpBarX + hpBarW + 6, hpBarY, 2, "#9db2d8");

  // Current rank (if earned)
  if (game.rankIndex >= 0) {
    drawPixelText(RANKS[game.rankIndex].title, 16, 72, 2, "#ffd84a");
  }

  // Circular timer — bottom left, fills clockwise, changes color
  const timerRadius = 22;
  const timerCX = 36;
  const timerCY = H - 36;
  const progress = Math.min(game.gameTime / game.gameDuration, 1);
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + progress * Math.PI * 2;

  // Color shifts: blue → yellow → red as time runs out
  let timerColor;
  if (progress < 0.5) timerColor = "#4488ff";
  else if (progress < 0.8) timerColor = "#ffd84a";
  else timerColor = "#ff3d6e";

  // Dark background circle
  ctx.beginPath();
  ctx.arc(timerCX, timerCY, timerRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#1b2542";
  ctx.fill();
  ctx.strokeStyle = "#334466";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Filled arc showing elapsed time
  if (progress > 0) {
    ctx.beginPath();
    ctx.moveTo(timerCX, timerCY);
    ctx.arc(timerCX, timerCY, timerRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = timerColor;
    ctx.fill();
  }

}

function drawHitText() {
  if (game.hitTextTimer <= 0) return;
  const alpha = Math.min(1, game.hitTextTimer / 0.3);
  const yOff = (1.2 - game.hitTextTimer) * -30; // float upward
  const scale = game.hitText === "PERFECT!" ? 5 : 4;
  const color = game.hitText === "PERFECT!" ? "#ffd84a" : "#ffffff";

  ctx.globalAlpha = alpha;
  drawPixelTextCentered(game.hitText, game.hitTextX, game.hitTextY + yOff, scale, color);
  ctx.globalAlpha = 1;
}

function drawScreenFlash() {
  // Ultra flash: bright white blast that fades fast
  if (game.ultraFlash > 0) {
    ctx.globalAlpha = game.ultraFlash * 0.8;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
  // Gold afterglow for hit flash
  if (game.hitFlash > 0) {
    ctx.globalAlpha = game.hitFlash / 0.15 * 0.3;
    ctx.fillStyle = "#ffd84a";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
}

function drawParticles() {
  for (const p of game.particles) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
  }
  ctx.globalAlpha = 1;
}

function drawBanner() {
  if (game.bannerTimer <= 0) return;
  const alpha = Math.min(1, game.bannerTimer / 0.5);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, H / 2 - 40, W, 80);
  drawPixelTextCentered(game.banner, W / 2, H / 2 - 14, 4, "#ffd84a");
  ctx.globalAlpha = 1;
}

// ---- Main Render ----

function renderGameScreen() {
  const shakeX = game.shake > 0.1 ? (Math.random() - 0.5) * game.shake : 0;
  const shakeY = game.shake > 0.1 ? (Math.random() - 0.5) * game.shake : 0;
  ctx.save();
  ctx.translate(shakeX, shakeY);

  drawBackground();
  drawKickbot();
  drawPlayerCharacter();
  drawTimingBar();
  drawHUD();
  drawParticles();
  drawHitText();
  drawScreenFlash();
  drawBanner();

  ctx.restore();
}

// ---- Medal Drawing ----

function drawMedal(cx, cy, tier) {
  // tier: 0=bronze, 1=silver, 2=gold, 3=platinum, 4=diamond
  const colors = [
    { main: "#cd7f32", dark: "#8b5a2b", light: "#e8a860", ribbon: "#cc3333" }, // bronze
    { main: "#c0c0c0", dark: "#808080", light: "#e0e0e0", ribbon: "#3366cc" }, // silver
    { main: "#ffd700", dark: "#b8860b", light: "#fff44f", ribbon: "#cc3333" }, // gold
    { main: "#e5e4e2", dark: "#a0a0a8", light: "#ffffff", ribbon: "#6633cc" }, // platinum
    { main: "#b9f2ff", dark: "#4fc3f7", light: "#ffffff", ribbon: "#ff3399" }, // diamond
  ];
  const c = colors[Math.min(tier, colors.length - 1)];
  const t = game.blinkTimer;

  // Laurel wreaths — complexity increases with tier
  if (tier >= 1) drawLaurels(cx, cy, tier, c);

  // Ribbon
  ctx.fillStyle = c.ribbon;
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy - 8);
  ctx.lineTo(cx - 22, cy + 20);
  ctx.lineTo(cx - 6, cy + 12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 14, cy - 8);
  ctx.lineTo(cx + 22, cy + 20);
  ctx.lineTo(cx + 6, cy + 12);
  ctx.closePath();
  ctx.fill();

  // Medal disc
  const radius = 24 + tier * 3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = c.main;
  ctx.fill();
  ctx.strokeStyle = c.dark;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Inner circle
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 6, 0, Math.PI * 2);
  ctx.strokeStyle = c.dark;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Shine highlight
  ctx.beginPath();
  ctx.arc(cx - 6, cy - 6, radius * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = c.light;
  ctx.globalAlpha = 0.4 + Math.sin(t * 3) * 0.15;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Star in center for gold+ tiers
  if (tier >= 2) {
    ctx.fillStyle = c.light;
    drawStar(cx, cy, 10 + tier, 5 + tier * 0.5);
  }

  // Diamond sparkle effect for tier 4
  if (tier >= 4) {
    for (let i = 0; i < 6; i++) {
      const angle = t * 2 + i * Math.PI / 3;
      const dist = radius + 10 + Math.sin(t * 4 + i) * 4;
      const sx = cx + Math.cos(angle) * dist;
      const sy = cy + Math.sin(angle) * dist;
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.5 + Math.sin(t * 5 + i * 2) * 0.4;
      drawStar(sx, sy, 4, 2);
      ctx.globalAlpha = 1;
    }
  }
}

function drawLaurels(cx, cy, tier, c) {
  const leafCount = 3 + tier * 2; // more leaves per tier
  const spread = 30 + tier * 8;

  ctx.fillStyle = tier >= 3 ? "#ffd700" : "#4a8c3f";
  const darkLeaf = tier >= 3 ? "#b8860b" : "#2d5a27";

  // Left branch
  for (let i = 0; i < leafCount; i++) {
    const frac = i / (leafCount - 1);
    const angle = -Math.PI * 0.7 + frac * Math.PI * 0.5;
    const bx = cx - spread + Math.cos(angle) * spread;
    const by = cy + Math.sin(angle) * spread;

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle + Math.PI * 0.3);
    // Leaf shape
    ctx.fillStyle = (i % 2 === 0) ? c.main : darkLeaf;
    ctx.beginPath();
    ctx.ellipse(0, 0, 4 + tier, 8 + tier * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Right branch (mirror)
  for (let i = 0; i < leafCount; i++) {
    const frac = i / (leafCount - 1);
    const angle = -Math.PI * 0.3 - frac * Math.PI * 0.5;
    const bx = cx + spread + Math.cos(angle) * spread;
    const by = cy + Math.sin(angle) * spread;

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle - Math.PI * 0.3);
    ctx.fillStyle = (i % 2 === 0) ? c.main : darkLeaf;
    ctx.beginPath();
    ctx.ellipse(0, 0, 4 + tier, 8 + tier * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Stems
  ctx.strokeStyle = darkLeaf;
  ctx.lineWidth = 2;
  // Left stem
  ctx.beginPath();
  ctx.arc(cx - spread, cy, spread, -Math.PI * 0.7, -Math.PI * 0.2);
  ctx.stroke();
  // Right stem
  ctx.beginPath();
  ctx.arc(cx + spread, cy, spread, -Math.PI * 0.8, -Math.PI * 0.3);
  ctx.stroke();
}

// ---- Award Screen ----

function drawAwardScreen() {
  const t = game.blinkTimer;

  // Dark background with warm tone
  ctx.fillStyle = "#080412";
  ctx.fillRect(0, 0, W, H);

  // Rotating golden rays from center
  ctx.save();
  ctx.translate(W / 2, 220);
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2 + t * 0.2;
    const alpha = 0.025 + Math.sin(t * 1.5 + i) * 0.012;
    ctx.fillStyle = `rgba(255, 216, 74, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * 500, Math.sin(angle) * 500);
    ctx.lineTo(Math.cos(angle + 0.12) * 500, Math.sin(angle + 0.12) * 500);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // --- Magnificent Scrondo on the left, presenting the award ---
  if (assets.scrondo) {
    const sw = 160;
    const sh = 200;
    const sx = 50;
    const sy = 180 + Math.sin(t * 1.5) * 4;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(assets.scrondo, sx, sy, sw, sh);
    // Scrondo's name
    drawPixelTextCentered("MAGNIFICENT", sx + sw / 2, sy + sh + 6, 2, "#c6a7ff");
    drawPixelTextCentered("SCRONDO", sx + sw / 2, sy + sh + 22, 2, "#c6a7ff");
  }

  // --- Player character on the right ---
  const charCanvas = assets.characters[game.selectedIndex];
  if (charCanvas) {
    const cw = 100;
    const ch = 130;
    const cx = W - 50 - cw;
    const cy = 220 + Math.sin(t * 2) * 3;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(charCanvas, cx, cy, cw, ch);
    drawPixelTextCenteredMultiline(CHARACTERS[game.selectedIndex].name, cx + cw / 2, cy + ch + 6, 2, "#9db2d8");
  }

  // --- Center: Header + Stats + Medal ---
  drawPixelTextCentered("TIME'S UP!", W / 2, 20, 5, "#ff3d6e");

  drawPixelTextCentered("FINAL SCORE: " + game.score, W / 2, 72, 3, "#ffffff");
  const displayLevel = game.rankIndex >= 0 ? game.rankIndex + 1 : 1;
  drawPixelTextCentered("LEVEL " + displayLevel, W / 2, 100, 3, "#5effd8");

  // Medal(s) + Rank in center — number of medals = level number
  if (game.rankIndex >= 0) {
    const rank = RANKS[game.rankIndex];
    const medalCount = game.rankIndex + 1; // level 1=1, level 2=2, etc.
    const medalSize = 83;
    const medalGap = 8;
    const totalW = medalCount * medalSize + (medalCount - 1) * medalGap;
    const startX = W / 2 - totalW / 2;
    const medalY = 200 - medalSize / 2;
    ctx.imageSmoothingEnabled = false;
    if (assets.goldenBootMedal) {
      for (let i = 0; i < medalCount; i++) {
        const mx = startX + i * (medalSize + medalGap);
        const bob = Math.sin(game.blinkTimer * 2 + i * 0.5) * 3;
        ctx.drawImage(assets.goldenBootMedal, mx, medalY + bob, medalSize, medalSize);
      }
    }
    drawPixelTextCentered(rank.title, W / 2, 270, 3, "#ffd84a");

    // Scrondo's award speech — one per session, based on score
    const speeches = [
      "SCRONDO IS IMPRESSED!",
      "THAT'S WHAT SCRANDO'S TALKIN' A BOOT!",
      "TRICKY KICKS, BOOT BLASTER!",
      "THEY DON'T KICK LIKE THAT IN ST. LOUIS!",
      "LET'S GET ICE CREAM, AND EAT IT BY KICKING",
    ];
    const speechIdx = game.score % speeches.length;
    drawPixelTextCentered(speeches[speechIdx], W / 2, 310, 2, "#c6a7ff");
  } else {
    drawPixelTextCentered("NO RANK EARNED", W / 2, 200, 3, "#666");
    drawPixelTextCentered("SCRONDO IS DISAPPOINTED.", W / 2, 240, 2, "#c6a7ff");
  }

  // Play again prompt
  if (Math.floor(t * 2.5) % 2 === 0) {
    drawPixelTextCentered("PRESS SPACE TO PLAY AGAIN", W / 2, H - 28, 3, "#ffffff");
  }
}

function drawInstructionsScreen() {
  const t = game.blinkTimer;

  // Dark stage background
  drawBackground();

  // Draw letskick.png centered in upper portion
  if (assets.letsKick) {
    const img = assets.letsKick;
    const targetW = 300;
    const scale = targetW / img.width;
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const x = (W - drawW) / 2;
    const y = 30;
    ctx.drawImage(img, x, y, drawW, drawH);
  }

  // Instructions text
  drawPixelTextCentered("SPACE = KICK", W / 2, 270, 3, "#ffd84a");
  drawPixelTextCentered("SHIFT + SPACE = ULTRAKICK", W / 2, 310, 3, "#ffd84a");

  // Blinking prompt
  if (Math.floor(t * 2.5) % 2 === 0) {
    drawPixelTextCentered("PRESS SPACE TO BEGIN", W / 2, H - 28, 3, "#ffffff");
  }
}

function render() {
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = false;

  switch (game.screen) {
    case "title":
      drawTitleScreen();
      break;
    case "select":
      drawSelectScreen();
      break;
    case "instructions":
      drawInstructionsScreen();
      break;
    case "game":
      renderGameScreen();
      break;
    case "award":
      drawAwardScreen();
      break;
  }
}

// ---- Game Loop ----

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05); // cap at 50ms
  lastTime = timestamp;

  if (game.screen === "game") {
    tick(dt);
  } else {
    game.blinkTimer += dt;
  }

  render();
  requestAnimationFrame(loop);
}

// ---- Start ----

// Start the game loop immediately (renders with whatever assets are ready)
requestAnimationFrame(loop);
// Load assets in background — sprites appear as they load
loadAssets(() => {});
// Try to start title music (browser may block until user interacts)
try { ensureAudio(); startTitleMusic(); } catch(e) {}
