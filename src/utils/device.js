import { Metrics } from '@firebolt-js/sdk';
import { LOCAL_STORAGE_KEYS } from '../constants/globalConstants';
import { getTitanSDK } from '@titan-os/sdk';

let deviceInfo = {};

export const getDeviceType = () => process.env.APP_PLATFORM || 'web';

const generateRandomUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const randomHex = Math.floor(Math.random() * 16);
    const value = char === 'x' ? randomHex : (randomHex & 0x3) | 0x8;
    return value.toString(16);
  });
};

const extractPhilipsModel = () => {
  const userAgentString = navigator.userAgent;
  const regex = /\(Philips, ([^)]+)\)/i;
  const match = userAgentString.match(regex);

  if (match && match[1]) {
    let model = match[1];
    model = model.split(', ')[0];
    return model;
  } else {
    return null;
  }
};

const getTizenInfo = () => ({
  //Requires <script type="text/javascript" src="$WEBAPIS/webapis/webapis.js"></script> for older tizen OS versions
  serialNumber: webapis.adinfo.getTIFA(),
  model: webapis.productinfo.getModel(),
  brand: 'samsung',
  os: 'Tizen',
  osVersion: webapis.tvinfo.getVersion(),
  macAddress: webapis.network.getMac(),
});

const getHisenseInfo = () => {
  const hisenseDeviceInfo = window.Hisense_GetDeviceInfo
    ? window.Hisense_GetDeviceInfo()
    : getWebInfo();

  let serialNumber = hisenseDeviceInfo.uuid
    ? hisenseDeviceInfo.uuid.substring(12)
    : hisenseDeviceInfo.serialNumber;
  serialNumber = serialNumber
    ? serialNumber
    : localStorage.getItem(LOCAL_STORAGE_KEYS.HISENSE_DEVICE_ID);

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem(LOCAL_STORAGE_KEYS.HISENSE_DEVICE_ID, serialNumber);
  }

  return {
    serialNumber: serialNumber,
    model: hisenseDeviceInfo.model_name ? hisenseDeviceInfo.model_name : hisenseDeviceInfo.model,
    brand: hisenseDeviceInfo.brand,
    os: 'VIDAA',
    osVersion: window.Hisense_GetFirmWareVersion
      ? window.Hisense_GetFirmWareVersion()
      : hisenseDeviceInfo.osVersion,
    macAddress: hisenseDeviceInfo.uuid
      ? hisenseDeviceInfo.uuid.substring(0, 12).match(/.{2}/g).join(':')
      : hisenseDeviceInfo.macAddress,
  };
};

const getWebOSInfo = async () => {
  if (!webOS) {
    console.error('webOS scripts not loaded');
    return getWebInfo();
  }

  const deviceModelAndBrand = new Promise((resolve) => {
    webOS.deviceInfo(function (device) {
      resolve({ model: device.modelName, brand: device.brandName });
    });
  });

  const deviceMacAdress = new Promise((resolve, reject) => {
    webOS.service.request('luna://com.webos.service.sm', {
      method: 'deviceid/getIDs',
      parameters: {
        idType: ['LGUDID'],
      },
      onSuccess: (response) => {
        const uuid = response.idList[0].idValue;
        resolve({
          macAddress: uuid
            .replace(/-/g, '')
            .substring(0, 12)
            .match(/.{1,2}/g)
            .join(':'),
        });
      },
      onFailure: (error) => {
        console.warn(
          'Failed to get system ID information: [' + error.errorCode + ']: ' + error.errorText
        );
        reject({ macAddress: null });
      },
    });
  });

  const deviceOsVersion = new Promise((resolve, reject) => {
    webOS.service.request('luna://com.webos.service.tv.systemproperty', {
      method: 'getSystemInfo',
      parameters: { keys: ['firmwareVersion'] },
      onSuccess: (response) => {
        resolve({ osVersion: response.firmwareVersion });
      },
      onFailure: (error) => {
        console.warn('Failed to get OsVersion: [' + error.errorCode + ']: ' + error.errorText);
        reject({ osVersion: null });
      },
    });
  });

  const deviceSerialNumber = new Promise((resolve, reject) => {
    webOS.service.request('luna://com.webos.service.sm', {
      method: 'deviceid/getIDs',
      parameters: { idType: ['LGUDID'] },
      onSuccess: (response) => {
        console.log('Advertising ID:', response.idList[0].idValue);
        resolve({ serialNumber: response.idList[0].idValue });
      },
      onFailure: function (error) {
        console.warn('Failed to get Advertising ID:', error);
        reject({ serialNumber: null });
      },
    });
  });

  const response = await Promise.all([
    deviceModelAndBrand,
    deviceMacAdress,
    deviceOsVersion,
    deviceSerialNumber,
  ]);

  console.log(response);

  return response.reduce((acc, info) => ({ ...acc, ...info }), {});
};

const getTitanInfo = async () => {
  const titanSDK = getTitanSDK();
  const deviceInf = await titanSDK.deviceInfo.getDeviceInfo();

  if (deviceInf) {
    const {
      Capability: { os },
      Channel: { brand },
      Product: { firmwareVersion, mac },
    } = deviceInf;

    let serialNumber = localStorage.getItem(LOCAL_STORAGE_KEYS.TITAN_DEVICE_ID);

    if (!serialNumber) {
      serialNumber = generateRandomUUID();
      localStorage.setItem(LOCAL_STORAGE_KEYS.TITAN_DEVICE_ID, serialNumber);
    }

    return {
      serialNumber: serialNumber,
      model: extractPhilipsModel(),
      brand: brand,
      os: os,
      osVersion: firmwareVersion,
      macAddress: mac,
    };
  } else {
    return getWebInfo();
  }
};

const getNetgemInfo = () => {
  let serialNumber = localStorage.getItem(LOCAL_STORAGE_KEYS.NETGEM_DEVICE_ID);

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem(LOCAL_STORAGE_KEYS.NETGEM_DEVICE_ID, serialNumber);
  }

  return {
    serialNumber: serialNumber,
    model: 'model-unknown',
    brand: 'Netgem',
    os: 'Netgem',
    osVersion: 'unknown',
    macAddress: 'unknown',
  };
};

const getFoxxumInfo = () => {
  // <script src="https://cache.zeasn.tv/webstatic/homepage_web/deviceinfo/zeasn_deviceInfo_sdk.js" type="text/javascript"></script>
  const infoDevice = new Promise((resolve) => {
    window.onDeviceInfoReady((DeviceInfo) => {
      let serialNumber = DeviceInfo?.Product?.deviceID;

      if (!serialNumber) {
        serialNumber = localStorage.getItem(LOCAL_STORAGE_KEYS.FOXXUM_DEVICE_ID);

        if (!serialNumber) {
          serialNumber = generateRandomUUID();
          localStorage.setItem(LOCAL_STORAGE_KEYS.FOXXUM_DEVICE_ID, serialNumber);
        }
      }

      resolve({
        serialNumber,
        model: DeviceInfo?.Product?.platform ?? 'unknown',
        brand: DeviceInfo?.Channel?.brand ?? 'unknown',
        os: DeviceInfo?.Capability?.os ?? 'unknown',
        osVersion: DeviceInfo?.Product?.firmwareVersion ?? 'unknown',
        macAddress: 'unknown',
      });
    });
  });

  return infoDevice;
};
const getSunriseInfo = () => {
  let serialNumber = localStorage.getItem(LOCAL_STORAGE_KEYS.SUNRISE_DEVICE_ID);

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem(LOCAL_STORAGE_KEYS.SUNRISE_DEVICE_ID, serialNumber);
  }

  const userAgent = navigator.userAgent;
  // Regex to capture MN and FV
  const regex = /MN=([^;]+);.*FV=([^;]+);/;
  const match = userAgent.match(regex);

  return {
    serialNumber: serialNumber,
    model: match ? match[1].trim() : 'Sunrise',
    brand: 'Sunrise',
    os: 'Linux',
    osVersion: match ? match[2].trim() : '',
    macAddress: 'unknown',
  };
};

const getMetrologicalInfo = () => {
  let serialNumber = localStorage.getItem(LOCAL_STORAGE_KEYS.METROLOGICAL_DEVICE_ID);

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem(LOCAL_STORAGE_KEYS.METROLOGICAL_DEVICE_ID, serialNumber);
  }

  const userAgent = navigator.userAgent;
  const userAgentSplit = userAgent.split(' ');

  const model = userAgentSplit[userAgentSplit.length - 2];

  return {
    serialNumber: serialNumber,
    model: model,
    brand: 'ComCast',
    os: 'Entertainment OS',
    osVersion: 'unknown',
    macAddress: 'unknown',
  };
};

const getXperiInfo = () => {
  let serialNumber = localStorage.getItem(LOCAL_STORAGE_KEYS.XPERI_DEVICE_ID);

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem(LOCAL_STORAGE_KEYS.XPERI_DEVICE_ID, serialNumber);
  }

  const uaString = navigator.userAgent;

  let osVersion = 'unknown';
  let brand = 'Xperi';

  const re = /TiVoOS\/([^\s\)]+)\s*\([^)]*;([^;\)]+)/i;
  const match = uaString.match(re);
  if (match) {
    osVersion = match[1];
    brand = match[2].trim();
  }

  return {
    serialNumber: serialNumber,
    model: 'model-unknown',
    brand: brand,
    os: 'TiVoOS',
    osVersion: osVersion,
    macAddress: 'unknown',
  };
};

const parseNetrangeUserAgent = (uaString = '') => {
  const defaultInfo = {
    brand: 'Netrange',
    model: 'model-unknown',
    os: 'Netrange',
    osVersion: 'unknown',
    macAddress: 'unknown',
  };

  if (!uaString) return defaultInfo;

  const osVersionMatch = uaString.match(/QJY\/([0-9.]+)/i);
  const osVersion = osVersionMatch?.[1] || defaultInfo.osVersion;

  const modelBlockMatch = uaString.match(/QJY\/[0-9.]+\s+([^\s]+)/i);
  let brand = defaultInfo.brand;
  let model = defaultInfo.model;

  if (modelBlockMatch && modelBlockMatch[1]) {
    const parts = modelBlockMatch[1].split('_');
    if (parts.length >= 2) {
      brand = parts[0] || brand;
      model = parts[1] || model;
    }
  }

  const didMatch = uaString.match(/DID\/([A-Za-z0-9]+)/i);
  let macAddress = defaultInfo.macAddress;

  if (didMatch && didMatch[1]) {
    const raw = didMatch[1];

    if (/^[0-9A-Fa-f]{12}$/.test(raw)) {
      macAddress = raw
        .toUpperCase()
        .match(/.{1,2}/g)
        .join(':'); // 00198B9FBE25 → 00:19:8B:9F:BE:25
    }
    return {
      brand,
      model,
      os: defaultInfo.os,
      osVersion,
      macAddress,
    };
  }
};

const getNetrangeInfo = () => {
  let serialNumber = localStorage.getItem(LOCAL_STORAGE_KEYS.NETRANGE_DEVICE_ID);

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem(LOCAL_STORAGE_KEYS.NETRANGE_DEVICE_ID, serialNumber);
  }
  const ua = navigator.userAgent || '';
  const parsed = parseNetrangeUserAgent(ua);

  return {
    serialNumber: serialNumber,
    model: parsed && parsed.model ? parsed.model : 'Netrange',
    brand: parsed && parsed.brand ? parsed.brand : 'Netrange',
    os: parsed && parsed.os ? parsed.os : 'Netrange OS',
    osVersion: parsed && parsed.osVersion ? parsed.osVersion : 'unknown',
    macAddress: parsed && parsed.macAddress ? parsed.macAddress : 'unknown',
  };
};

const parseOcilionUserAgent = (uaString = '') => {
  const defaultInfo = {
    brand: 'Ocilion',
    model: 'unknown',
    os: 'unknown',
    osVersion: 'unknown',
    macAddress: 'unknown',
  };

  if (!uaString) return defaultInfo;

  const os = /Linux/i.test(uaString) ? 'Linux' : defaultInfo.os;
  const chromeMatch = uaString.match(/Chrome\/([0-9.]+)/i);
  const wpeMatch = uaString.match(/WPE\/([0-9.]+)/i);
  const webkitMatch = uaString.match(/AppleWebKit\/([0-9.]+)/i);

  const osVersion =
    (chromeMatch?.[1] && `Chrome/${chromeMatch[1]}`) ||
    (wpeMatch?.[1] && `WPE/${wpeMatch[1]}`) ||
    (webkitMatch?.[1] && `AppleWebKit/${webkitMatch[1]}`) ||
    defaultInfo.osVersion;

  return {
    ...defaultInfo,
    os,
    osVersion,
  };
};

const getOcilionInfo = () => {
  let serialNumber = localStorage.getItem(LOCAL_STORAGE_KEYS.OCILION_DEVICE_ID);

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem(LOCAL_STORAGE_KEYS.OCILION_DEVICE_ID, serialNumber);
  }

  const ua = navigator.userAgent || '';

  const parsed = parseOcilionUserAgent(ua);

  return {
    serialNumber,
    model: parsed.model,
    brand: parsed.brand,
    os: parsed.os,
    osVersion: parsed.osVersion,
    macAddress: parsed.macAddress,
  };
};

const getWebInfo = () => {
  let serialNumber = localStorage.getItem(LOCAL_STORAGE_KEYS.WEB_DEVICE_INFO);

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem(LOCAL_STORAGE_KEYS.WEB_DEVICE_INFO, serialNumber);
  }

  return {
    serialNumber: serialNumber,
    model: 'simulated-model',
    brand: 'simulated-brand',
    os: 'Web',
    osVersion: '7.0',
    macAddress: 'simulated-mac-address',
  };
};

/**
 *
 * @param { "samsung" | "tizen" | "webos" | "hisense" | "titan" | "web" | "foxxum" | "metrological" | "netgem" | "ocilion" | "sunrise" | "xperi" } deviceType
 * @returns { Promise<{ serialNumber: string, model: string, brand: string, os: string, osVersion: string, macAddress: string }> }
 */
const setUpDeviceInfo = async (deviceType) => {
  console.log('Device type:', deviceType);

  switch (deviceType) {
    case 'samsung':
    case 'tizen':
      return getTizenInfo();
    case 'hisense':
      return getHisenseInfo();
    case 'lg':
      return await getWebOSInfo();
    case 'titan':
      return getTitanInfo();
    case 'netgem':
      return getNetgemInfo();
    case 'netrange':
      return getNetrangeInfo();
    case 'xperi':
      return getXperiInfo();
    case 'ocilion':
      return getOcilionInfo();
    case 'foxxum':
      return getFoxxumInfo();
    case 'sunrise':
      return getSunriseInfo();
    case 'metrological':
      return getMetrologicalInfo();
    case 'web':
      return getWebInfo();
    default: {
      console.warn('Unknown device');
      return getWebInfo();
    }
  }
};

const calcualtePrecision = (height, width) => {
  switch (true) {
    case height === 720 && width === 1280:
      return 2 / 3;
    case height === 2160 && width === 3840:
      return 2;
    case height === 4320 && width === 7680:
      return 4;
    default:
      return 1;
  }
};

/**
 * Initiate and save device info
 * @param {string} deviceType
 */
export const initDeviceInfo = async (deviceType) => {
  deviceInfo = await setUpDeviceInfo(deviceType);
};

/**
 * Returns device info.
 * @returns {{ serialNumber: string, model: string, brand: string, os: string, osVersion: string, macAddress: string }}
 */
export const getDeviceInfo = () => deviceInfo;

export const getDeviceStageProps = () => {
  const { innerHeight, innerWidth } = window;
  const height = innerHeight || 1080;
  const width = innerWidth || 1920;
  return {
    h: height,
    w: width,
    precision: calcualtePrecision(height, width),
  };
};

export const eventTrackPayload = (event, id, seriesID) => {
  const { serialNumber, osVersion, os, model, brand } = getDeviceInfo();
  try {
    if (w4track)
      w4track(
        {
          event,
          app: process.env.APP_NAME,
          app_domain: process.env.APP_DOMAIN,
          app_version: process.env.APP_VERSION,
          app_bundle: process.env.APP_BUNDLE,
          ...(id && { video_id: id }),
          device: 'SmartTV',
          model,
          brand,
          os,
          version: osVersion,
          device_id: serialNumber,
          ...(seriesID && { series_id: seriesID }),
        },
        process.env.APP_WATCH4_API_KEY
      );
    else {
      console.error('event tracking object not attched', error);
    }
  } catch (error) {
    const deviceType = getDeviceType();
    deviceType === 'metrological' &&
      Metrics.error(
        Metrics.ErrorType.MEDIA,
        error.response ? error.response.status.toString() : '500',
        'Script not loaded',
        false
      );
    console.error('Script not loaded?', error);
  }
};
