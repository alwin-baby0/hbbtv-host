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
  serialNumber: webapis.productinfo.getDuid(),
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

  return {
    serialNumber: hisenseDeviceInfo.uuid
      ? hisenseDeviceInfo.uuid.substring(12)
      : hisenseDeviceInfo.serialNumber,
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

  const deviceSerialNumberAndOsVersion = new Promise((resolve, reject) => {
    webOS.service.request('luna://com.webos.service.tv.systemproperty', {
      method: 'getSystemInfo',
      parameters: { keys: ['serialNumber', 'firmwareVersion'] },
      onSuccess: (response) => {
        resolve({ serialNumber: response.serialNumber, osVersion: response.firmwareVersion });
      },
      onFailure: (error) => {
        console.warn(
          'Failed to get SerialNumberAndOsVersion: [' + error.errorCode + ']: ' + error.errorText
        );
        reject({ serialNumber: null, osVersion: null });
      },
    });
  });

  const response = await Promise.all([
    deviceModelAndBrand,
    deviceMacAdress,
    deviceSerialNumberAndOsVersion,
  ]);

  return response.reduce((acc, info) => ({ ...acc, ...info }), {});
};

const getTitanInfo = () => {
  if (DeviceInfo) {
    const {
      Capability: { os },
      Channel: { brand },
      Product: { firmwareVersion },
    } = DeviceInfo; // Requires titanos device-info-sdk script, can be found at https://docs.titanos.tv/deviceinfoapi

    let serialNumber = localStorage.getItem('titanDeviceID');

    if (!serialNumber) {
      serialNumber = generateRandomUUID();
      localStorage.setItem('titanDeviceID', serialNumber);
    }

    return {
      serialNumber: serialNumber,
      model: extractPhilipsModel(),
      brand: brand,
      os: os,
      osVersion: firmwareVersion,
      macAddress: null,
    };
  } else {
    return getWebInfo();
  }
};

const getNetgemInfo = () => {
  let serialNumber = localStorage.getItem('netgemDeviceID');

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem('netgemDeviceID', serialNumber);
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
  let serialNumber = localStorage.getItem('foxxumDeviceID');

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem('foxxumDeviceID', serialNumber);
  }

  const userAgent = navigator.userAgent;
  const regex = /Model\/([^()]+)/;
  const match = userAgent.match(regex);

  let brand, model, os, osVersion;

  if (match) {
    const matchParts = match[1].split(' ');

    const brandDetails = matchParts[0].split('-');
    brand = brandDetails[0];
    model = brandDetails[1];

    const osDetails = matchParts[1].split('/');
    os = osDetails[0];
    osVersion = osDetails[1];
  } else {
    brand = 'Foxxum';
    model = 'unknown-model';
    os = 'unknown';
    osVersion = 'unknown';
  }

  return {
    serialNumber: serialNumber,
    model: model,
    brand: brand,
    os: os,
    osVersion: osVersion,
    macAddress: 'unknown',
  };
};

const getSunriseInfo = () => {
  let serialNumber = localStorage.getItem('sunriseDeviceID');

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem('sunriseDeviceID', serialNumber);
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
  let serialNumber = localStorage.getItem('metrologicalDeviceID');

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem('metrologicalDeviceID', serialNumber);
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
  let serialNumber = localStorage.getItem('xperiDeviceID');

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem('xperiDeviceID', serialNumber);
  }

  return {
    serialNumber: serialNumber,
    model: 'model-unknown',
    brand: 'Xperi',
    os: 'TiVo',
    osVersion: 'unknown',
    macAddress: 'unknown',
  };
};

const getNetrangeInfo = () => {
  let serialNumber = localStorage.getItem('netrangeDeviceID');

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem('netrangeDeviceID', serialNumber);
  }

  return {
    serialNumber: serialNumber,
    model: 'model-unknown',
    brand: 'Netrange',
    os: 'Netrange',
    osVersion: 'unknown',
    macAddress: 'unknown',
  };
};

const getOcilionInfo = () => {
  let serialNumber = localStorage.getItem('ocilionDeviceID');

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem('ocilionDeviceID', serialNumber);
  }

  return {
    serialNumber: serialNumber,
    model: 'model-unknown',
    brand: 'Ocilion',
    os: 'Ocilion',
    osVersion: 'unknown',
    macAddress: 'unknown',
  };
};

const getWebInfo = () => {
  let serialNumber = localStorage.getItem('webDeviceID');

  if (!serialNumber) {
    serialNumber = generateRandomUUID();
    localStorage.setItem('webDeviceID', serialNumber);
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

// TODO: find out how to get os version for each of the platforms
/**
 *
 * @param { "samsung" | "tizen" | "webos" | "hisense" | "titan" | "web" | "foxxum" | "metrological" | "netgem" | "ocillion" | "sunrise" | "xperi" } deviceType
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
    case 'ocillion':
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
          video_id: id,
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
    console.error('Script not loaded?', error);
  }
};
