import FetchingService from '../FetchingService';
import { V2 } from '../utils';
import { API_METHODS } from '../../constants/globalConstants';

export default class SettingsService extends FetchingService {
  getPages = async () => {
    return await this._request({
      url: `/getPageTabs`,
      apiVersion: V2,
      method: API_METHODS.GET,
    });
  };

  getSinglePage = async (pageId) => {
    return await this._request({
      url: `/getPage`,
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
