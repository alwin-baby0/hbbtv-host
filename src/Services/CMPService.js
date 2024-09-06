import FetchingService from './FetchingService';
import { V2 } from './utils';

const testAPI = {
  title: 'We value your privacy',
  description:
    "We use cookies to enhance your browsing experience. By clicking 'Yes', you consent to our use of cookies. You can customize your consent preferences by clicking 'Customize'.",
  buttons: {
    yes: {
      label: 'Yes, I Agree',
      callback_url: 'https://api-applicaster.wedo.tv/cmp?choice=1',
    },
    no: {
      label: 'No, I Do Not Agree',
      callback_url: 'https://api-applicaster.wedo.tv/cmp?choice=0',
    },
    customize: {
      label: 'Customize Preferences',
      options: [
        {
          name: 'Privacy Settings',
          link: 'https://cmp.wedo.tv/privacy-settings?device_id=d9b02c2e-3e91-44bc-bd76-9e5f4ef91e09',
          qr: 'https://api-applicaster.wedo.tv/cmp/qr?url=https%3A%2F%2Fexample.com%2Fprivacy-settings%3Fdevice_id%3Dd9b02c2e-3e91-44bc-bd76-9e5f4ef91e09',
        },
        {
          name: 'Cookie Preferences',
          link: 'https://cmp.wedo.tv/cookie-preferences?device_id=d9b02c2e-3e91-44bc-bd76-9e5f4ef91e09',
          qr: 'https://api-applicaster.wedo.tv/cmp/qr?url=https%3A%2F%2Fexample.com%2Fprivacy-settings%3Fdevice_id%3Dd9b02c2e-3e91-44bc-bd76-9e5f4ef91e09',
        },
      ],
    },
  },
  consent: {
    device_id: 'd9b02c2e-3e91-44bc-bd76-9e5f4ef91e09',
    tcf_string: '',
    tcf_version: '2.2',
    expire: {
      date: '2024-09-11T12:52:31Z',
      timestamp: 1726059151,
    },
  },
};

class CMPService extends FetchingService {
  #cmpData;

  async initialFetch() {
    try {
      const cmpResults = await this.#getCMP('d9b02c2e-3e91-44bc-bd76-9e5f4ef91e09');
      this.#cmpData = cmpResults;
      if (cmpResults && cmpResults.data) {
        this.#cmpData = cmpResults.data;
      } else {
        console.error('No data found in CMP results');
      }
    } catch (error) {
      console.error('Error fetching CMP data:', error);
    }
  }

  async selectCMPChoice(deviceCode, choicePick) {
    const choiseResult = await this.#getCMPChoice(deviceCode, choicePick);
    console.log('RES', choiseResult);
  }

  get cmpData() {
    return this.#cmpData;
  }

  #getCMP = async (deviceCode) => {
    console.log('Sending request with deviceCode:', deviceCode); // Loguj zahtev

    const response = await this._request({
      url: `/cmp`,
      apiVersion: V2,
      method: 'GET',
      headers: {
        'X-DEVICE-ID': deviceCode,
      },
    });

    console.log('Response from API:', response.data); // Loguj odgovor

    return response;
  };

  #getCMPChoice = async (deviceCode, choicePick) => {
    return await this._request({
      url: `/cmp`,
      apiVersion: V2,
      method: 'GET',
      headers: {
        'X-Device-ID': deviceCode,
      },
      params: {
        choice: choicePick,
      },
    });
  };

  #getDeviceCode = async () => {
    return await this._request({
      url: `/device.php`,
      apiVersion: auth,
      method: 'GET',
    });
  };

  #getDeviceCodeStatus = async (deviceCode) => {
    return await this._request({
      url: `/device.php`,
      apiVersion: auth,
      method: 'POST',
      body: JSON.stringify({
        device_code: deviceCode,
      }),
    });
  };

  #getToken = async () => {
    return await this._request({
      url: `/token.php`,
      apiVersion: auth,
      method: 'POST',
    });
  };
}

const cmpService = new CMPService();

export { cmpService as CMPService };
