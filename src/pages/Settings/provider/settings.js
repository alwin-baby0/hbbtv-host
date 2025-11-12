import { LanguageService, t } from '../../../Services';
import MemberTabButton from '../../../components/MemberTabButton/MemberTabButton';
import { TRANSLATIONS } from '../../../constants/globalConstants';
import { CMPService } from '../../../Services';
import { getDeviceInfo } from '../../../utils/device';

const languageArea = (page, tabButtons) => {
  const items = tabButtons.map((tabInfo, index) => ({
    type: MemberTabButton,
    collision: true,
    tabInfoData: tabInfo,
    w: 250,
    h: 100,
    tabIndex: index,
  }));

  // page._Column.props = {
  //   items: items,
  //   enableScroll: false,
  //   parentState: 'DefaultState',
  // };
};

export default async function (page) {
  const languages = await LanguageService.getLanguages();
  await CMPService.initialFetch();
  const serialNumber = getDeviceInfo().serialNumber;

  page.props = {
    languagesData: languages.data,
    serialNumber,
  };

  let tabButtons = [];

  if (languages.data.languages.split(',').length > 1) {
    tabButtons = [
      {
        id: 0,
        title: t(TRANSLATIONS.COOKIE_PREFERENCES),
      },
      {
        id: 1,
        title: t(TRANSLATIONS.LANGUAGES),
      },
    ];
  } else {
    tabButtons = [
      {
        id: 0,
        title: t(TRANSLATIONS.COOKIE_PREFERENCES),
      },
    ];
  }

  languageArea(page, tabButtons);
}
