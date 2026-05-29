# Layered Living Light

Layered Living Light is a participatory immersive installation exploring the challenges of the Sunshine Coast's native species.

The app runs as a local browser-based installation. It uses AprilTag placards and keyboard fallbacks to trigger animal PNG animations, rare animal moments, ambient nature effects, a day/night scene cycle, counters, and background audio.

## Tech Stack

- HTML, CSS, JavaScript
- p5.js 1.9.0 loaded from CDN
- Local Node.js static server with hot reload
- AprilTag detector assets in `assets/vendor/apriltag`
- PNG-based animal and background animation layers
- Native browser audio for ambient day and night sound

## Project Structure

- `index.html` - app entry point
- `sketch.js` - main p5 scene, interaction, animation, audio, and rendering logic
- `style.css` - page styling
- `dev-server.js` - local server with hot reload and static asset MIME types
- `assets/BACKGROUND/fullwidth/200ppi` - 9600 x 1080 layered background PNGs
- `assets/png/1x` - animal PNGs and night owl PNG
- `assets/png/rare-nature/1x` - rare nature effect PNGs
- `assets/animals/animation-presets.json` - animal placement/motion/category presets
- `assets/animals/nature-presets.json` - rare nature companion presets
- `assets/placards` - AprilTag placards and printable tag sheets
- `assets/audio` - day and night ambience files

## Requirements

- macOS or Windows installation computer
- Node.js 18 or newer
- Chrome recommended for the installation browser
- Webcam for AprilTag scanning
- Projector/display set to the intended installation resolution
- Printed AprilTag placards from `assets/placards/placards.html`
- Internet access on first load, because p5.js is currently loaded from a CDN

The artwork scene itself is designed at 9600 x 1080. The browser scales that scene to the available display area while preserving its aspect ratio.

## Install

1. Install Node.js from `https://nodejs.org/`.
2. Clone this project onto the installation computer:

```bash
git clone git@github.com:emmakuskopf/LayeredLivingLight.git
cd LayeredLivingLight
```

If the installation computer does not have GitHub SSH access, download the repository as a ZIP from GitHub instead, unzip it, and open Terminal in the unzipped project folder.

3. Open Terminal in the project folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open Chrome to:

```text
http://localhost:5173/
```

6. Allow camera access when prompted.
7. Click once, press a category key, or scan a placard to unlock browser audio.
8. Put the browser into fullscreen or kiosk display mode.

## Updating From GitHub

This folder is a Git repository on the `main` branch. The project remote is:

```bash
git@github.com:emmakuskopf/LayeredLivingLight.git
```

To get the latest version on the installation computer:

```bash
git pull origin main
```

To publish local changes back to GitHub:

```bash
git status
git add .
git commit -m "Describe the update"
git push origin main
```

## Running The Installation

Start the local server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173/
```

The app starts in night mode. After the first successful animal trigger, it transitions to day. Once the last active animal leaves the scene, the app waits 45 seconds, then fades back to night.

The server runs at port 5173 by default. To use a different port:

```bash
PORT=5174 npm run dev
```

## Controls

AprilTags are the intended public interaction.

Keyboard fallbacks:

- `B` - birds
- `M` - mammals
- `I` - insects
- `R` - reptiles
- `/` or `?` - mystery rare animal

## Audio

Browsers block autoplay. Audio starts only after the first user interaction.

- Day ambience: `assets/audio/morning-birds-eumundi.mp3`
- Night ambience: `assets/audio/boobook-owl-calls-roisin-gleeson.m4a`

The night owl sound fades in with night mode. The day ambience fades down during night so the owl call can be heard.

Audio credits:

- Morning birds: Eumundiman, Freesound sound 542475
- Boobook owl: roisin.gleeson, Freesound sound 815912, CC0

## Placards

Open this file in a browser to view/print the placards:

```text
assets/placards/placards.html
```

Current tag categories:

- ID 0 - birds
- ID 1 - mammals
- ID 2 - insects
- ID 3 - reptiles
- ID 4 - mystery rare animal

## Installation Checklist

- Confirm `npm run dev` starts without errors.
- Confirm `http://localhost:5173/` loads.
- Confirm the installation browser has internet access for the p5.js CDN script, or vendor p5.js locally before installing offline.
- Confirm camera permission is allowed.
- Confirm AprilTags trigger the correct categories.
- Confirm keyboard fallbacks work.
- Confirm first click/key/tag unlocks audio.
- Confirm day ambience is audible in day mode.
- Confirm owl ambience is audible in night mode.
- Confirm the projection/display is fullscreen.
- Confirm the browser/computer will not sleep.
- Confirm the projector and computer are set to the intended resolution.

## Optional Kiosk Launch

On macOS with Chrome installed, this command opens the app in kiosk mode:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk http://localhost:5173/
```

Keep the Terminal window running `npm run dev` open in the background.

## Deployment Notes

This is intended to run locally, not from a public hosted website, because it needs camera access, local assets, and installation reliability.

Before final install:

- Keep all assets inside the project folder.
- Do not rename asset files unless the matching JSON/settings references are updated.
- Asset filenames use lowercase kebab-case, with two-digit suffixes for variants, such as `magpie-01.png` or `07-right-mountains-background.png`.
- Animal placement, category, motion, rarity, and size live in `assets/animals/animation-presets.json`.
- Rare nature companion effects live in `assets/animals/nature-presets.json`.
- Replacement PNGs should keep the same filenames when possible.
- Test in the exact browser and display setup used onsite.
- Disable system sleep and screen saver.
- Use a stable power source and fixed webcam position.
