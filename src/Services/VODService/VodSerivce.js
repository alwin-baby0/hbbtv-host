import FetchingService from '../FetchingService';
import {
  parseSeriesPageData,
  parseSportsEventsData,
  parseSportsPageData,
  parseVodCategories,
  parseVodMoviesPageData,
  parseHomePageHeroSection,
} from '../../Models/parsers';
import { V2 } from '../utils';
import {
  API_METHODS,
  API_URLS,
  VOD_PREVIEW_TYPES,
  IMAGE_SIZES,
  LOCAL_STORAGE_KEYS,
  TRANSLATIONS,
  RAIL_TYPES,
} from '../../constants/globalConstants';
import { t } from '../../utils';

export const VODS_PER_ROW = 12;
export const VOD_ROWS_PER_FETCH = 3;

class VodService extends FetchingService {
  #emptyStateMovies = {
    contentStripe: undefined,
    vodStripes: [],
    pointer: 2,
    stripesFetched: 0,
    hasMore: true,
    page: 1,
  };

  #emptyStateSeries = {
    contentStripe: undefined,
    vodStripes: [],
    pointer: 2,
    stripesFetched: 0,
    hasMore: true,
    page: 1,
  };

  #emptyStateSport = {
    contentStripe: undefined,
    vodStripes: [],
    pointer: 2,
    stripesFetched: 0,
    hasMore: true,
    page: 1,
  };

  #initState = {
    [VOD_PREVIEW_TYPES.MOVIES]: { ...this.#emptyStateMovies },
    [VOD_PREVIEW_TYPES.SERIES]: { ...this.#emptyStateSeries },
    [VOD_PREVIEW_TYPES.SPORTS]: { ...this.#emptyStateSport },
  };

  // type of vod to preview
  #vodType;
  // state to keep data
  #state = { ...this.#initState };
  // get state for current vod type
  #getCurrentState = () => this.#state[this.#vodType];
  #heroSectionPage = 1; // Page counter for Hero Section
  #heroSectionItems;
  #isLastFetchEmpty = false; // Initialize to false
  lastVodType = null;

  /**
   * Fetches initial stripes for page
   */
  async initialFetch() {
    if (this.lastVodType !== this.#vodType) {
      this.resetData();
    }

    if (!this.#vodType) {
      console.warn('no vod type selected in vod service');
      return;
    }

    if (!this.#heroSectionItems) {
      //get gallery data
      const galleryItems = await this.#getHeroSection();
      // preload gallry items
      if (galleryItems?.items) {
        galleryItems.items.forEach((item) => item.preloadImages(IMAGE_SIZES.S));
        this.#heroSectionItems = galleryItems;
      }
    }

    const currentState = this.#getCurrentState();

    // get content (categories or sport events)
    if (!currentState.contentStripe) {
      const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS));
      settings.genres.types[this.#vodType].unshift('all');
      settings.genres.localized['all'] = t(TRANSLATIONS.ALL_GENRE);
      currentState.contentStripe = parseVodCategories(
        {
          items: settings.genres.types[this.#vodType].map((item) => {
            return {
              value: item,
              localised: settings.genres.localized[item],
            };
          }),
        },
        this.#vodType
      );
    }

    if (!currentState.vodStripes.length) {
      const promises = [];
      for (let i = 0; i <= 2 - currentState.stripesFetched; i++) {
        promises.push(
          this.#getVods({
            row: currentState.pointer,
            page: currentState.page,
            limit: VODS_PER_ROW,
          })
        );
        currentState.pointer++;
      }

      const newStripes = await Promise.allSettled(promises);

      if (newStripes) {
        newStripes.forEach(({ value: stripeData }, index) => {
          if (stripeData) {
            if (stripeData.railType !== RAIL_TYPES.BANNER) currentState.stripesFetched++;
            stripeData.hasMore = stripeData.items.length === VODS_PER_ROW;

            stripeData.stripeId = currentState.pointer - newStripes.length + index;
            stripeData.page = currentState.page;
            currentState.vodStripes.push(stripeData);
          }
        });
      }
    }

    this.lastVodType = this.#vodType;
  }

  #getHeroSection = async (page = 1) => {
    const params = {
      row: 1,
      page,
      limit: 6,
    };

    switch (this.#vodType) {
      case VOD_PREVIEW_TYPES.MOVIES:
        return await this.#getMoviesHeroSection(params);
      case VOD_PREVIEW_TYPES.SERIES:
        return await this.#getSeriesHeroSection(params);
      case VOD_PREVIEW_TYPES.SPORTS:
        return await this.#getSportHeroSection(params);
      default:
        console.warn('wrong vodType getVods');
    }
  };

  async fetchMoreItemsForHeroSection() {
    // Add a check for the previous fetch result
    if (this.#heroSectionItems && !this.#isLastFetchEmpty) {
      const nextPage = this.#heroSectionPage + 1;
      const heroSectionData = await this.#getHeroSection(nextPage);

      // Check if heroSectionData is null, undefined, or has no items
      if (!heroSectionData || !heroSectionData.items || heroSectionData.items.length === 0) {
        this.#isLastFetchEmpty = true; // Mark the fetch as empty
        return []; // Return an empty array if no data or no items
      }

      // If data is valid and items exist, update page, items, and reset empty fetch flag
      this.#heroSectionPage = nextPage;
      this.#heroSectionItems.items.push(...heroSectionData.items);
      this.#isLastFetchEmpty = false; // Reset the flag as fetch was successful
      return heroSectionData;
    }
  }

  /**
   * Fetches more movie stripes for Vod Page page
   */
  async fetchMoreStripes() {
    const state = this.#getCurrentState();
    const BATCH_SIZE = 2;

    const rows = [];

    while (rows.length < BATCH_SIZE && state.pointer < 25) {
      rows.push(state.pointer);
      state.pointer++;
    }

    const requests = rows.map((row) =>
      this.#getVods({
        row,
        page: state.page,
        limit: VODS_PER_ROW,
      })
    );

    const results = await Promise.all(requests);

    const newStripes = results
      .map((stripeData, i) => {
        const row = rows[i];

        if (!stripeData || stripeData.error) return null;

        currentState.pointer++;

        if (stripeData?.items.length > 0) {
          if (stripeData.railType !== RAIL_TYPES.BANNER) currentState.stripesFetched++;
          counter++;
          // each stripe has unique id
          stripeData.stripeId = currentState.pointer;
          stripeData.page = currentState.page;
          stripeData.hasMore = stripeData.items.length === currentState.currentRailLimit;

          return {
            ...stripeData,
            stripeId: row + 1,
            page: state.page,
            hasMore: stripeData.items.length === state.currentRailLimit,
          };
        }
      })
      .filter(Boolean);

    state.vodStripes.push(...newStripes);

    return newStripes;
  }

  /**
   * Reset vod service
   */
  resetData() {
    this.#state = { ...this.#initState };
    this.#heroSectionItems = undefined;
  }

  get heroSectionItems() {
    return this.#heroSectionItems;
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

  get stripesFetched() {
    return this.#getCurrentState().stripesFetched;
  }

  get sportEvents() {
    return this.#getCurrentState().sportEvents;
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

  #getMovies = async (params) =>
    await this._request({
      url: `/${API_URLS.GET_MOVIES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params,
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    })
      .then(parseVodMoviesPageData)
      .catch((err) => err.data);

  #getMoviesHeroSection = async (params) =>
    await this._request({
      url: `/${API_URLS.GET_MOVIES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params,
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    }).then(parseHomePageHeroSection);

  #getSeries = async (params) =>
    await this._request({
      url: `/${API_URLS.GET_SERIES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params,
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    })
      .then(parseSeriesPageData)
      .catch((err) => err.data);

  #getSeriesHeroSection = async (params) =>
    await this._request({
      url: `/${API_URLS.GET_SERIES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params,
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    }).then(parseHomePageHeroSection);

  #getSports = async (params) => {
    return await this._request({
      url: `/${API_URLS.GET_SPORTS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params,
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    })
      .then(parseSportsPageData)
      .catch((err) => err.data);
  };

  #getSportHeroSection = async (params) =>
    await this._request({
      url: `/${API_URLS.GET_SPORTS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params,
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    }).then(parseHomePageHeroSection);

  #getSportsEvents = async (type = 'video', language = 'en') =>
    await this._request({
      url: `/${API_URLS.GET_SPORTS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        type,
        language,
        page: 1,
        row: 2,
        limit: VODS_PER_ROW,
      },
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    }).then(parseSportsEventsData);
}

const vodService = new VodService();

export { vodService as VodService };
