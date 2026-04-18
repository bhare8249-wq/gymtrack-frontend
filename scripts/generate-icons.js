const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG      = path.join(__dirname, '../src/icon.svg');
const SPLASH   = path.join(__dirname, '../src/splash.svg');
const svgBuffer    = fs.readFileSync(SVG);
const splashBuffer = fs.readFileSync(SPLASH);

const iosDir    = path.join(__dirname, '../ios/App/App/Assets.xcassets/AppIcon.appiconset');
const iosSplash = path.join(__dirname, '../ios/App/App/Assets.xcassets/Splash.imageset');
const androidRes = path.join(__dirname, '../android/app/src/main/res');
const publicDir  = path.join(__dirname, '../public');

// ── Icon sizes ────────────────────────────────────────────────────────────────

const iosSizes = [
  { name: 'AppIcon-20@1x.png',    size: 20   },
  { name: 'AppIcon-20@2x.png',    size: 40   },
  { name: 'AppIcon-20@3x.png',    size: 60   },
  { name: 'AppIcon-29@1x.png',    size: 29   },
  { name: 'AppIcon-29@2x.png',    size: 58   },
  { name: 'AppIcon-29@3x.png',    size: 87   },
  { name: 'AppIcon-40@1x.png',    size: 40   },
  { name: 'AppIcon-40@2x.png',    size: 80   },
  { name: 'AppIcon-40@3x.png',    size: 120  },
  { name: 'AppIcon-60@2x.png',    size: 120  },
  { name: 'AppIcon-60@3x.png',    size: 180  },
  { name: 'AppIcon-76@1x.png',    size: 76   },
  { name: 'AppIcon-76@2x.png',    size: 152  },
  { name: 'AppIcon-83.5@2x.png',  size: 167  },
  { name: 'AppIcon-1024@1x.png',  size: 1024 },
];

const androidSizes = [
  { dir: 'mipmap-mdpi',    size: 48  },
  { dir: 'mipmap-hdpi',    size: 72  },
  { dir: 'mipmap-xhdpi',   size: 96  },
  { dir: 'mipmap-xxhdpi',  size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

// ── Splash sizes ──────────────────────────────────────────────────────────────

// iOS: all three slots use the same 2732×2732 image
const iosSplashFiles = [
  'splash-2732x2732.png',
  'splash-2732x2732-1.png',
  'splash-2732x2732-2.png',
];

// Android portrait
const androidPortrait = [
  { dir: 'drawable',             w: 800,  h: 1200 },
  { dir: 'drawable-port-mdpi',   w: 320,  h: 480  },
  { dir: 'drawable-port-hdpi',   w: 480,  h: 800  },
  { dir: 'drawable-port-xhdpi',  w: 720,  h: 1280 },
  { dir: 'drawable-port-xxhdpi', w: 960,  h: 1600 },
  { dir: 'drawable-port-xxxhdpi',w: 1280, h: 1920 },
];

// Android landscape
const androidLandscape = [
  { dir: 'drawable-land-mdpi',   w: 480,  h: 320  },
  { dir: 'drawable-land-hdpi',   w: 800,  h: 480  },
  { dir: 'drawable-land-xhdpi',  w: 1280, h: 720  },
  { dir: 'drawable-land-xxhdpi', w: 1600, h: 960  },
  { dir: 'drawable-land-xxxhdpi',w: 1920, h: 1280 },
];

// ── Run ───────────────────────────────────────────────────────────────────────

async function run() {
  // iOS icons
  fs.mkdirSync(iosDir, { recursive: true });
  for (const icon of iosSizes) {
    await sharp(svgBuffer).resize(icon.size, icon.size).png().toFile(path.join(iosDir, icon.name));
    console.log(`✓ iOS icon ${icon.size}px → ${icon.name}`);
  }

  // Android icons
  for (const icon of androidSizes) {
    const dir = path.join(androidRes, icon.dir);
    fs.mkdirSync(dir, { recursive: true });
    await sharp(svgBuffer).resize(icon.size, icon.size).png().toFile(path.join(dir, 'ic_launcher.png'));
    await sharp(svgBuffer).resize(icon.size, icon.size).png().toFile(path.join(dir, 'ic_launcher_round.png'));
    await sharp(svgBuffer).resize(icon.size, icon.size).png().toFile(path.join(dir, 'ic_launcher_foreground.png'));
    console.log(`✓ Android icon ${icon.size}px → ${icon.dir}`);
  }

  // PWA icons + favicon
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'logo192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'logo512.png'));
  await sharp(svgBuffer).resize(32,  32 ).png().toFile(path.join(publicDir, 'favicon.png'));
  console.log('✓ PWA icons (192, 512, 32px)');

  // iOS splash (2732×2732 for all three scale slots)
  fs.mkdirSync(iosSplash, { recursive: true });
  for (const file of iosSplashFiles) {
    await sharp(splashBuffer).resize(2732, 2732).png().toFile(path.join(iosSplash, file));
    console.log(`✓ iOS splash → ${file}`);
  }

  // Android portrait splashes
  for (const s of androidPortrait) {
    const dir = path.join(androidRes, s.dir);
    fs.mkdirSync(dir, { recursive: true });
    await sharp(splashBuffer).resize(s.w, s.h).png().toFile(path.join(dir, 'splash.png'));
    console.log(`✓ Android portrait splash ${s.w}×${s.h} → ${s.dir}`);
  }

  // Android landscape splashes
  for (const s of androidLandscape) {
    const dir = path.join(androidRes, s.dir);
    fs.mkdirSync(dir, { recursive: true });
    await sharp(splashBuffer).resize(s.w, s.h).png().toFile(path.join(dir, 'splash.png'));
    console.log(`✓ Android landscape splash ${s.w}×${s.h} → ${s.dir}`);
  }

  console.log('\n✅ All icons + splash screens generated!');
}

run().catch(err => { console.error(err); process.exit(1); });
