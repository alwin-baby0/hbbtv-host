import { Launch } from '@lightningjs/sdk';
import App from './App.js';
import Settings from '../settings.json';
import { getDevice } from './utils/device.js';

function getPerformanceFactor() {
  return 1;
}

export default function () {
  const { appSettings, platformSettings } = Settings;
  if (appSettings) {
    appSettings.stage.h = window.innerHeight;
    appSettings.stage.w = window.innerWidth;

    // Determine precision based on resolution and performance
    const resolution = { height: window.innerHeight, width: window.innerWidth };
    const performanceFactor = getPerformanceFactor();

    if (resolution.height === 720 && resolution.width === 1280) {
      // 720p
      appSettings.stage.precision = (2 / 3) * performanceFactor;
    } else if (resolution.height === 2160 && resolution.width === 3840) {
      // 4K
      appSettings.stage.precision = 2 * performanceFactor;
    } else if (resolution.height === 4320 && resolution.width === 7680) {
      // 8K
      appSettings.stage.precision = 4 * performanceFactor;
    } else {
      // FHD
      appSettings.stage.precision = 1 * performanceFactor;
    }
  }
  const device = getDevice();
  let keyCodes = {};
  Settings.appSettings.keys = {};

  switch (device) {
    case 'tizen':
      appSettings.keys = {
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
      break;
    case 'webos':
      appSettings.keys = {
        412: 'Exit',
        461: 'Back',
        33: 'ChannelUp',
        34: 'ChannelDown',
        415: 'MediaPlay',
        19: 'MediaPause',
        417: 'MediaFastForward',
        412: 'MediaRewind',
        413: 'MediaStop',
      };
      break;
    case 'hisense':
      appSettings.keys = {
        8: 'Back',
        427: 'ChannelUp',
        428: 'ChannelDown',
        415: 'MediaPlay',
        19: 'MediaPause',
        417: 'MediaFastForward',
        412: 'MediaRewind',
        413: 'MediaStop',
      };
      break;
    // Dodajte druge slučajeve prema potrebi
    default:
      // Ocilion Key Codes
      // 461 || 17: 'Back',
      appSettings.keys = {
        8: 'Back',
        412: 'MediaRewind',
        417: 'MediaTrackNext',
        415: 'MediaPlay',
        413: 'MediaStop',
        179: 'MediaPlayPause',
      };
      // Ako nije prepoznat uređaj, neka ostane prazno
      break;
  }

  // Assign the key codes to the arguments
  arguments[0].keys = keyCodes;

  window.App = Launch(App, appSettings, platformSettings);
  return window.App;
}
