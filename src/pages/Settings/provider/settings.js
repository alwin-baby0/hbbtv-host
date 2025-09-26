import { LanguageService, t } from '../../../Services';
import MemberTabButton from '../../../components/MemberTabButton/MemberTabButton';

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
      title: t('my_account'),
    },
  ];

  if (localStorage.getItem('userData')) {
    tabButtons.push(
      {
        id: 1,
        title: t('continue_watching'),
      },
      {
        id: 2,
        title: t('favorites'),
      },
      {
        id: 3,
        title: t('logout'),
      }
    );
  }
  memberArea(page, tabButtons);
}
