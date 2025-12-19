import { Metrics } from '@firebolt-js/sdk';
import { API_METHODS, API_URLS, LOCAL_STORAGE_KEYS } from '../../constants/globalConstants';
import { getDeviceInfo, getDeviceType } from '../../utils/device';
import FetchingService from '../FetchingService';
import { V2 } from '../utils';

class CMPService extends FetchingService {
  #cmpData;
  async initialFetch() {
    const deviceCode = getDeviceInfo().serialNumber;
    try {
      const cmpResults = await this.#getCMP(deviceCode);
      this.#cmpData = cmpResults;
      if (cmpResults && cmpResults.data) {
        this.#cmpData = cmpResults.data;
      } else {
        console.error('No data found in CMP results');
      }
    } catch (error) {
      console.error('Error fetching CMP data:', error);
      const deviceType = getDeviceType();
      deviceType === 'metrological' &&
        Metrics.error(Metrics.ErrorType.RESTRICTION, '400', 'Error fetching CMP data', false);
    }
  }

  async selectCMPChoice(deviceCode, choicePick) {
    await this.#getCMPChoice(deviceCode, choicePick);
  }

  get cmpData() {
    return this.#cmpData;
  }

  #getCMP = async (deviceCode) => {
    const response = await this._request({
      url: `/${API_URLS.GET_CMP}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        'X-DEVICE-ID': deviceCode,
      },
      params: {
        language: localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE) || 'en',
        device_id: deviceCode,
      },
    });
    return response;
  };

  #getCMPChoice = async (deviceCode, choicePick) => {
    return await this._request({
      url: `/${API_URLS.GET_CMP}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      headers: {
        'X-Device-ID': deviceCode,
      },
      params: {
        language: localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE) || 'en',
        choice: choicePick,
        device_id: deviceCode,
      },
    });
  };
}
const cmpService = new CMPService();

export { cmpService as CMPService };
