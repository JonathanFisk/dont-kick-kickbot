# Don't Kick Kickbot — Complete Game Documentation

## Summary

Browser-based, 8-bit arcade game inspired by Punch-Out!!. The player uses a timing bar to kick a big, pixel-art robotic rabbit ("Kickbot"). Playable on **desktop** (keyboard) and **mobile/tablet** (touch) — the canvas stays 800x500 internally with touch UI layered on top for touch devices. Features a title screen, character selection, instructions screen, 5 boss phases with unique visual accessories, combo scoring, speed ramp, an Ultra Kick mechanic, a 60-second game timer, an award ceremony screen with medals/ranks presented by "Magnificent Scrondo," chiptune music per screen, audio SFX, and high-pitched text-to-speech taunts.

---

## Target Platform

- **Web browser** (desktop + mobile)
- **Input**: Keyboard (desktop) or touch (mobile/tablet)
- **Rendering**: HTML5 Canvas (800 x 500), pixel-art aesthetic
- **Canvas setting**: `imageSmoothingEnabled = false` throughout
- **Frame rate**: `requestAnimationFrame` (browser refresh rate), dt capped at 50 ms
- **Mobile**: Viewport hardened (no zoom/scroll), orientation overlay suggests landscape, optional fullscreen + landscape lock on game start

---

## Project Files

| File | Purpose |
|------|---------|
| `index.html` | Single-page entry, loads `style.css` + `script.js`, contains canvas + sound toggle button + orientation overlay div |
| `style.css` | Arcade cabinet layout, dark theme, pixelated canvas rendering, responsive, mobile viewport hardening, orientation overlay |
| `script.js` | All game logic, rendering, audio, animation, keyboard input, and touch input handling |
| `DONT_KICK_KICKBOT.md` | This documentation file |
| `index_old.html` | Archived previous version |
| `script_old.js` | Archived previous version |
| `style_old.css` | Archived previous version |

---

## Assets

All stored in `assets/`. PNGs have transparent backgrounds.

### Images (Loaded)

| File | Used For |
|------|----------|
| `titlesplash.png` | Title screen (loaded but not rendered — custom title screen is drawn instead) |
| `kickbot.png` | Main Kickbot sprite, displayed in title screen + gameplay |
| `logo.png` | Title screen logo image (upper-left) |
| `letskick.png` | Instructions screen splash image |
| `goldenbootmedal.png` | Golden boot medal image on award screen |
| `boots.png` | Player character: Boots |
| `squash.png` | Player character: Squash |
| `bonsoo.png` | Player character: Bonsoo |
| `dropkickmary.png` | Player character: Dropkick Mary |
| `scrondo.png` | Award screen presenter: Magnificent Scrondo |

### Audio (Loaded)

| File | Used For |
|------|----------|
| `grimace.m4a` | Kickbot pain sound on hit (plays 200 ms after punch) |
| `Kickbot grimace 02.wav` | Secondary grimace sound (used on Ultra Kick hit + award screen replay) |
| `punch.mp3` | Impact sound on successful kick |
| `woosh.mp3` | Whiff sound on miss |
| `gong.mp3` | Gong sound when confirming character selection |
| `whip.mp3` | Whip sound when cycling through characters on select screen |
| `ultra kick voice title.mp3` | Voice clip on Ultra Kick activation |
| `ultra kick mouth harp.mp3` | Mouth harp sting after Ultra Kick lands (300 ms delay) |

### Assets (In Folder but NOT Loaded)

| File | Notes |
|------|-------|
| `reward boot.png` | Present in assets folder, not referenced in code |

---

## Game Screens & Flow

```
TITLE  --[Space/Tap]-->  SELECT  --[Space/Tap]-->  INSTRUCTIONS  --[Space/Tap]-->  GAMEPLAY (60s)  --[timer]-->  AWARD
                           ^                                                                                       |
                           |_______________________________________[Space/Tap]_____________________________________|
```

### 1) Title Screen (`game.screen = "title"`)

- **Background**: Solid dark (#0a0818) with rotating subtle blue rays, scanline overlay, confetti shower (40 particles in 5 colors)
- **Kickbot**: Large sprite (280 x 340) in upper-right corner, bobbing + slight rotation sway, with 5 orbiting gold stars
- **Logo**: `logo.png` displayed upper-left (190 px tall, proportional width), with subtle vertical bob
- **Characters**: All 4 characters lined up along the bottom with idle bob + sway animations, names displayed below each in #9db2d8
  - Order (left to right): Dropkick Mary, Bonsoo, Squash, Boots
- **Prompt**: Blinking at bottom center (toggles at 2.5 Hz)
  - Desktop: "PRESS SPACE"
  - Touch: "TAP TO START"
- **Pulsing glow**: Subtle radial gradient behind the title
- **Music**: Title music starts on first user interaction (keydown, click, or touchstart)
- **Transition**: Space or Tap → Character Select

### 2) Character Select Screen (`game.screen = "select"`)

- **Background**: Dark stage with perspective grid floor
- **Header**: "CHOOSE YOUR KICKER" in gold pixel text (scale 4)
- **Character portraits**: 4 characters displayed as 120 x 160 images, side by side with 30 px gaps, centered at y=100
- **Selection highlight**: Yellow (#ffd84a) 4 px stroke border around selected character
- **Character names**: Displayed below portraits, gold when selected, #9db2d8 otherwise
- **Instructions** (conditional):
  - Desktop: "ARROWS TO MOVE" (white) + "SPACE TO LOCK IN" (gold)
  - Touch: "TAP CHARACTER TO SELECT" (white) + "TAP AGAIN TO LOCK IN" (gold)
- **Touch arrow indicators**: Pulsing gold triangles on left/right screen edges (touch devices only)
- **Input**:
  - Desktop: Left/Right arrows cycle selection, Space confirms
  - Touch: Tap portrait to select, tap selected portrait to confirm, tap left/right halves as fallback, swipe left/right (>50 px threshold)
- **Sound**: Whip sound on character change, gong sound on confirm
- **Music**: Select music plays
- **Transition**: Space/Tap on selected → Instructions screen

### 3) Instructions Screen (`game.screen = "instructions"`)

- **Background**: Dark stage with perspective grid floor
- **Image**: `letskick.png` centered in upper portion (300 px wide, proportionally scaled)
- **Instructions** (conditional):
  - Desktop: "SPACE = KICK" + "SHIFT + SPACE = ULTRAKICK"
  - Touch: Visual mockups of the KICK button (blue) and ULTRA button (red) with labels "= KICK" and "= ULTRAKICK"
- **Prompt**: Blinking at bottom center
  - Desktop: "PRESS SPACE TO BEGIN"
  - Touch: "TAP TO BEGIN"
- **Transition**: Space or Tap → Gameplay (resets game timer, starts music; on touch also requests fullscreen + landscape lock)

### 4) Gameplay Screen (`game.screen = "game"`)

- **Duration**: 60 seconds (`game.gameDuration`)
- **Background**: Dark stage (#0b1020) with perspective grid floor (starts at y=350), horizontal lines every 18 px, converging vertical lines, subtle spotlight gradient
- **Kickbot**: Centered, with boss-specific tint/accessories/aura, idle bob
- **Player character**: Lower-center (slightly left), mirrored horizontally, with animation states
- **Timing bar**: At bottom of screen (y = H-40), 600 px wide
- **HUD**: Score, combo, speed, level, boss HP bar, circular timer, rank
- **Touch buttons** (touch only): Two stacked buttons at bottom-right — blue KICK button (x:680 y:330) and red ULTRA KICK button (x:680 y:390), both 100x50 px. Dim when player is mid-animation, light up when idle.
- **Transition**: Timer expires → Award screen

### 5) Award Screen (`game.screen = "award"`)

- **Background**: Dark (#080412) with rotating golden rays from center
- **Left side**: Magnificent Scrondo sprite (160 x 200, bobbing) with name below in purple
- **Right side**: Selected player character (100 x 130, bobbing) with name below
- **Center**: "TIME'S UP!" header (red, scale 5), final score + level reached, golden boot medal(s) from `goldenbootmedal.png` (count = level number), rank title in gold, Scrondo speech in purple
- **Prompt**: Blinking at bottom
  - Desktop: "PRESS SPACE TO PLAY AGAIN"
  - Touch: "TAP TO PLAY AGAIN"
- **Music**: Victory fanfare loop
- **Transition**: Space or Tap → Character Select (full game state reset)

---

## Core Mechanics

### Timing Bar

- Horizontal bar at bottom of screen, sweeps left-right continuously (position 0.0 → 1.0)
- **Base speed**: 0.6 full sweeps per second
- **Effective speed**: `baseSpeed * speedFactor`
- White cursor/marker moves along the bar
- Player presses Space (or taps) when cursor is within the target zones (centered at 0.5)

### Target Zones

| Zone | Half-width | Visual |
|------|-----------|--------|
| **Hit** (outer) | ±0.12 | Red tinted (#ff3d6e, 35% alpha) with red border |
| **Perfect** (inner) | ±0.05 | Gold tinted (#ffd84a, 50% alpha) with gold border |

### Scoring

- **Hit**: `150 * 1.5^combo`
- **Perfect**: `250 * 1.5^combo`
- **Ultra Kick**: 2x multiplier on the base calculation
- Combo increments on hit, **resets to 0** on miss
- Score is floored to integer

### Speed Ramp

- On hit: `speedFactor = 1 + combo * 0.20 + boss.speedBonus`
- On miss: `speedFactor = 1 + boss.speedBonus` (combo resets so speed drops)
- Gets brutal fast — by combo 5 the bar is moving at 2.0x + boss bonus

### Ultra Kick

- **Desktop activation**: Hold Shift and press Space during gameplay (player must be idle)
- **Touch activation**: Tap the ULTRA KICK button (bottom-right of screen, only visible on touch devices)
- **Animation**: Player spins 3 full rotations over 0.6 s (ultraspin state), then transitions to normal windup → strike → recover
- **Audio**: Plays `ultra kick voice title.mp3` immediately, `ultra kick mouth harp.mp3` 300 ms after landing
- **On hit**:
  - Counts as **2 hits** toward boss advancement
  - Earthquake shake (20 intensity, 1.0 s duration)
  - Extra particles (30 gold + 20 red + 15 white)
  - Stars last 3.0 s (vs 1.5 s normal)
  - Screen flash 0.25 s
  - 2x score multiplier
- **On miss**: Normal miss behavior (stumble, taunt, combo reset)

---

## Boss System

### Boss Phases

| # | Name | Hits to Advance | Speed Bonus | Tint Color | Accessory |
|---|------|-----------------|-------------|------------|-----------|
| 1 | KICKMASTER | 5 | +0.0 | #ff3d6e (red) | None (the rookie) |
| 2 | SUPER KICK FACE | 7 | +0.1 | #5effd8 (teal) | None |
| 3 | KICKY PANTZ | 9 | +0.2 | #ffd84a (gold) | Angular sunglasses with dark lenses |
| 4 | DOOZY DIPPER | 11 | +0.3 | #c6a7ff (purple) | Mohawk spikes (5 spikes) |
| 5 | SHOE HEAD | 13 | +0.4 | #ff8ad1 (pink) | Evil crown with jewel + pulsing red eyes |

### Boss Visual Scaling

- Each boss is slightly larger: `scale = 1 + bossIndex * 0.06`
- Boss aura glow radius increases: `100 + bossIndex * 30`
- Boss tint overlay applied via cached offscreen canvas (alpha: `0.12 + bossIndex * 0.04`)
- Boss position shifts up slightly: `y offset -= bossIndex * 8`

### Boss Advancement

- Tracking: `game.hitsOnBoss` increments per successful kick (2 for Ultra Kick)
- When hits reach threshold: advance to next boss, reset hit counter
- Banner displayed: "LEVEL X: BOSS NAME" for 3.0 s
- Taunt bubble: "NEXT BOT IN." for 2.5 s
- Tint cache invalidated for new boss color
- Final boss beaten: "ULTIMATE KICKLORD!" banner

---

## Rank System

Ranks are earned by defeating bosses. Each boss beaten awards the corresponding rank.

| Boss Beaten | Rank Title | Medal Tier |
|-------------|-----------|------------|
| KICKMASTER | JR. KICKY WICK | Bronze |
| SUPER KICK FACE | SUBBOOTER | Silver |
| KICKY PANTZ | CAPT. O' KICK'N | Gold |
| DOOZY DIPPER | GRAND FOOTFRAPPER | Platinum |
| SHOE HEAD | ULTIMATE KICKLORD | Diamond |

Current rank is displayed in the HUD (bottom-left, gold text) and on the award screen with a medal.

### Medal Visuals (Award Screen)

- **All tiers**: Ribbon (two triangular tails) + circular disc with inner ring + shine highlight
- **Silver+**: Laurel wreaths with increasing leaf count (`3 + tier * 2` leaves per branch)
- **Gold+**: Star shape in center of medal
- **Platinum+**: Golden laurel leaves instead of green
- **Diamond**: 6 orbiting sparkle stars

---

## Player Character

### Characters

| Key | Name | Sprite |
|-----|------|--------|
| boots | BOOTS | `assets/boots.png` |
| squash | SQUASH | `assets/squash.png` |
| bonsoo | BONSOO | `assets/bonsoo.png` |
| dropkickmary | DROPKICK MARY | `assets/dropkickmary.png` |

### Position

- Base position: lower-center, slightly left of center (`W/2 - 100, 300`)
- Drawn at 140 x 160, mirrored horizontally (`scaleX = -1`)
- Pivot point: bottom-center (feet)

### Animation States

| State | Trigger | Duration | Description |
|-------|---------|----------|-------------|
| `idle` | Default | Continuous | Gentle vertical bob (`sin(t*3) * 2`) |
| `ultraspin` | Ultra Kick | 0.6 s | 3 full rotations, bobs upward in arc, transitions to `windup` |
| `windup` | Kick (or after ultraspin) | 0.1 s | Crouch back (offsetX: -25, lean back -0.15 rad, slight squash). **Kick check happens at end.** |
| `strike` | After windup | 0.28 s | 3 phases: explosive lunge (0-0.08s), flip rotation (0.08-0.18s), hold at contact (0.18-0.28s) |
| `recover` | After strike | 0.3 s | Ease-out bounce back to idle position |
| `stumble` | On miss | 0.5 s | Stumble backward (-35 px) with slight wobble, then return |

---

## Kickbot

### Animation States

| State | Trigger | Duration | Description |
|-------|---------|----------|-------------|
| `idle` | Default | Continuous | Gentle vertical bob (`sin(t*2.5) * 2`) |
| `hit` | Successful kick | 0.5 s | Recoil backward 30 px (0.1 s), white flash overlay fading, return to position (0.4 s) |
| `taunt` | Miss | 1.0 s | Lean forward -15 px + scale up 8% (0.2 s), hold (0.5 s), return (0.3 s) |

### Hit Effects

- **Cross-eyes**: X-shaped eyes drawn over sprite during `hit` state
- **Orbiting stars**: 5 gold stars orbit the head in a flattened ellipse (1.5 s normal, 3.0 s ultra)

### Fallback Rendering

If `kickbot.png` fails to load, a simple pixel-art rectangle fallback is drawn (gray body, head, ears with pink inner, white belly, black eyes).

---

## Feedback & Effects

### On Hit

| Effect | Normal Hit | Perfect Hit | Ultra Kick Hit |
|--------|-----------|-------------|----------------|
| Screen shake | 4 intensity | 8 intensity | 20 intensity + 1.0 s earthquake |
| Screen flash | None | 0.15 s gold | 0.25 s gold |
| Particles | 10 gold | 18 gold + 10 red | 30 gold + 20 red + 15 white |
| Stars | 1.5 s | 1.5 s | 3.0 s |
| Cross-eyes | Yes | Yes | Yes |
| Sound | punch.mp3 + grimace (200 ms delay) + bell ding (1047 Hz) | punch.mp3 + grimace + bell ding (1320 Hz, louder) | Same as perfect + grimace02 (200 ms) + ultra harp (300 ms delay) |

### On Miss

- Player stumbles backward with wobble
- Kickbot leans forward (taunt state)
- Combo resets to 0
- Speed drops back to `1 + boss.speedBonus`
- `woosh.mp3` plays
- Taunt line spoken via TTS + shown in speech bubble

### Particles

- Spawn from impact point (center, y=240)
- Random angles and speeds (60-120 px/s)
- Gravity applied (100 px/s^2)
- Lifespan: 0.8-1.2 s, fade with remaining life
- Rendered as 4x4 pixel squares

### Speech Bubble

- White rounded rectangle with dark border, positioned right side of screen
- Tail/pointer pointing left toward Kickbot
- Text in dark pixel font (scale 3)
- Visible for 2.0 s per taunt (2.5 s on boss advance)
- Only appears on kick attempts (no idle taunts)

---

## Dialogue / Voice Lines

### Sore-Loser Lines (On Hit)

- "WINKY DOO!"
- "STOP THAT!"
- "THAT'S MY NUCKINS!"
- "NOT FAIR!"
- "RING A DING DING!"
- "SUPER HUPPA KICK!"
- "HACHY MACHY!"
- "CORN GRUBBER!"
- "RIGHT IN THE BISCUITS!"

### Miss Taunts (On Miss)

- "TRY AGAIN!"
- "TOO SLOW!"
- "YOU KICK LIKE A NOODLE."
- "MISS ME?"
- "YOU'VE GOT WAFFLE FOOT"
- "NAH NAH BOO GOO!"
- "YUBBA HUB"
- "MY GRAMMA USED TO KICK FOR THE DOLPHINS!"
- "GIVE UP, YOUNG HAMSTER"

### Scrondo Award Speeches (Award Screen)

- "SCRONDO IS IMPRESSED!"
- "THAT'S WHAT SCRANDO'S TALKIN' A BOOT!"
- "TRICKY KICKS, BOOT BLASTER!"
- "THEY DON'T KICK LIKE THAT IN ST. LOUIS!"
- "LET'S GET ICE CREAM, AND EAT IT BY KICKING"
- No rank earned: "SCRONDO IS DISAPPOINTED."

Speech index is `game.score % speeches.length`.

### Boss Advance Taunt

- "NEXT BOT IN." (shown in speech bubble for 2.5 s)

### TTS Voice Settings

- Engine: Browser `speechSynthesis`
- `pitch`: 2.0 (max chipmunk)
- `rate`: 1.9 (fast and frantic)
- `volume`: 1.0
- Previous utterance is cancelled before speaking new line

---

## Audio System

### Sound Toggle

- Button: top-right corner of cabinet, "SOUND: ON" / "SOUND: OFF"
- Disabling stops all music + cancels TTS
- Re-enabling restarts the appropriate music for the current screen

### Web Audio Context

- Created on first user interaction (keydown, click, or touchstart)
- Auto-resumes if suspended

### Synthesized Music

Each screen has its own chiptune melody loop built from Web Audio oscillators.

#### Title Music — "Dance of the Knights" (Prokofiev, C minor)
- **Style**: Heavy, menacing march — ominous staccato, dark and imposing
- **Waveform**: Square (dark stabbing brass) + triangle bass (octave below) + sine sub-bass
- **Structure**: 4 phrases x 16 notes (64 total), looping
  - Phrase A: Menacing march, heavy staccato
  - Phrase B: Darker chromatic descent
  - Phrase C: Rising threat
  - Phrase D: Ominous resolution
- **Rhythm**: Heavy march drum boom every 2 beats
- **Tempo**: 180 ms per beat

#### Character Select Music — "Entry of the Gods into Valhalla" (Wagner, D major)
- **Style**: Majestic brass Valhalla leitmotif, stately and grand
- **Waveform**: Triangle (warm sustained brass) + triangle bass + triangle 5th harmony
- **Structure**: 4 phrases x 16 notes (64 total), looping
  - Phrase A: Valhalla motif, broad brass statement
  - Phrase B: Majestic descent
  - Phrase C: Ascending the rainbow bridge (with octave shimmer + sub-bass)
  - Phrase D: Noble resolution back to tonic
- **Rhythm**: Timpani boom every 4 beats
- **Tempo**: 220 ms per beat

#### Gameplay Music — "Ride of the Valkyries" (Wagner, B minor)
- **Style**: Galloping triplet charge, warlike brass horn calls
- **Waveform**: Square (aggressive brass) + triangle bass (octave below)
- **Structure**: 4 phrases x 8 notes (32 total), looping
  - Phrase A: Galloping Valkyrie charge
  - Phrase B: Horn call soaring upward (with high harmony)
  - Phrase C: "Ho-jo-to-ho!" battle cry peak (with high harmony)
  - Phrase D: Thundering descent and reset
- **Boss scaling**: Pitch shifts up by `1 + bossIndex * 0.08`, volume increases by `0.005` per boss
- **Rhythm**: Galloping percussion every 3 beats
- **Tempo**: 160 ms per beat

#### Award Fanfare — Horn Concerto No. 4, K.495 (Mozart, Eb major)
- **Style**: Bright, jaunty horn Rondo theme, celebratory
- **Waveform**: Triangle melody + sine bass (0.5x frequency) + square shimmer on phrases B/D
- **Structure**: 4 phrases x 16 notes (64 total), looping
  - Phrase A: Famous horn Rondo call
  - Phrase B: Ascending answer, building joy
  - Phrase C: Playful descent
  - Phrase D: Triumphant wrap back to tonic
- **Rhythm**: Light tapping every 4 beats
- **Tempo**: 170 ms per beat

### SFX

| Sound | Source | Details |
|-------|--------|---------|
| Kick (hit) | `punch.mp3` | Volume 0.8 (normal) or 1.0 (perfect) |
| Grimace (pain) | `grimace.m4a` | Plays 200 ms after punch, volume 0.8 |
| Grimace 02 | `Kickbot grimace 02.wav` | Plays on Ultra Kick hit (200 ms delay) + on award screen replay, volume 0.8 |
| Bell ding | Synthesized sine | 1047 Hz (hit) or 1320 Hz (perfect), 0.4 s duration |
| Miss whoosh | `woosh.mp3` | Volume 0.7 |
| Laugh (miss) | Synthesized square | Two descending beeps (260 Hz -> 200 Hz) |
| Whoosh (swing) | Synthesized sawtooth | Frequency sweep 650 -> 140 Hz over 0.18 s |
| Gong | `gong.mp3` | Plays on character select confirm, volume 1.0 |
| Whip | `whip.mp3` | Plays on character selection change, volume 0.7 |
| Ultra voice | `ultra kick voice title.mp3` | Plays on Ultra Kick activation, volume 1.0 |
| Ultra harp | `ultra kick mouth harp.mp3` | Plays 300 ms after Ultra Kick lands, volume 1.0 |

---

## HUD (Gameplay Screen)

| Element | Position | Details |
|---------|----------|---------|
| Score | Top-left | "SCORE {n}" — white, scale 3 |
| Combo | Below score | "COMBO {n}" — #9db2d8, scale 2 (only shown when combo > 1) |
| Speed | Below combo | "SPEED {n.n}X" — gold, scale 2 |
| Level | Top-center | "LVL {n}" — boss tint color, scale 3 |
| Boss HP | Top-right | "BOSS HP" label + colored bar (green > 50%, gold > 25%, red <= 25%) + "{n} LEFT" |
| Rank | Below speed | Current rank title — gold, scale 2 (only if earned) |
| Timer | Bottom-left | Circular pie chart (radius 22), fills clockwise. Color: blue (<50%), gold (50-80%), red (>80%) |
| Kick button | Bottom-right (upper) | Touch devices only. Blue (#4488ff) button (100x50 px at x:680 y:330), teal border when available, dims when player is animating. "KICK" in pixel text. |
| Ultra Kick button | Bottom-right (lower) | Touch devices only. Red (#ff3d6e) button (100x50 px at x:680 y:390), pulsing gold border when available, dims when player is animating. "ULTRA KICK" in pixel text. |

---

## Mobile Touch Support

### Detection

- `isTouchDevice()` checks `"ontouchstart" in window || navigator.maxTouchPoints > 0`
- `showTouchUI` flag is set once at load — all touch-specific rendering and text is gated behind this flag
- Desktop users see zero changes

### Viewport & CSS Hardening

- **Viewport meta**: `maximum-scale=1, user-scalable=no, viewport-fit=cover`
- **Body**: `overflow: hidden; position: fixed; overscroll-behavior: none; 100dvh`
- **Canvas**: `touch-action: none; user-select: none`
- **Mobile media query** (`hover: none, pointer: coarse`): strips cabinet borders/padding/shadows, fills viewport, adds `env(safe-area-inset-*)` for notch handling

### Coordinate Mapping

`touchToCanvas(touch)` maps `touch.clientX/Y` to 800x500 canvas coordinates using `canvas.getBoundingClientRect()`.

### Touch Handlers

- `canvas.addEventListener("touchstart", ...)` with `{ passive: false }` — `e.preventDefault()` blocks zoom/scroll
- `canvas.addEventListener("touchend", ...)` — swipe detection for character select (>50 px horizontal threshold)

### Orientation Overlay

- `#orientationOverlay` div with phone rotate icon + "Rotate your phone for the best experience" message
- CSS-only: `display: flex` via `@media (max-width: 840px) and (orientation: portrait) and (hover: none) and (pointer: coarse)`
- No JavaScript needed — purely CSS media query driven

### Fullscreen & Orientation Lock

- `tryFullscreenLandscape()` called when transitioning from instructions → gameplay on touch
- Requests `document.documentElement.requestFullscreen()` (or webkit prefix)
- Requests `screen.orientation.lock("landscape")`
- Both fail silently if unsupported (wrapped in `.catch(() => {})`)

### Touch Buttons (Gameplay)

Two on-screen buttons are drawn on the canvas during gameplay — only when `showTouchUI` is true. Tapping elsewhere on the canvas does nothing during gameplay.

**KICK Button** (upper):
- Drawn via `drawKickButton()`, canvas coordinates: `{ x: 680, y: 330, w: 100, h: 50 }`
- **Available** (player idle): Blue (#4488ff) background, teal (#5effd8) border, white text
- **Unavailable** (player animating): Dark (#223355) background, dim border, muted text

**ULTRA KICK Button** (lower):
- Drawn via `drawUltraButton()`, canvas coordinates: `{ x: 680, y: 390, w: 100, h: 50 }`
- **Available** (player idle): Red (#ff3d6e) background, gold (#ffd84a) pulsing border, white text
- **Unavailable** (player animating): Dark (#552233) background, dim border, muted text

Hit detection: `isBtnTap(pos, btn)` checks if touch coordinates fall within either button's bounds.

### Touch Control Summary

| Screen | Touch Action | Replaces |
|--------|-------------|----------|
| Title | Tap anywhere | Space |
| Select | Tap portrait / swipe / tap halves | Arrows + Space |
| Instructions | Tap anywhere | Space |
| Gameplay | Tap KICK button = kick | Space |
| Gameplay | Tap ULTRA button = ultra kick | Shift+Space |
| Award | Tap anywhere | Space |

---

## Pixel Font System

Custom bitmap font rendered via Canvas `fillRect`.

- **Glyph size**: 5 columns x 7 rows per character
- **Supported characters**: A-Z, 0-9, `! ? . : - + ' , = / [space]`
- **Encoding**: Each row is a string of `"0"` and `"1"` (e.g., `"01110"`)
- **Functions**:
  - `drawPixelText(text, x, y, scale, color)` — draw left-aligned
  - `measurePixelText(text, scale)` — returns `{width, height}`
  - `drawPixelTextCentered(text, cx, y, scale, color)` — draw horizontally centered
  - `drawPixelTextCenteredMultiline(text, cx, y, scale, color)` — splits on spaces, one word per line
  - `drawPixelTextOutlined(text, x, y, scale, color, outlineColor)` — draw with 1-pixel outline in 8 directions

---

## Input Summary

### Keyboard (Desktop)

| Key | Title Screen | Character Select | Instructions | Gameplay | Award Screen |
|-----|-------------|-----------------|--------------|----------|--------------|
| **Space** | Go to Select | Lock in character | Start game | Attempt kick | Go to Select (replay) |
| **Shift+Space** | — | — | — | Ultra Kick | — |
| **Left Arrow** | — | Previous character | — | — | — |
| **Right Arrow** | — | Next character | — | — | — |

### Touch (Mobile)

| Gesture | Title Screen | Character Select | Instructions | Gameplay | Award Screen |
|---------|-------------|-----------------|--------------|----------|--------------|
| **Tap** | Go to Select | Select character (tap portrait) / Confirm (tap selected) / Navigate (tap halves) | Start game | — | Go to Select (replay) |
| **Tap KICK button** | — | — | — | Regular kick | — |
| **Tap ULTRA button** | — | — | — | Ultra Kick | — |
| **Swipe L/R** | — | Cycle characters | — | — | — |

- Kicks are blocked during animation (player state must be `idle`)
- First interaction (key, click, or touch) initializes Web Audio + starts title music

---

## Background Rendering

- **Stage**: Dark fill (#0b1020)
- **Floor**: Darker fill (#0f1628) starting at y=350
- **Horizontal grid lines**: #1a2540, every 18 px from floor to bottom
- **Perspective lines**: #151e35, 13 lines converging from bottom spread to center-top vanishing point (W/2, 200)
- **Spotlight**: Radial gradient from top-center, subtle blue-white glow

---

## White Background Removal Utility

Function `removeWhiteBackground(img)` exists in code for stripping white/near-white pixels from images via offscreen canvas pixel manipulation. Currently **not actively called** — all PNGs already have transparent backgrounds. Falls back to raw image on tainted canvas (file:// protocol CORS restriction).

---

## Game State Object

Key `game` properties:

| Property | Type | Description |
|----------|------|-------------|
| `screen` | string | `"title"` / `"select"` / `"instructions"` / `"game"` / `"award"` |
| `selectedIndex` | number | Currently selected character (0-3) |
| `score` | number | Cumulative score |
| `combo` | number | Current hit streak |
| `bossIndex` | number | Current boss (0-4) |
| `hitsOnBoss` | number | Hits landed on current boss |
| `barPos` | number | Timing bar position (0.0-1.0) |
| `barDir` | number | Bar direction (1 = right, -1 = left) |
| `baseSpeed` | number | Base sweep speed (0.6) |
| `speedFactor` | number | Current speed multiplier |
| `gameTime` | number | Elapsed game time in seconds |
| `gameDuration` | number | Total game duration (60 s) |
| `rankIndex` | number | Highest rank earned (-1 = none, 0-4) |
| `shake` | number | Screen shake intensity (decays at 20/s) |
| `earthquakeTimer` | number | Sustained shake duration (Ultra Kick) |
| `hitFlash` | number | Screen-wide gold flash timer |
| `ultraFlash` | number | Screen-wide white flash timer (Ultra Kick) |
| `particles` | array | Active particle effects |
| `tauntText` | string | Current speech bubble text |
| `tauntBubbleTimer` | number | Speech bubble visibility timer |
| `banner` | string | Boss advance banner text |
| `bannerTimer` | number | Banner visibility timer |
| `starsTimer` | number | Orbiting stars duration |
| `blinkTimer` | number | Title/award/instructions screen animation timer |

---

## Version History

| Version | Tag | Description |
|---------|-----|-------------|
| v1.0 | `v1.0-desktop-only` | Desktop-only, keyboard input, no touch support |
| v2.0 | `main` (current) | Added mobile touch support, orientation overlay, Ultra Kick button, conditional UI text, viewport hardening. Desktop unchanged. |

---

## Known Implementation Notes

- `titlesplash.png` is loaded but the title screen renders a custom layout instead of displaying it
- `reward boot.png` exists in assets folder but is not loaded or used
- There is a redundant `break` after the `stumble` case in `updatePlayerAnim` — harmless but dead code
- The `removeWhiteBackground` function exists but is never called
- Boss banner for boss 0 ("KICKMASTER") is never shown since you start on that boss
- Award screen Scrondo speech selection uses `score % speeches.length` which creates a deterministic-feeling pick based on final score
- Boss 2 ("SUPER KICK FACE") has no visual accessory despite the original design calling for a headband
