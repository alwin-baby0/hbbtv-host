import request, { axiosInstance2 } from '../index';

export const getSearch = (keyword, category) => {
  return request({
    url: axiosInstance2.defaults.baseURL + '/search',
    method: 'GET',
    params: {
      keyword,
      category,
      orderBy: 'date:desc',
      limit: 1000,
    },
  });
};
