import { Launch } from '@lightningjs/sdk';
import App from './App.js';
import Settings from '../settings.json';
import { eventTrackPayload, getDeviceInfo, getDeviceStageProps, getDeviceType, initDeviceInfo } from './utils/device.js';
import { setupKeys } from './utils/keys.js';

/**
 * This file should serve as a place to add for example polyfills, initiate
 * services before the app starts, in one word prepare for app start...
 * If needed, app, stage and canvas can be saved in this file as global
 * variables and used elsewhere in the project.
 */

const sequence = (steps) => {
  return steps.reduce((promise, method) => {
    return promise.then(() => method());
  }, Promise.resolve(null));
};

const loadJS = (url) => {
  return new Promise((resolve) => {
    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.onload = resolve;
    scriptTag.src = url;
    document.body.appendChild(scriptTag);
  });
};

const { appSettings = {}, platformSettings } = Settings;
const deviceType = getDeviceType();

sequence([
  () => {
    appSettings.stage = {
      ...appSettings.stage,
      ...getDeviceStageProps(),
    };
  },
  () => {
    appSettings.keys = setupKeys(deviceType);
  },
  async () => initDeviceInfo(deviceType),
  async () => {
    if (process.env.APP_USE_GA === 'true') {
      await loadJS(`${process.env.APP_BASE_GA}/js?id=${process.env.APP_GA_API_KEY}`);
      window.dataLayer ?? (window.dataLayer = []);
      window.gtag = function () {
        dataLayer.push(arguments);
      }
    }
  },
  async () => loadJS(`${process.env.APP_BASE_WATCH4}/track.js?api_key=${process.env.APP_WATCH4_API_KEY}`),
  () => {
    const app = Launch(App, appSettings, platformSettings);
    document.body.appendChild(app.stage.getCanvas());
    console.log('App launched on device: ', Object.entries(getDeviceInfo()).map((([key, value]) => `| ${key}: ${value} |`)));
    eventTrackPayload('launch_app', getDeviceInfo().serialNumber);
  }
])
