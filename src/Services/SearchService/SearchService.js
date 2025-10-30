import { SimpleRailItem } from '../../Models';
import { API_URLS, RAIL_TYPES, CARD_TYPES, API_METHODS } from '../../constants/globalConstants';
import FetchingService from '../FetchingService';
import { V2 } from '../utils';

export default class SearchService extends FetchingService {
  getSearch = async (keyword, category) =>
    this._request({
      url: `/${API_URLS.GET_SEARCH}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        keyword,
        limit: 500,
        page: 1,
        orderBy: 'name:desc',
        category,
      },
    }).then(this.#parseSearchPageData);

  #parseSearchPageData({ data }) {
    const railItems = data.entry?.map((item) => new SimpleRailItem(item));
    if (!railItems) return;

    return {
      railType: RAIL_TYPES.MOVIE,
      railTitle: data.title,
      cardType: CARD_TYPES.POSTER,
      items: railItems,
    };
  }
}

const searchService = new SearchService();

export { searchService as SearchService };
