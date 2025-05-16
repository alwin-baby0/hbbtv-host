import { getDeviceInfo, getDeviceType } from '../../utils/device';

export const V1 = 'v1';
export const V2 = 'v2';
export const auth = 'auth';

const bundleIndentifierMap = (deviceType) => {
  switch (deviceType) {
    case 'lg': return 'lgtv';
    case 'tizen': return 'samsungtv';
    default: return deviceType;
  }
}

export function createApiCtx() {
  return btoa(
    JSON.stringify({
      languageCode: localStorage.getItem('languageCode') || 'en',
      version_name: process.env.APP_VERSION,
      osVersion: 2,
      deviceWidth: window.innerWidth,
      deviceHeight: window.innerHeight,
      platform: bundleIndentifierMap(getDeviceType()),
      bundleIdentifier: process.env.APP_BUNDLE,
      api_key: process.env.APP_WATCH4_API_KEY, // TODO: Check if here we should use google analitics or watch4 api key??
      deviceId: getDeviceInfo().serialNumber,
    })
  );
}
