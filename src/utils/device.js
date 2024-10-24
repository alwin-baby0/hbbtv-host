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
      _serialNumber = 'd9b02c2e-3e91-44bc-bd76-9e5f4ef91e09';
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
  }
};

export const eventTrackPayload = (event, id) => {
  try {
    w4track(
      {
        event,
        app: 'wedotv.samsung',
        app_domain: 'samsung.wedotv.app',
        app_version: '1.0.0',
        app_bundle: 'com.wedotv.app',
        id,
        device: _deviceType,
        model: _model,
        brand: _brand,
        os: _os,
        version: _os_Version,
        device_id: _serialNumber,
      },
      '6d4bbea06e8ee78ca99183a6ffc7e16'
    );
  } catch (error) {
    console.error('Script not loaded?', error);
  }
};
