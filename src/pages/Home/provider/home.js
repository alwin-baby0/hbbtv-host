import { HomePageService } from '../../../api/services/HomePageService';

export default async function (page) {
  if (page._props.sliderData !== null && page._props.railData) {
    return;
  }

  await HomePageService.initialFetch();
  page.props = {
    sliderData: HomePageService.heroSectionItems,
    railData: HomePageService.stripes,
  };
}
