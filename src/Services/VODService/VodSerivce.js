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
} from '../../constants/globalConstants';

export const VODS_PER_ROW = 12;
export const VOD_ROWS_PER_FETCH = 3;

class VodService extends FetchingService {
  #emptyStateMovies = {
    contentStripe: undefined,
    vodStripes: [],
    pointer: 2,
    stripesFetched: 0,
    hasMore: true,
  };

  #emptyStateSeries = {
    contentStripe: undefined,
    vodStripes: [],
    pointer: 2,
    stripesFetched: 0,
    hasMore: true,
  };

  #emptyStateSport = {
    contentStripe: undefined,
    vodStripes: [],
    pointer: 2,
    stripesFetched: 0,
    hasMore: true,
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
      while (currentState.stripesFetched < 3 && currentState.pointer < 25) {
        const promises = [];
        for (let i = 0; i <= 2 - currentState.stripesFetched; i++) {
          promises.push(this.#getVods({ row: currentState.pointer, page: 1, limit: VODS_PER_ROW }));
          currentState.pointer++;
        }

        const newStripes = await Promise.allSettled(promises);

        if (newStripes) {
          newStripes.forEach(({ value: stripeData }, index) => {
            if (stripeData) {
              currentState.stripesFetched++;
              stripeData.hasMore = stripeData.items.length === VODS_PER_ROW;

              stripeData.stripeId = currentState.pointer - newStripes.length + index;
              stripeData.page = 1;
              currentState.vodStripes.push(stripeData);
            }
          });

          let eventData = {};
          if (this.#vodType === VOD_PREVIEW_TYPES.SPORTS) {
            eventData = await this.#getSportsEvents();
            currentState.sportEvents = [eventData.items];
          }

          eventData?.items?.length && (currentState.vodStripes = [eventData]);
          currentState.vodStripes.push(...newStripes);
        }
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
  async fetchMoreStripes(index) {
    const currentState = this.#getCurrentState();

    let counter = 0;
    const newStripes = [];

    while (counter < 2 && currentState.pointer < 25) {
      const stripeData = await this.#getVods({
        row: currentState.pointer,
        page: 1,
        limit: VODS_PER_ROW,
      });
      currentState.pointer++;

      if (stripeData?.items.length > 0) {
        currentState.stripesFetched++;
        counter++;
        // each stripe has unique id
        stripeData.stripeId = currentState.pointer;
        // each stripe page number so we can fetch more after
        stripeData.page = 1;
        stripeData.hasMore = stripeData.items.length === currentState.currentRailLimit;
        newStripes.push(stripeData);
      }
    }

    currentState.vodStripes.push(...newStripes);

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
    }).then(parseVodMoviesPageData);

  #getMoviesHeroSection = async (params) =>
    await this._request({
      url: `/${API_URLS.GET_MOVIES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params,
    }).then(parseHomePageHeroSection);

  #getSeries = async (params) =>
    await this._request({
      url: `/${API_URLS.GET_SERIES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params,
    }).then(parseSeriesPageData);

  #getSeriesHeroSection = async (params) =>
    await this._request({
      url: `/${API_URLS.GET_SERIES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params,
    }).then(parseHomePageHeroSection);

  #getSports = async (params) => {
    return await this._request({
      url: `/${API_URLS.GET_SPORTS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params,
    }).then(parseSportsPageData);
  };

  #getSportHeroSection = async (params) =>
    await this._request({
      url: `/${API_URLS.GET_SPORTS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params,
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
    }).then(parseSportsEventsData);
}

const vodService = new VodService();

export { vodService as VodService };
