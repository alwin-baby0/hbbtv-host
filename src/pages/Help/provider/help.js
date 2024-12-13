import { getPages } from '../../../api/help';
import HelpButton from '../../../Components/Buttons/HelpButton/HelpButton';

// TODO: create service to handle this logic
const fetchPages = (page) => {
  return getPages().then(({ data }) => {
    const items = data.entry.map((pageInfo, index) => ({
      type: HelpButton,
      collision: true,
      pageInfoData: pageInfo,
      w: 250,
      h: 100,
      pageIndex: index,
    }));

    page._Column.props = {
      items: items,
      enableScroll: false,
    };

    page.helpPages = data.entry;
  });
};

export default async function (page) {
  await fetchPages(page);
}
