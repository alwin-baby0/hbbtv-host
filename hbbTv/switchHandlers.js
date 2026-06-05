

const LEGACY_ENTRY = './assets/index-legacy-fV3qKqHw.js';
const LEGACY_POLYFILL = './assets/polyfills-legacy-brPzi115.js';

function showSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  splash.style.visibility = 'visible';
  splash.style.opacity = '0.99';
}

function hideSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  splash.style.opacity = '0';
  splash.style.visibility = 'hidden';
}

function resetConditionsForHidingSplash() {
  window.broadcastPlaybackPlaying = false
  window.appExitAnimationEnded = false
}

function checkConditionsAndHideSplash() {
  if (window.broadcastPlaybackPlaying && window.appExitAnimationEnded) {
    hideSplash()
    resetConditionsForHidingSplash()
  }
}

function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      window.appExitAnimationEnded = true
      resolve()
    }, ms);
  });
}

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
  if (hls && typeof hls.stopLoad === 'function') {
    hls.stopLoad();
  }

  if (hls && typeof hls.loadSource === 'function') {
    hls.loadSource('');
  }

  if (hls && typeof hls.detachMedia === 'function') {
    hls.detachMedia();
  }

  const video = document.getElementById('video');
  if (video) {
    if (typeof video.pause === 'function') {
      video.pause();
    }
    video.removeAttribute('src');
    video.load && video.load();
    video.style.visibility = 'hidden';
  }
}

function showBroadcast() {
  if (playerType === 'dash') startDashBroadcast()
  if (playerType === 'hls') startHlsBroadcast()
}


const onPlaying = () => {
  window.broadcastPlaybackPlaying = true;
  checkConditionsAndHideSplash();
};

function appendBroadcastVideoElement() {
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
  video.addEventListener('playing', onPlaying);
  document.body.appendChild(video);
}

function startDashBroadcast() {
  try {
    let video = document.getElementById('video');
    if (!video) appendBroadcastVideoElement()
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
  try {
    // kill any existing hls
    stopHlsBroadcast()
    let video = document.getElementById('video');
    if (!video) appendBroadcastVideoElement()
    video.style.visibility = 'visible';

    if (hls && typeof hls.attachMedia === 'function') {
      hls.attachMedia(video);
    }

    if (hls && typeof hls.loadSource === 'function') {
      hls.loadSource(ssaiEnabledFullManifestUrl);
    }

    if (typeof video.play === 'function') {
      video.play().catch(() => { });
    }
  } catch (e) {
    console.warn('startHlsBroadcast error', e);
  }
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
  window.history.pushState({}, '', '/');
  disableRedButton()
  resetConditionsForHidingSplash()
  showSplash()
  hideBroadcast()
  insertLightningScripts()
  currentObject = TYPE.APP
  console.log('### hideBroadcastAndShowApp');
}

async function hideAppAndShowBroadcast() {
  window.history.pushState({}, '', '/');
  // small pause to allow any pending tasks to settle before switching
  showBroadcast();
  await wait(1000);
  currentObject = TYPE.BROADCAST;
  checkConditionsAndHideSplash()
  enableRedButton()
  console.log('### hideAppAndShowBroadcast');
}
