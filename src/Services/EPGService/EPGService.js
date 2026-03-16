import FetchingService from '../FetchingService';
import { V2 } from '../utils';
import { EPGRailItem } from '../../Models/utils/EPGRailItem';
import { parseVodCategories } from '../../Models/parsers';
import {
  API_URLS,
  ROUTES,
  RAIL_TYPES,
  CARD_TYPES,
  API_METHODS,
  LOCAL_STORAGE_KEYS,
} from '../../constants/globalConstants';
import { Metrics } from '@firebolt-js/sdk';
import { getDeviceType } from '../../utils/device';

export const EPG_ROWS_PER_FETCH = 10;

class EPGService extends FetchingService {
  channelsItems;
  filteredChannelsItems; // New filtered channels array
  allChannels; // New filtered channels array

  epgs = [];
  epgsAll = [];
  pointer = 1;
  stripesFetched = 0;
  genreItems = [];
  startTime = Infinity;
  endTime = -Infinity;
  loading = false;

  async initialFetch(channelId) {
    // Reset state variables to ensure a fresh start
    // this.channelsItems = null;
    this.filteredChannelsItems = null; // Reset filtered channels
    this.epgs = [];
    this.pointer = 1;
    this.stripesFetched = 0;
    this.genreItems = [];

    const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS));

    const getGenres = parseVodCategories(
      {
        items: settings.genres.types.channels.map((item) => {
          return {
            value: item,
            localised: settings.genres.localized[item],
          };
        }),
      },
      ROUTES.LIVE
    );

    this.genreItems = getGenres;

    let channels;

    if (channelId) {
      const firstChannel = (await this.#getGenresCategory('', '', channelId))[0];

      channels = await this.#getGenresCategory('', `${channelId}`);
      channels.unshift(firstChannel);
    } else {
      channels = await this.#getGenresCategory();
    }

    if (channels?.length > 0) {
      this.channelsItems = channels;

      const channelsEPGs = this.channelsItems.slice(0, EPG_ROWS_PER_FETCH).map((channel) => {
        return this.#getEPG(channel.id, channel.url);
      });

      const epgResults = await Promise.all(channelsEPGs);

      this.epgs.push(
        ...epgResults.map((result, index) => {
          return {
            ...result,
            channelIcon: this.channelsItems[index].icon,
            channelTitle: this.channelsItems[index].title,
            src: this.channelsItems[index].url,
          };
        })
      );

      const channelsEPGsAll = this.channelsItems.slice(0, EPG_ROWS_PER_FETCH).map((channel) => {
        return this.#getEPG(channel.id);
      });

      const epgResultsAll = await Promise.all(channelsEPGsAll);

      this.epgsAll.push(
        ...epgResultsAll.map((result, index) => {
          return {
            ...result,
            channelIcon: this.channelsItems[index].icon,
            channelTitle: this.channelsItems[index].title,
            src: this.channelsItems[index].url,
          };
        })
      );

      this.allChannels = this.channelsItems.map((channel) => channel.id);

      this.filteredChannelsItems = this.channelsItems;

      this.reCalculateEpgContainer();

      this.pointer++;
      this.stripesFetched = this.epgs.length;
    }
  }

  async fetchMoreEPGs() {
    this.loading = true;

    const channelsEPGs = this.filteredChannelsItems.slice(
      (this.pointer - 1) * EPG_ROWS_PER_FETCH,
      this.pointer * EPG_ROWS_PER_FETCH
    );

    const channelEPG = channelsEPGs.map(async (channel) => {
      return this.#getEPG(channel.id);
    });

    const epgResults = await Promise.all(channelEPG);

    this.epgs.push(...epgResults);
    this.pointer++;
    this.stripesFetched += epgResults.length;

    this.reCalculateEpgContainer();

    this.loading = false;

    return { results: epgResults };
  }

  async fetchCategoryType(type) {
    this.pointer = 2;
    this.stripesFetched = 5;
    const fetchedResult = await this.#getGenresCategory(type);

    const channels = fetchedResult.map((channel) => channel.id);
    this.allChannels = channels;

    const firstFiveChannels = channels.slice(0, EPG_ROWS_PER_FETCH);

    const channelEPG = await Promise.all(
      firstFiveChannels.map((channelId) => {
        try {
          return this.#getEPG(channelId);
        } catch (error) {
          const deviceType = getDeviceType();
          deviceType === 'metrological' &&
            Metrics.error(Metrics.ErrorType.MEDIA, '404', 'Failed to get EPG for channel', false);
          console.error(`Failed to get EPG for channelId ${channelId}`, error);
          return null;
        }
      })
    );

    const epgResults = await Promise.all(channelEPG);

    this.epgs = [...epgResults];

    this.filteredChannelsItems = this.channelsItems.filter((channel) =>
      channels.includes(channel.id)
    );

    this.reCalculateEpgContainer();
  }

  reCalculateEpgContainer = () => {
    const { start, end } = this.epgsAll.reduce(
      (acc, epg) => {
        const endTimeMS = new Date(epg.items[epg.items.length - 1].endTimeAll.ms).getTime();
        const startTimeMS = new Date(epg.items[0].startTimeAll.ms).getTime();
        return {
          end: Math.max(endTimeMS, acc.end),
          start: Math.min(startTimeMS, acc.start),
        };
      },
      { start: this.startTime, end: this.endTime }
    );

    // Check if the new start time is earlier than the current start time
    if (start < this.startTime) {
      this.startTime = start;
    }

    this.endTime = end;
  };

  async getAllChannels() {
    const channelIdsInEPG = this.allChannels;

    return this.filteredChannelsItems.filter((channel) => {
      return channelIdsInEPG.includes(channel.id);
    });
  }

  async getFilteredChannels() {
    // Filter channels in filteredChannelsItems that have IDs present in allChannelIds
    return this.filteredChannelsItems.filter((channel) => {
      return this.allChannels.includes(channel.id);
    });
  }

  /**
   * @returns {boolean} - 'true' if we can fetch more stripes
   */
  get hasMore() {
    return this.stripesFetched < this.channelsItems.length;
  }

  #getGenresCategory = async (include, exclude, channel_id) =>
    await this._request({
      url: `/${API_URLS.GET_EPG_CHANNELS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        ...(include && { tags: include }),
        ...(exclude && { exclude }),
        ...(channel_id && { channel_id }),
      },
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    }).then(this.#parseLiveChannelsData);

  #parseLiveChannelsData({ data }) {
    if (data.entry && data.entry.items) {
      return data.entry.items.map((channel) => ({
        id: channel.id,
        title: channel.title,
        icon: channel.images[0]?.logo,
        url: channel.files[0].url,
      }));
    } else {
      return [
        {
          id: data.entry.id,
          title: data.entry.title,
          icon: data.entry.images[0]?.logo,
          url: data.entry.files[0].url,
        },
      ];
    }
  }

  getSingleEPGChannel = async (channelId) =>
    await this._request({
      url: `/${API_URLS.GET_EPG_PROGRAM}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        channel_id: `${channelId}`,
      },
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    }).then(this.#parseSingleEPGChannel);

  #parseSingleEPGChannel({ data }) {
    const railItems = data.entry?.items?.map((item) => new EPGRailItem(item));
    if (!railItems) return;

    return {
      railType: RAIL_TYPES.LIVETV,
      cardType: CARD_TYPES.POSTER,
      items: railItems,
      itemsPerRow: 1,
    };
  }

  #getEPG = async (channelId, url) =>
    this._request({
      url: `/${API_URLS.GET_EPG_PROGRAM}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        channel_id: channelId,
      },
      headers: {
        'X-API-Live-Key': process.env.APP_LIVE_KEY,
      },
    }).then((response) => this.#parseLiveEPGData(response, url));

  #parseLiveEPGData({ data }, url) {
    const channelId = data.entry.channel_id; // Extract the channel ID from the data

    const channelItem = data.entry?.items?.map(
      (item) => new EPGRailItem({ ...item, url: url, id: channelId })
    );

    // Add channelId to each EPGRailItem object
    channelItem.forEach((item) => {
      item.channelId = channelId;
    });
    return {
      railType: RAIL_TYPES.EPGS,
      cardType: CARD_TYPES.EPG_CARD_ITEM,
      items: channelItem,
      channelId: channelId, // Include channelId in the returned object
    };
  }

  get epgs() {
    return this.epgs;
  }

  get genreItems() {
    return this.genreItems;
  }

  get channelsItems() {
    return this.channelsItems;
  }

  get pointer() {
    return this.pointer;
  }

  get filteredChannelsItems() {
    return this.filteredChannelsItems;
  }

  get allChannels() {
    return this.allChannels;
  }
}

const epgService = new EPGService();

export { epgService as EPGService };
