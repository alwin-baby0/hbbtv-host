#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk').default || require('chalk');
const { deleteFolder, copyFolder, runHttpServer } = require('./utils');
const esbuild = require('esbuild');

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

async function cleanAndRecreateFolder(folderPath) {
  await deleteFolder(folderPath);
  await fs.promises.mkdir(folderPath, { recursive: true });
}

async function minifyTopLevelJsFiles(folderPath) {
  const entries = await fs.promises.readdir(folderPath, { withFileTypes: true });
  const jsFiles = entries.filter(
    (e) => e.isFile() && e.name.endsWith('.js') && !e.name.endsWith('.min.js')
  );

  for (const file of jsFiles) {
    const filePath = path.join(folderPath, file.name);
    const before = (await fs.promises.stat(filePath)).size;
    const content = await fs.promises.readFile(filePath, 'utf8');
    const result = await esbuild.transform(content, { minify: true, keepNames: true });
    await fs.promises.writeFile(filePath, result.code, 'utf8');
    const after = (await fs.promises.stat(filePath)).size;
    const afterColor = after > 102400 ? chalk.yellow : chalk.gray;
    console.log(chalk.green('Minified'), chalk.cyan(file.name), chalk.gray(`${(before / 1024).toFixed(1)}KB`), chalk.green('→'), afterColor(`${(after / 1024).toFixed(1)}KB`));
  }
}

async function main() {
  try {
    await runUpdateScript();
    console.log('')
    console.log(chalk.green('Build updated successfully'));
  } catch (e) {
    console.error('Failed to execute update.js:', e.message);
    process.exit(1);
  }

  const hbbtvDir = path.join(process.cwd(), 'hbbTv');
  const outputDir = path.join(process.cwd(), 'build-hbbTv');

  // Clean and recreate the output folder.
  try {
    await cleanAndRecreateFolder(outputDir);
    console.log('')
    console.log(chalk.green('Cleaned'), chalk.cyan('build-hbbTv'));
  } catch (e) {
    console.error('Failed to clean build-hbbTv:', e.message);
    process.exit(1);
  }

  // Copy all contents from hbbTv into build-hbbTv.
  try {
    await copyFolder(hbbtvDir, outputDir);
    console.log(chalk.green('Copied'), chalk.cyan('hbbTv'), chalk.green('→'), chalk.cyan('build-hbbTv'));
    console.log('')
  } catch (e) {
    console.error('Failed to copy hbbTv to build-hbbTv:', e.message);
    process.exit(1);
  }

  // Minify top-level JS files in build-hbbTv in-place.
  try {
    await minifyTopLevelJsFiles(outputDir);
    console.log('');
    console.log(chalk.green('Minification complete'));
  } catch (e) {
    console.error('Failed to minify JS files:', e.message);
    process.exit(1);
  }

  if (process.env.npm_config_launch === 'true') {
    try {
      console.log(chalk.green('Starting http-server for build-hbbTv on port 4001...'));
      console.log('');
      await runHttpServer(outputDir, 4001);
    } catch (e) {
      console.error('Failed to start http-server:', e.message);
      process.exit(1);
    }
  } else {
    console.log(chalk.green('Build Succesfull →'), chalk.cyan('build-hbbTv'));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
