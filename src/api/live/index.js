import { RAIL_TYPES } from '../../pages/utils';
import request, { V2 } from '../index';
import { LiveChannelsRailItem } from '../../Models/LiveChannelsRailItem';
import { EPGRailItem } from '../../Models/utils/EPGRailItem';

export const getChannels = async () =>
  request({
    url: `/epg_channels?id&include&exclude=channel`,
    apiVersion: V2,
    method: 'GET',
    params: {
      page: 1,
      limit: 6,
    },
  }).then(parseLiveChannelsData);

function parseLiveChannelsData({ data }) {
  const railItems = data.entry?.map((item) => new LiveChannelsRailItem(item));
  if (!railItems) return;

  return {
    railType: RAIL_TYPES.LIVETV,
    railTitle: data.title,
    cardType: 'POSTER',
    items: railItems,
    itemsPerRow: 1,
  };
}

export const getSingleChannel = async (channelId) =>
  request({
    url: `/epg_program`,
    apiVersion: V2,
    method: 'GET',
    params: {
      id: `${channelId}`,
    },
  }).then(parseLiveEPGData);

function parseLiveEPGData({ data }) {
  const railItems = data.entry?.map((item) => new EPGRailItem(item));
  if (!railItems) return;

  return {
    railType: RAIL_TYPES.LIVETV,
    cardType: 'POSTER',
    items: railItems,
    itemsPerRow: 1,
  };
}

export const getLiveChannels = async (channelId) =>
  request({
    url: `/getLiveChannel`,
    apiVersion: V2,
    method: 'GET',
    params: {
      id: channelId,
    },
  });

export const getEPG = async (channelId) =>
  request({
    url: `/getEpg`,
    apiVersion: V2,
    method: 'GET',
    params: {
      type: 'livechannel',
      id: channelId,
    },
  });
export const getEPGV2 = async (channelId) =>
  request({
    url: `/epg_program`,
    apiVersion: V2,
    method: 'GET',
    params: {
      start_time: start_time,
      id: `channel_${channelId}`,
    },
  });
