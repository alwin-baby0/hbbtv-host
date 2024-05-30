import request, { V1, V2 } from '../index';
import { SimpleRailItem } from '../models';

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

export const getSingleSeries = async (seriesId) => {
  return request({
    url: '/getSerie',
    apiVersion: V2,
    method: 'GET',
    params: {
      id: seriesId,
    },
  });
};

export const getSeason = async (seriesId) => {
  return request({
    url: `/series/${seriesId}/seasons`,
    apiVersion: V2,
    method: 'GET',
    params: {
      id: seriesId,
    },
  });
};
