import request, { axiosInstance2 } from '../index';

export const getSports = (page, limit) => {
  return request({
    url: axiosInstance2.defaults.baseURL + '/sports',
    method: 'GET',
    params: {
      page,
      limit,
    },
  });
};

export const getEvents = (page, type = 'events', limit) => {
  return request({
    url: axiosInstance2.defaults.baseURL + '/getSportEvents',
    method: 'GET',
    params: {
      type,
      page,
      limit,
    },
  });
};

export const getSingleEvent = (sportId) => {
  return request({
    url: axiosInstance2.defaults.baseURL + '/getSportEvent',
    method: 'GET',
    params: {
      id: sportId,
    },
  });
};
