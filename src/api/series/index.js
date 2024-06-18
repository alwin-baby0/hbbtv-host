import { VOD_TYPES } from '../../pages/utils';
import request, { V1, V2 } from '../index';
import { SimpleRailItem } from '../models';
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

export const getSeries = async (page, limit) => {
  return request({
    url: '/series',
    apiVersion: V2,
    method: 'GET',
    params: {
      page,
      limit,
    },
  }).then(parseSeriesPageData);
};

function parseSeriesPageData({ data }) {
  const railItems = data.entry?.map((item) => new SimpleRailItem(item));
  if (!railItems || railItems.length === 0) return;

  return {
    railType: VOD_TYPES.SERIE,
    cardType: 'POSTER',
    items: railItems,
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
  }).then(parseSingleSeriesPageData);
};

function parseSingleSeriesPageData({ data }) {
  // console.log('single data', data);
  const railItems = data.entry?.map((item) => new SingleSeriesRailItem(item));
  if (!railItems || railItems.length === 0) return;

  return {
    railType: VOD_TYPES.SERIE,
    cardType: 'POSTER',
    items: railItems,
  };
}

export const getSeason = async (seriesId) => {
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
  console.log('dataa:', data);
  const railItems = data.entry?.map(
    (item) => new SimpleRailItem({ ...item, type: { value: 'episode' } })
  );
  if (!railItems || railItems.length === 0) return;

  return {
    railType: VOD_TYPES.EPISODE,
    cardType: 'POSTER',
    items: railItems,
    railTitle: data.title,
    itemsPerRow: 5,
  };
}
