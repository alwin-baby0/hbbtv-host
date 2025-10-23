import { LanguageService, t } from '../../../Services';
import MemberTabButton from '../../../components/MemberTabButton/MemberTabButton';
import { LOCAL_STORAGE_KEYS, TRANSLATIONS } from '../../../constants/globalConstants';

const memberArea = (page, tabButtons) => {
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
    parentState: 'DefaultState',
  };
};

export default async function (page) {
  const languages = await LanguageService.getLanguages();

  page.props = {
    languagesData: languages.data,
  };

  const tabButtons = [
    {
      id: 0,
      title: t(TRANSLATIONS.MY_ACCOUNT),
    },
  ];

  if (localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
    tabButtons.push(
      {
        id: 1,
        title: t(TRANSLATIONS.CONTINUE_WATCHING),
      },
      {
        id: 2,
        title: t(TRANSLATIONS.FAVORITES),
      },
      {
        id: 3,
        title: t(TRANSLATIONS.LOGOUT),
      }
    );
  }
  memberArea(page, tabButtons);
}
