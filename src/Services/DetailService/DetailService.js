import { GalleryItem } from '../../Models';
import { parseDetailsData, parseSeasonData } from '../../Models/parsers';
import FetchingService from '../FetchingService';
import { V2 } from '../utils';
import { API_METHODS, API_URLS, LOCAL_STORAGE_KEYS } from '../../constants/globalConstants';

class DetailService extends FetchingService {
  getMovie = async (movieId) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    const headers = userData ? { 'X-Authorization': `Bearer ${userData.access_token}` } : {}; // Empty headers object if userData is not present

    return await this._request({
      url: `/${API_URLS.GET_MOVIE}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: headers,
      params: {
        _: timestamp,
        id: movieId,
      },
    }).then(parseDetailsData);
  };

  getSerie = async (seriesId) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    const headers = userData ? { 'X-Authorization': `Bearer ${userData.access_token}` } : {}; // Empty headers object if userData is not present

    const galleryItem = await this._request({
      url: `/${API_URLS.GET_SERIE}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: headers,
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
          return data.entry.map((tab) => tab.id);
        }

        return [];
      })
      .catch((error) => {
        console.error('Error fetching season tabs:', error);
        return [];
      });

    const seasonsPromises = seasonTabs.map((id) =>
      this._request({
        url: `/${API_URLS.GET_SEASON}`,
        apiVersion: V2,
        method: API_METHODS.GET,
        params: {
          _: timestamp,
          season_id: id,
        },
      }).then((data) => parseSeasonData(data, seriesId))
    );

    try {
      const seasons = await Promise.all(seasonsPromises);
      return {
        galleryItem,
        seasons,
      };
    } catch (error) {
      console.error('Error fetching seasons:', error);
      throw error;
    }
  };

  getAdCues = async (videoId, seriesId, videoUrl) =>
    this._request({
      url: `/${API_URLS.GET_AD_CUES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        video_id: videoId,
        series_id: seriesId,
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
    }).then(({ data }) => new GalleryItem(data?.entry[0]));
}

const detailService = new DetailService();

export { detailService as DetailService };
