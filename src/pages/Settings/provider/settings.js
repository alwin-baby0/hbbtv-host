import LanguageButton from '../../../Components/Buttons/LanguageButton/LanguageButton';
import HelpButton from '../../../components/Buttons/HelpButton/HelpButton';
import MemberTabButton from '../../../components/MemberTabButton/MemberTabButton';
const languagesData = [
  {
    code: 'EN',
    value: 'en',
  },
  {
    code: 'DE',
    value: 'de',
  },
  {
    code: 'IT',
    value: 'it',
  },
];

const tabButtons = [
  {
    id: 0,
    title: 'User',
  },
  {
    id: 1,
    title: 'Languages',
  },
  {
    id: 2,
    title: 'Continue Watching',
  },
  {
    id: 3,
    title: 'Favorites',
  },
];

// const languages = (page) => {
//   const items = languagesData.map((language) => ({
//     type: LanguageButton,
//     props: {
//       languageInfo: language,
//     },
//     w: 250,
//     h: 100,
//   }));
//   page._Column.props = {
//     items: items,
//     enableScroll: false,
//   };
// };

const memberArea = (page) => {
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
  // languages(page);
  memberArea(page);
}
