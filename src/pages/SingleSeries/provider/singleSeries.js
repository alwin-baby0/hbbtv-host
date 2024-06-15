import { getSeason, getSingleSeries } from '../../../api/series';
import { VOD_TYPES, constructRails } from '../../utils';

export default async function (page, { seriesId }) {
  const [series, season] = await Promise.all([
    getSingleSeries(seriesId),
    getSeason(seriesId),
  ]);

  if (!series) {
    throw new Error('Series data not found');
  }

  let episodes = [];
  let sectionTitle = 'No Season Available';

  if (season && season.items) {
    episodes = constructRails(season);
    sectionTitle = season.sectionTitle;
  } else {
    console.warn('Season data not found or empty');
  }

  page.props = {
    sectionTitle: sectionTitle,
    galleryItem: series.items[0],
  };

  page._Column.props = {
    items: episodes,
  };
}
