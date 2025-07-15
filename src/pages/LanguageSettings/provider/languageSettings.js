import { LanguageService, parseTranslations } from '../../../Services';
import MemberTabButton from '../../../components/MemberTabButton/MemberTabButton';
import { t } from '../../../utils/translation';

const languageArea = (page, tabButtons) => {
  const items = tabButtons.map((tabInfo, index) => ({
    type: MemberTabButton,
    collision: true,
    tabInfoData: tabInfo,
    w: 250,
    h: 100,
    tabIndex: index,
  }));

  page._Column.props = {
    items: items,
    enableScroll: false,
  };
};

export default async function (page) {
  const translations = parseTranslations();
  const languages = await LanguageService.getLanguages();

  page.props = {
    languagesData: languages.data,
  };

  let tabButtons = [];

  if (languages.data.languages.split(',').length > 1) {
    tabButtons = [
      {
        id: 0,
        title: t(translations, 'cookie_preferences'),
      },
      {
        id: 1,
        title: t(translations, 'languages'),
      },
    ];
  } else {
    tabButtons = [
      {
        id: 0,
        title: t(translations, 'cookie_preferences'),
      },
    ];
  }

  languageArea(page, tabButtons);
}
