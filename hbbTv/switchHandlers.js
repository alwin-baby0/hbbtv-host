

const LEGACY_ENTRY = './assets/index-legacy-osAvQ0Zr.js';
const LEGACY_POLYFILL = './assets/polyfills-legacy-CVVjtyMm.js';

const splash = document.getElementById('splash');
const splashVideo = document.getElementById('splash-video')
const loader = document.getElementById('loader');
const loaderImage = document.getElementById('loader-image');

function splashTimeUpdateHandler() {
  if (splashVideo.currentTime >= 1.2) {
    splashVideo.pause();
    showHbbtvLoader(true)
    insertLightningScripts()
    splashVideo.removeEventListener('timeupdate', splashTimeUpdateHandler);
  }
}

function playAndPauseAtOneSecond(video) {
  video.addEventListener('timeupdate', splashTimeUpdateHandler);
  video.addEventListener('ended', onSplashVideoEnded);
  video.play();
}

function onSplashVideoEnded() {
  console.log('Splash video finished playing', splashVideo.currentTime);
  splashVideo.removeEventListener('timeupdate', splashTimeUpdateHandler);
  splashVideo.currentTime = 0;
  if (!splash) return;
  splash.style.opacity = '0';
  splash.style.visibility = 'hidden';
  splashVideo.removeEventListener('ended', onSplashVideoEnded);
}

function continuePlayingSplashTillEnd(video) {
  video.play();
  window.hideHbbtvSplash = function () { }
}

function showHbbtvSplash() {
  window.hideHbbtvSplash = hideHbbtvSplashOriginal
  if (!splash) return;
  splash.style.visibility = 'visible';
  splash.style.opacity = '1';
  playAndPauseAtOneSecond(splashVideo);
}

function hideHbbtvSplashOriginal() {
  hideHbbtvLoader()
  continuePlayingSplashTillEnd(splashVideo)
}

function showHbbtvLoader(isSplash = false) {
  if (!loader || !loaderImage) return;
  if (isSplash) {
    loader.style.background = 'transparent'
    loaderImage.style.bottom = '25%'
  }
  loader.style.visibility = 'visible';
  loader.style.opacity = '1';

}

function hideHbbtvLoader() {
  if (!loader || !loaderImage) return;
  loader.style.visibility = 'hidden';
  loader.style.opacity = '0';
  loader.style.background = '#1b1b23'
  loaderImage.style.bottom = '50%'
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
  const video = document.getElementById('ssai-broadcast-video');
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

  const video = document.getElementById('ssai-broadcast-video');
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

function onBroadcastVideoCanPlay(e) {
  if (!broadcastControlObject.objectsInitialized) broadcastControlObject.initializeObjects()
  if (broadcastControlObject.objectsInitialized) {
    broadcastControlObject.hideAndMuteBroadcast()
  }
  if (e.srcElement && e.srcElement.play) e.srcElement.play()
}

function onBroadcastVideoPlaying() {
  if (!isVodEnabled()) return;
  enableRedButton()
  hideHbbtvLoader()
  startPropmtingUserWithOverlay()
}

function appendBroadcastVideoElement() {
  const video = document.createElement('video');
  video.setAttribute('id', 'ssai-broadcast-video');
  video.setAttribute('controls', 'false');
  video.controls = false;
  video.style.position = 'absolute';
  video.style.left = 0;
  video.style.top = 0;
  video.style.width = '1280px';
  video.style.height = '720px';
  video.addEventListener('canplay', onBroadcastVideoCanPlay);
  video.addEventListener('playing', onBroadcastVideoPlaying);
  document.body.appendChild(video);
  return video
}

function startDashBroadcast() {
  try {
    let video = document.getElementById('ssai-broadcast-video');
    if (!video) video = appendBroadcastVideoElement()
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
    console.warn('startDashBroadcast error', e);
  }
}

function startHlsBroadcast() {
  try {
    // kill any existing hls
    let video = document.getElementById('ssai-broadcast-video');
    if (!video) video = appendBroadcastVideoElement()
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

function removeCanvasAndLightningScripts() {
  const canvas = document.body.querySelector('canvas');
  if (canvas) {
    canvas.remove()
  }

  const polyfillScript = document.getElementById('vite-legacy-polyfill');
  if (polyfillScript) {
    polyfillScript.remove();
  }

  const entryScript = document.getElementById('vite-legacy-entry');
  if (entryScript) {
    entryScript.remove();
  }

  // Remove google tag manager script from head
  const googleTagScript = document.querySelector('script[src*="googletagmanager"]');
  if (googleTagScript) {
    googleTagScript.remove();
  }

  // Remove tracking.watch4.com script from body
  const trackingScript = document.querySelector('script[src*="tracking.watch4.com"]');
  if (trackingScript) {
    trackingScript.remove();
  }
}
window.removeCanvasAndLightningScripts = removeCanvasAndLightningScripts

function isVodEnabled() {
  const isVod = document.getElementById('is_vod')?.innerHTML
  return Number(isVod) === 1
}

function hideBroadcastAndShowApp() {
  window.history.pushState({}, '', '/');
  hidePromptOverlay()
  stopPropmtingUserWithOverlay()
  disableRedButton()
  showHbbtvSplash()
  hideBroadcast()
  currentObject = TYPE.APP
}

function hideAppAndShowBroadcast() {
  window.history.pushState({}, '', '/');
  showBroadcast();
  currentObject = TYPE.BROADCAST;
  enableRedButton()
}

function cleanupBroadcastBeforeReleasing() {
  hidePromptOverlay()
  stopPropmtingUserWithOverlay()
  hideBroadcast()
}
