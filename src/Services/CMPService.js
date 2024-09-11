import FetchingService from './FetchingService';
import { V2, auth } from './utils';

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
    await this.#getCMPChoice(deviceCode, choicePick);
  }

  // async fetchDeviceCode() {
  //   const response = await this.#getDeviceCode();
  //   console.log('device code:', response.data.device_code);
  //   return response.data;
  // }
  async fetchDeviceCode() {
    try {
      const response = await this.#getDeviceCode();
      const deviceCode = response.data.device_code;
      let authCode = '';
      console.log('device code:', deviceCode);

      this._intervalId = setInterval(async () => {
        try {
          const statusResponse = await this.#getDeviceCodeStatus(deviceCode);
          console.log('statusResponse', statusResponse.data);
          console.log(authCode);

          if (statusResponse.data.status === 'approved') {
            // clearInterval(intervalId);
            this.clearPollingInterval(this._intervalId); // Use the clear function
            console.log('Device code status condition met, stopping the interval.');
            console.log('status:', statusResponse.data.status);
            console.log('autorization code:', statusResponse.data.authorization_code);
            authCode = statusResponse.data.authorization_code;
            const timestamp = Math.floor(Date.now() / 1000);

            const tokenData = await this.#getToken(
              statusResponse.data.authorization_code,
              timestamp
            );
            console.log(tokenData);
          }
        } catch (statusError) {
          console.error('Error fetching device code status:', statusError);
        }
      }, 5000);
      return response.data;
    } catch (error) {
      console.error('Error fetching device code:', error);
      this.clearPollingInterval(this._intervalId); // Use the clear function on error
    }
  }

  clearPollingInterval() {
    clearInterval(this._intervalId);
  }

  get cmpData() {
    return this.#cmpData;
  }

  #getCMP = async (deviceCode) => {
    const response = await this._request({
      url: `/cmp`,
      apiVersion: V2,
      method: 'GET',
      headers: {
        'X-DEVICE-ID': deviceCode,
      },
    });

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
      params: {
        client_id: 'c8a895d28ee9c800298d4e55d4e75586e7cec291',
        client_secret: 'b6d16f854b572ac95e3bd0a12ac6ed9d921767d7',
      },
    });
  };

  #getDeviceCodeStatus = async (deviceCode) => {
    return await this._request({
      url: `/device-status.php`,
      apiVersion: auth,
      method: 'POST',
      params: {
        client_id: 'c8a895d28ee9c800298d4e55d4e75586e7cec291',
        client_secret: 'b6d16f854b572ac95e3bd0a12ac6ed9d921767d7',
        device_code: deviceCode,
      },
    });
  };

  #getToken = async (authorizationCode, timestamp) => {
    return await this._request({
      url: `/token.php`,
      apiVersion: auth,
      method: 'POST',
      headers: {
        'X-nocache': timestamp,
      },
      params: {
        client_id: 'c8a895d28ee9c800298d4e55d4e75586e7cec291',
        client_secret: 'b6d16f854b572ac95e3bd0a12ac6ed9d921767d7',
        grant_type: 'authorization_code',
        code: authorizationCode,
      },
    });
  };
}

const cmpService = new CMPService();

export { cmpService as CMPService };
