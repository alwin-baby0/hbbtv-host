import request, { V2 } from '../index';
import HomeRailItem from './HomeRailItem';
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
  }).then(parseHomePageData);

function parseHomePageData(result) {
  const { data } = result;
  return {
    sectionTitle: data.title,
    items: data.entry?.map((item) => new HomeRailItem(item)),
  };
}
