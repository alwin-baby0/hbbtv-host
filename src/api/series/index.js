import request, { V1, V2 } from '../index';
import { MovieRailItem, SimpleRailItem } from '../models';
import SingleSeriesRailItem from '../models/SingleSeriesRailItem';

export const getSeriesGenres = async () => {
  return request({
    url: '/getGenres',
    apiVersion: V2,
    method: 'GET',
    params: {
      category: 'series',
      type: 'genres_series',
    },
  });
};

export const getSeries = async () =>
  request({
    url: '/search',
    apiVersion: V2,
    method: 'GET',
    params: {
      keyword: 'all',
      category: 'series',
      orderBy: 'date:desc',
      limit: 24,
    },
  }).then(parseSeriesPageData);

function parseSeriesPageData(result) {
  const { data } = result;
  return {
    sectionTitle: data.title,
    items: data.entry?.map((item) => new SimpleRailItem(item)),
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
  }).then(parseSingleSeriesPageData);
};
function parseSingleSeriesPageData(result) {
  const { data } = result;

  return {
    items: data.entry?.map((item) => new SingleSeriesRailItem(item)),
  };
}

export const getSeason = (seriesId) => {
  return request({
    url: `/series/${seriesId}/seasons`,
    apiVersion: V2,
    method: 'GET',
    params: {
      row: 1,
      limit: 6,
    },
  }).then(parseSeasonData);
};

function parseSeasonData(result) {
  const { data } = result;
  return {
    items: data.entry?.map((item) => new SimpleRailItem(item)),
    sectionTitle: data.title,
  };
}
