import request, { V2 } from '../index';

export const getPages = () =>
  request({
    url: `/getPageTabs`,
    apiVersion: V2,
    method: 'GET',
  });

export const getSinglePage = (pageId) =>
  request({
    url: `/getPage`,
    apiVersion: V2,
    method: 'GET',
    params: {
      id: pageId,
    },
  });
