import { createAxiosInstance, setTvInfo } from '../api';

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

      var _serialNumber = webapis.productinfo.getDuid();
      var _model = webapis.productinfo.getModel();
      var _brand = 'samsung';
      var _macAddress = webapis.network.getMac();

      // Logovanje podataka u konzolu
      console.log(`Device is TIZEN: ${device}`);
      console.log('Serial Number:', _serialNumber);
      console.log('Model:', _model);
      console.log('Brand:', _brand);
      console.log('MAC Address:', _macAddress);

      setTvInfo({ mac: _macAddress, sn: _serialNumber, brand: _brand, model: _model });
      createAxiosInstance();
      break;
    case 'web':
      // Definišite neke simulirane vrednosti za web
      var _serialNumber = 'simulated-serial-number';
      var _model = 'simulated-model';
      var _brand = 'simulated-brand';
      var _macAddress = 'simulated-mac-address';

      // Logovanje podataka u konzolu
      console.log('Device is web');
      console.log('Serial Number:', _serialNumber);
      console.log('Model:', _model);
      console.log('Brand:', _brand);
      console.log('MAC Address:', _macAddress);

      // Ako želite da postavite ove informacije, možete koristiti setTvInfo
      setTvInfo({ mac: _macAddress, sn: _serialNumber, brand: _brand, model: _model });
      createAxiosInstance();
      break;
  }
};
