import { SimpleRailItem } from '../../Models';
import { RAIL_TYPES } from '../../Pages/utils';
import request, { V2 } from '../index';


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
  const railItems = data.entry?.map((item) => new SimpleRailItem(item));
  if (!railItems) return;

  return {
    railType: RAIL_TYPES.MOVIE,
    railTitle: data.title,
    cardType: 'POSTER',
    items: railItems,
  };
}
