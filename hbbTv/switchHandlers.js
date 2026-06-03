

const LEGACY_ENTRY = './assets/index-legacy-DCKMT_NL.js';
const LEGACY_POLYFILL = './assets/polyfills-legacy-brPzi115.js';

function hideBroadcast() {
  if (playerType === 'dash') stopDashBroadcast()
  if (playerType === 'hls') stopHlsBroadcast()
}

function stopDashBroadcast() {
  if (dash && typeof dash.pause === 'function') {
    dash.pause();
  }
  if (dash && typeof dash.attachSource === 'function') {
    dash.attachSource('');
  }
  if (dash && typeof dash.attachView === 'function') {
    dash.attachView(null);
  }
  const video = document.getElementById('video');
  if (video) video.style.visibility = 'hidden'
}

function stopHlsBroadcast() {

}

function showBroadcast() {
  if (playerType === 'dash') startDashBroadcast()
  if (playerType === 'hls') startHlsBroadcast()
}

function startDashBroadcast() {
  try {
    let video = document.getElementById('video');
    if (!video) {
      video = document.createElement('video');
      video.setAttribute('id', 'video');
      video.setAttribute('controls', 'false');
      video.controls = false;
      video.setAttribute('autoplay', 'autoplay');

      video.style.position = 'absolute';
      video.style.left = 0;
      video.style.top = 0;
      video.style.width = '1280px';
      video.style.height = '720px';
      video.muted = true;
      document.body.appendChild(video);
    }
    video.style.visibility = 'visible'
    if (dash && typeof dash.attachView === 'function') {
      dash.attachView(video);
    }
    if (dash && typeof dash.attachSource === 'function') {
      dash.attachSource(ssaiEnabledFullManifestUrl);
    }
    if (typeof dash.play === 'function') {
      dash.play();
    }
  } catch (e) {
    console.warn('hideAppAndShowBroadcast error', e);
  }
}

function startHlsBroadcast() {

}

function insertLightningScripts() {
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
}

function hideBroadcastAndShowApp() {
  hideBroadcast()
  insertLightningScripts()
  currentObject = TYPE.APP
  console.log('### hideBroadcastAndShowApp');
}

function hideAppAndShowBroadcast() {
  window.history.pushState({}, '', '/');
  showBroadcast()
  currentObject = TYPE.BROADCAST;
  console.log('### hideAppAndShowBroadcast');
}
