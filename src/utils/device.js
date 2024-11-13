import { createAxiosInstance, setTvInfo } from '../api';

var _serialNumber = '';
var _model = '';
var _brand = 'samsung';
// var _macAddress = webapis.network.getMac();
var _deviceType = 'SmartTV';
var _os = '';
var _os_Version = '';

export const getDevice = () => {
  if (window.tizen) {
    return 'tizen';
  } else if (window.webos) {
    return 'webos';
  } else if (window.Hisense) {
    return 'hisense';
  }
  return 'web';
};

const uuidToMac = (uuid) => {
  var uuidWithoutHyphens = uuid.replace(/-/g, '');
  var macString = uuidWithoutHyphens.substring(0, 12);
  var macAddress = macString.match(/.{1,2}/g).join(':');
  return macAddress;
};

const generateRandomUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const randomHex = Math.floor(Math.random() * 16);
    const value = char === 'x' ? randomHex : (randomHex & 0x3) | 0x8;
    return value.toString(16);
  });
};

export const getTVInfo = () => {
  const device = getDevice();
  switch (device) {
    case 'tizen':
      console.log('webapis', webapis);
      console.log('webapis.productinfo', webapis.productinfo);

      _serialNumber = webapis.productinfo.getDuid();
      _model = webapis.productinfo.getModel();
      _brand = 'samsung';
      _os = 'Tizen';
      _os_Version = webapis.tvinfo.getVersion();
      var _macAddress = webapis.network.getMac();

      // Logovanje podataka u konzolu
      console.log(`Device is TIZEN: ${device}`);
      console.log('Serial Number:', _serialNumber);
      console.log('Model:', _model);
      console.log('Brand:', _brand);
      console.log('MAC Address:', _macAddress);

      // Postavljanje serijskog broja u localStorage
      localStorage.setItem('serialNumber', _serialNumber);

      setTvInfo({ mac: _macAddress, sn: _serialNumber, brand: _brand, model: _model });
      createAxiosInstance();
      break;
    case 'web':
      // Definišite neke simulirane vrednosti za web
      // _serialNumber = 'd9b02c2e-3e91-44bc-bd76-9e5f4ef91e09';
      _serialNumber = localStorage.getItem('serialNumber') || generateRandomUUID();
      _model = 'simulated-model';
      _brand = 'simulated-brand';
      _os = 'Web';
      _os_Version = '7.0';
      var _macAddress = 'simulated-mac-address';

      // Logovanje podataka u konzolu
      console.log('Device is web');
      console.log('Serial Number:', _serialNumber);
      console.log('Model:', _model);
      console.log('Brand:', _brand);
      console.log('MAC Address:', _macAddress);

      // Postavljanje serijskog broja u localStorage
      localStorage.setItem('serialNumber', _serialNumber);

      // Ako želite da postavite ove informacije, možete koristiti setTvInfo
      setTvInfo({ mac: _macAddress, sn: _serialNumber, brand: _brand, model: _model });
      createAxiosInstance();
      break;
    case 'webos':
      _os = 'webOS';
      webOS.deviceInfo((device) => {
        console.log('WEBOS MODEL', device.modelName);
        console.log('WEBOS BRAND', device.brandName);
        _model = device.modelName;
        _brand = device.brandName;
      });

      // Get uuid
      webOS.service.request('luna://com.webos.service.sm', {
        method: 'deviceid/getIDs',
        parameters: {
          idType: ['LGUDID'],
        },
        onSuccess: function (inResponse) {
          console.log('UUID: ' + inResponse.idList[0].idValue);
          _macAddress = uuidToMac(inResponse.idList[0].idValue);
          console.log('MAC ADDRESS', _macAddress);
          // Call request for get SN
          webOS.service.request('luna://com.webos.service.tv.systemproperty', {
            method: 'getSystemInfo',
            parameters: { keys: ['serialNumber', 'firmwareVersion'] },
            onSuccess: function (result) {
              _serialNumber = result.serialNumber;
              _os_Version = result.firmwareVersion;
              localStorage.setItem('serialNumber', _serialNumber);

              console.log('Serial Number:', _serialNumber);
              console.log('Model:', _model);
              console.log('Brand:', _brand);
              console.log('MAC Address:', _macAddress);

              setTvInfo({ mac: _macAddress, sn: _serialNumber, brand: _brand, model: _model });
              createAxiosInstance();
            },
            onFailure: function (error) {
              console.error('Failed to get serial number:', error);
            },
          });
        },
        onFailure: function (inError) {
          console.log('Failed to get system ID information');
          console.log('[' + inError.errorCode + ']: ' + inError.errorText);
        },
      });
      break;
  }
};

export const eventTrackPayload = (event, id) => {
  try {
    w4track(
      {
        event,
        app: 'wedotv_lg',
        app_domain: 'lg.wedotv.app',
        app_version: '1.0.0',
        app_bundle: 'wedotv_lg',
        id,
        device: _deviceType,
        model: _model,
        brand: _brand,
        os: _os,
        version: _os_Version,
        device_id: _serialNumber,
      },
      'bded05c0ac827d4bbdb460af22df3e3b'
    );
  } catch (error) {
    console.error('Script not loaded?', error);
  }
};
