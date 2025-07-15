const lng = localStorage.getItem('languageCode');
const defTr = await import(`../../../src/static/${lng}.json`);

console.log(defTr);

let translationsVar = undefined;
export default class TranslationService {
  getLanguageTranslations = async () => {
    const lngCode = localStorage.getItem('languageCode');

    const translations = await fetch(`https://api-applicaster.wedo.tv/lang/${lngCode || 'en'}/app`);
    const res = translations.json();
    return res;
  };

  setTranslations = async () => {
    this.getLanguageTranslations()
      .then((data) => {
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
