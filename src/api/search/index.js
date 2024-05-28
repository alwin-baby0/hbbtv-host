import request, { V2 } from '../index';
import MoviesRailItem from '../movies/MoviesRailItem';

export const getSearch = (keyword, category) =>
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
    items: data.entry?.map((item) => new MoviesRailItem(item)),
  };
}
