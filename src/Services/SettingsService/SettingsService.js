import FetchingService from '../FetchingService';
import { V2 } from '../utils';
import { API_METHODS, API_URLS } from '../../constants/globalConstants';

export default class SettingsService extends FetchingService {
  getPages = async () => {
    return await this._request({
      url: `/${API_URLS.GET_PAGE_TABS}`,
      apiVersion: V2,
      method: API_METHODS.GET,
    });
  };

  getSinglePage = async (pageId) => {
    return await this._request({
      url: `/${API_URLS.GET_PAGE}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        id: pageId,
      },
    });
  };
}

const settingsService = new SettingsService();

export { settingsService as SettingsService };
