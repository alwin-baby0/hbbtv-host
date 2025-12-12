import axios from 'axios';
import { createApiCtx } from './utils';
import { LOCAL_STORAGE_KEYS } from '../constants/globalConstants';

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
        console.log('asdf try no: ', i);
        try {
          return await FetchingService.axiosInstance({
            url: fullUrl,
            ...options,
          });
        } catch (err) {
          const status = err?.response?.status;
          lastErr = err;

          if (!status) {
            continue; // <-- treat as retryable
          }

          if (String(status)[0] !== '5') {
            throw err;
          }
        }
      }

      // After failing 3 times, return last error
      throw lastErr;
    };

    const primaryUrl = API_BASE_URL;
    const backupUrl = BACKUP_API_URL + url;

    return attempt(primaryUrl)
      .catch(async (err) => {
        // Only retry with backup if the failure was a 5xx
        const status = err?.response?.status;
        if (status && String(status)[0] === '5') {
          console.log('asdf primaryurl: ', primaryUrl);
          console.log('asdf fallbackurl: ', backupUrl);
          return attempt(backupUrl);
        }
        throw err;
      })
      .then((res) => this.#onSuccess(res))
      .catch((err) => this.#onError(err));
  }

  #onSuccess = (response) => {
    this.#loading = false;
    return response;
  };

  #onError = (error) => {
    this.#loading = false;
    if (process.env.NODE_ENV === 'development') {
      if (error.response) {
        // Request was made but server responded with something
        // other than 2xx
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        console.error('Headers:', error.response.headers);
      } else {
        // Something else happened while setting up the request
        // triggered the error
        console.error('Error Message:', error.message);
      }

      return Promise.reject(error.response || error.message);
    }
  };
}
