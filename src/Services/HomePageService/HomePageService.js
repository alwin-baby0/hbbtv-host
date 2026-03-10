import FetchingService from '../FetchingService';
import { SimpleRailItem } from '../../Models';
import { V2 } from '../utils';
import { parseHomePageHeroSection, parseHomePageRailData } from '../../Models/parsers';
import {
  API_METHODS,
  API_URLS,
  IMAGE_SIZES,
  LOCAL_STORAGE_KEYS,
} from '../../constants/globalConstants';

class HomePageService extends FetchingService {
  #heroSectionItems;
  #stripes = [];
  #pointer = 2;
  stripesFetched = 0;
  #currentRailLimit = 12; // Početni limit je 6
  #heroSectionPage = 1; // Page counter for Hero Section
  #isLastFetchEmpty = false; // Initialize to false
  #banner = [];
  #page = 1;

  get currentRailLimit() {
    return this.#currentRailLimit;
  }

  /**
   * Fetches initial stripes for Home page
   */
  async initialFetch() {
    const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS));
    this.#banner = settings?.ads?.creative.banner;

    if (!this.#heroSectionItems) {
      //get gallery data
      const galleryItems = await this.#getHomePageHeroSection();
      // preload gallry items
      if (galleryItems?.items) {
        galleryItems.items.forEach((item) => item.preloadImages(IMAGE_SIZES.S));
        this.#heroSectionItems = galleryItems;
      }
    }

    // fetch untill get 3 stripes with data or try 25 times
    while (this.stripesFetched < 3 && this.#pointer < 25) {
      const promises = [];
      for (let i = 0; i <= 2 - this.stripesFetched; i++) {
        promises.push(this.#getHomePage(this.#pointer, 1, this.#currentRailLimit));
        this.#pointer++;
      }

      const newStripes = await Promise.allSettled(promises);

      newStripes.forEach(({ value: stripeData }, index) => {
        if (stripeData) {
          this.stripesFetched++;
          stripeData.hasMore = stripeData.items.length === this.#currentRailLimit;

          stripeData.stripeId = this.#pointer - newStripes.length + index;
          stripeData.page = 1;
          this.#stripes.push(stripeData);
        }
      });
    }

    this.#page = 1;
  }

  /**
   * Fetches more stripes for Home page
   */
  async fetchMoreStripes() {
    let counter = 0;
    const newStripes = [];
    const requests = [];

    while (counter < 2 && this.#pointer < 25) {
      requests.push(this.#getHomePage(this.#pointer, this.#page, this.#currentRailLimit));

      this.#pointer++;
      counter++;
    }

    const results = await Promise.all(requests);

    for (const stripeData of results) {
      if (!stripeData) {
        return;
      }

      if (stripeData.error) {
        this.#page++;
        this.#pointer = 1;
        return;
      }

      if (stripeData?.items?.length > 0) {
        this.stripesFetched++;

        stripeData.stripeId = this.#pointer;
        stripeData.page = 1;
        stripeData.hasMore = stripeData.items.length === this.#currentRailLimit;

        newStripes.push(stripeData);
      }
    }

    this.#stripes.push(...newStripes);

    return newStripes;
  }

  /**
   * Fetches more items for stripe on Home page, updates cache
   * @param {number} stripeId Stripe Id - unique to a stripe
   * @returns {Promise<SimpleRailItem[]>} Returns array of new SimpleRailItems
   */
  async fetchMoreItemsForStripeId(stripeId) {
    const stripe = this.#stripes.find((stripe) => stripe.stripeId === stripeId);
    if (stripe && stripe.hasMore) {
      const stripeData = await this.#getHomePage(stripeId, stripe.page + 1, this.#currentRailLimit);
      if (stripeData) {
        stripe.page += 1;
        stripe.hasMore = stripeData.items.length === this.#currentRailLimit;

        if (stripeData) {
          stripe.items.push(...stripeData.items);
        }

        return stripeData;
      }
      stripe.hasMore = false;
    }
  }

  async fetchMoreItemsForHeroSection() {
    // Add a check for the previous fetch result
    if (this.#heroSectionItems && !this.#isLastFetchEmpty) {
      const nextPage = this.#heroSectionPage + 1;
      const heroSectionData = await this.#getHomePageHeroSection(nextPage);

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

    return [];
  }

  /**
   * Resets data for home page service
   */
  resetData() {
    this.#heroSectionItems = undefined;
    this.#stripes = [];
    this.#pointer = 2;
    this.stripesFetched = 0;
    this.#currentRailLimit = 12; // Reset limit to initial value
    this.#banner = [];
    this.#page = 1;
  }

  /**
   * @returns {{ type: string, sectionTitle: string, items: GalleryItem[] }}
   */
  get heroSectionItems() {
    return this.#heroSectionItems;
  }

  /**
   * Postavlja vrednost za banner
   * @param {Array} newBanner - Nova vrednost za banner
   */
  set banner(newBanner) {
    if (Array.isArray(newBanner)) {
      this.#banner = newBanner;
    } else {
      console.error('Banner mora biti niz.');
    }
  }

  get banner() {
    return this.#banner;
  }

  /**
   * @returns {{ type: string, sectionTitle: string, items: SimpleRailItem[] }}
   */
  get stripes() {
    return this.#stripes;
  }

  /**
   * @returns {boolean} - 'true' if we can fetch more stripes
   */
  get hasMore() {
    return this.#pointer < 25;
  }

  #getHomePageHeroSection = async (page = 1) =>
    this._request({
      url: `/${API_URLS.GET_HOME_PAGE}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        row: 1,
        page: page, // Use the passed page parameter
        limit: 6,
      },
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    }).then(parseHomePageHeroSection);

  #getHomePage = async (row, page, limit) =>
    this._request({
      url: `/${API_URLS.GET_HOME_PAGE}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        row,
        page,
        limit,
      },
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    })
      .then(parseHomePageRailData)
      .catch((err) => err.data);
}

const homePageService = new HomePageService();

export { homePageService as HomePageService };
