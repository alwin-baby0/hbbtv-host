import { LOCAL_STORAGE_KEYS } from '../../constants/globalConstants';
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
  let selectedLanguage = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE);

  if (!selectedLanguage) {
    selectedLanguage =
      navigator.language.split('-')[0] || navigator.userLanguage.split('-')[0] || 'en';

    const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS));
    if (
      !settings ||
      (settings && !Object.keys(settings.supported_languages).includes(selectedLanguage))
    ) {
      selectedLanguage = 'en';
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE, selectedLanguage);
  }

  const deviceInfo = getDeviceInfo();
  const userConsent = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_CONSENT));
  const didomiConfig = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.DIDOMI_CONFIG));

  return btoa(
    JSON.stringify({
      languageCode: localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE) || selectedLanguage,
      version_name: process.env.APP_VERSION,
      osVersion: deviceInfo.osVersion || 'no-os-version-defined',
      deviceWidth: window.innerWidth || 1920,
      deviceHeight: window.innerHeight || 1080,
      platform: bundleIndentifierMap(getDeviceType()),
      bundleIdentifier: process.env.APP_BUNDLE,
      api_key: process.env.APP_WATCH4_API_KEY,
      deviceId: deviceInfo.serialNumber || 'no-id-defined',
      deviceModel: deviceInfo.model || 'no-model-defined',
      deviceMake: deviceInfo.brand || 'no-make-defined',
      tcf: {
        gdprApplies: window.didomiState && window.didomiState.didomiGDPRApplies ? true : false,
        tcfString: userConsent && userConsent.consent_string ? userConsent.consent_string : null,
        cmpSdkId: didomiConfig && didomiConfig.id ? didomiConfig.id : null,
        cmpSdkVersion: didomiConfig && didomiConfig.version ? didomiConfig.version : null,
      },
    })
  );
}
