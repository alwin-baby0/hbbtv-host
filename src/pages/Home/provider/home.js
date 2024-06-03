import { getHomePage, getHomePageHeroSection } from '../../../api/home';
import { imageSizes } from '../../../api/models/utils';

export default async function (page) {
  const rows = Array.from({ length: 19 }, (_, index) => index + 2);
  const promises = rows.map((row) => getHomePage(row, 1, 6));

  const sliderData = await getHomePageHeroSection();

  const railDataRows = await Promise.all(promises);

  const railData = railDataRows
    .reduce((accumulator, data) => {
      return accumulator.concat(data);
    }, [])
    .filter((rail) => rail.items);

  //preload images for gallery
  sliderData.items.forEach((item) => item.preloadImages(imageSizes.XL));

  page.props = {
    sliderData,
    railData,
  };
}
