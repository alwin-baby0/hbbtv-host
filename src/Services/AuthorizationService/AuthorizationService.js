import { Metrics } from '@firebolt-js/sdk';
import {
  API_METHODS,
  API_URLS,
  CUSTOM_EVENT_NAMES,
  LOCAL_STORAGE_KEYS,
} from '../../constants/globalConstants';
import FetchingService from '../FetchingService';
import { auth } from '../utils';
import { getDeviceType } from '../../utils/device';

class AuthorizationService extends FetchingService {
  async setDeviceCodeStatusInterval(deviceCode) {
    const deviceType = getDeviceType();
    try {
      if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
        this._intervalId = setInterval(async () => {
          try {
            const statusResponse = await this.#getDeviceCodeStatus(deviceCode);
            console.log('statusResponse', statusResponse.data);

            if (statusResponse.data.status === 'approved') {
              this.clearPollingInterval(this._intervalId);
              console.log('Device code status condition met, stopping the interval.');
              console.log('status:', statusResponse.data.status);
              console.log('autorization code:', statusResponse.data.authorization_code);
              const timestamp = Math.floor(Date.now() / 1000);

              const tokenData = await this.#getToken(
                statusResponse.data.authorization_code,
                timestamp
              );
              localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(tokenData.data));
              const event = new CustomEvent(CUSTOM_EVENT_NAMES.USER_LOG_IN);
              window.dispatchEvent(event);
            }
          } catch (statusError) {
            deviceType === 'metrological' &&
              Metrics.error(
                Metrics.ErrorType.RESTRICTION,
                '400',
                'Error fetching device code status',
                true
              );
            console.error('Error fetching device code status:', statusError);
          }
        }, 5000);
      }
    } catch (error) {
      deviceType === 'metrological' &&
        Metrics.error(Metrics.ErrorType.RESTRICTION, '400', 'Error fetching device code', true);
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
      method: API_METHODS.GET,
      params: {
        client_id: process.env.APP_CMP_CLIENT_ID,
        client_secret: process.env.APP_CMP_CLIENT_SECRET,
      },
    });
  };

  #getDeviceCodeStatus = async (deviceCode) => {
    return await this._request({
      url: `/${API_URLS.GET_DEVICE_STATUS}`,
      apiVersion: auth,
      method: API_METHODS.POST,
      params: {
        client_id: process.env.APP_CMP_CLIENT_ID,
        client_secret: process.env.APP_CMP_CLIENT_SECRET,
        device_code: deviceCode,
      },
    });
  };

  #getToken = async (authorizationCode) => {
    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.GET_TOKEN}`,
      apiVersion: auth,
      method: API_METHODS.POST,
      headers: {
        'X-nocache': timestamp,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        client_id: process.env.APP_CMP_CLIENT_ID,
        client_secret: process.env.APP_CMP_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: authorizationCode,
      },
    });
  };

  revokeToken = async (token) => {
    return await this._request({
      url: `/${API_URLS.REVOKE_TOKEN}`,
      apiVersion: auth,
      method: API_METHODS.POST,
      data: {
        client_id: process.env.APP_CMP_CLIENT_ID,
        client_secret: process.env.APP_CMP_CLIENT_SECRET,
        token: token,
      },
    });
  };
}

const authorizationService = new AuthorizationService();

export { authorizationService as AuthorizationService };
