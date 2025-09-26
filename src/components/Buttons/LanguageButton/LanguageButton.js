import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../../reskin/colors.json';
import { createApiCtx } from '../../../Services/utils';
import axios from 'axios';

const languageMapper = {
  ab: { name: 'Abkhaz', local: 'Аҧсуа' },
  aa: { name: 'Afar', local: 'Afaraf' },
  af: { name: 'Afrikaans', local: 'Afrikaans' },
  ak: { name: 'Akan', local: 'Akan' },
  sq: { name: 'Albanian', local: 'Shqip' },
  am: { name: 'Amharic', local: 'አማርኛ' },
  ar: { name: 'Arabic', local: 'العربية' },
  an: { name: 'Aragonese', local: 'Aragonés' },
  hy: { name: 'Armenian', local: 'Հայերեն' },
  as: { name: 'Assamese', local: 'অসমীয়া' },
  av: { name: 'Avaric', local: 'Авар' },
  ae: { name: 'Avestan', local: 'avesta' },
  ay: { name: 'Aymara', local: 'Aymar' },
  az: { name: 'Azerbaijani', local: 'Azərbaycanca' },
  bm: { name: 'Bambara', local: 'Bamanankan' },
  ba: { name: 'Bashkir', local: 'Башҡортса' },
  eu: { name: 'Basque', local: 'Euskara' },
  be: { name: 'Belarusian', local: 'Беларуская' },
  bn: { name: 'Bengali', local: 'বাংলা' },
  bh: { name: 'Bihari', local: 'भोजपुरी' },
  bi: { name: 'Bislama', local: 'Bislama' },
  bs: { name: 'Bosnian', local: 'Bosanski' },
  bt: { name: 'Breton', local: 'Brezhoneg' },
  bg: { name: 'Bulgarian', local: 'Български' },
  my: { name: 'Burmese', local: 'မြန်မာဘာသာ' },
  ca: { name: 'Catalan', local: 'Català' },
  ch: { name: 'Chamorro', local: 'Chamoru' },
  ce: { name: 'Chechen', local: 'Нохчийн' },
  ny: { name: 'Chichewa', local: 'Chichewa' },
  zh: { name: 'Chinese', local: '中文' },
  cv: { name: 'Chuvash', local: 'Чӑвашла' },
  kw: { name: 'Cornish', local: 'Kernewek' },
  co: { name: 'Corsican', local: 'Corsu' },
  cr: { name: 'Cree', local: 'ᓀᐦᐃᔭᐍᐏᐣ' },
  hr: { name: 'Croatian', local: 'Hrvatski' },
  cs: { name: 'Czech', local: 'Čeština' },
  da: { name: 'Danish', local: 'Dansk' },
  dv: { name: 'Divehi', local: 'Divehi' },
  nl: { name: 'Dutch', local: 'Nederlands' },
  dz: { name: 'Dzongkha', local: 'རྫོང་ཁ' },
  en: { name: 'English', local: 'English' },
  eo: { name: 'Esperanto', local: 'Esperanto' },
  et: { name: 'Estonian', local: 'Eesti' },
  ee: { name: 'Ewe', local: 'Eʋegbe' },
  fo: { name: 'Faroese', local: 'Føroyskt' },
  fj: { name: 'Fijian', local: 'Na Vosa Vaka-Viti' },
  fi: { name: 'Finnish', local: 'Suomi' },
  fr: { name: 'French', local: 'Français' },
  ff: { name: 'Fula', local: 'Fulfulde' },
  gl: { name: 'Galician', local: 'Galego' },
  ka: { name: 'Georgian', local: 'ქართული' },
  de: { name: 'German', local: 'Deutsch' },
  el: { name: 'Greek', local: 'Ελληνικά' },
  gn: { name: 'Guaraní', local: "Avañe'ẽ" },
  gu: { name: 'Gujarati', local: 'ગુજરાતી' },
  ht: { name: 'Haitian', local: 'Kreyòl Ayisyen' },
  ha: { name: 'Hausa', local: 'هَوُسَ' },
  he: { name: 'Hebrew', local: 'עברית' },
  hz: { name: 'Herero', local: 'Otjiherero' },
  hi: { name: 'Hindi', local: 'हिन्दी' },
  ho: { name: 'Hiri Motu', local: 'Hiri Motu' },
  hu: { name: 'Hungarian', local: 'Magyar' },
  ia: { name: 'Interlingua', local: 'Interlingua' },
  id: { name: 'Indonesian', local: 'Bahasa Indonesia' },
  ie: { name: 'Interlingue', local: 'Interlingue' },
  ga: { name: 'Irish', local: 'Gaeilge' },
  ig: { name: 'Igbo', local: 'Igbo' },
  ik: { name: 'Inupiaq', local: 'Iñupiak' },
  io: { name: 'Ido', local: 'Ido' },
  is: { name: 'Icelandic', local: 'Íslenska' },
  it: { name: 'Italian', local: 'Italiano' },
  iu: { name: 'Inuktitut', local: 'ᐃᓄᒃᑎᑐᑦ' },
  ja: { name: 'Japanese', local: '日本語' },
  jv: { name: 'Javanese', local: 'Basa Jawa' },
  kl: { name: 'Kalaallisut', local: 'Kalaallisut' },
  kn: { name: 'Kannada', local: 'ಕನ್ನಡ' },
  kr: { name: 'Kanuri', local: 'Kanuri' },
  ks: { name: 'Kashmiri', local: 'كشميري' },
  kk: { name: 'Kazakh', local: 'Қазақша' },
  km: { name: 'Khmer', local: 'ភាសាខ្មែរ' },
  ki: { name: 'Kikuyu', local: 'Gĩkũyũ' },
  rw: { name: 'Kinyarwanda', local: 'Kinyarwanda' },
  ky: { name: 'Kyrgyz', local: 'Кыргызча' },
  kv: { name: 'Komi', local: 'Коми' },
  kg: { name: 'Kongo', local: 'Kongo' },
  ko: { name: 'Korean', local: '한국어' },
  ku: { name: 'Kurdish', local: 'Kurdî' },
  kj: { name: 'Kwanyama', local: 'Kuanyama' },
  la: { name: 'Latin', local: 'Latina' },
  lb: { name: 'Luxembourgish', local: 'Lëtzebuergesch' },
  lg: { name: 'Ganda', local: 'Luganda' },
  li: { name: 'Limburgish', local: 'Limburgs' },
  ln: { name: 'Lingala', local: 'Lingála' },
  lo: { name: 'Lao', local: 'ພາສາລາວ' },
  lt: { name: 'Lithuanian', local: 'Lietuvių' },
  lu: { name: 'Luba-Katanga', local: 'Tshiluba' },
  lv: { name: 'Latvian', local: 'Latviešu' },
  gv: { name: 'Manx', local: 'Gaelg' },
  mk: { name: 'Macedonian', local: 'Македонски' },
  mg: { name: 'Malagasy', local: 'Malagasy' },
  ms: { name: 'Malay', local: 'Bahasa Melayu' },
  ml: { name: 'Malayalam', local: 'മലയാളം' },
  mt: { name: 'Maltese', local: 'Malti' },
  mi: { name: 'Māori', local: 'Māori' },
  mr: { name: 'Marathi', local: 'मराठी' },
  mh: { name: 'Marshallese', local: 'Kajin M̧ajeļ' },
  mn: { name: 'Mongolian', local: 'Монгол' },
  na: { name: 'Nauru', local: 'Dorerin Naoero' },
  nv: { name: 'Navajo', local: 'Diné Bizaad' },
  nd: { name: 'Northern Ndebele', local: 'isiNdebele' },
  ne: { name: 'Nepali', local: 'नेपाली' },
  ng: { name: 'Ndonga', local: 'Owambo' },
  nb: { name: 'Norwegian Bokmål', local: 'Norsk (Bokmål)' },
  nn: { name: 'Norwegian Nynorsk', local: 'Norsk (Nynorsk)' },
  no: { name: 'Norwegian', local: 'Norsk' },
  ii: { name: 'Nuosu', local: 'ꆈꌠ꒿ Nuosuhxop' },
  nr: { name: 'Southern Ndebele', local: 'isiNdebele' },
  oc: { name: 'Occitan', local: 'Occitan' },
  oj: { name: 'Ojibwe', local: 'ᐊᓂᔑᓈᐯᒧᐎᓐ' },
  cu: { name: 'Old Church Slavonic', local: 'Словѣ́ньскъ' },
  om: { name: 'Oromo', local: 'Afaan Oromoo' },
  or: { name: 'Oriya', local: 'ଓଡି଼ଆ' },
  os: { name: 'Ossetian', local: 'Ирон æвзаг' },
  pa: { name: 'Panjabi', local: 'ਪੰਜਾਬੀ' },
  pi: { name: 'Pāli', local: 'पाऴि' },
  fa: { name: 'Persian', local: 'فارسی' },
  pl: { name: 'Polish', local: 'Polski' },
  ps: { name: 'Pashto', local: 'پښتو' },
  pt: { name: 'Portuguese', local: 'Português' },
  qu: { name: 'Quechua', local: 'Runa Simi' },
  rm: { name: 'Romansh', local: 'Rumantsch' },
  rn: { name: 'Kirundi', local: 'Kirundi' },
  ro: { name: 'Romanian', local: 'Română' },
  ru: { name: 'Russian', local: 'Русский' },
  sa: { name: 'Sanskrit', local: 'संस्कृतम्' },
  sc: { name: 'Sardinian', local: 'Sardu' },
  sd: { name: 'Sindhi', local: 'سنڌي‎' },
  se: { name: 'Northern Sami', local: 'Sámegiella' },
  sm: { name: 'Samoan', local: 'Gagana Sāmoa' },
  sg: { name: 'Sango', local: 'Sängö' },
  sr: { name: 'Serbian', local: 'Српски' },
  gd: { name: 'Gaelic', local: 'Gàidhlig' },
  sn: { name: 'Shona', local: 'ChiShona' },
  si: { name: 'Sinhala', local: 'සිංහල' },
  sk: { name: 'Slovak', local: 'Slovenčina' },
  sl: { name: 'Slovene', local: 'Slovenščina' },
  so: { name: 'Somali', local: 'Soomaaliga' },
  st: { name: 'Southern Sotho', local: 'Sesotho' },
  es: { name: 'Spanish', local: 'Español' },
  su: { name: 'Sundanese', local: 'Basa Sunda' },
  sw: { name: 'Swahili', local: 'Kiswahili' },
  ss: { name: 'Swati', local: 'SiSwati' },
  sv: { name: 'Swedish', local: 'Svenska' },
  ta: { name: 'Tamil', local: 'தமிழ்' },
  te: { name: 'Telugu', local: 'తెలుగు' },
  tg: { name: 'Tajik', local: 'Тоҷикӣ' },
  th: { name: 'Thai', local: 'ภาษาไทย' },
  ti: { name: 'Tigrinya', local: 'ትግርኛ' },
  bo: { name: 'Tibetan Standard', local: 'བོད་ཡིག' },
  tk: { name: 'Turkmen', local: 'Türkmençe' },
  tl: { name: 'Tagalog', local: 'Tagalog' },
  tn: { name: 'Tswana', local: 'Setswana' },
  to: { name: 'Tonga', local: 'faka Tonga' },
  tr: { name: 'Turkish', local: 'Türkçe' },
  ts: { name: 'Tsonga', local: 'Xitsonga' },
  tt: { name: 'Tatar', local: 'Татарча' },
  tw: { name: 'Twi', local: 'Twi' },
  ty: { name: 'Tahitian', local: 'Reo Mā’ohi' },
  ug: { name: 'Uyghur', local: 'ئۇيغۇرچه' },
  uk: { name: 'Ukrainian', local: 'Українська' },
  ur: { name: 'Urdu', local: 'اردو' },
  uz: { name: 'Uzbek', local: 'O‘zbek' },
  ve: { name: 'Venda', local: 'Tshivenḓa' },
  vi: { name: 'Vietnamese', local: 'Tiếng Việt' },
  vo: { name: 'Volapük', local: 'Volapük' },
  wa: { name: 'Walloon', local: 'Walon' },
  cy: { name: 'Welsh', local: 'Cymraeg' },
  wo: { name: 'Wolof', local: 'Wolof' },
  fy: { name: 'Western Frisian', local: 'Frysk' },
  xh: { name: 'Xhosa', local: 'isiXhosa' },
  yi: { name: 'Yiddish', local: 'ייִדיש' },
  yo: { name: 'Yoruba', local: 'Yorùbá' },
  za: { name: 'Zhuang', local: 'Cuengh' },
  zu: { name: 'Zulu', local: 'isiZulu' },
};

export default class LanguageButton extends Lightning.Component {
  _props = {
    languageInfo: {},
  };
  static _template() {
    return {
      Column: {
        collision: true,
        flex: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
        w: 1045,
        h: 85,
        rect: true,
        Text: {},
      },
    };
  }

  set props(props) {
    const { items, ...rest } = props;
    this._props = { ...this._props, ...rest };
  }

  get _Column() {
    return this.tag('Column');
  }

  _selectButton() {
    this._selected = true;
    const languageCode = localStorage.getItem('languageCode');
    const isSelected = this._props.languageInfo === languageCode;

    this._Column.patch({
      color: Colors(isSelected ? colors.focusedLanguage : colors.unfocusedLanguage).get(),
    });
  }

  _unselectButton() {
    this._selected = false;
    this._Column.patch({
      color: Colors(colors.unfocusedLanguage).get(),
    });
  }

  _enable() {
    const { languageInfo } = this._props;
    this._Column.patch({
      color: Colors(colors.background).get(),
      Text: {
        text: languageMapper[languageInfo].name,
        color: Colors(colors.white).get(),
        fontFace: 'Montserrat-SemiBold',
      },
    });
  }

  _findLanguageIndex() {
    const languageCode = localStorage.getItem('languageCode');
    const index = this._props.languageInfo.findIndex((info) => info.languageInfo === languageCode);
    return index; // Vratiće -1 ako nije pronađen
  }

  _active() {
    const languageCode = localStorage.getItem('languageCode');
    const isSelected = this._props.languageInfo === languageCode;

    if (isSelected) {
      this.fireAncestors('$setFocusLanguage', this._props.languageIndex);
    }
  }

  async _handleEnter() {
    localStorage.setItem('languageCode', this._props.languageInfo);
    const translations = await this.#getLanguageTranslations(this._props.languageInfo);
    localStorage.setItem('languageTr', JSON.stringify(translations));
    Router.navigate('home');
    window.location.reload();
  }

  _focus() {
    this._Column.patch({
      color: Colors(colors.focus).get(),
    });
  }

  _unfocus() {
    const languageCode = localStorage.getItem('languageCode');
    const isSelected = this._props.languageInfo === languageCode;

    this._Column.patch({
      color: Colors(isSelected ? colors.focusedLanguage : colors.unfocusedLanguage).get(),
    });
  }

  _handleHover() {
    this._focus();
  }

  _handleUnhover() {
    this._unfocus();
  }

  _handleClick() {
    localStorage.setItem('languageCode', this._props.languageInfo);
    Router.navigate('home');
    window.location.reload();
  }

  #getLanguageTranslations = async (lngCode) => {
    const translations = await axios(`https://api-applicaster.wedo.tv/lang/${lngCode}/app`, {
      params: {
        ctx: createApiCtx(),
      },
    });

    const res = translations.data;

    return res;
  };
}
