import { getSeason, getSingleSeries } from '../../../api/series';

const fetchSingleSeries = async ({ seriesId }) => {
  const series = await getSingleSeries(seriesId);
  return series;
};

const fetchSeason = async ({ seriesId }) => {
  const season = await getSeason(seriesId);
  return {
    seasonInfo: season,
  };
};

export default async function (page, { seriesId }) {
  const [series, season] = await Promise.all([
    fetchSingleSeries({ seriesId }),
    fetchSeason({ seriesId }),
  ]);

  page.props = {
    ...series,
    ...season,
  };
}
