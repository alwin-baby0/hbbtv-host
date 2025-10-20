import FetchingService from '../FetchingService';
import { V2 } from '../utils';
import { API_METHODS, API_URLS } from '../../constants/globalConstants';

export default class LanguageService extends FetchingService {
  getLanguages = async () => {
    return await this._request({
      url: `/${API_URLS.GET_LANGUAGES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
    });
  };
}

const languageService = new LanguageService();

export { languageService as LanguageService };
