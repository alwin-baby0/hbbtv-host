import request, { V2 } from '../index';
export const getHomePage = (row, page, limit) =>
  request({
    url: '/start',
    apiVersion: V2,
    method: 'GET',
    params: {
      row,
      page,
      limit,
    },
  });
