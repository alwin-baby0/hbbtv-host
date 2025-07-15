import defTr from '../../public/static/translations/en.json';
/**
 * @param { {[key: string]: string} } translations
 * @param { string } key
 */
export function t(translations, key) {
  return translations[key] || defTr[key];
}
