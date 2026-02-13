# Don't Kick Kickbot — Complete Game Documentation

## Summary

Browser-based, 8-bit arcade game inspired by Punch-Out!!. The player uses a timing bar and the **Space** key to kick a big, pixel-art robotic rabbit ("Kickbot"). Features a title screen, character selection, 5 boss phases with unique visual accessories, combo scoring, speed ramp, an Ultra Kick mechanic, a 90-second game timer, an award ceremony screen with medals/ranks presented by "Magnificent Scrondo," chiptune music per screen, audio SFX, and high-pitched text-to-speech taunts.

---

## Target Platform

- **Web browser** (desktop first, playable on laptop)
- **Input**: Keyboard only
- **Rendering**: HTML5 Canvas (800 x 500), pixel-art aesthetic
- **Canvas setting**: `imageSmoothingEnabled = false` throughout
- **Frame rate**: `requestAnimationFrame` (browser refresh rate), dt capped at 50 ms

---

## Project Files

| File | Purpose |
|------|---------|
| `index.html` | Single-page entry, loads `style.css` + `script.js`, contains canvas + sound toggle button |
| `style.css` | Arcade cabinet layout, dark theme, pixelated canvas rendering, responsive |
| `script.js` | All game logic, rendering, audio, animation, and input handling (~1985 lines) |
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
| `titlesplash.png` | Title screen (currently not rendered — custom title screen is drawn instead) |
| `kickbot.png` | Main Kickbot sprite, displayed in title screen + gameplay |
| `boots.png` | Player character: Boots |
| `squash.png` | Player character: Squash |
| `bonsoo.png` | Player character: Bonsoo |
| `dropkickmary.png` | Player character: Dropkick Mary |
| `scrondo.png` | Award screen presenter: Magnificent Scrondo |

### Audio (Loaded)

| File | Used For |
|------|----------|
| `grimace.m4a` | Kickbot pain sound on hit (plays 200 ms after punch) |
| `punch.mp3` | Impact sound on successful kick |
| `woosh.mp3` | Whiff sound on miss |
| `ultra kick voice title.mp3` | Voice clip on Ultra Kick activation |
| `ultra kick mouth harp.mp3` | Mouth harp sting after Ultra Kick lands (300 ms delay) |

### Audio (In Folder but NOT Loaded)

| File | Notes |
|------|-------|
| `gong.mp3` | Present in assets folder, not referenced in code |
| `whip.mp3` | Present in assets folder, not referenced in code |

---

## Game Screens & Flow

```
TITLE  --[Space]-->  CHARACTER SELECT  --[Space]-->  GAMEPLAY (90s)  --[timer expires]-->  AWARD
                         ^                                                                   |
                         |___________________________[Space]_________________________________|
```

### 1) Title Screen (`game.screen = "title"`)

- **Background**: Solid black with scanline overlay
- **Kickbot**: Large sprite (280 x 340) in upper-right corner, bobbing + slight rotation sway
- **Title text**: "DON'T KICK" in large white pixel text (scale 6), "KICKBOT!" in gold pixel text (scale 7) on a blue banner (#2060cc)
- **Characters**: All 4 characters lined up along the bottom with idle bob + sway animations, names displayed below each in #9db2d8
  - Order (left to right): Dropkick Mary, Bonsoo, Squash, Boots
- **Prompt**: "PRESS SPACE" blinking at bottom center (toggles at 2.5 Hz)
- **Pulsing glow**: Subtle radial gradient behind the title
- **Music**: Title music starts on first user interaction (keydown or click)
- **Transition**: Space → Character Select

### 2) Character Select Screen (`game.screen = "select"`)

- **Background**: Dark stage with perspective grid floor
- **Header**: "CHOOSE YOUR KICKER" in gold pixel text (scale 4)
- **Character portraits**: 4 characters displayed as 120 x 160 images, side by side with 30 px gaps, centered
- **Selection highlight**: Yellow (#ffd84a) 4 px stroke border around selected character
- **Character names**: Displayed below portraits, gold when selected, #9db2d8 otherwise
- **Instructions**: "ARROWS TO MOVE" (white) + "SPACE TO LOCK IN" (gold) at bottom
- **Input**: Left/Right arrows cycle selection, Space confirms
- **Music**: Select music plays
- **Transition**: Space → Gameplay (resets game timer to 0)

### 3) Gameplay Screen (`game.screen = "game"`)

- **Duration**: 90 seconds (`game.gameDuration`)
- **Background**: Dark stage (#0b1020) with perspective grid floor (starts at y=350), horizontal lines every 18 px, converging vertical lines, subtle spotlight gradient
- **Kickbot**: Centered, with boss-specific tint/accessories/aura, idle bob
- **Player character**: Lower-center (slightly left), mirrored horizontally, with animation states
- **Timing bar**: At bottom of screen (y = H-40), 600 px wide
- **HUD**: Score, combo, speed, level, boss HP bar, timer, rank
- **Transition**: Timer expires → Award screen

### 4) Award Screen (`game.screen = "award"`)

- **Background**: Dark (#080412) with rotating golden rays from center
- **Left side**: Magnificent Scrondo sprite (160 x 200, bobbing) with name below in purple
- **Right side**: Selected player character (100 x 130, bobbing) with name below
- **Center**: "TIME'S UP!" header (red, scale 5), final score + level reached, medal with laurels, rank title in gold, Scrondo speech in purple
- **Medal**: Tier-based (bronze → diamond) with increasing visual complexity (laurels, stars, sparkles)
- **Prompt**: "PRESS SPACE TO PLAY AGAIN" blinking at bottom
- **Music**: Victory fanfare loop
- **Transition**: Space → Character Select (full game state reset)

---

## Core Mechanics

### Timing Bar

- Horizontal bar at bottom of screen, sweeps left-right continuously (position 0.0 → 1.0)
- **Base speed**: 0.6 full sweeps per second
- **Effective speed**: `baseSpeed * speedFactor`
- White cursor/marker moves along the bar
- Player presses Space when cursor is within the target zones (centered at 0.5)

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

### Ultra Kick (Shift + Space)

- **Activation**: Hold Shift and press Space during gameplay (player must be idle)
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
| 2 | SUPER KICK FACE | 7 | +0.1 | #5effd8 (teal) | Headband with knot tails |
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
| `ultraspin` | Shift+Space | 0.6 s | 3 full rotations, bobs upward in arc, transitions to `windup` |
| `windup` | Space (or after ultraspin) | 0.1 s | Crouch back (offsetX: -25, lean back -0.15 rad, slight squash). **Kick check happens at end.** |
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
| Sound | punch.mp3 + grimace (200 ms delay) + bell ding (1047 Hz) | punch.mp3 + grimace + bell ding (1320 Hz, louder) | Same as perfect + ultra harp (300 ms delay) |

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
- Lifespan: 0.8–1.2 s, fade with remaining life
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

- Created on first user interaction (keydown or click)
- Auto-resumes if suspended

### Synthesized Music

Each screen has its own chiptune melody loop built from Web Audio oscillators.

#### Title Music
- **Style**: Triumphant, ascending — "Gonna Fly Now" inspired
- **Waveform**: Triangle (warm, brass-like)
- **Structure**: 4 phrases x 16 notes (64 total), looping
  - Phrase A: Horn fanfare, ascending 4ths/5ths
  - Phrase B: Soaring upward climb (with bass harmony)
  - Phrase C: Triumphant peak (with octave harmony + bass)
  - Phrase D: Driving rhythm, resolve back to base
- **Rhythm**: Kick drum every 4 beats, snare on 2 and 4
- **Tempo**: 170 ms per beat

#### Character Select Music
- **Style**: Training montage energy, motivational
- **Waveform**: Square (punchy) + triangle bass
- **Structure**: 4 phrases x 16 notes (64 total), looping
  - Phrase A: Punchy staccato
  - Phrase B: Building intensity
  - Phrase C: Quick ascending runs
  - Phrase D: Resolve with swagger
- **Rhythm**: Hi-hat every beat, kick on 1 & 3, snare on 2 & 4
- **Tempo**: 130 ms per beat

#### Gameplay Music
- **Style**: Dramatic arc — builds tension, releases, repeats
- **Waveform**: Alternates square (phrases A/C) and triangle (phrases B/D)
- **Structure**: 4 phrases x 8 notes (32 total), looping
  - Phrase A: Rising action
  - Phrase B: Tension peak (with harmony at 1.5x frequency)
  - Phrase C: Resolution drop
  - Phrase D: Dramatic stab + pauses (with harmony)
- **Boss scaling**: Pitch shifts up by `1 + bossIndex * 0.08`, volume increases by `0.005` per boss
- **Tempo**: 200 ms per beat

#### Award Fanfare
- **Style**: Victory celebration
- **Waveform**: Triangle melody + sine bass harmony (0.5x frequency)
- **Structure**: 36 notes, looping with pauses
- **Tempo**: 250 ms per beat

### SFX

| Sound | Source | Details |
|-------|--------|---------|
| Kick (hit) | `punch.mp3` | Volume 0.8 (normal) or 1.0 (perfect) |
| Grimace (pain) | `grimace.m4a` | Plays 200 ms after punch, volume 0.8 |
| Bell ding | Synthesized sine | 1047 Hz (hit) or 1320 Hz (perfect), 0.4 s duration |
| Miss whoosh | `woosh.mp3` | Volume 0.7 |
| Laugh (miss) | Synthesized square | Two descending beeps (260 Hz → 200 Hz) |
| Whoosh (swing) | Synthesized sawtooth | Frequency sweep 650 → 140 Hz over 0.18 s |
| Ultra voice | `ultra kick voice title.mp3` | Plays on Ultra Kick activation, volume 1.0 |
| Ultra harp | `ultra kick mouth harp.mp3` | Plays 300 ms after Ultra Kick lands, volume 1.0 |

---

## HUD (Gameplay Screen)

| Element | Position | Details |
|---------|----------|---------|
| Score | Top-left | "SCORE {n}" — white, scale 3 |
| Combo | Below score | "COMBO {n}" — #9db2d8, scale 2 |
| Speed | Below combo | "SPEED {n.n}X" — gold, scale 2 |
| Level | Top-center | "LVL {n}" — boss tint color, scale 3 |
| Timer | Below level | "{n}S" countdown — #9db2d8 (red when ≤10 s), scale 2 |
| Boss HP | Top-right | "BOSS HP" label + colored bar (green > 50%, gold > 25%, red ≤ 25%) + "{n} LEFT" |
| Rank | Below speed | Current rank title — gold, scale 2 (only if earned) |

---

## Pixel Font System

Custom bitmap font rendered via Canvas `fillRect`.

- **Glyph size**: 5 columns x 7 rows per character
- **Supported characters**: A–Z, 0–9, `! ? . : - + ' , / [space]`
- **Encoding**: Each row is a string of `"0"` and `"1"` (e.g., `"01110"`)
- **Functions**:
  - `drawPixelText(text, x, y, scale, color)` — draw left-aligned
  - `measurePixelText(text, scale)` — returns `{width, height}`
  - `drawPixelTextCentered(text, cx, y, scale, color)` — draw horizontally centered
  - `drawPixelTextCenteredMultiline(text, cx, y, scale, color)` — splits on spaces, one word per line

---

## Input Summary

| Key | Title Screen | Character Select | Gameplay | Award Screen |
|-----|-------------|-----------------|----------|--------------|
| **Space** | Go to Select | Lock in character | Attempt kick | Go to Select (replay) |
| **Shift+Space** | — | — | Ultra Kick | — |
| **Left Arrow** | — | Previous character | — | — |
| **Right Arrow** | — | Next character | — | — |
| **Click** | Unlock audio | — | — | — |

- Kicks are blocked during animation (player state must be `idle`)
- First interaction (key or click) initializes Web Audio + starts title music

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
| `screen` | string | `"title"` / `"select"` / `"game"` / `"award"` |
| `selectedIndex` | number | Currently selected character (0–3) |
| `score` | number | Cumulative score |
| `combo` | number | Current hit streak |
| `bossIndex` | number | Current boss (0–4) |
| `hitsOnBoss` | number | Hits landed on current boss |
| `barPos` | number | Timing bar position (0.0–1.0) |
| `barDir` | number | Bar direction (1 = right, -1 = left) |
| `baseSpeed` | number | Base sweep speed (0.6) |
| `speedFactor` | number | Current speed multiplier |
| `gameTime` | number | Elapsed game time in seconds |
| `gameDuration` | number | Total game duration (90 s) |
| `rankIndex` | number | Highest rank earned (-1 = none, 0–4) |
| `shake` | number | Screen shake intensity (decays at 20/s) |
| `earthquakeTimer` | number | Sustained shake duration (Ultra Kick) |
| `hitFlash` | number | Screen-wide gold flash timer |
| `particles` | array | Active particle effects |
| `tauntText` | string | Current speech bubble text |
| `tauntBubbleTimer` | number | Speech bubble visibility timer |
| `banner` | string | Boss advance banner text |
| `bannerTimer` | number | Banner visibility timer |
| `starsTimer` | number | Orbiting stars duration |
| `blinkTimer` | number | Title/award screen animation timer |

---

## Known Implementation Notes

- `titlesplash.png` is loaded but the title screen renders a custom layout instead of displaying it
- `gong.mp3` and `whip.mp3` exist in assets but are not loaded or used
- There is a redundant `break` after the `stumble` case in `updatePlayerAnim` (line ~1015) — harmless but dead code
- The `removeWhiteBackground` function exists but is never called
- Boss banner for boss 0 ("KICKMASTER") is never shown since you start on that boss
- Award screen Scrondo speech selection uses `score % speeches.length` which creates a deterministic-feeling pick based on final score
