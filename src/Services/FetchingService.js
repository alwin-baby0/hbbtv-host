import axios from 'axios';
import { createApiCtx } from './utils';

const API_BASE_URLS = {
  v1: process.env.APP_BASE_URL,
  v2: process.env.APP_BASE_URL_2,
  auth: process.env.APP_BASE_OAUTH,
};

export default class FetchingService {
  // we create static instance of axios to be unique throught the project
  static axiosInstance = axios.create({
    params: {
      ctx: createApiCtx(),
    },
  });
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
    return FetchingService.axiosInstance({ url: API_BASE_URLS[apiVersion] + url, ...options })
      .then(this.#onSuccess)
      .catch(this.#onError);
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
