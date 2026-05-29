# Conversation Log

This file records the working conversation that shaped Layered Living Light. It is a curated project log rather than a dump of internal command output, so it can be useful in GitHub as a reference for installation, design decisions, and future maintenance.

## Project Purpose

Layered Living Light is a participatory browser-based installation about endangered and threatened species of the Sunshine Coast. Visitors use AprilTag placards to contribute animals into a wide layered landscape. The scene responds with animal appearances, rare species moments, environmental companions, counters, ambient sound, and a day/night cycle.

## Initial Setup

- Started a local live version of the app at `http://localhost:5173/`.
- Added a local Node.js static server with hot reload.
- Confirmed the project runs as a static p5.js browser app, served by `dev-server.js`.
- Kept the app browser workflow centered on the local URL for testing.

## Background Layering

- The scene is built at a 9600 x 1080 artwork ratio.
- Background artwork was reorganized into a full-width layered folder.
- Background layers are ordered from back to front, with layer 1 at the back and layer 13 at the front.
- The cloud layer was assigned to layer 2 so it sits behind trees.
- Cloud speed was tuned several times and is currently set faster than the early draft.
- The app preserves the 9600 x 1080 scene aspect ratio and scales it to the browser display.

## Visual Style

- A paper and cut-paper texture treatment was explored.
- The treatment was adjusted so it applies per layer rather than as a flat overlay across the entire scene.
- Texture on transparent animation/video layers was later removed because it darkened animal assets too much.
- The final animal workflow moved away from transparent video and toward PNG assets animated in canvas.

## Animal And Rare Species Logic

- Species are grouped into birds, mammals, insects, and reptiles.
- Rare species are included with lower spawn weighting than normal animals.
- The mystery AprilTag was changed to trigger rare animals only, to make rare testing easier.
- The system prevents the same animal sequence from being triggered again while it is still active.
- Rare animals display for 15 seconds.
- Normal animals display for 2 minutes.
- Rare animals disappear with a softer fade sparkle effect instead of a burst.
- A subtle glow appears behind spawned animal PNGs so users can spot their contribution.

## PNG Animation Workflow

- The project moved from MP4/WebM video transparency attempts to PNG-based animation.
- PNG assets are placed using exact scene coordinates.
- Simple motion presets were added, including bob, sway, breathe, flutter, hop, crawl, pulse, shake, drift, and fly.
- The black cockatoo flying behavior was added as a bird crossing the scene.
- Asset placement, category, rarity, duration, size, and motion are now managed in `assets/animals/animation-presets.json`.
- Rare nature companion effects are managed in `assets/animals/nature-presets.json`.

## Nature Companion Effects

Rare animal companion effects were reintroduced as PNG assets rather than video files.

- Leaves for koala, potaroo, moth, frog, and frittilary.
- Wind effects for black cockatoo and spotted quoll.
- Water effects for turtle and curlew.
- Turtle creek was pinned to the turtle PNG and scaled down.
- Curlew waves were moved back behind an appropriate layer and repositioned.
- Nature animation scale handling was adjusted so assets render closer to their authored dimensions.

## AprilTag Interaction

- The project moved away from hand gestures because gestures were not translating reliably for the installation visuals.
- AprilTags were chosen as the public interaction model.
- Printable placards were created for each category and a mystery tag.
- AprilTag IDs are:
  - `0` birds
  - `1` mammals
  - `2` insects
  - `3` reptiles
  - `4` mystery rare animal
- A cooldown prevents holding a tag up from spawning many animals immediately.
- Keyboard fallbacks remain available for testing:
  - `B` birds
  - `M` mammals
  - `I` insects
  - `R` reptiles
  - `/` or `?` mystery
- Installation-only cleanup removed placement-point testing controls from the display workflow.

## Counters And Sign

- A tally sign PNG was added to the scene at the requested scene coordinates.
- Category counters were placed over the sign.
- Counters were changed from tally marks to numbers so they can exceed 5.
- Counters now reflect only animals currently visible on screen.
- Rare animals triggered by the mystery tag still count under their real category and also contribute to the rare counter.
- Night-only boobook owl can count as a bird while the night scene is active, and the count resets as soon as day is triggered.

## Audio

- Day ambient audio was added from the Eumundiman Freesound morning birds recording.
- Night boobook owl audio was added from the roisin.gleeson Freesound recording.
- Browser autoplay restrictions mean audio starts only after the first user interaction.
- Day ambience grows faintly louder as more animals populate the scene and fades quieter as the scene empties.
- Day ambience fades down during night mode so the boobook owl call can be heard.
- Night owl audio volume was increased to sit closer to the louder daytime layer.

## Day And Night Cycle

- The app starts in night mode.
- The first successful animal trigger transitions the scene to day.
- Once the last animal disappears, the app waits 45 seconds before beginning the fade back to night.
- The night effect darkens the sky and front layers without hiding the scene entirely.
- Clouds and sunset are removed during night.
- A full moon and sparse stars were added.
- Stars and moon twinkle and fade away faster than the darker layer treatment when day begins.
- A boobook owl PNG appears in the night scene, placed on the sign, with a small glow.

## Background Ambient Effects

- A gentle daytime floating leaf effect was added behind the right hill foreground and in front of the right mountains background.
- Leaf drift is timed every 30 seconds and lasts about 15 seconds.
- The leaf motion was slowed and stabilized so it drifts rather than jumping.
- A grass or leaf rustle patch was added as a background effect at the requested coordinate.
- The rustle was adjusted to use heavier lower strokes and lighter upper strokes, with increased density and spread.

## Packaging And GitHub

- A README was added with installation instructions, tech stack, controls, audio notes, placards, kiosk launch, and deployment checklist.
- The project was initialized and connected to GitHub over SSH at `git@github.com:emmakuskopf/LayeredLivingLight.git`.
- The README now uses the lowercase GitHub username `emmakuskopf`.
- Installation notes now document that p5.js is currently loaded from a CDN and therefore needs internet access on first load unless vendored locally.
- Asset replacement guidance was added so future changes preserve references.

## Asset Naming Cleanup

Asset filenames were cleaned into a readable convention:

- Lowercase.
- Kebab-case.
- Two-digit suffixes for variants.
- Layer numbers preserved for background ordering.

Examples:

- `magpie-01.png`
- `cockatoo-front-06.png`
- `07-right-mountains-background.png`
- `apriltag-birds-00.png`

References were updated in:

- `sketch.js`
- `assets/animals/animation-presets.json`
- `assets/placards/placards.json`
- `assets/placards/placards.html`
- `README.md`

## Current Tech Stack

- HTML, CSS, JavaScript.
- p5.js 1.9.0 from CDN.
- Node.js local static server with hot reload.
- AprilTag detector assets in `assets/vendor/apriltag`.
- PNG background and animal layers.
- Native browser audio for day and night ambience.
- JSON preset files for animal and rare nature configuration.

## Current Runtime Notes

- Run with `npm run dev`.
- Open `http://localhost:5173/`.
- Allow camera access.
- Click, press a category key, or scan a placard to unlock audio.
- Use Chrome in fullscreen or kiosk mode for installation.
- Keep the serving terminal open during the installation.
- Keep assets inside the project folder and avoid renaming files unless JSON and code references are updated too.

## Recent Verification

- `node --check sketch.js` passed.
- Animal, nature, and placard JSON files parsed successfully.
- Referenced asset path checks passed after asset renaming.
- The local app reloaded successfully at `http://localhost:5173/`.
