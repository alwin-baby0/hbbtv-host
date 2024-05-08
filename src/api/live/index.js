import request, { V1, V2 } from '../index';

export const getChannels = () =>
  request({
    url: `channels`,
    apiVersion: V1,
    method: 'GET',
    params: {
      page: 1,
      limit: 6,
    },
  });

export const getSingleChannel = (channelId) =>
  request({
    url: `/getChannel`,
    apiVersion: V1,
    method: 'GET',
    params: {
      channel_id: `${channelId}`,
    },
  });

export const getLiveChannels = (channelId) =>
  request({
    url: `/getLiveChannel`,
    apiVersion: V2,
    method: 'GET',
    params: {
      id: channelId,
    },
  });

export const getEPG = (channelId) =>
  request({
    url: `/getEpg`,
    apiVersion: V2,
    method: 'GET',
    params: {
      type: 'livechannel',
      id: channelId,
    },
  });
export const getEPGV2 = (channelId) =>
  request({
    url: `/epg_program`,
    apiVersion: V2,
    method: 'GET',
    params: {
      start_time: start_time,
      id: `channel_${channelId}`,
    },
  });
