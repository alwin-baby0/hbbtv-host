import { SingleSeriesRailItem, SimpleRailItem } from '../../Models';
import { RAIL_TYPES } from '../../Pages/utils';
import request, { V2 } from '../index';

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
  const railItems = data.entry?.map((item) => new SingleSeriesRailItem(item));
  if (!railItems || railItems.length === 0) return;

  return {
    railType: RAIL_TYPES.SERIE,
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
  const railItems = data.entry?.map(
    (item) => new SimpleRailItem({ ...item, type: { value: 'episode' } })
  );
  if (!railItems || railItems.length === 0) return;

  return {
    railType: RAIL_TYPES.EPISODE,
    cardType: 'POSTER',
    items: railItems,
    railTitle: data.title,
    itemsPerRow: 5,
  };
}
