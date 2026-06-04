#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk').default || require('chalk');

function runUpdateScript() {
  return new Promise((resolve, reject) => {
    const updateScript = path.join(__dirname, 'update.js');
    const child = spawn(process.execPath, [updateScript], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('update.js failed with code ' + code));
    });
  });
}

function runHttpServer() {
  return new Promise((resolve, reject) => {
    const hbbTvDir = path.join(__dirname, '..', '..', 'hbbTv');
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const child = spawn(cmd, ['http-server', '--mimetypes', '.types', '-p', '3000'], {
      cwd: hbbTvDir,
      stdio: 'inherit',
    });

    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('http-server exited with code ' + code));
    });
  });
}

async function main() {

  // Execute update.js after the HbbTV start flow.
  try {
    await runUpdateScript();
    console.log(chalk.green('Build updated successfully'));
  } catch (e) {
    console.error('Failed to execute update.js:', e.message);
    process.exit(1);
  }

  // Serve the HbbTV folder once update completes.
  try {
    console.log(chalk.green('Starting http-server for hbbTv...'));
    await runHttpServer();
  } catch (e) {
    console.error('Failed to start http-server:', e.message);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
