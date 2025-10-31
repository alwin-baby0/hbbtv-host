import { API_METHODS, API_URLS, LOCAL_STORAGE_KEYS } from '../../constants/globalConstants';
import FetchingService from '../FetchingService';
import { V2 } from '../utils';

class UserService extends FetchingService {
  getFavorites = async (page, limit = 8) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.GET_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        'X-Authorization': `Bearer ${userData.access_token}`,
      },
      params: {
        cachebuster: timestamp,
        page,
        limit,
      },
    });
  };

  addToFavorites = async (videoID, vodType) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.ADD_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        'X-Authorization': `Bearer ${userData.access_token}`,
        'X-nocache': timestamp,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        _: timestamp,
      },
      data: {
        video_id: videoID,
        type: vodType,
      },
    });
  };

  removeFromFavorites = async (videoID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/${API_URLS.REMOVE_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.DELETE,
      headers: {
        'X-Authorization': `Bearer ${userData.access_token}`,
        'X-nocache': timestamp,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        _: timestamp,
      },
      data: {
        video_id: videoID,
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
        'X-Authorization': `Bearer ${userData.access_token}`,
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

    const timestamp = new Date().getTime();

    if (vodPosition === 0) {
      vodPosition++;
    }

    return await this._request({
      url: `/${API_URLS.ADD_USER_RECENTLY_WATCHED}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        'X-nocache': timestamp,
        'X-Authorization': `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        video_id: videoID,
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
}

const userService = new UserService();

export { userService as UserService };
