import { Router } from '@lightningjs/sdk';
import { HomePageService } from '../../../Services';

const searchTV = {
  timestamp: 0,
};

export default async function (page) {
  const currentHash = Router.getActiveHash();
  const isDetailPage = /^((movie|series)-details\/)/.test(currentHash);

  if (searchTV.timestamp + 1000 * 60 * 30 <= new Date().getTime() || !isDetailPage) {
    searchTV.timestamp = new Date().getTime();
    page.tag('VODSection').props = {
      items: [],
      railTitle: '',
    };

    await HomePageService.initialFetch();

    page.$changedVODGenre(HomePageService.stripes[0]);
    page._Input._Placeholder.patch({
      visible: true,
    });
    page._Input.tag('Input').value = '';
  }
}
