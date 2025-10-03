import axios from 'axios';
import { createApiCtx } from '../utils';

const lngCode =
  localStorage.getItem('languageCode') || navigator.language || navigator.userLanguage || 'en-';

let defTrPromise = (async () => {
  const lng = lngCode.split('-')[0] || 'en';
  return import(`../../../public/static/translations/${lng}.json`);
})();

let translationsVar = undefined;
export default class TranslationService {
  getLanguageTranslations = async () => {
    const lng = lngCode.split('-')[0];
    localStorage.setItem('languageCode', lng.split('-')[0]);

    const translations = await axios(`https://api-applicaster.wedo.tv/lang/${lng || 'en'}/app`, {
      params: { ctx: createApiCtx() },
    });

    return translations.data;
  };

  setTranslations = async () => {
    try {
      const data = await this.getLanguageTranslations();
      translationsVar = data;
      localStorage.setItem('languageTr', JSON.stringify(data));
    } catch (error) {
      console.log('Translation error:', error);
      const trExist = localStorage.getItem('languageTr');
      if (trExist) {
        translationsVar = JSON.parse(trExist);
      } else {
        const defTr = await defTrPromise;
        translationsVar = defTr;
        localStorage.setItem('languageTr', JSON.stringify(defTr));
      }
    }
  };
}

const translationService = new TranslationService();

export { translationService as TranslationService };

/**
 * @param { keyof typeof defTr } key
 */
export async function t(key) {
  const defTr = await defTrPromise;
  return translationsVar[key] || defTr[key];
}
