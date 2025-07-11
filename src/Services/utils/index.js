import { getDeviceInfo, getDeviceType } from '../../utils/device';

export const V1 = 'v1';
export const V2 = 'v2';
export const auth = 'auth';

const bundleIndentifierMap = (deviceType) => {
  switch (deviceType) {
    case 'lg':
      return 'lgtv';
    case 'tizen':
      return 'samsungtv';
    default:
      return deviceType;
  }
};

export function createApiCtx() {
  const selectedLanguage =
    navigator.language.split('-')[0] || navigator.userLanguage.split('-')[0] || 'en';
  return btoa(
    JSON.stringify({
      languageCode: localStorage.getItem('languageCode') || selectedLanguage,
      version_name: process.env.APP_VERSION,
      osVersion: getDeviceInfo().osVersion || 'no-os-version-defined',
      deviceWidth: window.innerWidth || 1920,
      deviceHeight: window.innerHeight || 1080,
      platform: bundleIndentifierMap(getDeviceType()),
      bundleIdentifier: process.env.APP_BUNDLE,
      api_key: process.env.APP_WATCH4_API_KEY,
      deviceId: getDeviceInfo().serialNumber || 'no-id-defined',
      deviceModel: getDeviceInfo().model || 'no-model-defined',
      deviceMake: getDeviceInfo().brand || 'no-make-defined',
    })
  );
}
