import { SimpleRailItem } from '../../Models';
import {
  API_URLS,
  RAIL_TYPES,
  CARD_TYPES,
  API_METHODS,
  SEARCH_TYPES,
} from '../../constants/globalConstants';
import FetchingService from '../FetchingService';
import { V2 } from '../utils';

export default class SearchService extends FetchingService {
  getSearch = async (
    keywords,
    category = '',
    cardType,
    itemsPerRow = undefined,
    railType = RAIL_TYPES.MOVIE,
    type = SEARCH_TYPES.ALL
  ) =>
    this._request({
      url: `/${API_URLS.GET_SEARCH}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        keywords,
        limit: 500,
        page: 1,
        orderBy: 'name:desc',
        category,
        type,
      },
    }).then((response) => this.#parseSearchPageData(response, cardType, itemsPerRow, railType));

  #parseSearchPageData({ data }, cardType = CARD_TYPES.POSTER, itemsPerRow, railType) {
    const railItems = data.entry?.items?.map((item) => new SimpleRailItem(item));
    if (!railItems) return;

    return {
      railType: railType,
      railTitle: data.entry.query,
      cardType: cardType,
      items: railItems,
      ...(itemsPerRow && { itemsPerRow }),
    };
  }
}

const searchService = new SearchService();

export { searchService as SearchService };
