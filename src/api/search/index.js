import request, { V2 } from '../index';
import { SimpleRailItem } from '../models';

export const getSearch = async (keyword, category) =>
  request({
    url: '/search',
    apiVersion: V2,
    method: 'GET',
    params: {
      keyword,
      category,
      orderBy: 'date:desc',
      limit: 24,
    },
  }).then(parseSearchPageData);

function parseSearchPageData(result) {
  const { data } = result;

  return {
    sectionTitle: data.title,
    items: data.entry?.map((item) => new SimpleRailItem(item)),
  };
}
