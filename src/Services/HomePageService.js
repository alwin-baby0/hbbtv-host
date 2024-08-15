import FetchingService from './FetchingService';
import { SimpleRailItem } from '../Models';
import { V2 } from './utils';
import { imageSizes } from '../Models/utils';
import { parseHomePageHeroSection, parseHomePageRailData } from '../Models/parsers';

class HomePageService extends FetchingService {
  #heroSectionItems;
  #stripes = [];
  #pointer = 2;
  stripesFetched = 0;
  #currentRailLimit = 7; // Početni limit je 6

  /**
   * Fetches initial stripes for Home page
   */
  async initialFetch() {
    if (!this.#heroSectionItems) {
      //get gallery data
      const galleryItems = await this.#getHomePageHeroSection();
      // preload gallry items
      if (galleryItems?.items) {
        galleryItems.items.forEach((item) => item.preloadImages(imageSizes.XL));
        this.#heroSectionItems = galleryItems;
      }
    }

    // fetch untill get 3 stripes with data or try 25 times
    while (this.stripesFetched < 3 && this.#pointer < 25) {
      const stripeData = await this.#getHomePage(this.#pointer, 1, this.#currentRailLimit);
      this.#pointer++;

      if (stripeData) {
        this.stripesFetched++;
        stripeData.hasMore = stripeData.items.length === this.#currentRailLimit;

        stripeData.stripeId = this.#pointer - 1;
        stripeData.page = 1;
        this.#stripes.push(stripeData);
      }
    }
  }

  /**
   * Fetches more stripes for Home page
   */
  async fetchMoreStripes() {
    let counter = 0;
    const newStripes = [];

    while (counter < 2 && this.#pointer < 25) {
      const stripeData = await this.#getHomePage(this.#pointer, 1, this.#currentRailLimit);
      this.#pointer++;

      if (stripeData?.items.length > 0) {
        this.stripesFetched++;
        counter++;
        // each stripe has unique id
        stripeData.stripeId = this.#pointer - 1;
        // each stripe page number so we can fetch more after
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

  /**
   * Resets data for home page service
   */
  resetData() {
    this.#heroSectionItems = undefined;
    this.#stripes = [];
    this.#pointer = 2;
    this.stripesFetched = 0;
    this.#currentRailLimit = 7; // Reset limit to initial value
  }

  /**
   * @returns {{ type: string, sectionTitle: string, items: GalleryItem[] }}
   */
  get heroSectionItems() {
    return this.#heroSectionItems;
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

  #getHomePageHeroSection = async () =>
    this._request({
      url: '/start',
      apiVersion: V2,
      method: 'GET',
      params: {
        row: 1,
        page: 1,
        limit: 6,
      },
    }).then(parseHomePageHeroSection);

  #getHomePage = async (row, page, limit) =>
    this._request({
      url: '/start',
      apiVersion: V2,
      method: 'GET',
      params: {
        row,
        page,
        limit,
      },
    }).then(parseHomePageRailData);
}

const homePageService = new HomePageService();

export { homePageService as HomePageService };
