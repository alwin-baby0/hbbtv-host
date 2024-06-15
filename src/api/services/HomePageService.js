import request, { V2 } from "..";
import { GalleryRailItem, SimpleRailItem } from "../models";
import { imageSizes } from "../models/utils";


class HomePageService {
  #heroSectionItems;
  #stripes = [];
  #pointer = 2;
  stripesFetched = 0;

  #loading = false;

  /**
   * Fetches initial stripes for Home page
   */
  async initialFetch() {
    this.#loading = true;
    if (!this.#heroSectionItems) {
      //get gallery data
      const galleryItems = await this.#getHomePageHeroSection();
      // preload gallry items
      if (galleryItems.items) {
        galleryItems.items.forEach((item) => item.preloadImages(imageSizes.XL));
      }

      this.#heroSectionItems = galleryItems;
    }

    // fetch untill get 3 stripes with data or try 25 times
    while (this.stripesFetched < 3 && this.#pointer < 25) {
      const stripeData = await this.#getHomePage(this.#pointer, 1, 6);
      this.#pointer++;

      if (stripeData) {
        this.stripesFetched++;

        stripeData.stripeId = this.#pointer - 1;
        stripeData.page = 1;
        this.#stripes.push(stripeData);
      }
    }
    this.#loading = false;
  }

  /**
   * Fetches more stripes for Home page
   */
  async fetchMoreStripes() {
    this.#loading = true;
    let counter = 0;
    const newStripes = [];

    while (counter < 2 && this.#pointer < 25) {
      const stripeData = await this.#getHomePage(this.#pointer, 1, 6);
      this.#pointer++;

      if (stripeData.items.length > 0) {
        this.stripesFetched++;
        counter++;
        // each stripe has unique id
        stripeData.stripeId = this.#pointer - 1;
        // each stripe page number so we can fetch more after
        stripeData.page = 1;
        newStripes.push(stripeData)
      }
    }

    this.#stripes.push(...newStripes);
    this.#loading = false;

    return newStripes;
  }

  /**
   * Fetches more items for stripe on Home page, updates cache
   * @param {number} stripeId Stripe Id - unique to a stripe
   * @returns {SimpleRailItem[]} Returns array of new SimpleRailItems
   */
  async fetchMoreItemsForStripeId(stripeId) {
    this.#loading = true;
    const stripe = this.#stripes.find(stripe => stripe.stripeId === stripeId);
    if (stripe && stripe.hasMore) {
      const stripeData = await this.#getHomePage(stripeId, stripe.page++, 6);

      stripe.hasMore = stripeData.items.length === 6;

      if (stripeData) {
        stripe.items.push(...stripeData.items);
      }

      this.#loading = false;
      return stripeData.items;
    }

    this.#loading = false;
    return [];
  }

  resetData() {
    this.#heroSectionItems = undefined;
    this.#stripes = [];
    this.#pointer = 2;
    stripesFetched = 0;
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

  /**
  * @returns {boolean} - 'true' if we are fetching atm
  */
  get isLoading() {
    return this.#loading;
  }

  #getHomePageHeroSection = async () =>
    await request({
      url: '/start',
      apiVersion: V2,
      method: 'GET',
      params: {
        row: 1,
        page: 1,
        limit: 6,
      },
    }).then(this.#parseHomePageHeroSection)

  #parseHomePageHeroSection({ data }) {
    const galleryItems = data.entry?.map((item) => new GalleryRailItem(item));
    if (!galleryItems && galleryItems.length === 0) return;

    return {
      railType: galleryItems[0].type,
      railTitle: data.title,
      cardType: 'GALLERY_ITEM',
      items: galleryItems,
    };
  }

  #getHomePage = async (row, page, limit) =>
    await request({
      url: '/start',
      apiVersion: V2,
      method: 'GET',
      params: {
        row,
        page,
        limit,
      },
    }).then(this.#parseHomePageRailData) // parse the data

  #parseHomePageRailData({ data }) {
    const railItems = data.entry?.map((item) => new SimpleRailItem(item));
    if (!railItems || railItems.length === 0) return;

    return {
      railType: railItems[0].type,
      railTitle: data.title,
      cardType: 'POSTER',
      items: railItems,
    };
  }
}

const homePageService = new HomePageService();

export { homePageService as HomePageService };