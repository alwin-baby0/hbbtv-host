import LanguageButton from '../../../components/Buttons/LanguageButton/LanguageButton';

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

const languages = (page) => {
  const items = languagesData.map((language) => ({
    type: LanguageButton,
    props: {
      languageInfo: language,
    },
    w: 250,
    h: 100,
  }));

  page._Column.props = {
    items: items,
    enableScroll: false,
  };
};

export default async function (page) {
  languages(page);
}
