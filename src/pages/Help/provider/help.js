import HelpButton from '../../../components/Buttons/HelpButton/HelpButton';
import { SettingsService } from '../../../Services';

export default async function (page) {
  const { data } = await SettingsService.getPages();

  const items = data.entry.map((pageInfo, index) => ({
    type: HelpButton,
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
}
