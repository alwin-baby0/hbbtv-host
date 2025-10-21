import FetchingService from '../FetchingService';
import axios from 'axios';

export default class CountryService extends FetchingService {
  getCountry = async () => {
    const translations = await axios(`${process.env.APP_BASE_URL_2}/ip2country.php?resp=json`, {});
    return translations;
  };
}

const countryService = new CountryService();

export { countryService as CountryService };
