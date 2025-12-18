import {
  API_METHODS,
  API_URLS,
  CUSTOM_EVENT_NAMES,
  LOCAL_STORAGE_KEYS,
} from '../../constants/globalConstants';
import FetchingService from '../FetchingService';
import { auth } from '../utils';

class AuthorizationService extends FetchingService {
  async setDeviceCodeStatusInterval(deviceCode) {
    try {
      if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
        this._intervalId = setInterval(async () => {
          try {
            const statusResponse = await this.#getDeviceCodeStatus(deviceCode);
            console.log('statusResponse', statusResponse.data);

            if (statusResponse.data.status === 'authorized') {
              this.clearPollingInterval(this._intervalId);
              console.log('Device code status condition met, stopping the interval.');
              console.log('status:', statusResponse.data.status);
              console.log('autorization code:', statusResponse.data.pin);
              const timestamp = Math.floor(Date.now() / 1000);

              const tokenData = await this.#getToken(deviceCode, timestamp);
              localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(tokenData.data));
              const event = new CustomEvent(CUSTOM_EVENT_NAMES.USER_LOG_IN);
              window.dispatchEvent(event);
            }
          } catch (statusError) {
            console.error('Error fetching device code status:', statusError);
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error fetching device code:', error);
      this.clearPollingInterval(this._intervalId);
    }
  }

  clearPollingInterval() {
    clearInterval(this._intervalId);
  }

  getDeviceCode = async () => {
    return await this._request({
      url: `/${API_URLS.GET_DEVICE_CODE}`,
      apiVersion: auth,
      method: API_METHODS.POST,
      params: {
        client_id: process.env.APP_CMP_CLIENT_ID,
      },
    });
  };

  #getDeviceCodeStatus = async (deviceCode) => {
    return await this._request({
      url: `/${API_URLS.GET_DEVICE_STATUS}`,
      apiVersion: auth,
      method: API_METHODS.GET,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        client_id: process.env.APP_CMP_CLIENT_ID,
        grant_type: `urn:ietf:params:oauth:grant-type:device_code`,
        device_code: deviceCode,
      },
    });
  };

  #getToken = async (authorizationCode) => {
    return await this._request({
      url: `/${API_URLS.GET_TOKEN}`,
      apiVersion: auth,
      method: API_METHODS.POST,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        client_id: process.env.APP_CMP_CLIENT_ID,
        client_secret: process.env.APP_CMP_CLIENT_SECRET,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        device_code: authorizationCode,
      },
    });
  };

  refreshToken = async () => {
    const refreshToken = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
    ).refresh_token;

    const deviceCode = await this.getDeviceCode();

    return await this._request({
      url: `/${API_URLS.GET_TOKEN}`,
      apiVersion: auth,
      method: API_METHODS.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.APP_CMP_CLIENT_ID,
        device_code: deviceCode,
      },
    });
  };
}

const authorizationService = new AuthorizationService();

export { authorizationService as AuthorizationService };
