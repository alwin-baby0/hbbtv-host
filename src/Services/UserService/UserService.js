import { API_METHODS, API_URLS, LOCAL_STORAGE_KEYS } from '../../constants/globalConstants';
import { refreshTokenOnOauth } from '../../utils';
import FetchingService from '../FetchingService';
import { V2 } from '../utils';

class UserService extends FetchingService {
  getFavorites = async (page, limit = 8) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const response = await this._request({
      url: `/${API_URLS.GET_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
      params: {
        page,
        limit,
      },
    });

    if (!response) {
      await refreshTokenOnOauth();
    } else {
      return response;
    }
  };

  addToFavorites = async (videoID, vodType) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const response = await this._request({
      url: `/${API_URLS.ADD_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
      data: {
        content_id: videoID,
        content_type: vodType,
      },
    });

    if (!response) {
      await refreshTokenOnOauth();
    } else {
      return response;
    }
  };

  removeFromFavorites = async (videoID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const response = await this._request({
      url: `/${API_URLS.REMOVE_USER_FAVORITES}`,
      apiVersion: V2,
      method: API_METHODS.DELETE,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
      params: {
        content_id: videoID,
      },
    });

    if (!response) {
      await refreshTokenOnOauth();
    } else {
      return response;
    }
  };

  getRecentlyWatched = async (page, limit = 8) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    const response = await this._request({
      url: `/${API_URLS.GET_USER_RECENTLY_WATCHED}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
      params: {
        cachebuster: timestamp,
        page,
        limit,
      },
    });

    if (!response) {
      await refreshTokenOnOauth();
    } else {
      return response;
    }
  };

  addRecentlyWatched = async (videoID, vodType, vodPosition, seriesID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    if (vodPosition === 0) {
      vodPosition++;
    }

    const response = await this._request({
      url: `/${API_URLS.ADD_USER_RECENTLY_WATCHED}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
      data: {
        content_id: videoID,
        type: vodType,
        position: vodPosition,
        ...(seriesID && { series_id: seriesID }),
      },
    });

    if (!response) {
      await refreshTokenOnOauth();
    } else {
      return response;
    }
  };

  deleteRecentlyWatched = async (videoID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const timestamp = new Date().getTime();

    const response = await this._request({
      url: `/${API_URLS.REMOVE_USER_RECENTLY_WATCHED}`,
      apiVersion: V2,
      method: API_METHODS.DELETE,
      headers: {
        'X-nocache': timestamp,
        'X-Authorization': `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
      data: {
        video_id: videoID,
      },
    });

    if (!response) {
      await refreshTokenOnOauth();
    } else {
      return response;
    }
  };

  getProgress = async (videoID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const response = await this._request({
      url: `/${API_URLS.GET_PROGRESS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
      params: {
        video_id: videoID,
      },
    });

    if (!response) {
      await refreshTokenOnOauth();
    } else {
      return response;
    }
  };

  addProgress = async (videoID, position, duration) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const response = await this._request({
      url: `/${API_URLS.ADD_PROGRESS}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
      data: {
        video_id: videoID,
        position,
        duration,
      },
    });

    if (!response) {
      await refreshTokenOnOauth();
    } else {
      return response;
    }
  };

  getSeriesProgress = async (seriesID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const response = await this._request({
      url: `/${API_URLS.GET_SERIES_PROGRESS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
      params: {
        series_id: seriesID,
      },
    });

    if (!response) {
      await refreshTokenOnOauth();
    } else {
      return response;
    }
  };

  addSeriesProgress = async (videoID, seriesID, episodeNumber, seasonNumber, position) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    const response = await this._request({
      url: `/${API_URLS.ADD_SERIES_PROGRESS}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/json',
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
      data: {
        series_id: seriesID,
        last_episode: episodeNumber,
        last_season: seasonNumber,
        video_id: videoID,
        position: position,
      },
    });

    if (!response) {
      await refreshTokenOnOauth();
    } else {
      return response;
    }
  };
}

const userService = new UserService();

export { userService as UserService };
