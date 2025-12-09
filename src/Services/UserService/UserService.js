import { API_METHODS, API_URLS, LOCAL_STORAGE_KEYS } from '../../constants/globalConstants';
import { AuthorizationService } from '../AuthorizationService';
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
    }).catch((err) => {
      if (err.status === 401) {
        const userData = AuthorizationService.refreshToken();
        if (userData?.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
        window.location.reload();
      }
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
    }).catch((err) => {
      if (err.status === 401) {
        const userData = AuthorizationService.refreshToken();
        if (userData?.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
        window.location.reload();
      }
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
    }).catch((err) => {
      if (err.status === 401) {
        const userData = AuthorizationService.refreshToken();
        if (userData?.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
        window.location.reload();
      }
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
    }).catch((err) => {
      if (err.status === 401) {
        const userData = AuthorizationService.refreshToken();
        if (userData?.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
        window.location.reload();
      }
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
    }).catch((err) => {
      if (err.status === 401) {
        const userData = AuthorizationService.refreshToken();
        if (userData?.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
        window.location.reload();
      }
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
    }).catch((err) => {
      if (err.status === 401) {
        const userData = AuthorizationService.refreshToken();
        if (userData?.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
        window.location.reload();
      }
    });
  };

  getProgress = async (videoID) => {
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
        video_id: videoID,
      },
    }).catch((err) => {
      if (err.status === 401) {
        const userData = AuthorizationService.refreshToken();
        if (userData?.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
        window.location.reload();
      }
    });
  };

  addProgress = async (videoID, position, duration) => {
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
    }).catch((err) => {
      if (err.status === 401) {
        const userData = AuthorizationService.refreshToken();
        if (userData?.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
        window.location.reload();
      }
    });
  };

  getSeriesProgress = async (seriesID) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    return await this._request({
      url: `/${API_URLS.GET_SERIES_PROGRESS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        series_id: seriesID,
      },
    }).catch((err) => {
      if (err.status === 401) {
        const userData = AuthorizationService.refreshToken();
        if (userData?.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
        window.location.reload();
      }
    });
  };

  addSeriesProgress = async (videoID, seriesID, episodeNumber, seasonNumber, position) => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA));

    return await this._request({
      url: `/${API_URLS.ADD_SERIES_PROGRESS}`,
      apiVersion: V2,
      method: API_METHODS.POST,
      headers: {
        Authorization: `Bearer ${userData.access_token}`,
        'Content-Type': 'application/json',
      },
      data: {
        series_id: seriesID,
        last_episode: episodeNumber,
        last_season: seasonNumber,
        video_id: videoID,
        position: position,
      },
    }).catch((err) => {
      if (err.status === 401) {
        const userData = AuthorizationService.refreshToken();
        if (userData?.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
        window.location.reload();
      }
    });
  };
}

const userService = new UserService();

export { userService as UserService };
