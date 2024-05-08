import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://api.watch4.com/v2',
});

axiosInstance.interceptors.request.use((config) => {
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
