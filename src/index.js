import { Launch } from '@lightningjs/sdk';
import App from './App.js';
import Settings from '../settings.json';
import { getDevice } from './utils/device.js';

function getPerformanceFactor() {
  return 1;
}

export default function (appSettings, platformSettings) {
  if (Settings) {
    Settings.appSettings.stage.h = window.innerHeight;
    Settings.appSettings.stage.w = window.innerWidth;

    // Determine precision based on resolution and performance
    const resolution = { height: window.innerHeight, width: window.innerWidth };
    const performanceFactor = getPerformanceFactor();

    if (resolution.height === 720 && resolution.width === 1280) {
      // 720p
      Settings.appSettings.stage.precision = (2 / 3) * performanceFactor;
    } else if (resolution.height === 2160 && resolution.width === 3840) {
      // 4K
      Settings.appSettings.stage.precision = 2 * performanceFactor;
    } else if (resolution.height === 4320 && resolution.width === 7680) {
      // 8K
      Settings.appSettings.stage.precision = 4 * performanceFactor;
    } else {
      // FHD
      Settings.appSettings.stage.precision = 1 * performanceFactor;
    }
  }

  const device = getDevice();
  let keyCodes = {};

  if (device === 'tizen') {
    keyCodes = {
      10009: 'Back',
      10182: 'Exit',
      427: 'ChannelUp',
      428: 'ChannelDown',
      10252: 'MediaPlayPause',
      412: 'MediaRewind',
      417: 'MediaFastForward',
      415: 'MediaPlay',
      19: 'MediaPause',
      413: 'MediaStop',
    };
  } else if (device === 'webOS') {
    keyCodes = {
      461: 'Back',
      412: 'Exit', // Assuming 412 is meant for 'Exit' on LG devices
    };
  }

  // Assign the key codes to the arguments
  arguments[0].keys = keyCodes;

  window.App = Launch(App, Settings.appSettings, Settings.platformSettings);
  return window.App;
}
