import { getHomePage, getHomePageHeroSection } from '../../../api/home';

export default async function (page) {
  const rows = Array.from({ length: 19 }, (_, index) => index + 2);
  const promises = rows.map((row) => getHomePage(row, 1, 6));

  const sliderData = await getHomePageHeroSection();

  const railDataRows = await Promise.all(promises);

  const railData = railDataRows
    .reduce((accumulator, data) => {
      return accumulator.concat(data);
    }, [])
    .filter((item) => item.items);

  page.props = {
    sliderData,
    railData,
  };
}
