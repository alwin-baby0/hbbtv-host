import request, { V2 } from '../index';

export const getSports = (page, limit) => {
  return request({
    url: '/sports',
    apiVersion: V2,
    method: 'GET',
    params: {
      page,
      limit,
    },
  });
};

export const getEvents = (page, type = 'events', limit) => {
  return request({
    url: '/getSportEvents',
    apiVersion: V2,
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
    url: '/getSportEvent',
    apiVersion: V2,
    method: 'GET',
    params: {
      id: sportId,
    },
  });
};
