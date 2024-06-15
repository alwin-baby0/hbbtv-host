import { VOD_TYPES } from '../../pages/utils';
import request, { V2 } from '../index';
import { LiveEventsRailItem, SimpleRailItem } from '../models';

export const getSports = async (page, limit) => {
  return request({
    url: '/sports',
    apiVersion: V2,
    method: 'GET',
    params: {
      page,
      limit,
    },
  }).then(parseSportsPageData);
};

function parseSportsPageData({ data }) {
  const railItems = data.entry?.map((item) => new SimpleRailItem({ ...item, type: { value: 'sport' } }))
  if (!railItems || railItems.length === 0) return;

  return {
    railType: VOD_TYPES.SPORT,
    cardType: 'POSTER',
    items: railItems,
  };
}

export const getEvents = async (type = 'video', language = 'en') => {
  return request({
    url: '/getSportEvents',
    apiVersion: V2,
    method: 'GET',
    params: {
      type,
      language,
    },
  }).then(parseSportsEventsData);
};

function parseSportsEventsData({ data }) {
  const railItems = data.entry?.map((item) => new LiveEventsRailItem(item))
  if (!railItems || railItems.length === 0) return;

  return {
    railType: VOD_TYPES.SPORT_LIVE,
    railTitle: data.title,
    cardType: 'POSTER',
    items: railItems,
    itemsPerRow: 6,
    h: 400,
    railItemsOptions: {
      h: 341,
    }
  };
}

export const getSingleEvent = async (sportId) => {
  return request({
    url: '/getSportEvent',
    apiVersion: V2,
    method: 'GET',
    params: {
      id: sportId,
    },
  });
};
