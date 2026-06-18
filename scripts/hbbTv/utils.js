#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function deleteFolder(folderPath) {
  try {
    await fs.promises.rm(folderPath, { recursive: true, force: true });
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

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
      await fs.promises.symlink(target, destPath).catch(() => {});
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

function runHttpServer(dir, port = 3000) {
  const { spawn } = require('child_process');
  return new Promise((resolve, reject) => {
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const child = spawn(cmd, ['http-server', '--mimetypes', '.types', '-p', String(port)], {
      cwd: dir,
      stdio: 'inherit',
    });
    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('http-server exited with code ' + code));
    });
  });
}

module.exports = { deleteFolder, copyFolder, runHttpServer };
