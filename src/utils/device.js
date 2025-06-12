let deviceInfo = {}

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
  serialNumber: webapis.productinfo.getDuid(),
  model: webapis.productinfo.getModel(),
  brand: 'samsung',
  os: 'Tizen',
  osVersion: webapis.tvinfo.getVersion(),
  macAddress: webapis.network.getMac(),
});

const getHisenseInfo = () => {
  const hisenseDeviceInfo = window.Hisense_GetDeviceInfo();
  return {
    serialNumber: hisenseDeviceInfo.uuid?.substring(12),
    model: hisenseDeviceInfo.model_name,
    brand: hisenseDeviceInfo.brand,
    os: 'VIDAA',
    osVersion: window.Hisense_GetFirmWareVersion(),
    macAddress: hisenseDeviceInfo.uuid?.substring(0, 12).match(/.{2}/g).join(':'),
  };
};

const getWebOSInfo = async () => {
  if (!webOS) {
    console.error('webOS scripts not loaded');
    return getWebInfo();
  }

  const deviceModelAndBrand = new Promise((resolve) => {
    webOS.deviceInfo(function (device) {
      resolve({ model: device.modelName, brand: device.brandName })
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
        resolve({ macAddress: uuid.replace(/-/g, '').substring(0, 12).match(/.{1,2}/g).join(':') });
      },
      onFailure: (error) => {
        console.warn('Failed to get system ID information: [' + error.errorCode + ']: ' + error.errorText);
        reject({ macAddress: null })
      },
    });
  })

  const deviceSerialNumberAndOsVersion = new Promise((resolve, reject) => {
    webOS.service.request('luna://com.webos.service.tv.systemproperty', {
      method: 'getSystemInfo',
      parameters: { keys: ['serialNumber', 'firmwareVersion'] },
      onSuccess: (response) => {
        resolve({ serialNumber: response.serialNumber, osVersion: response.firmwareVersion });
      },
      onFailure: (error) => {
        console.warn('Failed to get SerialNumberAndOsVersion: [' + error.errorCode + ']: ' + error.errorText);
        reject({ serialNumber: null, osVersion: null })
      },
    });
  })

  const response = await Promise.all([deviceModelAndBrand, deviceMacAdress, deviceSerialNumberAndOsVersion]);

  return response.reduce((acc, info) => ({ ...acc, ...info }), {})
};

const getTitanInfo = () => ({
  serialNumber: generateRandomUUID(),
  model: extractPhilipsModel(),
  brand: 'Philips',
  os: 'TitanOS',
  osVersion: '1.0',
  macAddress: '12:34:56:78:9A:BC',
});

const getWebInfo = () => ({
  serialNumber: generateRandomUUID(),
  model: 'simulated-model',
  brand: 'simulated-brand',
  os: 'Web',
  osVersion: '7.0',
  macAddress: 'simulated-mac-address',
});

/**
 *
 * @param { "tizen" | "webos" | "hisense" | "titan" | "web" } deviceType
 * @returns { Promise<{ serialNumber: string, model: string, brand: string, os: string, osVersion: string, macAddress: string }> }
 */
const setUpDeviceInfo = async (deviceType) => {
  console.log('Device type:', deviceType);
  switch (deviceType) {
    case 'tizen':
      return getTizenInfo();
    case 'hisense':
      return getHisenseInfo();
    case 'lg':
      return await getWebOSInfo();
    case 'titan':
      return getTitanInfo();
    case 'web':
      return getWebInfo();
    default: {
      console.warn('Unknown device');
      return null;
    }
  }
};

const calcualtePrecision = (height, width) => {
  switch (true) {
    case height === 720 && width === 1280: return 2 / 3;
    case height === 2160 && width === 3840: return 2;
    case height === 4320 && width === 7680: return 4;
    default: return 1;
  }
}

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
  const { innerHeight, innerWidth } = window
  const height = innerHeight || 1080
  const width = innerWidth || 1920
  return {
    h: height,
    w: width,
    precision: calcualtePrecision(height, width),
  }
}

export const eventTrackPayload = (event, id) => {
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
          id,
          device: 'SmartTV',
          model,
          brand,
          os,
          version: osVersion,
          device_id: serialNumber,
        },
        process.env.APP_WATCH4_API_KEY,
      );
    else {
      console.error('event tracking object not attched', error);
    }
  } catch (error) {
    console.error('Script not loaded?', error);
  }
};
