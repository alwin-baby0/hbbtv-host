import FetchingService from '../FetchingService';
import { V2 } from '../utils';
import { API_METHODS, API_URLS } from '../../constants/globalConstants';

export default class LanguageService extends FetchingService {
  getLanguages = async () => {
    return await this._request({
      url: `/${API_URLS.GET_LANGUAGES}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        'X-API-Live-Key': 'live_samsung_e8262140d6f64be7178597b99e53bd617f9035e26ca143a1',
      },
    });
  };
}

const languageService = new LanguageService();

export { languageService as LanguageService };
