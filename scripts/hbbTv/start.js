#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk').default || require('chalk');
const { runHttpServer } = require('./utils');

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

async function main() {

  // Execute update.js after the HbbTV start flow.
  try {
    await runUpdateScript();
    console.log('')
    console.log(chalk.green('✓ Build updated successfully'));
  } catch (e) {
    console.error('Failed to execute update.js:', e.message);
    process.exit(1);
  }

  // Serve the HbbTV folder once update completes.
  try {
    const hbbTvDir = path.join(__dirname, '..', '..', 'hbbTv');
    console.log('')
    console.log(chalk.green('Starting http-server for hbbTv...'));
    console.log('')
    await runHttpServer(hbbTvDir, 3001);
  } catch (e) {
    console.error('Failed to start http-server:', e.message);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
