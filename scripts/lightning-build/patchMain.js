#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk').default || require('chalk');

// Extract a <script> tag by its id attribute from raw HTML, regardless of
// attribute order or whether the tag is commented out.
function extractScriptTag(html, id) {
  const tagRegex = new RegExp(`<script\\b[^>]*\\bid=["']${id}["'][^>]*>`, 'i');
  const match = html.match(tagRegex);
  if (!match) {
    throw new Error(`No <script> tag with id="${id}" found in index.html`);
  }
  console.log(chalk.green('✓ Extracted tag:'), chalk.cyan(match[0]));
  return match[0];
}

// Read a given attribute's value off an already-extracted <script> tag.
function extractAttr(tag, attr) {
  const attrRegex = new RegExp(`\\b${attr}=["']([^"']+)["']`, 'i');
  const match = tag.match(attrRegex);
  if (!match) {
    throw new Error(`Attribute "${attr}" not found on tag: ${tag}`);
  }
  console.log(chalk.green('✓ Extracted'), chalk.cyan(attr), chalk.green('='), chalk.cyan(match[1]));
  return match[1];
}

// Remove a <script> tag (open tag through closing tag) by its id attribute,
// whether or not it's wrapped in an HTML comment.
function removeScriptTag(html, id) {
  const tagRegex = new RegExp(`<script\\b[^>]*\\bid=["']${id}["'][^>]*>[\\s\\S]*?</script>`, 'i');
  return html.replace(tagRegex, '');
}

// Replace text in a file, supporting both plain string replacement and regex search.
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

const INSERT_LIGHTNING_SCRIPTS_FUNCTION_FOR_BUILD = `function insertLightningScripts() {
  // Check and insert vite-legacy-polyfill if not present
  if (!document.getElementById('vite-legacy-polyfill')) {
    const polyfillScript = document.createElement('script');
    polyfillScript.crossOrigin = 'anonymous';
    polyfillScript.id = 'vite-legacy-polyfill';
    polyfillScript.src = LEGACY_POLYFILL;

    // Insert entry script after polyfill loads
    polyfillScript.onload = function () {
      if (!document.getElementById('vite-legacy-entry')) {
        const entryScript = document.createElement('script');
        entryScript.crossOrigin = 'anonymous';
        entryScript.id = 'vite-legacy-entry';
        entryScript.setAttribute('data-src', LEGACY_ENTRY);
        entryScript.textContent = "System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))";
        document.body.appendChild(entryScript);
      }
    };

    document.body.appendChild(polyfillScript);
  } else if (!document.getElementById('vite-legacy-entry')) {
    // If polyfill already exists, just add entry script
    const entryScript = document.createElement('script');
    entryScript.crossOrigin = 'anonymous';
    entryScript.id = 'vite-legacy-entry';
    entryScript.setAttribute('data-src', LEGACY_ENTRY);
    entryScript.textContent = "System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))";
    document.body.appendChild(entryScript);
  }
}`;

const DEV_ENTRY_SCRIPT_TAG = '<script type="module" src="/src/index.js"></script>';

// Matches the whole line the dev entry script sits on (leading indentation
// through the trailing newline), so removing it doesn't leave a blank line behind.
const DEV_ENTRY_SCRIPT_LINE_REGEX = /^[ \t]*<script type="module" src="\/src\/index\.js"><\/script>[ \t]*\r?\n/m;

const INSERT_LIGHTNING_SCRIPTS_FUNCTION_FOR_DEV = `function insertLightningScripts() {
  const entryScript = document.createElement('script');
  entryScript.type = 'module';
  entryScript.setAttribute('src', "/src/index.js");
  document.body.appendChild(entryScript);
}`;

// Remove the dev-only entry script tag from the source index.html, if present,
// so it doesn't linger into the next vite build.
async function removeDevEntryScript(rootIndexHtmlPath) {
  const html = await fs.promises.readFile(rootIndexHtmlPath, 'utf8');
  if (!DEV_ENTRY_SCRIPT_LINE_REGEX.test(html)) {
    return;
  }
  await replaceInFile(rootIndexHtmlPath, DEV_ENTRY_SCRIPT_LINE_REGEX, '');
  console.log(chalk.green('✓ Removed'), chalk.cyan(DEV_ENTRY_SCRIPT_TAG), chalk.green('from'), chalk.cyan('index.html'));
  console.log('')
}

// Read the vite-legacy-entry/vite-legacy-polyfill script src values out of
// build/index.html and patch them into build/static/scripts/main.js's
// LEGACY_ENTRY/LEGACY_POLYFILL constants, so main.js always points at the
// exact hashed filenames the last build actually produced.
async function patchMainJs(buildDir) {
  console.log('')
  const indexHtmlPath = path.join(buildDir, 'index.html');
  const mainJsPath = path.join(buildDir, 'static', 'scripts', 'main.js');

  const html = await fs.promises.readFile(indexHtmlPath, 'utf8');

  const polyfillTag = extractScriptTag(html, 'vite-legacy-polyfill');
  const legacyPolyfill = extractAttr(polyfillTag, 'src');
  console.log('')

  const entryTag = extractScriptTag(html, 'vite-legacy-entry');
  const legacyEntry = extractAttr(entryTag, 'data-src');
  console.log('')

  await replaceInFile(mainJsPath, /const LEGACY_ENTRY = .*;/, `const LEGACY_ENTRY = '${legacyEntry}';`);
  await replaceInFile(mainJsPath, /const LEGACY_POLYFILL = .*;/, `const LEGACY_POLYFILL = '${legacyPolyfill}';`);

  console.log(chalk.green('✓ Patched'), chalk.cyan('main.js'), chalk.green('with:'), chalk.cyan(legacyEntry), chalk.green('and'), chalk.cyan(legacyPolyfill));
  console.log('')

  let updatedHtml = html;
  updatedHtml = removeScriptTag(updatedHtml, 'vite-legacy-polyfill');
  updatedHtml = removeScriptTag(updatedHtml, 'vite-legacy-entry');

  if (updatedHtml !== html) {
    await fs.promises.writeFile(indexHtmlPath, updatedHtml, 'utf8');
    console.log(chalk.green('✓ Removed'), chalk.cyan('vite-legacy-polyfill'), chalk.green('and'), chalk.cyan('vite-legacy-entry'), chalk.green('script tags from'), chalk.cyan('index.html'));
    console.log('')
  }

  await replaceInFile(mainJsPath, INSERT_LIGHTNING_SCRIPTS_FUNCTION_FOR_DEV, INSERT_LIGHTNING_SCRIPTS_FUNCTION_FOR_BUILD);
  console.log(chalk.green('✓ Restored'), chalk.cyan('insertLightningScripts()'), chalk.green('implementation in'), chalk.cyan('main.js'));
}

async function main() {
  const rootIndexHtmlPath = path.join(process.cwd(), 'index.html');
  const buildDir = path.join(process.cwd(), 'build');

  try {
    await removeDevEntryScript(rootIndexHtmlPath);
  } catch (e) {
    console.error('Failed to clean index.html:', e.message);
    process.exit(1);
  }

  try {
    await patchMainJs(buildDir);
  } catch (e) {
    console.error('Failed to patch main.js:', e.message);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
