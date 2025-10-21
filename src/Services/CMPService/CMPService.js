import {
  API_METHODS,
  API_URLS,
  CUSTOM_EVENT_NAMES,
  LOCAL_STORAGE_KEYS,
} from '../../constants/globalConstants';
import { getDeviceInfo } from '../../utils/device';
import FetchingService from '../FetchingService';
import { V2, auth } from '../utils';

class CMPService extends FetchingService {
  #cmpData;
  async initialFetch() {
    const deviceCode = getDeviceInfo().serialNumber;
    try {
      const cmpResults = await this.#getCMP(deviceCode);
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

  async setDeviceCodeStatusInterval(deviceCode) {
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
              authCode = statusResponse.data.authorization_code;
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

  get cmpData() {
    return this.#cmpData;
  }

  #getCMP = async (deviceCode) => {
    const response = await this._request({
      url: `/${API_URLS.GET_CMP}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        'X-DEVICE-ID': deviceCode,
      },
      params: {
        language: localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE) || 'en',
        device_id: deviceCode,
      },
    });

    return response;
  };

  #getCMPChoice = async (deviceCode, choicePick) => {
    return await this._request({
      url: `/${API_URLS.GET_CMP}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        'X-Device-ID': deviceCode,
      },
      params: {
        language: localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE) || 'en',
        choice: choicePick,
        device_id: deviceCode,
      },
    });
  };

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

  getFavorites = async (page, limit = 8) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.GET_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        'X-Authorization': `Bearer ${userData.access_token}`,
      },
      params: {
        cachebuster: timestamp,
        page,
        limit,
      },
    });
  };

  addToFavorites = async (videoID, vodType) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.ADD_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        'X-Authorization': `Bearer ${userData.access_token}`,
        'X-nocache': timestamp,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        _: timestamp,
      },
      data: {
        video_id: videoID,
        type: vodType,
      },
    });
  };

  removeFromFavorites = async (videoID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.REMOVE_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.DELETE,
      headers: {
        'X-Authorization': `Bearer ${userData.access_token}`,
        'X-nocache': timestamp,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        _: timestamp,
      },
      data: {
        video_id: videoID,
      },
    });
  };

  getRecentlyWatched = async (page, limit = 8) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.GET_USER_RECENTLY_WATCHED}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        'X-Authorization': `Bearer ${userData.access_token}`,
      },
      params: {
        cachebuster: timestamp,
        page,
        limit,
      },
    });
  };

  addRecentlyWatched = async (videoID, vodType, vodPosition, seriesID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    if (vodPosition === 0) {
      vodPosition++;
    }

    return await this._request({
      url: `/${API_URLS.ADD_USER_RECENTLY_WATCHED}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        'X-nocache': timestamp,
        'X-Authorization': `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        video_id: videoID,
        type: vodType,
        position: vodPosition,
        ...(seriesID && { series_id: seriesID }),
      },
    });
  };

  deleteRecentlyWatched = async (videoID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.REMOVE_USER_RECENTLY_WATCHED}`,
      apiVersion: V2,
      method: API_METHODS.DELETE,
      headers: {
        'X-nocache': timestamp,
        'X-Authorization': `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        video_id: videoID,
      },
    });
  };
}

const cmpService = new CMPService();

export { cmpService as CMPService };
