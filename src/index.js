import { Launch } from '@lightningjs/sdk';
import App from './App.js';
import Settings from '../settings.json';
import { getDeviceStageProps, getDeviceType, initDeviceInfo } from './utils/device.js';
import { setupKeys } from './utils/keys.js';

/**
 * This file should serve as a place to add for example polyfills, initiate
 * services before the app starts, in one word prepare for app start...
 * If needed, app, stage and canvas can be saved in this file as global
 * variables and used elsewhere in the project.
 */

const { appSettings = {}, platformSettings } = Settings;

appSettings.stage = {
  ...appSettings.stage,
  ...getDeviceStageProps(),
};

const deviceType = getDeviceType();
appSettings.keys = setupKeys(deviceType);

initDeviceInfo(deviceType).then(() => {
  const app = Launch(App, appSettings, platformSettings);
  document.body.appendChild(app.stage.getCanvas());
})
