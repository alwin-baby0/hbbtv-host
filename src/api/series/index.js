import { Router, Storage } from '@lightningjs/sdk';
import request, { axiosInstance, axiosInstance2 } from '../index';

export const getSeries = (page, limit) => {
  return request({
    url: axiosInstance.defaults.baseURL + '/series',
    method: 'GET',
    params: {
      page,
      limit,
    },
  });
};

export const getSingleSeries = (seriesId) => {
  return request({
    url: axiosInstance2.defaults.baseURL + '/getSerie',
    method: 'GET',
    params: {
      id: seriesId,
    },
  });
};

export const getSeason = (seriesId) => {
  return request({
    url: axiosInstance2.defaults.baseURL + `/series/${seriesId}/seasons`,
    method: 'GET',
    params: {
      id: seriesId,
    },
  });
};
