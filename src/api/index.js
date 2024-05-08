import axios from 'axios';
export const V1 = 'v1';
export const V2 = 'v2';

const API_BASE_URLS = {
  v1: process.env.APP_BASE_URL,
  v2: process.env.APP_BASE_URL_2,
};

const jsonCtx = {
  languageCode: localStorage.getItem('languageCode') || 'en',
  version_name: '1.0.0',
  osVersion: 2,
  deviceWidth: 1280,
  platform: 'lightningjs',
  bundleIdentifier: 'com.appwedotv',
};
const jsonCtxData = btoa(JSON.stringify(jsonCtx));

export const axiosInstance = axios.create({
  params: {
    ctx: jsonCtxData,
  },
});

axiosInstance.interceptors.request.use((config) => {
  return config;
});

const request = async ({ apiVersion, url, ...options }) => {
  const onSuccess = (response) => response;
  const onError = () => {
    // DISPLAY API ERROR MESSAGES ON DEV ENVIRONMENT
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

  return axiosInstance({ url: API_BASE_URLS[apiVersion] + url, ...options })
    .then(onSuccess)
    .catch(onError);
};

export default request;
