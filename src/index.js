import { Launch } from '@lightningjs/sdk';
import App from './App.js';
import { getDevice } from './utils/device.js';
export default function () {
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

  window.App = Launch(App, ...arguments);
  return window.App;
}
