import { API_METHODS, API_URLS, LOCAL_STORAGE_KEYS } from '../../constants/globalConstants';
import FetchingService from '../FetchingService';
import { V2 } from '../utils';

class UserService extends FetchingService {
  getFavorites = async (page, limit = 8) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    return await this._request({
      url: `/${API_URLS.GET_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
      },
      params: {
        page,
        limit,
      },
    });
  };

  addToFavorites = async (videoID, vodType) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    return await this._request({
      url: `/${API_URLS.ADD_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        content_id: videoID,
        content_type: vodType,
      },
    });
  };

  removeFromFavorites = async (videoID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    return await this._request({
      url: `/${API_URLS.REMOVE_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.DELETE,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        content_id: videoID,
      },
    });
  };

  getRecentlyWatched = async (page, limit = 8) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.GET_USER_RECENTLY_WATCHED}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
      },
      params: {
        cachebuster: timestamp,
        page,
        limit,
      },
    });
  };

  addRecentlyWatched = async (videoID, vodType, vodPosition, seriesID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    if (vodPosition === 0) {
      vodPosition++;
    }

    return await this._request({
      url: `/${API_URLS.ADD_USER_RECENTLY_WATCHED}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        content_id: videoID,
        type: vodType,
        position: vodPosition,
        ...(seriesID && { series_id: seriesID }),
      },
    });
  };

  deleteRecentlyWatched = async (videoID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.REMOVE_USER_RECENTLY_WATCHED}`,
      apiVersion: V2,
      method: API_METHODS.DELETE,
      headers: {
        'X-nocache': timestamp,
        'X-Authorization': `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        video_id: videoID,
      },
    });
  };

  getProgress = async (videoID) => {
    console.log('asdf ID getPROG: ', videoID);
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    return await this._request({
      url: `/${API_URLS.GET_PROGRESS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        content_id: videoID,
      },
    });
  };

  addProgress = async (videoID, position, duration) => {
    console.log('asdf ADD PROG: ', videoID, position, duration);
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    return await this._request({
      url: `/${API_URLS.ADD_PROGRESS}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        video_id: videoID,
        position,
        duration,
      },
    });
  };

  getSeriesProgress = async (seriesID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    return await this._request({
      url: `/${API_URLS.ADD_SERIES_PROGRESS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        series_id: seriesID,
      },
    });
  };
}

const userService = new UserService();

export { userService as UserService };
