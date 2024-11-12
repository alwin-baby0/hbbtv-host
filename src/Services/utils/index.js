// createApiCtx
export const V1 = 'v1';
export const V2 = 'v2';
export const auth = 'auth';

export const createApiCtx = () =>
  btoa(
    JSON.stringify({
      languageCode: localStorage.getItem('languageCode') || 'en',
      version_name: '1.0.0',
      osVersion: 2,
      deviceWidth: window.innerWidth,
      deviceHeight: window.innerHeight,
      platform: 'lightningjs',
      bundleIdentifier: 'wedotv.samsung',
    })
  );
