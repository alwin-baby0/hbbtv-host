import request, { V1, V2 } from '../index';

export const getSeries = (page, limit) => {
  return request({
    url: '/series',
    apiVersion: V1,
    method: 'GET',
    params: {
      page,
      limit,
    },
  });
};

export const getSingleSeries = (seriesId) => {
  return request({
    url: '/getSerie',
    apiVersion: V2,
    method: 'GET',
    params: {
      id: seriesId,
    },
  });
};

export const getSeason = (seriesId) => {
  return request({
    url: `/series/${seriesId}/seasons`,
    apiVersion: V2,
    method: 'GET',
    params: {
      id: seriesId,
    },
  });
};
