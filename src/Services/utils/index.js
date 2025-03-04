import { API_KEY, APP_BUNDLE, APP_VERSION } from '../../config';

// createApiCtx
export const V1 = 'v1';
export const V2 = 'v2';
export const auth = 'auth';

const deviceId = localStorage.getItem('serialNumber');
console.log('deviceId', deviceId);

export const createApiCtx = () =>
  btoa(
    JSON.stringify({
      languageCode: localStorage.getItem('languageCode') || 'en',
      version_name: APP_VERSION,
      osVersion: 2,
      deviceWidth: window.innerWidth,
      deviceHeight: window.innerHeight,
      platform: 'lightningjs',
      bundleIdentifier: APP_BUNDLE,
      api_key: API_KEY,
      deviceId,
    })
  );
