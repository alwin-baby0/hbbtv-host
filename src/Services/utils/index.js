export const V1 = 'v1';
export const V2 = 'v2';

export const createApiCtx = () => btoa(JSON.stringify({
  languageCode: localStorage.getItem('languageCode') || 'en',
  version_name: '1.0.0',
  osVersion: 2,
  deviceWidth: 1280,
  platform: 'lightningjs',
  bundleIdentifier: 'com.appwedotv',
}));
