import FetchingService from '../FetchingService';
import { V2 } from '../utils';
import axios from 'axios';

export default class CountryService extends FetchingService {
  getCountry = async () => {
    const translations = await axios(
      `https://api-applicaster.wedo.tv/ip2country.php?resp=json`,
      {}
    );
    return translations;
  };
}

const countryService = new CountryService();

export { countryService as CountryService };
