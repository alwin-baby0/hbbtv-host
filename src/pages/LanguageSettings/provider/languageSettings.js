import { parseTranslations } from '../../../Services/HomePageService';
import { LanguageService } from '../../../Services/LanguagesService';
import MemberTabButton from '../../../components/MemberTabButton/MemberTabButton';
import defTr from '../../../../static/translations/en.json';

const languageArea = (page, tabButtons) => {
  const items = tabButtons.map((tabInfo, index) => ({
    type: MemberTabButton,
    tabInfoData: tabInfo,
    w: 250,
    h: 100,
    tabIndex: index,
  }));

  page._Column.props = {
    items: items,
    enableScroll: false,
  };

  //  page.helpPages = data.entry;
};

export default async function (page) {
  const translations = parseTranslations();
  const languages = await LanguageService.getLanguages();
  // console.log(languages);

  page.props = {
    languagesData: languages.data,
  };

  const tabButtons = [
    {
      id: 0,
      title: translations.cookie_preferences || defTr.cookie_preferences,
    },
    {
      id: 1,
      title: 'Languages',
    },
  ];

  languageArea(page, tabButtons);
}
