import { VOD_TYPES } from '../../pages/utils';
import request, { V2 } from '../index';
import { SimpleRailItem } from '../models';

export const getSearch = async (keyword, category) =>
  request({
    url: '/search',
    apiVersion: V2,
    method: 'GET',
    params: {
      keyword,
      limit: 15,
      page: 1,
      orderBy: 'name:desc',
      category,
    },
  }).then(parseSearchPageData);

function parseSearchPageData({ data }) {
  const railItems = data.entry?.map((item) => new SimpleRailItem(item))
  if (!railItems || railItems.length === 0) return;

  return {
    railType: VOD_TYPES.MOVIE,
    cardType: 'POSTER',
    items: railItems,
  };
}
