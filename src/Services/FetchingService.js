import axios from 'axios';
import { createApiCtx } from './utils';
import { refreshTokenOnOauth } from '../utils';
import { Metrics } from '@firebolt-js/sdk';
import { getDeviceInfo, getDeviceType } from '../utils/device';
import logger from '../utils/logger';

const API_BASE_URLS = {
  v1: process.env.APP_BASE_URL,
  v2: process.env.APP_BASE_URL_2,
  auth: process.env.APP_BASE_OAUTH,
};

const API_BASE_URL = process.env.APP_BASE_URL;

export default class FetchingService {
  // we create static instance of axios to be unique throught the project
  static axiosInstance = null;
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
    return FetchingService.axiosInstance({
      url: /* API_BASE_URLS[apiVersion] */ API_BASE_URL + url,
      ...options,
    })
      .then(this.#onSuccess)
      .catch((error) => this.#onError(error, url));
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
    if (process.env.NODE_ENV === 'development') {
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
      logger.error(error.message ? error.message : 'API call failed', {
        id: url,
        error,
        deviceId: deviceInfo.serialNumber,
        device: deviceInfo,
      });

      return error.response || error.message;
    }
  };
}
