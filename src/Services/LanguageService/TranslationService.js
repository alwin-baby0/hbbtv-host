export default class TranslationService {
  getLanguageTranslations = async () => {
    const lngCode = localStorage.getItem('languageCode');

    const prevodi = await fetch(`https://api-applicaster.wedo.tv/lang/${lngCode || 'en'}/app`);
    const res = prevodi.json();
    return res;
  };

  setTranslations = async () => {
    this.getLanguageTranslations()
      .then((data) => {
        localStorage.setItem('languageTr', JSON.stringify(data));
      })
      .catch((error) => {
        const trExist = localStorage.getItem('languageTr');
        if (trExist) {
          console.log('Translation error:', error);
        } else {
          localStorage.setItem('languageTr', JSON.stringify(defTr));
        }
      });
  };
}

const translationService = new TranslationService();

export { translationService as TranslationService };

/**
 * @param { {[key: string]: string} } translations
 * @param { string } key
 */
export function t(translations, key) {
  return translations[key] || defTr[key];
}
