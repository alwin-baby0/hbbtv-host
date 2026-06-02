#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Run the standard Vite build and relay stdout/stderr to the console.
// This script is used to generate the production build before copying
// the output into the HbbTV-specific deployment folder.
function runBuild() {
  return new Promise((resolve, reject) => {
    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(cmd, ['run', 'build'], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('build failed with code ' + code));
    });
  });
}

// Remove a folder and all contents, but ignore it if it does not exist.
// This ensures the target HbbTV folder is clean before copying a fresh build.
async function deleteFolder(folderPath) {
  try {
    await fs.promises.rm(folderPath, { recursive: true, force: true });
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

// Recursively copy a folder from the build output into the HbbTV deployment directory.
// Keeps symlinks intact when possible and preserves the build folder layout.
async function copyFolder(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyFolder(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      const target = await fs.promises.readlink(srcPath);
      await fs.promises.symlink(target, destPath).catch(() => { });
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

// Find a generated Vite asset filename by regex, such as the legacy entry or polyfill.
// This lets the build script discover hashed legacy bundle names dynamically.
async function findAssetName(folder, pattern) {
  const entries = await fs.promises.readdir(folder);
  const match = entries.find((name) => pattern.test(name));
  if (!match) {
    throw new Error(`No file matching ${pattern} found in ${folder}`);
  }
  return match;
}

// Replace text in a file, supporting both plain string replacement and regex search.
// Used to inject generated legacy asset filenames into the HbbTV loader script.
async function replaceInFile(filePath, search, replace) {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const newContent = search instanceof RegExp ? content.replace(search, replace) : content.split(search).join(replace);
    if (newContent !== content) {
      await fs.promises.writeFile(filePath, newContent, 'utf8');
    }
  } catch (e) {
    console.warn('replaceInFile failed for', filePath, e.message);
  }
}

// Update the HbbTV loader with the actual legacy bundle filenames produced by Vite.
// The HbbTV app uses these constants to load the legacy polyfill and entry script.
async function patchLegacyAssets(hbbtvDir) {
  const legacyDir = path.join(hbbtvDir, 'assets');
  const legacyEntry = await findAssetName(legacyDir, /^index-legacy-.*\.js$/);
  const legacyPolyfill = await findAssetName(legacyDir, /^polyfills-legacy-.*\.js$/);
  const switchHandlersPath = path.join(hbbtvDir, 'switchHandlers.js');

  await replaceInFile(switchHandlersPath, /const LEGACY_ENTRY = .*;/, `const LEGACY_ENTRY = './assets/${legacyEntry}';`);
  await replaceInFile(switchHandlersPath, /const LEGACY_POLYFILL = .*;/, `const LEGACY_POLYFILL = './assets/${legacyPolyfill}';`);
  console.log('Patched switchHandlers.js with:', legacyEntry, legacyPolyfill);
}

async function main() {
  // Build the app first so we have fresh Vite-generated assets.
  try {
    await runBuild();
  } catch (e) {
    console.error('Build failed:', e.message);
    process.exit(1);
  }

  const buildDir = path.join(process.cwd(), 'build');
  const hbbtvDir = path.join(process.cwd(), 'hbbTv');

  // Copy the production build assets into the HbbTV deployment folder.
  const folders = ['assets', 'static'];
  for (const folder of folders) {
    const sourceFolder = path.join(buildDir, folder);
    const targetFolder = path.join(hbbtvDir, folder);

    try {
      await deleteFolder(targetFolder);
      await copyFolder(sourceFolder, targetFolder);
      console.log(`Copied ${folder} to ${targetFolder}`);
    } catch (e) {
      console.error(`Failed to copy ${folder}:`, e.message);
      process.exit(1);
    }
  }

  // Patch the HbbTV loader with the exact legacy bundle filenames.
  try {
    await patchLegacyAssets(hbbtvDir);
  } catch (e) {
    console.error('Failed to patch switchHandlers.js:', e.message);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
