#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk').default || require('chalk');

const ENTRY_SCRIPT_TAG = '<script type="module" src="/src/index.js"></script>';

// Insert the entry script tag as the last child of <body>, right above
// </body>, unless it's already present.
async function insertEntryScript(indexHtmlPath) {
  const html = await fs.promises.readFile(indexHtmlPath, 'utf8');

  if (html.includes(ENTRY_SCRIPT_TAG)) {
    console.log(chalk.yellow('•'), chalk.cyan(ENTRY_SCRIPT_TAG), chalk.yellow('already present, skipping.'));
    return;
  }

  const bodyCloseRegex = /<\/body>/i;
  if (!bodyCloseRegex.test(html)) {
    throw new Error('No </body> tag found in index.html');
  }

  const updatedHtml = html.replace(bodyCloseRegex, `  ${ENTRY_SCRIPT_TAG}\n</body>`);
  await fs.promises.writeFile(indexHtmlPath, updatedHtml, 'utf8');
  console.log(chalk.green('✓ Inserted'), chalk.cyan(ENTRY_SCRIPT_TAG), chalk.green('above'), chalk.cyan('</body>'));
}

async function main() {
  const indexHtmlPath = path.join(process.cwd(), 'index.html');

  try {
    await insertEntryScript(indexHtmlPath);
    console.log('')
  } catch (e) {
    console.error('Failed to insert entry script:', e.message);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
