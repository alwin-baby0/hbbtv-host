import { GalleryItem } from '../Models';
import { parseDetailsData, parseSeasonData } from '../Models/parsers';
import FetchingService from './FetchingService';
import { V2 } from './utils';

class DetailService extends FetchingService {
  getMovie = async (movieId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const timestamp = new Date().getTime();

    const headers = userData ? { 'X-Authorization': `Bearer ${userData.access_token}` } : {}; // Empty headers object if userData is not present

    return await this._request({
      url: `/getMovie`,
      apiVersion: V2,
      method: 'GET',
      headers: headers,
      params: {
        _: timestamp,
        id: movieId,
        ssai_test: '',
      },
    }).then(parseDetailsData);
  };

  getSerie = async (seriesId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const timestamp = new Date().getTime();

    const headers = userData ? { 'X-Authorization': `Bearer ${userData.access_token}` } : {}; // Empty headers object if userData is not present

    const galleryItem = await this._request({
      url: '/getSerie',
      apiVersion: V2,
      method: 'GET',
      headers: headers,
      params: {
        _: timestamp,
        id: seriesId,
      },
    }).then(parseDetailsData);

    const seasonTabs = await this._request({
      url: '/getSeasonTabs',
      apiVersion: V2,
      method: 'GET',
      params: {
        _: timestamp,
        series_id: seriesId,
      },
    })
      .then(({ data }) => {
        if (data && data.entry) {
          return data.entry.map((tab) => tab.id);
        }
        // Handle case when data or data.entry is undefined
        return [];
      })
      .catch((error) => {
        // Handle the error appropriately
        console.error('Error fetching season tabs:', error);
        return [];
      });

    const seasonsPromises = seasonTabs.map((id) =>
      this._request({
        url: '/getSeason',
        apiVersion: V2,
        method: 'GET',
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
      // Handle or throw the error based on your application's error handling policy
      throw error;
    }
  };

  getSport = async (sportId) => {
    return await this.getSerie(sportId);
  };

  getEvent = async (eventId) =>
    this._request({
      url: '/getSportEvent',
      apiVersion: V2,
      method: 'GET',
      params: {
        id: eventId,
      },
    }).then(({ data }) => new GalleryItem(data?.entry[0]));
}

const detailService = new DetailService();

export { detailService as DetailService };
