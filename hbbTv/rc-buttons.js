//
//  define RC button globals for terminal
//
if (typeof (KeyEvent) !== 'undefined') {
  if (typeof (KeyEvent.VK_LEFT) !== 'undefined') {
    var VK_LEFT = KeyEvent.VK_LEFT;
    var VK_UP = KeyEvent.VK_UP;
    var VK_RIGHT = KeyEvent.VK_RIGHT;
    var VK_DOWN = KeyEvent.VK_DOWN;
  }
  if (typeof (KeyEvent.VK_ENTER) !== 'undefined') {
    var VK_ENTER = KeyEvent.VK_ENTER;
  }
  if (typeof (KeyEvent.VK_RED) !== 'undefined') {
    var VK_RED = KeyEvent.VK_RED;
    var VK_GREEN = KeyEvent.VK_GREEN;
    var VK_YELLOW = KeyEvent.VK_YELLOW;
    var VK_BLUE = KeyEvent.VK_BLUE;
  }
  if (typeof (KeyEvent.VK_PLAY) !== 'undefined') {
    var VK_PLAY = KeyEvent.VK_PLAY;
    var VK_PAUSE = KeyEvent.VK_PAUSE;
    var VK_PLAY_PAUSE = KeyEvent.VK_PLAY_PAUSE;
    var VK_STOP = KeyEvent.VK_STOP;
  }
  if (typeof (KeyEvent.VK_FAST_FWD) !== 'undefined') {
    var VK_FAST_FWD = KeyEvent.VK_FAST_FWD;
    var VK_REWIND = KeyEvent.VK_REWIND;
  }
  if (typeof (KeyEvent.VK_BACK) !== 'undefined') {
    var VK_BACK = KeyEvent.VK_BACK;
  }
  if (typeof (KeyEvent.VK_0) !== 'undefined') {
    var VK_0 = KeyEvent.VK_0;
    var VK_1 = KeyEvent.VK_1;
    var VK_2 = KeyEvent.VK_2;
    var VK_3 = KeyEvent.VK_3;
    var VK_4 = KeyEvent.VK_4;
    var VK_5 = KeyEvent.VK_5;
    var VK_6 = KeyEvent.VK_6;
    var VK_7 = KeyEvent.VK_7;
    var VK_8 = KeyEvent.VK_8;
    var VK_9 = KeyEvent.VK_9;
  }
}
//
// if we failed, define RC button globals for browser emulator
//
if (typeof (VK_LEFT) === 'undefined') {
  var VK_LEFT = 0x25;
  var VK_UP = 0x26;
  var VK_RIGHT = 0x27;
  var VK_DOWN = 0x28;
}
if (typeof (VK_ENTER) === 'undefined') {
  var VK_ENTER = 0x0d;
}
if (typeof (VK_RED) === 'undefined') {
  var VK_RED = 0x193;
  var VK_GREEN = 0x194;
  var VK_YELLOW = 0x195;
  var VK_BLUE = 0x196;
}
if (typeof (VK_PLAY) === 'undefined') {
  var VK_PLAY = 0x50;
  var VK_PAUSE = 0x51;
  var VK_PLAY_PAUSE = 0x52;
  var VK_STOP = 0x53;
}
if (typeof (VK_FAST_FWD) === 'undefined') {
  var VK_FAST_FWD = 0x46;
  var VK_REWIND = 0x52;
}
if (typeof (VK_BACK) === 'undefined') {
  var VK_BACK = 0x8;
}
if (typeof (VK_0) === 'undefined') {
  var VK_0 = 0x30;
  var VK_1 = 0x31;
  var VK_2 = 0x32;
  var VK_3 = 0x33;
  var VK_4 = 0x34;
  var VK_5 = 0x35;
  var VK_6 = 0x36;
  var VK_7 = 0x37;
  var VK_8 = 0x38;
  var VK_9 = 0x39;
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
    polyfillScript.src = './assets/polyfills-legacy-brPzi115.js';

    // Insert entry script after polyfill loads
    polyfillScript.onload = function () {
      if (!document.getElementById('vite-legacy-entry')) {
        const entryScript = document.createElement('script');
        entryScript.crossOrigin = 'anonymous';
        entryScript.id = 'vite-legacy-entry';
        entryScript.setAttribute('data-src', './assets/index-legacy-B9uFLftc.js');
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
    entryScript.setAttribute('data-src', './assets/index-legacy-B9uFLftc.js');
    entryScript.textContent = "System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))";
    document.body.appendChild(entryScript);
  }
}

function removeCanvasAndLightningScripts() {
  const video = document.getElementById('video-player');
  if (video) {
    video.pause()
    if (window.unload) {
      window.unload(video)
      window.unload = null
    }
    video.remove()
  }

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

function handleKeyCode(kc) {
  try {
    // process buttons
    switch (kc) {
      case VK_RED:
        console.log('### here');

        // red button shows & hides the app scene
        if (currentObject === TYPE.BROADCAST) {
          hideBroadcastAndShowApp();
        }
        else {
          // hideAppAndShowBroadcast();
        }
        // no need to rerender complete scene
        shouldRender = false;
        break;
      default:
        // pressed unhandled key
        shouldRender = false;
    }
  }
  catch (e) {
    // pressed unhandled key, catch the error
  }
  // we return true to prevent default action for processed keys
  return true;
}

//
//  define utility functions for RC
//
var rcUtils = {
  MASK_CONSTANT_RED: 0x1,
  MASK_CONSTANT_GREEN: 0x2,
  MASK_CONSTANT_YELLOW: 0x4,
  MASK_CONSTANT_BLUE: 0x8,
  MASK_CONSTANT_NAVIGATION: 0x10,
  MASK_CONSTANT_PLAYBACK: 0x20,
  MASK_CONSTANT_NUMERIC: 0x100,
  setKeyset: function (app, mask) {
    try {
      app.privateData.keyset.setValue(mask);
    } catch (e) {
      // try as per OIPF DAE v1.1
      try {
        app.private.keyset.setValue(mask);
      }
      catch (ee) {
        // catch the error while setting keyset value
      }
    }
  },
  registerKeyEventListener: function () {
    document.addEventListener('keydown', function (e) {
      if (handleKeyCode(e.keyCode)) {
        e.preventDefault();
      }
    }, false);
  }
};

