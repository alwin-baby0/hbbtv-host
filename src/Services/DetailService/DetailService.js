import { GalleryItem } from '../../Models';
import {
  parseDetailsData,
  parseSeasonData,
  parseVodCategories,
  parseSeasonTabs,
} from '../../Models/parsers';
import FetchingService from '../FetchingService';
import { V2 } from '../utils';
import { API_METHODS, API_URLS, LOCAL_STORAGE_KEYS } from '../../constants/globalConstants';
import { Metrics } from '@firebolt-js/sdk';
import { getDeviceType } from '../../utils/device';

class DetailService extends FetchingService {
  getMovie = async (movieId) => {
    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.GET_MOVIE}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        _: timestamp,
        id: movieId,
      },
    }).then(parseDetailsData);
  };

  seasonTabsParsed;

  getSerie = async (seriesId) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    const galleryItem = await this._request({
      url: `/${API_URLS.GET_SERIE}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        _: timestamp,
        id: seriesId,
      },
    }).then(parseDetailsData);

    const seasonTabs = await this._request({
      url: `/${API_URLS.GET_SEASON_TABS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        _: timestamp,
        series_id: seriesId,
      },
    })
      .then(({ data }) => {
        if (data && data.entry) {
          this.seasonTabsParsed = parseSeasonTabs({ data }, 'seasonTabs');
          return data.entry.items.map((tab) => ({ id: tab.id, title: tab.name }));
        }

        return [];
      })
      .catch((error) => {
        const deviceType = getDeviceType();
        deviceType === 'metrological' &&
          Metrics.error(Metrics.ErrorType.MEDIA, '404', 'Error fetching seasons', true);
        console.error('Error fetching season tabs:', error);
        return [];
      });

    const seasonsPromises = seasonTabs.map(({ id }) =>
      this._request({
        url: `/${API_URLS.GET_SEASON}`,
        apiVersion: V2,
        method: API_METHODS.GET,
        params: {
          _: timestamp,
          season_id: id,
        },
      }).then((data) => parseSeasonData(data, seriesId, id))
    );

    try {
      const seasons = await Promise.all(seasonsPromises);
      return {
        galleryItem,
        seasons,
        seasonTabs,
        seasonTabsParsed: this.seasonTabsParsed,
      };
    } catch (error) {
      const deviceType = getDeviceType();
      deviceType === 'metrological' &&
        Metrics.error(Metrics.ErrorType.MEDIA, '400', 'Error fetching seasons', true);
      console.error('Error fetching seasons:', error);
      throw error;
    }
  };

  getAdCues = async (videoId, seriesId, videoUrl) =>
    this._request({
      url: `/${API_URLS.GET_AD_CUES}`,
      apiVersion: V2,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: API_METHODS.GET,
      params: {
        video_id: videoId,
        ...(seriesId && { series_id: seriesId }),
        video_url: videoUrl,
      },
    });

  getSport = async (sportId) => {
    return await this.getSerie(sportId);
  };

  getEvent = async (eventId) =>
    this._request({
      url: `/${API_URLS.GET_SPORT_EVENT}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        id: eventId,
      },
    }).then(parseDetailsData);
}

const detailService = new DetailService();

export { detailService as DetailService };
