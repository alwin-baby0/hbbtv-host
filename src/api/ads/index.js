import request, { V2 } from '../index';

export const getBanners = () =>
  request({
    url: `/ads`,
    apiVersion: V2,
    method: 'GET',
  });
