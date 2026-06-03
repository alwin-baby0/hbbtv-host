/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Launch } from '@lightningjs/sdk';
import { Lifecycle, Parameters, Metrics } from '@firebolt-js/sdk';
import App from './App.js';
import Settings from '../settings.json';
import {
  eventTrackPayload,
  getDeviceInfo,
  getDeviceStageProps,
  getDeviceType,
  initDeviceInfo,
} from './utils/device.js';
import { setupKeys } from './utils/keys.js';
import FetchingService from './Services/FetchingService.js';
import {
  SettingsService,
  LoggingService,
  AuthorizationService,
  DidomiService,
} from './Services/index.js';
import { EVENT_NAMES, LOCAL_STORAGE_KEYS, LOG_LEVEL } from './constants/globalConstants.js';

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
    window.keyCodes = appSettings.keys;
  },
  () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.EPISODE_ID_DETAIL);
  },
  async () => await initDeviceInfo(deviceType),
  async () => {
    await DidomiService.init();
    const userNotice = window.Didomi.getConfig();

    let userConsent = await window.Didomi.getCurrentUserStatus();

    let isDeclined = true;
    Object.keys(userConsent.purposes).forEach((key) => {
      if (userConsent.purposes[key].enabled) {
        isDeclined = false;
      }
    });

    // commenting this out as we are handling consent in the hbbTv code
    // if (isDeclined || userNotice.notice.daysBeforeShowingAgain <= 0) window.Didomi.notice.show();

    window.didomiOnReady &&
      window.didomiOnReady.push(async () => {
        userConsent = await window.Didomi.getCurrentUserStatus();
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_CONSENT, JSON.stringify(userConsent));

        localStorage.setItem(LOCAL_STORAGE_KEYS.DIDOMI_CONFIG, JSON.stringify(userNotice));
      });
  },
  () => FetchingService.init(),
  async () => {
    if (process.env.APP_USE_GA === 'true') {
      await loadJS(`${process.env.APP_BASE_GA}/js?id=${process.env.APP_GA_API_KEY}`);
      window.dataLayer ?? (window.dataLayer = []);
      window.gtag = function () {
        dataLayer.push(arguments);
      };
    }
  },
  async () =>
    loadJS(`${process.env.APP_BASE_WATCH4}/track.js?api_key=${process.env.APP_WATCH4_API_KEY}`),
  async () => {
    await AuthorizationService.scheduleDeviceAuthorizationCodeRefresh();
    const settings = await SettingsService.getSettings();
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings.data));
  },
  async () => {
    try {
      const app = Launch(App, appSettings, platformSettings);
      document.body.appendChild(app.stage.getCanvas());
      console.log(
        'App launched on device: ',
        Object.entries(getDeviceInfo()).map(([key, value]) => `| ${key}: ${value} |`)
      );

      deviceType === 'metrological' && Lifecycle.ready();
      eventTrackPayload(EVENT_NAMES.LAUNCH_APP);

      deviceType === 'metrological' && (await Parameters.initialization());

      deviceType === 'metrological' && (await Metrics.appInfo(process.env.APP_VERSION));
    } catch (error) {
      console.error('Failed to start the app', error);
      const deviceInfo = getDeviceInfo();
      LoggingService.postLog(LOG_LEVEL.ERROR, deviceInfo, {
        message: 'Failed to start the app',
        error,
      });
      deviceType === 'metrological' &&
        Metrics.error(Metrics.ErrorType.OTHER, '', 'Failed to start the app', true);
    }
  },
]);
