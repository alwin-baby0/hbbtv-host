import request, { V1, V2 } from '../index';
import SeriesRailItem from './SeriesRailItem';

export const getSeries = (page, limit) =>
  request({
    url: '/series',
    apiVersion: V1,
    method: 'GET',
    params: {
      page,
      limit,
    },
  }).then(parseSeriesPageData);

function parseSeriesPageData(result) {
  const { data } = result;

  return {
    sectionTitle: data.title,
    items: data.items?.map((item) => new SeriesRailItem(item)),
  };
}

export const getSingleSeries = (seriesId) => {
  return request({
    url: '/getSerie',
    apiVersion: V2,
    method: 'GET',
    params: {
      id: seriesId,
    },
  });
};

export const getSeason = (seriesId) => {
  return request({
    url: `/series/${seriesId}/seasons`,
    apiVersion: V2,
    method: 'GET',
    params: {
      id: seriesId,
    },
  });
};
