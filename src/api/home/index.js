import request, { axiosInstance2 } from '../index';
export const getHomePage = (row, page, limit) =>
  request({
    url: axiosInstance2.defaults.baseURL + '/start',
    method: 'GET',
    params: {
      row,
      page,
      limit,
    },
  });
