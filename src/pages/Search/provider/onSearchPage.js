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
    };
    await HomePageService.initialFetch();
    page.$changedVODGenre(HomePageService.stripes[0]);
    page._Input._Placeholder.patch({
      visible: true,
    });
    page._Input.tag('Input').value = '';
  }
}
// TODO: move search components into components folder, create service to handle logic behind this page
