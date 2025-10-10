import FetchingService from '../FetchingService';
import { V2 } from '../utils';
import { API_METHODS } from '../../constants/globalConstants';

export default class LanguageService extends FetchingService {
  getLanguages = async () => {
    return await this._request({
      url: `/languageByCountry`,
      apiVersion: V2,
      method: API_METHODS.GET,
    });
  };
}

const languageService = new LanguageService();

export { languageService as LanguageService };
