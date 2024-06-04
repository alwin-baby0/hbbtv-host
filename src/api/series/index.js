import request, { V1, V2 } from '../index';
import HomeRailItem from '../home/HomeRailItem';
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

export const getSingleSeries = (seriesId) =>
  request({
    url: '/getSerie',
    apiVersion: V2,
    method: 'GET',
    params: {
      id: seriesId,
    },
  }).then(parseSingleSeriesPageData);

function parseSingleSeriesPageData(result) {
  const { data } = result;

  return {
    items: data.entry?.map((item) => new HomeRailItem(item)),
  };
}

export const getSeason = (seriesId, { row, limit } = {}) =>
  request({
    url: `/series/${seriesId}/seasons`,
    apiVersion: V2,
    method: 'GET',
    params: {
      row: 1,
      limit: 6,
    },
  }).then(parseSeasonData);
function parseSeasonData(result) {
  const { data } = result;

  return {
    items: data.entry?.map((item) => new HomeRailItem(item)),
    sectionTitle: data.title,
  };
}
