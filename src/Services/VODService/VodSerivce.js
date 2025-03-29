import FetchingService from '../FetchingService';
import {
  parseSeriesPageData,
  parseSportsEventsData,
  parseSportsPageData,
  parseVodCategories,
  parseVodMoviesPageData,
} from '../../Models/parsers';
import { VOD_PREVIEW_TYPES } from '../../Pages/utils';
import { V2 } from '../utils';

export const VODS_PER_ROW = 6;
export const VOD_ROWS_PER_FETCH = 3;

class VodService extends FetchingService {
  #emptyState = {
    contentStripe: undefined,
    vodStripes: undefined,
    pointer: 1,
    stripesFetched: 0,
    hasMore: true,
  };

  #initState = {
    ['movies']: { ...this.#emptyState },
    ['series']: { ...this.#emptyState },
    ['sports']: { ...this.#emptyState },
  };

  // type of vod to preview
  #vodType;
  // state to keep data
  #state = { ...this.#initState };
  // get state for current vod type
  #getCurrentState = () => this.#state[this.#vodType];

  /**
   * Fetches initial stripes for page
   */
  async initialFetch() {
    if (!this.#vodType) {
      console.warn('no vod type selected in vod service');
      return;
    }

    const currentState = this.#getCurrentState();

    // get content (categories or sport events)
    if (!currentState.contentStripe) {
      currentState.contentStripe = await this.#getContent();
    }

    // fetch initial vod stripes (movies series sports)
    if (!currentState.vodStripes) {
      const stripeData = await this.#getVods({
        page: currentState.pointer,
        limit: VOD_ROWS_PER_FETCH * VODS_PER_ROW,
      });
      currentState.pointer++;

      if (stripeData) {
        currentState.stripesFetched += stripeData.items.length / VODS_PER_ROW;
        currentState.vodStripes = [stripeData];

        // if we get less items then requested, its the last page
        if (stripeData.items.length < VOD_ROWS_PER_FETCH * VODS_PER_ROW) {
          currentState.hasMore = false;
        }
      } else {
        // if we dont get any data, previous page was the last
        currentState.hasMore = false;
      }
    }
  }

  /**
   * Fetches more movie stripes for Vod Page page
   */
  async fetchMoreStripes(index) {
    const currentState = this.#getCurrentState();

    let newStripes;

    if (index >= currentState.stripesFetched - 2 && !this.loading && currentState.hasMore) {
      newStripes = await this.#getVods({
        page: currentState.pointer,
        limit: VOD_ROWS_PER_FETCH * VODS_PER_ROW,
      });
      currentState.pointer++;

      if (newStripes) {
        currentState.stripesFetched += newStripes.items.length / VODS_PER_ROW;
        currentState.vodStripes.push(newStripes);
        if (newStripes.items.length < VOD_ROWS_PER_FETCH * VODS_PER_ROW) {
          currentState.hasMore = false;
        }
      } else {
        currentState.hasMore = false;
      }
    }

    return newStripes;
  }

  /**
   * Reset vod service
   */
  resetData() {
    this.#state = { ...this.#initState };
  }

  /**
   * @param {VOD_PREVIEW_TYPES} type - type of view we are viewing currently
   */
  set vodType(type) {
    this.#vodType = type;
  }

  /**
   * return type of vod
   */
  get vodType() {
    return this.#vodType;
  }

  /**
   * @returns {{ type: string, sectionTitle: string, items: RailItem[] }[]}
   */
  get contentStripes() {
    return this.#getCurrentState().contentStripe;
  }

  /**
   * @returns {{ type: string, sectionTitle: string, items: RailItem[] }}
   */
  get vodStripes() {
    return this.#getCurrentState().vodStripes;
  }

  /**
   * @returns {boolean} - 'true' if we can fetch more stripes
   */
  get hasMore() {
    return this.#getCurrentState().hasMore;
  }

  #getContent = async () => {
    switch (this.#vodType) {
      case VOD_PREVIEW_TYPES.MOVIES:
        return await this.#getGenres(this.#vodType);
      case VOD_PREVIEW_TYPES.SERIES:
        return await this.#getGenres(this.#vodType);
      case VOD_PREVIEW_TYPES.SPORTS:
        return await this.#getSportsEvents();
      default:
        console.warn('wrong vodType getContent');
    }
  };

  #getVods = async (params) => {
    switch (this.#vodType) {
      case VOD_PREVIEW_TYPES.MOVIES:
        return await this.#getMovies(params);
      case VOD_PREVIEW_TYPES.SERIES:
        return await this.#getSeries(params);
      case VOD_PREVIEW_TYPES.SPORTS:
        return await this.#getSports(params);
      default:
        console.warn('wrong vodType getVods');
    }
  };

  #getGenres = async (vodType) =>
    await this._request({
      url: '/getGenres',
      apiVersion: V2,
      method: 'GET',
      params: {
        category: vodType,
        type: `genres_${vodType}`,
      },
    }).then((result) => parseVodCategories(result, vodType));

  #getMovies = async (params) =>
    await this._request({
      url: '/movies',
      apiVersion: V2,
      method: 'GET',
      params,
    }).then(parseVodMoviesPageData);

  #getSeries = async (params) =>
    await this._request({
      url: '/series',
      apiVersion: V2,
      method: 'GET',
      params,
    }).then(parseSeriesPageData);

  #getSports = async (params) =>
    await this._request({
      url: '/sports',
      apiVersion: V2,
      method: 'GET',
      params,
    }).then(parseSportsPageData);

  #getSportsEvents = async (type = 'video', language = 'en') =>
    await this._request({
      url: '/getSportEvents',
      apiVersion: V2,
      method: 'GET',
      params: {
        type,
        language,
      },
    }).then(parseSportsEventsData);
}

const vodService = new VodService();

export { vodService as VodService };
