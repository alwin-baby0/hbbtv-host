import FetchingService from '../FetchingService';
import { V2 } from '../utils';
import { EPGRailItem } from '../../Models/utils/EPGRailItem';
import { parseVodCategories } from '../../Models/parsers';
import { RAIL_TYPES } from '../../constants/globalConstants';
import { CARD_TYPES, API_METHODS } from '../../constants/globalConstants';

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

  async initialFetch() {
    // Reset state variables to ensure a fresh start
    this.channelsItems = null;
    this.filteredChannelsItems = null; // Reset filtered channels
    this.epgs = [];
    this.pointer = 1;
    this.stripesFetched = 0;
    this.genreItems = [];

    const getGenres = await this.#getContent();
    this.genreItems = getGenres;

    const channels = await this.#getGenresCategory('all');

    if (channels?.length > 0) {
      this.channelsItems = channels;

      const channelsEPGs = this.channelsItems.slice(0, EPG_ROWS_PER_FETCH).map((channel) => {
        return this.#getEPG(channel.id);
      });

      const epgResults = await Promise.all(channelsEPGs);

      this.epgs.push(
        ...epgResults.map((result, index) => {
          return {
            ...result,
            channelIcon: this.channelsItems[index].icon,
            channelTitle: this.channelsItems[index].title,
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
        const endTimeMS = new Date(epg.items[epg.items.length - 1].extensions.end_time).getTime();
        const startTimeMS = new Date(epg.items[0].extensions.start_time).getTime();
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

  #getContent = async () => {
    return await this.#getGenres();
  };

  #getGenres = async () =>
    await this._request({
      url: '/epg_genres',
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        type: `channel`,
        exclude: 'movies,channel',
      },
    }).then((result) => parseVodCategories(result, 'live'));

  #getGenresCategory = async (include) =>
    await this._request({
      url: '/epg_channels',
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        include: include,
        exclude: 'channel',
      },
    }).then(this.#parseLiveChannelsData);

  #parseLiveChannelsData({ data }) {
    return data.entry.map((channel) => ({
      id: channel.id,
      title: channel.title,
      icon: channel.media_group[0]?.media_item[0]?.src,
    }));
  }

  getSingleEPGChannel = async (channelId) =>
    await this._request({
      url: `/epg_program`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        id: `${channelId}`,
      },
    }).then(this.#parseSingleEPGChannel);

  #parseSingleEPGChannel({ data }) {
    const railItems = data.entry?.map((item) => new EPGRailItem(item));
    if (!railItems) return;

    return {
      railType: RAIL_TYPES.LIVETV,
      cardType: CARD_TYPES.POSTER,
      items: railItems,
      itemsPerRow: 1,
    };
  }

  #getEPG = async (channelId) =>
    this._request({
      url: '/epg_program',
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        id: channelId,
      },
    }).then(this.#parseLiveEPGData);

  #parseLiveEPGData({ data }) {
    const channelId = data.id; // Extract the channel ID from the data

    const channelItem = data.entry?.map((item) => new EPGRailItem(item));

    // Add channelId to each EPGRailItem object
    channelItem.forEach((item) => {
      item.channelId = channelId;
    });
    return {
      railType: data.type.value,
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
