import request, { V2 } from '../index';

export const getSearch = (keyword, category) => {
  return request({
    url: '/search',
    apiVersion: V2,
    method: 'GET',
    params: {
      keyword,
      category,
      orderBy: 'date:desc',
      limit: 1000,
    },
  });
};
