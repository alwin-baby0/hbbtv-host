import axios from 'axios';
import { createApiCtx } from '../utils';
import { LOCAL_STORAGE_KEYS, LOG_LEVEL } from '../../constants/globalConstants';
import { Metrics } from '@firebolt-js/sdk';
import { getDeviceInfo, getDeviceType } from '../../utils/device';
import { LoggingService } from '../LoggingService/index.js';

const lngCode =
  localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE) ||
  navigator.language ||
  navigator.userLanguage ||
  'en-';
const defTr = await import(`../../../public/static/translations/en.json`);

let translationsVar = undefined;
export default class TranslationService {
  getLanguageTranslations = async () => {
    const lng = lngCode.split('-')[0];
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE, lng.split('-')[0]);

    const translations = await axios(`${process.env.APP_BASE_URL_2}/lang/${lng || 'en'}/app`, {
      params: { ctx: createApiCtx() },
    });

    return translations.data;
  };

  setTranslations = async () => {
    this.getLanguageTranslations()
      .then((data) => {
        translationsVar = data;
        localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE_TRANSLATIONS, JSON.stringify(data));
      })
      .catch((error) => {
        const deviceInfo = getDeviceInfo();
        LoggingService.postLog(LOG_LEVEL.ERROR, deviceInfo, {
          message: 'API call failed',
          error,
        });
        const deviceType = getDeviceType();
        deviceType === 'metrological' &&
          Metrics.error(
            Metrics.ErrorType.MEDIA,
            error.response ? error.response.status.toString() : '404',
            'No translations found',
            false
          );
        const trExist = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_TRANSLATIONS);
        console.log('Translation error:', error);
        if (trExist) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE_TRANSLATIONS, JSON.stringify(trExist));
          translationsVar = trExist;
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE_TRANSLATIONS, JSON.stringify(defTr));
          translationsVar = defTr;
        }
      });
  };
}

const translationService = new TranslationService();

export { translationService as TranslationService };

/**
 * @param { keyof typeof defTr } key
 */
export function t(key) {
  return translationsVar && translationsVar[key] ? translationsVar[key] : defTr[key];
}
