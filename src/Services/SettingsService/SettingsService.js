import FetchingService from '../FetchingService';
import { V2 } from '../utils';

export default class SettingsService extends FetchingService {
  getPages = async () => {
    return await this._request({
      url: `/getPageTabs`,
      apiVersion: V2,
      method: 'GET',
    });
  };

  getSinglePage = async (pageId) => {
    return await this._request({
      url: `/getPage`,
      apiVersion: V2,
      method: 'GET',
      params: {
        id: pageId,
      },
    });
  };
}

const settingsService = new SettingsService();

export { settingsService as SettingsService };
