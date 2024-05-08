import request, { axiosInstance2 } from '../index';

export const getPages = () =>
  request({
    url: axiosInstance2.defaults.baseURL + `/getPageTabs`,
    method: 'GET',
  });

export const getSinglePage = (pageId) =>
  request({
    url: axiosInstance2.defaults.baseURL + `/getPage`,
    method: 'GET',
    params: {
      id: pageId,
    },
  });
