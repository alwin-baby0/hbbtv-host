import axios from 'axios';
import { createApiCtx } from './utils';
import { refreshTokenOnOauth } from '../utils';
import { Metrics } from '@firebolt-js/sdk';
import { getDeviceInfo, getDeviceType } from '../utils/device';
import { LOG_LEVEL } from '../constants/globalConstants';
import { LoggingService } from './LoggingService/index.js';

const API_BASE_URLS = {
  v1: process.env.APP_BASE_URL,
  v2: process.env.APP_BASE_URL_2,
  auth: process.env.APP_BASE_OAUTH,
};

const API_BASE_URL = 'https://httpbin.org/status/500';
const BACKUP_API_URL = process.env.APP_BASE_URL;

export default class FetchingService {
  // we create static instance of axios to be unique throught the project
  static axiosInstance = null;
  static activeBaseUrl = API_BASE_URL;
  static baseUrlResolved = false;

  static init() {
    if (FetchingService.axiosInstance) return;
    FetchingService.axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer bc6b83671bd80d6a26dd7607c912c1e705f8d563`,
      },
      params: {
        ctx: createApiCtx(),
      },
    });
  }

  // propery to check if we are fetching currently
  #loading = false;

  get loading() {
    return this.#loading;
  }

  /**
   * Generic function for fetching
   * @param {V1 | V2 | auth} apiVersion version of the api to use
   * @param {string} url url to the endpoint
   * @param {string} method GET | PUT | DELETE...
   * @param {object} params params to pass to request
   * @returns {Promise<any>} Returns Promise to await the request result
   */
  async _request({ apiVersion, url, ...options }) {
    this.#loading = true;

    const attempt = async (fullUrl) => {
      let lastErr;

      for (let i = 0; i < 3; i++) {
        console.log('asdf try no:', i, fullUrl);
        try {
          return await FetchingService.axiosInstance({
            url: fullUrl,
            ...options,
          });
        } catch (err) {
          const status = err?.response?.status;
          lastErr = err;

          if (!status) continue; // network error → retry
          if (String(status)[0] !== '5') throw err; // non-5xx → stop
        }
      }

      throw lastErr;
    };

    try {
      //Decide about api url initially
      if (!FetchingService.baseUrlResolved) {
        try {
          const res = await attempt(API_BASE_URL + url); //for testing remove +url since dummy api doesn't support that
          FetchingService.activeBaseUrl = API_BASE_URL;
          FetchingService.baseUrlResolved = true;
          return this.#onSuccess(res);
        } catch (err) {
          const status = err?.response?.status;

          if (status && String(status)[0] === '5') {
            console.warn('Primary API failed, switching to fallback');
            FetchingService.activeBaseUrl = BACKUP_API_URL;
            FetchingService.baseUrlResolved = true;

            const res = await attempt(BACKUP_API_URL + url);
            return this.#onSuccess(res);
          }

          throw err;
        }
      }

      //Regular flow
      const res = await attempt(FetchingService.activeBaseUrl + url);
      return this.#onSuccess(res);
    } catch (err) {
      return this.#onError(err);
    }
  }

  #onSuccess = (response) => {
    this.#loading = false;
    return response;
  };

  #onError = (error, url) => {
    this.#loading = false;
    const deviceType = getDeviceType();
    deviceType === 'metrological' &&
      Metrics.error(
        Metrics.ErrorType.MEDIA,
        error.response ? error.response.status.toString() : '500',
        error.response ? error.response.data : error.message,
        true
      );

    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);

      error.response.status === 401 && refreshTokenOnOauth();
    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.error('Error Message:', error.message);
    }

    const deviceInfo = getDeviceInfo();

    LoggingService.postLog(LOG_LEVEL.ERROR, deviceInfo, {
      message: 'API call failed',
      error,
    });

    return error.response || error.message;
  };
}
