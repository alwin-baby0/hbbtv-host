const lngCode =
  localStorage.getItem('languageCode') || navigator.language || navigator.userLanguage || 'en-';
const defTr = await import(
  `../../../public/static/translations/${lngCode.split('-')[0] || 'en'}.json`
);

let translationsVar = undefined;
export default class TranslationService {
  getLanguageTranslations = async () => {
    const lng = lngCode.split('-')[0];
    localStorage.setItem('languageCode', lng.split('-')[0]);
    console.log('LNG Code: ', lng);

    const translations = await fetch(`https://api-applicaster.wedo.tv/lang/${lng || 'en'}/app`);
    const res = translations.json();
    return res;
  };

  setTranslations = async () => {
    this.getLanguageTranslations()
      .then((data) => {
        console.log({ data });
        translationsVar = data;
        localStorage.setItem('languageTr', JSON.stringify(data));
      })
      .catch((error) => {
        const trExist = localStorage.getItem('languageTr');
        console.log('Translation error:', error);
        if (trExist) {
          localStorage.setItem('languageTr', JSON.stringify(trExist));
          translationsVar = trExist;
        } else {
          localStorage.setItem('languageTr', JSON.stringify(defTr));
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
  return translationsVar[key] || defTr[key];
}
