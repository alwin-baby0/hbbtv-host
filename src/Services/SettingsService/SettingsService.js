import FetchingService from '../FetchingService';
import { V2 } from '../utils';
import { API_METHODS, API_URLS } from '../../constants/globalConstants';

export default class SettingsService extends FetchingService {
  getPages = async () => {
    return await this._request({
      url: `/${API_URLS.GET_PAGE_TABS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
    });
  };

  getSinglePage = async (pageId) => {
    return await this._request({
      url: `/${API_URLS.GET_PAGE}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        page_id: pageId,
      },
      headers: {
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
    });
  };

  getSettings = async () => {
    return this._request({
      url: `/${API_URLS.GET_SETTINGS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
    });
  };
}

const settingsService = new SettingsService();

export { settingsService as SettingsService };
