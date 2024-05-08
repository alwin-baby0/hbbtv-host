import axios from 'axios';

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
  baseURL: process.env.APP_BASE_URL,
  params: {
    ctx: jsonCtxData,
  },
});

export const axiosInstance2 = axios.create({
  baseURL: process.env.APP_BASE_URL_2,
  params: {
    ctx: jsonCtxData,
  },
});

axiosInstance.interceptors.request.use((config) => {
  return config;
});

axiosInstance2.interceptors.request.use((config) => {
  return config;
});

const request = async ({ ...options }) => {
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

  return axiosInstance(options).then(onSuccess).catch(onError);
};

export default request;
