#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk').default || require('chalk');

// Maps the build-* npm script suffix to its vite --mode production-<value>.
const BUILD_TARGET_MODES = {
  lg: 'webos',
  hisense: 'hisense',
  titan: 'titan',
  netgem: 'netgem',
  netrange: 'netrange',
  tizen: 'tizen',
  xperi: 'xperi',
  foxxum: 'foxxum',
  ocilion: 'ocilion',
  metrological: 'metrological',
  sunrise: 'sunrise',
  default: 'web',
};

// Derive the vite mode from the npm script name that invoked this file,
// e.g. "build-lg" -> "webos", "build" -> "web".
function resolveMode() {
  const lifecycleEvent = process.env.npm_lifecycle_event || '';
  const suffix = lifecycleEvent.split('-')[1] ?? 'default';
  return BUILD_TARGET_MODES[suffix] ?? BUILD_TARGET_MODES.default;
}

function runNodeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${path.basename(scriptPath)} failed with code ${code}`));
    });
  });
}

function runViteBuild(mode) {
  return new Promise((resolve, reject) => {
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const child = spawn(cmd, ['vite', 'build', '--mode', `production-${mode}`], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`vite build --mode production-${mode} failed with code ${code}`));
    });
  });
}

async function main() {
  const mode = resolveMode();
  console.log(chalk.gray('Building for:'), chalk.cyan(`production-${mode}`));
  console.log('')

  const insertEntryScriptPath = path.join(__dirname, 'insertEntryScript.js');
  const patchMainPath = path.join(__dirname, 'patchMain.js');

  try {
    await runNodeScript(insertEntryScriptPath);
  } catch (e) {
    console.error('Failed to run insertEntryScript.js:', e.message);
    process.exit(1);
  }

  try {
    await runViteBuild(mode);
  } catch (e) {
    console.error('Failed to run vite build:', e.message);
    process.exit(1);
  }

  try {
    await runNodeScript(patchMainPath);
  } catch (e) {
    console.error('Failed to run patchMain.js:', e.message);
    process.exit(1);
  }

  console.log('')
  console.log(chalk.green('✓ Build complete'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
