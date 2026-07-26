const LEGACY_ENTRY = './assets/index-legacy-DPMczbX0.js';
const LEGACY_POLYFILL = './assets/polyfills-legacy-XyIu8j-J.js';

function insertLightningScripts() {
  const entryScript = document.createElement('script');
  entryScript.type = 'module';
  entryScript.setAttribute('src', "/src/index.js");
  document.body.appendChild(entryScript);
}
